import { Component, computed, signal } from '@angular/core';
import { ResumenPedido, type Linea } from './resumen-pedido';
import { TarjetaProducto, type Producto } from './tarjeta-producto';

@Component({
  selector: 'app-pedido',
  imports: [TarjetaProducto, ResumenPedido],
  template: `
    <main class="pedido">
      <header class="pedido__cabecera">
        <h1>Mi pedido</h1>
        <p class="pedido__ayuda">Agrega productos y revisa el total de tu pedido.</p>
      </header>

      <section class="pedido__catalogo" aria-label="Productos disponibles">
        @for (producto of productos; track producto.nombre) {
          <app-tarjeta-producto
            [producto]="producto"
            [enPedido]="unidades()[producto.nombre] ?? 0"
            (agregar)="agregar($event)"
          />
        }
      </section>

      <app-resumen-pedido [lineas]="lineas()" (quitar)="quitar($event)" />
    </main>
  `,
  styleUrl: './pedido.css',
})
export class Pedido {
  productos: Producto[] = [
    { nombre: 'Mango', precio: 1_800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4_500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12_000, existencias: 1 },
  ];

  private readonly pedido = signal<Linea[]>([]);

  readonly lineas = computed(() => this.pedido());

  readonly unidades = computed(() =>
    Object.fromEntries(this.pedido().map((linea) => [linea.nombre, linea.cantidad] as [string, number])),
  );

  agregar(nombre: string): void {
    this.pedido.update((lineas) => {
      if (lineas.some((linea) => linea.nombre === nombre)) {
        return lineas.map((linea) =>
          linea.nombre === nombre ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
        );
      }

      const producto = this.productos.find((producto) => producto.nombre === nombre)!;
      return [...lineas, { nombre, precio: producto.precio, cantidad: 1 }];
    });
  }

  quitar(nombre: string): void {
    this.pedido.update((lineas) => lineas.filter((linea) => linea.nombre !== nombre));
  }
}

import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <article class="tarjeta" [class.tarjeta--agotada]="disponibles() === 0">
      <h3 class="tarjeta__nombre">{{ producto().nombre }}</h3>
      <p class="tarjeta__precio">
        {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' : 'es-CO' }}
      </p>
      <p class="tarjeta__disponibles">Disponibles: {{ disponibles() }}</p>
      <button
        type="button"
        class="tarjeta__boton"
        [disabled]="disponibles() === 0"
        (click)="agregar.emit(producto().nombre)"
      >
        Agregar
      </button>
    </article>
  `,
  styleUrl: './tarjeta-producto.css',
})
export class TarjetaProducto {
  readonly producto = input.required<Producto>();
  readonly enPedido = input(0);
  readonly agregar = output<string>();

  readonly disponibles = computed(() => this.producto().existencias - this.enPedido());
}

import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <section class="resumen">
      <h3 class="resumen__titulo">Resumen del pedido</h3>

      <ul class="resumen__lineas">
        @for (linea of lineas(); track linea.nombre) {
          <li class="linea">
            <span class="linea__nombre">
              {{ linea.nombre }}
              <small class="linea__cantidad">x{{ linea.cantidad }}</small>
            </span>
            <span class="linea__importe">
              {{ linea.precio * linea.cantidad | currency: 'COP' : 'symbol-narrow' : '1.0-0' : 'es-CO' }}
            </span>
            <button type="button" class="linea__quitar" (click)="quitar.emit(linea.nombre)">
              Quitar
            </button>
          </li>
        } @empty {
          <li class="resumen__vacio">El pedido está vacío</li>
        }
      </ul>

      <dl class="totales">
        <dt>Subtotal</dt>
        <dd>{{ subtotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' : 'es-CO' }}</dd>

        <dt>Domicilio</dt>
        <dd>
          @if (subtotal() === 0) {
            -
          } @else if (domicilio() === 0) {
            Gratis
          } @else {
            {{ domicilio() | currency: 'COP' : 'symbol-narrow' : '1.0-0' : 'es-CO' }}
          }
        </dd>

        <dt class="totales__total">Total</dt>
        <dd class="totales__total">
          {{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' : 'es-CO' }}
        </dd>
      </dl>
    </section>
  `,
  styleUrl: './resumen-pedido.css',
})
export class ResumenPedido {
  readonly lineas = input.required<Linea[]>();
  readonly quitar = output<string>();

  readonly subtotal = computed(() =>
    this.lineas().reduce((acumulado, linea) => acumulado + linea.precio * linea.cantidad, 0),
  );

  readonly domicilio = computed(() =>
    this.subtotal() > 0 && this.subtotal() < 20_000 ? 3_000 : 0,
  );

  readonly total = computed(() => this.subtotal() + this.domicilio());
}

import {Component, Input} from '@angular/core';

import {Record} from '../record.interface';

@Component({
  selector: 'ffc-product',
  template: `
    <a [href]="record.Deeplink" class="product">
      <img [src]="record.ImageURL" [alt]="record.Title"/>
      <div class="title">{{record.Title}}</div>
      <div class="price">{{record.Price}} €</div>
    </a>
  `,
  styles: []
})
export class ProductComponent {
  @Input() record: Record;
}

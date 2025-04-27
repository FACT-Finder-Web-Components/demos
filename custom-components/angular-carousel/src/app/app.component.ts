import { Component } from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

const recordList = `
<ff-record-list>
  <template data-role="record">
    <ff-record>
        <a data-anchor="https://www.your.webshop[[variantValues.0.Deeplink]]"
           data-redirect="https://www.your.webshop[[variantValues.0.Deeplink]]"
           data-redirect-target="_blank"
           class="product">
            <img data-image="[[variantValues.0.ImageURL]]" alt="[[variantValues.0.Title]]">
            <div class="title">[[variantValues.0.Title]]</div>
            <div class="price">[[$ variantValues.0.Price]]</div>
        </a>
    </ff-record>
  </template>
</ff-record-list>
`;

@Component({
  selector: 'ffc-root',
  template: `
    <div id="app">
      <ffc-carousel query="hat" class="hats-carousel"></ffc-carousel>
      <div [outerHTML]="recordList"></div>
      <ffc-carousel query="shoe" class="shoes-carousel"></ffc-carousel>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'angular-carousel';
  recordList: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.recordList = this.sanitizer.bypassSecurityTrustHtml(recordList);
  }
}

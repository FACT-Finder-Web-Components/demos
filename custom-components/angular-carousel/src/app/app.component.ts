import { Component } from '@angular/core';

@Component({
  selector: 'ffc-root',
  template: `
    <ff-communication url="https://ng-search-web-components.fact-finder.de/fact-finder"
                      version="ng"
                      api="v3"
                      channel="demo-bergfreunde-en"
                      mustache-delimiters="[[,]]"
                      default-query="jacket"
                      search-immediate
                      disable-single-hit-redirect="true"
    ></ff-communication>
    <div id="app">
      <ffc-carousel query="hat" class="hats-carousel"></ffc-carousel>
      <ff-record-list>
        <ff-record>
          <a href="[[record.Deeplink]]" class="product">
            <img data-image="[[record.ImageURL]]" alt="[[record.Title]]">
            <div class="title">[[record.Title]]</div>
            <div class="price">[[record.Price]] €</div>
          </a>
        </ff-record>
      </ff-record-list>
      <ffc-carousel query="shoe" class="shoes-carousel"></ffc-carousel>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'angular-carousel';
}

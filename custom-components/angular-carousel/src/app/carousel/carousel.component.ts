import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';

import {ProductComponent} from '../product/product.component';
import {Record} from '../record.interface';

@Component({
    selector: 'ffc-carousel',
    host: {class: 'carousel-wrapper'},
    template: `
        <div (click)="prev()" class="button prev-button">❮</div>
        <div [ngStyle]="transformStyles" class="carousel">
            <ffc-product *ngFor="let record of records" [record]="record"></ffc-product>
        </div>
        <div (click)="next()" class="button next-button">❯</div>
    `,
    styles: []
})
export class CarouselComponent implements OnInit {
    records: Record[] = [];

    @Input()
    private query: string;

    @ViewChildren(ProductComponent, {read: ElementRef})
    private productComponents: QueryList<ElementRef>;

    private subscriptionKey: string;
    private offset: number = 0;

    constructor(private el: ElementRef) {
    }

    async ngOnInit(): Promise<void> {
        const {request} = await getFactfinder();
        const {hits} = await request.search({query: this.query}, {requestOptions: {requestOnly: true}});
        this.records = hits.map(h => h.variantValues[0]);
    }

    next(): void {
        this.offset = (this.offset + 4) % this.records.length;
    }

    prev(): void {
        this.offset = (this.offset - 4 + this.records.length) % this.records.length;
    }

    get transformStyles(): {transform?: string;} {
        if (!this.productComponents) {
            return {};
        }

        const products: ElementRef[] = this.productComponents.toArray();
        if (products.length === 0) {
            return {};
        }

        const offsetPx: number = products[this.offset].nativeElement.offsetLeft - products[0].nativeElement.offsetLeft;
        return {transform: `translateX(-${offsetPx}px)`};
    }
}

async function getFactfinder() {
    const factfinder = (<any>window).factfinder;
    if (typeof factfinder !== `undefined`) {
        return factfinder;
    }

    return new Promise(resolve => {
        document.addEventListener(`ffCoreReady`, (event : any) => {
            resolve(event.factfinder);
        });
    });
}
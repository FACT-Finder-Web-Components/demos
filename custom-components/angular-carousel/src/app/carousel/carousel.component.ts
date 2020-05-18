import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';

import {ProductComponent} from '../product/product.component';
import {Record} from '../record.interface';

let UID: number = 0;
function newId() {
    return UID++;
}

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
export class CarouselComponent implements OnInit, OnDestroy {
    records: Record[] = [];

    @Input()
    private query: string;

    @ViewChildren(ProductComponent, {read: ElementRef})
    private productComponents: QueryList<ElementRef>;

    private subscriptionKey: string;
    private uid: number = newId();
    private offset: number = 0;

    constructor(private el: ElementRef) {
    }

    ngOnInit(): void {
        awaitFactfinder((resultDispatcher, eventAggregator) => {
            setTimeout(() => {
                // trigger search on a dedicated topic
                eventAggregator.addFFEvent({
                    type: 'search',
                    query: this.query,
                    topics: () => [`carousel-${this.uid}`]
                });
            });

            // update component's data when FACT-Finder response comes
            this.subscriptionKey = resultDispatcher.subscribe(`carousel-${this.uid}`, response => {
                this.records = response.searchResult.records.map(record => record.record);
            });
        });
    }

    ngOnDestroy(): void {
        awaitFactfinder(resultDispatcher => {
            if (this.subscriptionKey) {
                resultDispatcher.unsubscribe(`carousel-${this.uid}`, this.subscriptionKey);
            }
        });
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

function awaitFactfinder(callback) {
    const factfinder = (<any>window).factfinder;
    if (factfinder) {
        callback(factfinder.communication.ResultDispatcher, factfinder.communication.EventAggregator);
    } else {
        // @ts-ignore
        document.addEventListener('ffReady', ({resultDispatcher, eventAggregator}) => callback(resultDispatcher, eventAggregator));
    }
}

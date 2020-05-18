const Product = {
    props: {
        record: Object,
        required: true
    },
    template: '#product-template'
};

const Carousel = {
    props: {
        query: {
            type: String,
            required: true
        },
        itemsPerSlide: {
            type: Number,
            default: 4
        }
    },
    components: {
        'ffc-product': Product
    },
    data: function () {
        return {
            records: [],
            subscriptionKey: undefined,
            offset: 0
        };
    },
    computed: {
        transformStyles: function () {
            // this assignment is required to mark this.offset as a dependency
            const offset = this.offset;

            if (!this.$el) {
                return {};
            }
            const products = this.$el.querySelectorAll('.product');
            if (products.length === 0) {
                return {};
            }

            const offsetPx = products[offset].offsetLeft - products[0].offsetLeft;
            return {transform: 'translateX(-' + offsetPx + 'px)'};
        }
    },
    mounted: function () {
        const carousel = this;
        awaitFactfinder(function (resultDispatcher, eventAggregator) {
            setTimeout(function () {
                // trigger search on a dedicated topic
                eventAggregator.addFFEvent({
                    type: 'search',
                    query: carousel.query,
                    topics: function () {
                        return ['carousel-' + carousel._uid];
                    }
                });
            });

            // update component's data when FACT-Finder response comes
            carousel.subscriptionKey = resultDispatcher.subscribe('carousel-'  + carousel._uid, function (response) {
                carousel.records = response.searchResult.records.map(function (record) {
                    return record.record;
                });
            });
        });
    },
    beforeDestroy: function () {
        const carousel = this;
        awaitFactfinder(function (resultDispatcher) {
            if (carousel.subscriptionKey) {
                resultDispatcher.unsubscribe('carousel-'  + carousel._uid, carousel.subscriptionKey);
            }
        });
    },
    methods: {
        next: function () {
            this.offset += this.itemsPerSlide;
            this.offset %= this.records.length;
        },
        previous: function () {
            this.offset += this.records.length - this.itemsPerSlide;
            this.offset %= this.records.length;
        }
    },
    template: '#carousel-template'
};

Vue.config.ignoredElements = [
    'ff-record-list',
    'ff-record'
];
new Vue({
    el: '#app',
    components: {
        'ffc-carousel': Carousel
    }
});

function awaitFactfinder(callback) {
    if (typeof factfinder !== 'undefined') {
        callback(factfinder.communication.ResultDispatcher, factfinder.communication.EventAggregator);
    } else {
        document.addEventListener('ffReady', function (event) {
            callback(event.resultDispatcher, event.eventAggregator);
        });
    }
}

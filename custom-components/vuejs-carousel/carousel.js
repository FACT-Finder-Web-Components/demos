const Product = {
    props: {
        record: {
            type: Object,
            required: true,
        },
    },
    template: `#product-template`,
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
        },
    },
    components: {
        'ffc-product': Product
    },
    data: () => ({
        records: [],
        offset: 0,
    }),
    computed: {
        transformStyles: function () {
            // this assignment is required to mark this.offset as a dependency
            const offset = this.offset;

            if (!this.$el) {
                return {};
            }
            const products = this.$el.querySelectorAll(`.product`);
            if (products.length === 0) {
                return {};
            }

            const offsetPx = products[offset].offsetLeft - products[0].offsetLeft;
            return {transform: `translateX(-${offsetPx}px)`};
        }
    },
    mounted: async function () {
        const {request} = await getFactfinder();
        const {hits} = await request.search({query: this.query}, {requestOptions: {requestOnly: true}});
        this.records = hits;
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
    template: `#carousel-template`,
};

const app = Vue.createApp();
app.component(`ffc-carousel`, Carousel);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ff-')
app.mount(`#app`);

async function getFactfinder() {
    if (typeof factfinder !== `undefined`) {
        return factfinder;
    }

    return new Promise(resolve => {
        document.addEventListener(`ffCoreReady`, ({factfinder}) => {
            resolve(factfinder);
        });
    });
}
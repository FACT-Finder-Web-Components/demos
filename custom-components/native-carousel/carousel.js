const carouselTemplate = `
    <div class="button prev-button">&#10094</div>
    <div class="carousel"></div>
    <div class="button next-button">&#10095</div>
`;

const productTemplate = `
    <a href="{{Deeplink}}" class="product">
        <img src="{{ImageURL}}" alt="{{Title}}"/>
        <div class="title">{{ Title }}</div>
        <div class="price">{{Price}} €</div>
    </a>
`;

// Custom Element definition without ES6 class
function Carousel() {
    const element = Reflect.construct(HTMLElement, [], Carousel);
    element._carouselContainer = undefined;
    element._records = [];
    element._offset = 0;
    return element;
}
Carousel.prototype = Object.create(HTMLElement.prototype);
Carousel.prototype.constructor = Carousel;

Carousel.observedAttributes = [`query`];

Carousel.prototype.connectedCallback = function() {
    this.innerHTML = carouselTemplate;
    this.classList.add(`carousel-wrapper`);

    this._carouselContainer = this.querySelector(`.carousel`);
    this.querySelector(`.prev-button`).addEventListener(`click`, slide(this, -4));
    this.querySelector(`.next-button`).addEventListener(`click`, slide(this, 4));
}
Carousel.prototype.attributeChangedCallback = function(name, oldValue, newValue) {
    search(newValue, this);
};

customElements.define(`ffc-carousel`, Carousel);

async function search(query, element) {
    const {request} = await getFactfinder();
    const {hits} = await request.search({query}, {requestOptions: {requestOnly: true}});
    element._records = hits;
    element._carouselContainer.innerHTML = element._records.map(renderProduct).join(``);
}

function slide(element, count) {
    return () => {
        element._offset += element._records.length + count;
        element._offset %= element._records.length;

        const productElements = element._carouselContainer.children;
        const offsetPx = productElements[element._offset].offsetLeft - productElements[0].offsetLeft;
        element._carouselContainer.style.transform = `translateX(-${offsetPx}px)`;
    };
}

function renderProduct(record) {
    // naive templating engine implementation
    return Object.keys(record.variantValues[0]).reduce((html, property) => {
        return html.replace(new RegExp(`{{\\s*${property}\\s*}}`, `g`), record.variantValues[0][property]);
    }, productTemplate);
}

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

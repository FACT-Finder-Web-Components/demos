const carouselTemplate = 
    '<div class="button prev-button">&#10094</div>' +
    '<div class="carousel"></div>' +
    '<div class="button next-button">&#10095</div>';

const productTemplate =
    '<a href="{{Deeplink}}" class="product">' +
    '    <img src="{{ImageURL}}" alt="{{Title}}"/>' +
    '    <div class="title">{{Title}}</div>' +
    '    <div class="price">{{Price}} €</div>' +
    '</a>';

let UID = 0;
function newId() {
    return UID++;
}

// Custom Element definition without ES6 class
function Carousel() {
    // this way of instantiating HTMLElement on browsers with native Web Components support only works thanks to custom-elements-es5-adapter.js
    const element = HTMLElement.call(this);
    element._uid = newId();
    element._subscriptionKey = undefined;
    element._carouselContainer = undefined;
    element._records = [];
    element._offset = 0;
    return element;
}
Carousel.prototype = Object.create(HTMLElement.prototype);
Carousel.prototype.constructor = Carousel;

Carousel.observedAttributes = ['query'];

Carousel.prototype.connectedCallback = function() {
    this.innerHTML = carouselTemplate;
    this.classList.add('carousel-wrapper');

    this._carouselContainer = this.querySelector('.carousel');
    this.querySelector('.prev-button').addEventListener('click', prevSlide(this));
    this.querySelector('.next-button').addEventListener('click', nextSlide(this));

    const element = this;
    awaitFactfinder(function (resultDispatcher) {
        element._subscriptionKey = resultDispatcher.subscribe('carousel-' + element._uid, handleRecords(element));
    });
};

// unsubscribe when the element is detached from DOM
Carousel.prototype.disconnectedCallback = function() {
    if (this._subscriptionKey) {
        const element = this;
        awaitFactfinder(function (resultDispatcher) {
            resultDispatcher.unsubscribe('carousel-' + element._uid, element._subscriptionKey);
        });
    }
};

Carousel.prototype.attributeChangedCallback  = function(name, oldValue, newValue) {
    search(newValue, this._uid);
};

customElements.define('ffc-carousel', Carousel);

function search(query, uid) {
    awaitFactfinder(function (_, eventAggregator) {
        setTimeout(function () {
            eventAggregator.addFFEvent({
                type: 'search',
                query: query,
                topics: function () {
                    return ['carousel-' + uid];
                }
            });
        });
    });
}

function nextSlide(element) {
    return function () {
        element._offset += 4;
        element._offset %= element._records.length;
        updateTranslate(element);
    };
}

function prevSlide(element) {
    return function () {
        element._offset += element._records.length - 4;
        element._offset %= element._records.length;
        updateTranslate(element);
    };
}

function updateTranslate(element) {
    const productElements = element._carouselContainer.children;
    const offsetPx = productElements[element._offset].offsetLeft - productElements[0].offsetLeft;
    element._carouselContainer.style.transform = 'translateX(-' + offsetPx +'px)';
}

// render new records every time they are dispatched
function handleRecords(element) {
    return function(response) {
        element._records = response.searchResult.records;
        element._carouselContainer.innerHTML = element._records.map(renderProduct).join('');
    };
}
function renderProduct(record) {
    // naive templating engine implementation
    return Object.keys(record.record).reduce(function (html, property) {
        return html.replace(new RegExp('{{\s*' + property + '\s*}}', 'g'), record.record[property]);
    }, productTemplate);
}

function awaitFactfinder(callback) {
    if (typeof factfinder !== 'undefined') {
        callback(factfinder.communication.ResultDispatcher, factfinder.communication.EventAggregator);
    } else {
        document.addEventListener('ffReady', function (event) {
            callback(event.resultDispatcher, event.eventAggregator);
        });
    }
}

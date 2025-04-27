const template =
    `<div class="record">
         <img src="{{ImageURL}}" alt="{{Title}}" class="product-image">
         <div class="manufacturer">{{Manufacturer}}</div>
         <div class="title">{{Title}}</div>
         <div class="price">{{Price}} €</div>
         <a href="{{Deeplink}}" class="details-link">Details</a>
    </div>`;

// Custom Element definition without ES6 class
function CustomRecordList() {
    const element = Reflect.construct(HTMLElement, [], CustomRecordList);
    element._subscriptionKey = undefined;
    return element;
}
CustomRecordList.prototype = Object.create(HTMLElement.prototype);
CustomRecordList.prototype.constructor = CustomRecordList;

CustomRecordList.prototype.connectedCallback = async function() {
    const {response} = await getFactfinder();
    this._subscriptionKey = response.subscribeSearch(result =>
        this.innerHTML = result.hits.map(renderRecord).join(``)
    );
};

CustomRecordList.prototype.disconnectedCallback = async function() {
    if (this._subscriptionKey) {
        const {response} = await getFactfinder();
        response.unsubscribe(this._subscriptionKey);
    }
};

customElements.define(`custom-record-list`, CustomRecordList);

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

function renderRecord(record) {
    // naive templating engine implementation
    return Object.keys(record.variantValues[0]).reduce((html, property) => {
        return html.replace(new RegExp(`{{\\s*${property}\\s*}}`, `g`), record.variantValues[0][property]);
    }, template);
}

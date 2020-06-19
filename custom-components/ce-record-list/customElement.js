const template =
    '<div class="record">' +
    '    <img src="{{ImageURL}}" alt="{{Title}}" class="product-image">' +
    '    <div class="manufacturer">{{Manufacturer}}</div>' +
    '    <div class="title">{{Title}}</div>' +
    '    <div class="price">{{Price}} €</div>' +
    '    <a href="{{Deeplink}}" class="details-link">Details</a>' +
    '</div>';

// Custom Element definition without ES6 class
function CustomRecordList() {
    // this way of instantiating HTMLElement on browsers with native Web Components support only works thanks to custom-elements-es5-adapter.js
    const element = HTMLElement.call(this);
    element._subscriptionKey = undefined;
    return element;
}
CustomRecordList.prototype = Object.create(HTMLElement.prototype);
CustomRecordList.prototype.constructor = CustomRecordList;

// subscribe to 'records' topic when the element is attached to DOM
CustomRecordList.prototype.connectedCallback = function() {
    const element = this;
    awaitResultDispatcher(function (resultDispatcher) {
        element._subscriptionKey = resultDispatcher.subscribe('records', handleRecords(element));
    });
};

// unsubscribe when the element is detached from DOM
CustomRecordList.prototype.disconnectedCallback = function() {
    if (this._subscriptionKey) {
        const element = this;
        awaitResultDispatcher(function (resultDispatcher) {
            resultDispatcher.unsubscribe('records', element._subscriptionKey);
        });
    }
};

customElements.define('custom-record-list', CustomRecordList);

function awaitResultDispatcher(callback) {
    if (typeof factfinder !== 'undefined') {
        callback(factfinder.communication.ResultDispatcher);
    } else {
        document.addEventListener('ffReady', function (event) {
            callback(event.resultDispatcher);
        });
    }
}

// render new records every time they are dispatched
function handleRecords(element) {
    return function(records) {
        element.innerHTML = records.map(renderRecord).join('');
    };
}
function renderRecord(record) {
    // naive templating engine implementation
    return Object.keys(record.record).reduce(function (html, property) {
        return html.replace(new RegExp('{{\s*' + property + '\s*}}', 'g'), record.record[property]);
    }, template);
}

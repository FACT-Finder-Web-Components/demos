let UID = 0;
function newId() {
    return UID++;
}

const e = React.createElement;

function Product(props) {
    const record = props.record;
    return e('a', {href: record.Deeplink, className: 'product'},
        e('img', {src: record.ImageURL, alt: record.Title}),
        e('div', {className: 'title'}, record.Title),
        e('div', {className: 'price'}, record.Price + ' €')
    );
}

function Carousel(props) {
    const ref = React.useRef(null);

    const offsetState = React.useState(0);
    const offset = offsetState[0], setOffset = offsetState[1];

    const recordsState = React.useState([]);
    const records = recordsState[0], setRecords = recordsState[1];

    React.useEffect(function () {
        const uid = newId();
        let subscriptionKey = undefined;

        awaitFactfinder(function (resultDispatcher, eventAggregator) {
            setTimeout(function () {
                // trigger search on a dedicated topic
                eventAggregator.addFFEvent({
                    type: 'search',
                    query: props.query,
                    topics: function () {
                        return ['carousel-' + uid];
                    }
                });
            });

            // update component's data when FACT-Finder response comes
            subscriptionKey = resultDispatcher.subscribe('carousel-' + uid, function (response) {
                setRecords(response.searchResult.records.map(function (record) {
                    return record.record;
                }));
            });
        });

        return function () {
            awaitFactfinder(function (resultDispatcher) {
                if (subscriptionKey) {
                    resultDispatcher.unsubscribe('carousel-' + uid, subscriptionKey);
                }
            });
        };
    }, [props.query]);

    const products = records.map(function (record) {
        return e(Product, {record: record, key: record.ArticleID});
    });
    return e('div', {className: 'carousel-wrapper ' + (props.className || ''), ref: ref},
        e('div', {onClick: prev, className: 'button prev-button'}, '❮'),
        e('div', {style: transformStyles(ref.current, offset), className: 'carousel'}, products),
        e('div', {onClick: next, className: 'button next-button'}, '❯')
    );

    function next() {
        setOffset((offset + 4) % records.length);
    }
    function prev() {
        setOffset((offset - 4 + records.length) % records.length);
    }
    function transformStyles(carouselElement, offset) {
        if (!carouselElement) {
            return {};
        }

        const products = carouselElement.querySelectorAll('.product');
        if (products.length === 0) {
            return {};
        }

        const offsetPx = products[offset].offsetLeft - products[0].offsetLeft;
        return {transform: 'translateX(-' + offsetPx + 'px)'};
    }
}

ReactDOM.render(
    e('div', null,
        e(Carousel, {query: 'hat', className: 'hats-carousel'}),
        e('ff-record-list', null,
            e('ff-record', null,
                e('a', {href: '[[record.Deeplink]]', className: 'product'},
                    e('img', {'data-image': '[[record.ImageURL]]', alt: '[[record.Title]]'}),
                    e('div', {className: 'title'}, '[[record.Title]]'),
                    e('div', {className: 'price'}, '[[record.Price]]  €')
                )
            )
        ),
        e(Carousel, {query: 'shoe', className: 'shoes-carousel'})
    ),
    document.getElementById('app')
);

function awaitFactfinder(callback) {
    if (typeof factfinder !== 'undefined') {
        callback(factfinder.communication.ResultDispatcher, factfinder.communication.EventAggregator);
    } else {
        document.addEventListener('ffReady', function (event) {
            callback(event.resultDispatcher, event.eventAggregator);
        });
    }
}

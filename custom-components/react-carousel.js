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

const Carousel = createReactClass({
    getInitialState: function () {
        this.ref = React.createRef();
        this.uid = newId();

        return {
            records: [],
            subscriptionKey: undefined,
            offset: 0
        };
    },
    componentDidMount: function () {
        const carousel = this;
        awaitFactfinder(function (resultDispatcher, eventAggregator) {
            setTimeout(function () {
                // trigger search on a dedicated topic
                eventAggregator.addFFEvent({
                    type: 'search',
                    query: carousel.props.query,
                    topics: function () {
                        return ['carousel-' + carousel.uid];
                    }
                });
            });

            // update component's data when FACT-Finder response comes
            const subscriptionKey = resultDispatcher.subscribe('carousel-' + carousel.uid, function (response) {
                carousel.setState({
                    records: response.searchResult.records.map(function (record) {
                        return record.record;
                    })
                });
            });
            carousel.setState({subscriptionKey: subscriptionKey});
        });
    },
    componentWillUnmount: function () {
        const carousel = this;
        awaitFactfinder(function (resultDispatcher) {
            if (carousel.state.subscriptionKey) {
                resultDispatcher.unsubscribe('carousel-' + carousel.uid, carousel.state.subscriptionKey);
            }
        });
    },
    next: function () {
        this.setState(function (state) {
            return {offset: (state.offset + 4) % state.records.length};
        });
    },
    prev: function () {
        this.setState(function (state) {
            return {offset: (state.offset - 4 + state.records.length) % state.records.length};
        });
    },
    render: function () {
        const products = this.state.records.map(function (record) {
            return e(Product, {record: record, key: record.ArticleID});
        });

        return e('div', {className: 'carousel-wrapper ' + (this.props.className || ''), ref: this.ref},
            e('div', {onClick: this.prev, className: 'button prev-button'}, '❮'),
            e('div', {style: transformStyles(this.ref.current, this.state.offset), className: 'carousel'}, products),
            e('div', {onClick: this.next, className: 'button next-button'}, '❯')
        );
    }
});

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

// <template> tag wrapper component required to overcome React's issue with rendering its content. See https://github.com/facebook/react/issues/19932
function Template({ children, ...attrs }) {
    return (
        <template
            {...attrs}
            dangerouslySetInnerHTML={{ __html: children }}
        />
    );
}

function Product(props) {
  const {Deeplink, ImageURL, Price, Title} = props.record
  return (
    <a href={Deeplink} className="product">
      <img src={ImageURL} alt={Title} />
      <div className="title">{Title}</div>
      <div className="price">{Price} €</div>
    </a>
  )
}

function Carousel(props) {
  const ref = React.useRef();
  const [offset, setOffset] = React.useState(0);
  const [records, setRecords] = React.useState([]);

  React.useEffect(() => {
      (async () => {
          const {request} = await getFactfinder();
          const {hits} = await request.search({query: props.query}, {requestOptions: {requestOnly: true}});
          setRecords(hits.map(h => h.variantValues[0]));
      })();
  }, [props.query]);

  const prev = () => setOffset((offset - 4 + records.length) % records.length);
  const next = () => setOffset((offset + 4) % records.length);

  const transformStyles = () => {
    const products = ref.current ? ref.current.querySelectorAll('.product') : [];
    if (products.length) {
      const offsetPx = products[offset].offsetLeft - products[0].offsetLeft;
      return {transform: `translateX(-${offsetPx}px)`};
    }
    return {};
  };

  return (
    <div className={'carousel-wrapper ' + props.className} ref={ref}>
      <div className="button prev-button" onClick={prev}>❮</div>
      <div className="carousel" style={transformStyles()}>
        {records.map(r => <Product record={r} key={r.ArticleID} />)}
      </div>
      <div className="button next-button" onClick={next}>❯</div>
    </div>
  );
}

function getFactfinder() {
  return new Promise(resolve => {
    if (typeof window.factfinder !== `undefined`) {
      resolve(window.factfinder);
    } else {
      document.addEventListener(`ffCoreReady`, ({factfinder}) => resolve(factfinder));
    }
  });
}


function App() {
  return (
    <React.Fragment>
      <Carousel query="hat" className="hats-carousel" />
      <ff-record-list>
        <Template data-role="record">
          {`<ff-record>
            <a data-anchor="{{variantValues.0.Deeplink}}" class="product">
              <img alt="{{variantValues.0.Title}}" data-image="{{variantValues.0.ImageURL}}" />
              <div class="title">{{variantValues.0.Title}}</div>
              <div class="price">{{$ variantValues.0.Price}}</div>
            </a>
          </ff-record>`}
        </Template>
      </ff-record-list>
      <Carousel query="shoe" className="shoes-carousel" />
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById(`app`));

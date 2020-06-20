const newId = (() => {
  let uid = 0
  return () => uid++
})()

function Product(props) {
  const {Deeplink, ImageURL, Price, Title} = props.record
  return (
    <a href={Deeplink} className="product">
      <img src={ImageURL} alt={Title} />
      <div className="title">{Title}</div>
      <div className="price">{Price}</div>
    </a>
  )
}

function Carousel(props) {
  const ref = React.useRef()
  const [offset, setOffset] = React.useState(0)
  const [records, setRecords] = React.useState([])

  React.useEffect(() => {
    const uid = newId()
    let subscriptionKey = ''

    withFactfinder().then(factfinder => {
      const {EventAggregator, ResultDispatcher} = factfinder.communication

      subscriptionKey = ResultDispatcher.subscribe('carousel-' + uid, ({searchResult}) => {
        setRecords(searchResult.records.map(r => r.record))
      })

      setTimeout(() => EventAggregator.addFFEvent({
        type: 'search',
        query: props.query,
        topics: () => ['carousel-' + uid]
      }))
    })

    return async () => {
      const {ResultDispatcher} = (await withFactfinder()).communication
      ResultDispatcher.unsubscribe('carousel-' + uid, subscriptionKey)
    }
  }, [props.query])

  const prev = () => setOffset((offset - 4 + records.length) % records.length)

  const next = () => setOffset((offset + 4) % records.length)

  const transformStyles = () => {
    const products = ref.current ? ref.current.querySelectorAll('.product') : []
    if (products.length) {
      const offsetPx = products[offset].offsetLeft - products[0].offsetLeft
      return {transform: 'translateX(-' + offsetPx + 'px)'}
    }
    return {}
  }

  return (
    <div className={'carousel-wrapper ' + props.className} ref={ref}>
      <div className="button prev-button" onClick={prev}>❮</div>
      <div className="carousel" style={transformStyles()}>
        {records.map(r => <Product record={r} key={r.ArticleID} />)}
      </div>
      <div className="button next-button" onClick={next}>❯</div>
    </div>
  )
}

function withFactfinder() {
  return new Promise(resolve => {
    if (typeof window.factfinder !== 'undefined') {
      resolve(window.factfinder)
    } else {
      document.addEventListener('ffReady', event => resolve(event.factfinder))
    }
  })
}

function App() {
  return (
    <React.Fragment>
      <Carousel query="hat" className="hats-carousel" />
      <ff-record-list unresolved>
        <ff-record>
          <a data-anchor="{{record.Deeplink}}" className="product">
            <img alt="{{record.Title}}" data-image="{{record.ImageURL}}" />
            <div className="title">{"{{record.Title}}"}</div>
            <div className="price">{"{{record.Price}}"}</div>
          </a>
        </ff-record>
      </ff-record-list>
      <Carousel query="shoe" className="shoes-carousel" />
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

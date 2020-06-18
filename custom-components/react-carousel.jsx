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

class Carousel extends React.Component {
  state = {
    offset: 0,
    records: []
  }

  constructor(props) {
    super(props)
    this.uid = newId()
    this.ref = React.createRef()
  }

  async componentDidMount() {
    const {EventAggregator, ResultDispatcher} = (await withFactfinder()).communication

    setTimeout(() => EventAggregator.addFFEvent({
      type: 'search',
      query: this.props.query,
      topics: () => ['carousel-' + this.uid]
    }))

    this.subscriptionKey = ResultDispatcher.subscribe('carousel-' + this.uid, ({searchResult}) => {
      this.setState({records: searchResult.records.map(r => r.record)})
    })
  }

  async componentWillUnmount() {
    const {ResultDispatcher} = (await withFactfinder()).communication
    ResultDispatcher.unsubscribe('carousel-' + this.uid, this.subscriptionKey)
  }

  prev = () => {
    const {offset, records} = this.state
    this.setState({offset: (offset - 4 + records.length) % records.length})
  }

  next = () => {
    const {offset, records} = this.state
    this.setState({offset: (offset + 4) % records.length})
  }

  render() {
    return (
      <div className={'carousel-wrapper ' + this.props.className} ref={this.ref}>
        <div className="button prev-button" onClick={this.prev}>❮</div>
        <div className="carousel" style={this.transformStyles()}>
          {this.state.records.map(r => <Product record={r} key={r.ArticleID} />)}
        </div>
        <div className="button next-button" onClick={this.next}>❯</div>
      </div>
    )
  }

  transformStyles() {
    const products = this.ref.current ? this.ref.current.querySelectorAll('.product') : []
    if (products.length) {
      const offsetPx = products[this.state.offset].offsetLeft - products[0].offsetLeft
      return {transform: 'translateX(-' + offsetPx + 'px)'}
    }
    return {}
  }
}

function withFactfinder() {
  return new Promise(resolve => {
    if (typeof window.factfinder !== 'undefined') {
      resolve(window.factfinder)
    } else {
      document.addEventListener('ffReady', (event) => {
        resolve(event.factfinder)
      })
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

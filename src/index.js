import React from "react";
import ReactDOM from "react-dom";
import {
  Col,
  Row,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class Gellery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeGif: "" };
    this.getRandomGifIdx = this.getRandomGifIdx.bind(this);
    // this.changeMainGif = this.changeMainGif.bind(this);
  }

  getRandomGifIdx(array) {
    return Math.floor(Math.random() * Math.floor(array.length - 1));
  }

  componentDidMount() {
    const API = "Kp4JbB095JreBIc2k80yZz5PNRff3FbN";
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${API}`;

    fetch(url)
      .then(res => res.json())
      .then(gifs => {
        // console.log("get gifs:", gifs);
        // console.log("get gifs data:", gifs.data);
        // console.log("get gif data:", gifs.data[0].images.original.url);
        this.setState({
          activeGif:
            gifs.data[this.getRandomGifIdx(gifs.data)].images.original.url
        });
        setInterval(() => {
          this.setState({
            activeGif:
              gifs.data[this.getRandomGifIdx(gifs.data)].images.original.url
          });
        }, 3000);
        // console.log("get:", this.state.activeGif);
      });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <h1>Main Gif</h1>
            <img src={this.state.activeGif} alt="gif" />
          </Col>
        </Row>
        <hr />
        <h3>Thumb Gifs</h3>
        <GalleryThumb
          changeMainGif={gifUrl => this.setState({ activeGif: gifUrl })}
        />
      </Container>
    );
  }
}

class GalleryThumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = { gifs: [], visibleModal: null };
    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    const API = "Kp4JbB095JreBIc2k80yZz5PNRff3FbN";
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${API}`;
    fetch(url)
      .then(res => res.json())
      .then(gifs => {
        //  console.log("get gifs:", gifs);
        console.log("get gifs data:", gifs.data);
        this.setState({
          gifs: gifs.data
        });
      });
  }
  handleClick(gifUrl) {
    console.log("clicked", gifUrl);
    this.props.changeMainGif(gifUrl);
    this.displayModal();
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  displayModal(gifUrl) {
    this.setState({ visibleModal: gifUrl });
  }
  removeClickedGif(idx) {
    this.state.gifs.splice(idx, 1);
    this.setState({ gifs: this.state.gifs });
    this.displayModal();
  }
  render() {
    const closeBtn = (
      <button className="close" onClick={() => this.displayModal()}>
        &times;
      </button>
    );

    return (
      <div>
        <Row>
          {this.state.gifs.map((gif, idx) => (
            <Col xs="6" sm="4" key={idx}>
              <img
                src={gif.images.fixed_height.url}
                alt="gif"
                onClick={() => this.displayModal(gif.images.fixed_height.url)}
              />
              <Modal
                isOpen={this.state.visibleModal === gif.images.fixed_height.url}
                toggle={() => this.displayModal(gif.images.fixed_height.url)}
                className={this.props.className}
              >
                <ModalHeader toggle={this.toggle} close={closeBtn}>
                  <img src={gif.images.fixed_height.url} alt="gif" />
                </ModalHeader>
                <ModalBody>
                  <Button
                    outline
                    color="secondary"
                    onClick={() =>
                      this.handleClick(gif.images.fixed_height.url)
                    }
                  >
                    Use as main
                  </Button>{" "}
                  <Button
                    outline
                    color="secondary"
                    onClick={() => this.removeClickedGif({ idx })}
                  >
                    Remove
                  </Button>
                </ModalBody>
              </Modal>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Gellery />, rootElement);

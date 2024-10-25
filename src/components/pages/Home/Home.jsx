import Carousel from "react-bootstrap/Carousel";
import imagen1 from "../../../assets/1.jpg"; // Asegúrate de que la ruta sea correcta y que esté bien importada
import imagen2 from "../../../assets/2.jpg"; // Asegúrate de que la ruta sea correcta y que esté bien importada
import imagen3 from "../../../assets/3.jpg"; // Asegúrate de que la ruta sea correcta y que esté bien importada

const Home = () => {
  return (
    <Carousel ride="carousel">
      <Carousel.Item interval={2000}>
        <img src={imagen1} alt="First slide" className="d-block w-100" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={2000}>
        <img src={imagen2} alt="Second slide" className="d-block w-100" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={2000}>
        <img src={imagen3} alt="Third slide" className="d-block w-100" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Home;

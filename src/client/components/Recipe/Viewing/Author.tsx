import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";

export default function Author() {
  return (
    <Container
      className="border border-2 position-sticky px-4 py-4 m-3 bg-light text-center"
      style={{ top: "5.25em", marginTop: "-2em" }}
    >
      <h3>About the Author </h3>
      <Image
        src="https://via.placeholder.com/200"
        roundedCircle
        className="d-block mx-auto"
      />

      <p>
        I started this blog as a way to share my recipes with friends and
        family.
        <Link to="/about"> Learn more about Once Upon a Thyme here. </Link>
      </p>
    </Container>
  );
}

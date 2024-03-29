import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function RecipeCategories() {
  const { data: fetchedTags } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  });

  const [tags, setTags] = useState<any>(fetchedTags);

  useEffect(() => {
    setTags(fetchedTags);
  }, [fetchedTags]);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/recipes" }}>
          Recipes
        </Breadcrumb.Item>
        <Breadcrumb.Item active linkAs={Link} linkProps={{ to: "/category" }}>
          Categories
        </Breadcrumb.Item>
      </Breadcrumb>
      <Container>
        <h1>All Categories</h1>
        <Row>
          {tags.map((tag: any, index: number) => (
            <Col xs={3} key={index}>
              <Link to={`/category/${tag.value}`} className="text-capitalize">
                {tag.value}
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

async function getAllTags() {
  const { data } = await axios.get("/tags");
  return data;
}

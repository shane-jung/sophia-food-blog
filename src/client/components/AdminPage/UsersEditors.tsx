import { useGetAllUsers } from "@/client/queries";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import ListGroup from "react-bootstrap/ListGroup";

export default function UsersEditor() {
  const roles: { [key: string]: string } = {
    8012: "Admin",
    1000: "User",
  };
  const users = useGetAllUsers();
  return (
    <Container>
      <h1>Users</h1>
      <ListGroup>
        <ListGroup.Item as={Row} className="d-flex justify-content-between">
          <Col className="font-weight-bold">Username</Col>
          <Col className="font-weight-bold" xs={6}>
            Email Address
          </Col>
          <Col className="font-weight-bold">Role</Col>
        </ListGroup.Item>
        {users?.map((user: any) => {
          return (
            <ListGroup.Item
              as={Row}
              key={user._id}
              className="d-flex justify-content-between"
            >
              <Col>{user.username}</Col>
              <Col xs={6}>{user.email}</Col>
              <Col>
                {user.roles && user.roles.map((role: number) => roles[role])}
              </Col>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
}

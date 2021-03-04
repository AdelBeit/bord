import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// auth0 login
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = ({}) => {
  const Name = "bôrd";
  return (
    <Container className="login_page">
      <div>
        <Row>
          <Col>
            <span className="App_Title">{Name}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <LoginButton />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return <Button onClick={() => loginWithRedirect()}>Log In/Sign Up</Button>;
};

export { LoginButton, LoginPage };

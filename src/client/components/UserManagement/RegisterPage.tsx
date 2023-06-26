import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "../../api/axios";
import Logo from "../other/Logo";
import useAuth from "../../utils/useAuth";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import * as formik from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";

type fieldKey = "username" | "email" | "password" | "confirmPassword";

const autocomplete = {  email: "email", password: "new-password", confirmPassword: "new-password", username: "" }; 
const type = { email: "email", password: "password", confirmPassword : "password", username: "text" };

export default function RegisterPage() {
  const { Formik } = formik;

  const schema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
  });
  const { auth, setAuth } = useAuth();

  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [fields, setFields] = useState<fieldKey[]>([
    "username",
    "email",
    "password",
    "confirmPassword",
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  return (
    <Container>
      <Row>
        <Col xs={8} lg={6} xl={4} className="mx-auto">
          <Logo />
          <h3 className="text-center">Make an Account</h3>

          <Formik
            validationSchema={schema}
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validate={(values) => {
              const errors: any = {};
              if (!values.username) {
                errors.username = "Required";
              } else if (!/^[a-zA-Z0-9]{2,24}$/i.test(values.username)) {
                errors.username =
                  "Please enter a valid username between 2-24 characters with no spaces, special characters, or emojis.";
              }

              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i.test(
                  values.email
                )
              ) {
                errors.email = "Please enter a valid email address.";
              }


              if (!values.password) {
                errors.password = "Required";
              } else if (
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/i.test(values.password)
              ) {
                errors.password =
                  "Please enter a valid password between 8-24 characters with at least one uppercase letter, one lowercase letter, and one number.";
              }

              if (!values.confirmPassword) {
                errors.confirmPassword = "Required";
              } else if (values.password !== values.confirmPassword) {
                errors.confirmPassword = "Passwords do not match.";
              }
              if(errors.username || errors.email || errors.password || errors.confirmPassword)
                setValidated(false);
              else
                setValidated(true);

              return errors;
            }}
            onSubmit={ async (values, { setSubmitting }) => {
              // console.log("VALUES" , values);
              setSubmitting(true);
              try {
                const response = await axios.post("/users", {
                  email: values.email,
                });
                if (response.status == 200) {
                  const createResult = await axios.post("/users/create", {
                    values
                  });
                  // console.log(createResult);
                  const loginResult = await axios.post("/users/login", {
                    email: values.email,
                    password: values.password,
                  });

                  setAuth({
                    user: createResult.data.user,
                    isAuthenticated: true,
                  });
                  navigate(from, { replace: true });
                }
              } catch (err: any) {
                if (err.response.status === 409) {
                  setErrorMessage("Email already in use. Try logging in.")
                  return;
                }
              } finally { setSubmitting(false)} 

            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors, isSubmitting}) => (
              <Form
                method="POST"
                className="user-form"
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
              >
                {fields.map((field: fieldKey, index: number) => (
                  <Form.Group
                    className="mb-3"
                    key={field}
                  >
                    <FloatingLabel label={field}>
                      <Form.Control
                        id={field}
                        name={field}
                        required
                        value={values[field]}
                        onChange={handleChange}
                        isInvalid={touched[field] && !!errors[field]}
                        autoComplete={autocomplete[field]}
                        type={type[field]}
                      />
                    </FloatingLabel>

                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors[field]}
                    </Form.Control.Feedback>
                  </Form.Group>
                ))}
          <div className="text-danger">{errorMessage}</div>

                <Button variant="secondary" type="submit" className="mx-auto d-block my-2">
                  Create an Account
                </Button>
              </Form>
            )}
          </Formik>
          <p className="text-center">
            Already have an account?
            <Link to="/users/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

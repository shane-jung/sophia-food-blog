import { useEffect, useRef, useState } from "react";
import {
  Link,
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Logo from "../other/Logo";

import axios from "@/client/api/axios";
import useAuth from "../../utils/useAuth";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleLogin } from "../../slices/user";

import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import * as formik from "formik";
import * as yup from "yup";

type fieldKey = "email" | "password";
const fields: fieldKey[] = ["email", "password"];

const autocomplete = {  email: "email", password: "current-password" }; 
const type = { email: "email", password: "password" };

export default function LoginPage() {
  const { Formik } = formik;

  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.accessToken) navigate(from, { replace: true });
  }, []);

  
  return (
    <Container>
      <Row>
        <Col xs={8} lg={6} xl={4} className="mx-auto text-center">
          <Logo />

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

              if (!values.password) {
                errors.password = "Please enter your password";
              }

              if (errors.email || errors.password) setValidated(false);
              else setValidated(true);

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              try {
                const loginResult = await axios.post("/users/login", {
                  email: values.email,
                  password: values.password,
                });
                console.log(loginResult);
                dispatch(handleLogin(loginResult.data));
                setAuth({ user: loginResult.data.user, isAuthenticated: true });
                navigate(from, { replace: true });
              } catch (err: any) {
                setErrorMessage(err.response.data.errMessage);
                if (err.response.status === 409) {
                  return;
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
              isSubmitting,
            }) => (
              <Form
                method="POST"
                className="user-form"
                onSubmit={handleSubmit}
                noValidate
                validated={validated}
              >
                {fields.map((field: fieldKey, index: number) => (
                  <Form.Group className="mb-3" key={field}>
                    <FloatingLabel label={field}>
                      <Form.Control
                        type= {type[field]}
                        id={field}
                        name={field}
                        required
                        value={values[field]}
                        onChange={handleChange}
                        isInvalid={touched[field] && !!errors[field]}
                        autoComplete={autocomplete[field]}
                      />
                    </FloatingLabel>

                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors[field]}
                    </Form.Control.Feedback>  
                  </Form.Group>
                ))}
          <div className="text-danger">{errorMessage}</div>

                <Button
                  variant="secondary"
                  className="my-2 text-center"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
          
          <p className="text-center">
            Don't have an account?{" "}
            <Link to="/users/register">Create an Account</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

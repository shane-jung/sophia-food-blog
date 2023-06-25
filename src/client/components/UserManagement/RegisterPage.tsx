import userController from "@/server/controllers/userController";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "../../api/axios";
import Logo from "../other/Logo";
import useAuth from "../../utils/useAuth";
import { Container } from "react-bootstrap";

import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button  from "react-bootstrap/Button";

const USERNAME_REGEX = /^[a-zA-Z0-9]{2,24}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$/;
const EMAIL_REGEX = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;

export default function RegisterPage() {
  const { auth, setAuth } = useAuth();
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    const match = password === confirmPassword;
    setValidConfirmPassword(match);
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrMessage("");
  }, [username, email, password, confirmPassword]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (
      !validUsername ||
      !validEmail ||
      !validPassword ||
      !validConfirmPassword
    ) {
      console.log(
        validUsername,
        validEmail,
        validPassword,
        validConfirmPassword
      );
      return;
    }
    console.log("here");
    try {
      const response = await axios.post("/users", {
        email: email,
      });
      if (response.status == 200) {
        const createResult = await axios.post("/users/create", {
          email,
          username,
          password,
        });
        console.log(createResult);

        const loginResult = await axios.post("/users/login", {
          email,
          password,
        });
        setAuth({ user: createResult.data.user, isAuthenticated: true });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      if (err.response.status === 409) {
        setErrMessage("Email already exists");
        return;
      }
    }
  }

  return (
    <Container>
      <Logo />
      <Form method="POST" className="user-form" onSubmit={handleSubmit}>
        <h3 className="text-center">Make an Account</h3>
        <p
          className={errMessage ? "form-error-message" : "offscreen"}
          ref={errRef}
        >
          {errMessage}
        </p>
        <FloatingLabel label="Username">
          <Form.Control
            type="text"
            id="username"
            ref={usernameRef}
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FloatingLabel>
        <FloatingLabel label="Email Address">
          <Form.Control
            type="email"
            id="email"
            ref={emailRef}
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="email-error"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            required
          />
        </FloatingLabel>
        <p
          id="email-error"
          className={
            "form-error-message " + (email && !validEmail ? "active" : "")
          }
        >
          {email && !validEmail ? "Please enter a valid email address" : ""}
        </p>
        <FloatingLabel label="Password">
          <Form.Control
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="new-password"
            type="password"
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            pattern={PASSWORD_REGEX.source}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            required
          />
        </FloatingLabel>
        <p
          id="password-error"
          className={
            "form-error-message " + (password && !validPassword ? "active" : "")
          }
        >
          {password && !validPassword
            ? "Passwords should be between 8 and 24 characters and contain at least one number, one lowercase and one uppercase letter."
            : ""}
        </p>
        <FloatingLabel label="Confirm Password">
          <Form.Control
            name="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            type="password"
            minLength={8}
            onChange={(e) => setConfirmPassword(e.target.value)}
            pattern={PASSWORD_REGEX.source}
            onFocus={() => setConfirmPasswordFocus(true)}
            onBlur={() => setConfirmPasswordFocus(false)}
            autoComplete="new-password"
            required
          />
        </FloatingLabel>
        <p
          id="confirm-password-error"
          className={
            "form-error-message " +
            (confirmPassword && !validConfirmPassword ? "active" : "")
          }
        >
          {confirmPassword && !validConfirmPassword
            ? "Please make sure the passwords match."
            : ""}
        </p>
        <Button
          variant = "secondary"
        //   className={
            
        //     // validUsername &&
        //     // validEmail &&
        //     // validPassword &&
        //     // validConfirmPassword
        //     //   ? ""
        //     //   : "disabled-button"
        //   }
         >
          Create an Account
        </Button>
      </Form>
    </Container>
  );
}

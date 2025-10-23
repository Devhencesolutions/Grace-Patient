import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
} from "reactstrap";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import withRouter from "../../Components/Common/withRouter";
import logo from "../../assets/images/logo/grace_lab_logo.jpg";

const ForgotPassword = (props) => {
  const [values, setValues] = useState({ email: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const { email } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleForgotPassword();
    }
  };

  const handleForgotPassword = async () => {
    setIsSubmit(true);
    if (values.email === "") {
      let errors = {};
      errors.email = "Email is required!";
      setFormErrors(errors);
      setErrEmail(true);
    } else {
      const data = {
        email: email,
        modal: "Patient"
      };
      
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/forgotPassword`, data);
        if (res.isOk) {
          toast.success("Mail sent successfully for password reset");
          setFormErrors({});
        } else {
          setFormErrors({});
          toast.error(res.message);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to process request!");
      }
    }
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email === "") {
      errors.email = "Email is required!";
      setErrEmail(true);
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid Email address!";
      setErrEmail(true);
    } else {
      setErrEmail(false);
    }
    return errors;
  };

  const validClassEmail = errEmail && isSubmit ? "form-control is-invalid" : "form-control";

  document.title = "Forgot Password | Grace Labs";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50"></div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card style={{ marginTop: "35%" }}>
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div className="site-logo">
                        <Link to="/">
                          <img
                            style={{ display: "flex", alignItems: "center" }}
                            src={logo}
                            height={"70px"}
                            width={"80px"}
                            alt="Grace Labs"
                          />
                        </Link>
                      </div>
                    </div>
                    <h5 className="text-primary mt-2">Forgot Password</h5>
                    <p className="text-muted">Enter your email to receive password reset instructions</p>
                  </div>

                  <div className="p-2 mt-4">
                    <div className="mb-3">
                      <Label htmlFor="email" className="form-label">
                        Email
                      </Label>
                      <Input
                        name="email"
                        className={validClassEmail}
                        placeholder="Enter email"
                        type="email"
                        onChange={handleChange}
                        value={email}
                        onKeyDown={handleKeyDown}
                      />
                      {isSubmit && <p className="text-danger">{formErrors.email}</p>}
                    </div>

                    <div className="mt-4">
                      <Button
                        color="success"
                        className="btn btn-success w-100"
                        type="submit"
                        onClick={handleForgotPassword}
                      >
                        Send Reset Link
                      </Button>
                    </div>

                    <div className="mt-4 text-center">
                      <p className="mb-0">
                        Remember your password?{" "}
                        <Link to="/" className="fw-semibold text-primary text-decoration-underline">
                          Back to Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ForgotPassword); 
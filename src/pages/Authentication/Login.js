import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  // Alert,
} from "reactstrap";
import { Alert } from "react-bootstrap";

import logo from "../../assets/images/logo/grace_lab_logo.jpg";

import { ToastContainer, toast } from "react-toastify";
//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, socialLogin, resetLoginFlag } from "../../store/actions";

import withRouter from "../../Components/Common/withRouter";
import axios from "axios";

const initialState = {
  mobileNumber: "",
  password: "",
};

const Login = (props) => {
  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     login();
  //   }
  // };

  // const [showError, setShowError] = useState(false);
  const [values, setValues] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const { mobileNumber, password } = values;
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const login = () => {
    setIsSubmit(true);
    setFormErrors(validate(values));

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/userLoginPatient`,
        values
      )
      .then((res) => {
        const payload = res?.data;
        if (payload?.isOk) {
          const user = payload.data;
          localStorage.setItem("AdminUser", user?._id);
          localStorage.setItem("Patient", user?.PatientName ?? "");
          localStorage.setItem("Email Id", user?.Email ?? "");
          localStorage.setItem(
            "PatientReferenceNo",
            user?.PatientReferenceNo ?? ""
          );
          window.location.replace("/profile");
        } else {
          toast.error(payload?.message || "Authentication failed!");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Authentication failed!");
      });
  };

  const [errMobileNumber, setErrMobileNumber] = useState(false);
  const [errPassword, setErrPassword] = useState(false);

  const validate = (values) => {
    const errors = {};
    const mobileRegex = /^[0-9]{10}$/;
    if (values.mobileNumber === "") {
      errors.mobileNumber = "Mobile number is required!";
      setErrMobileNumber(true);
    } else if (!mobileRegex.test(values.mobileNumber)) {
      errors.mobileNumber = "Invalid mobile number!";
      setErrMobileNumber(true);
    } else {
      setErrMobileNumber(false);
    }
    if (values.password === "") {
      errors.password = "Password is required!";
      setErrPassword(true);
    }
    if (values.password !== "") {
      setErrPassword(false);
    }
    return errors;
  };
  const validClassMobileNumber =
    errMobileNumber && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPassword =
    errPassword && isSubmit ? "form-control is-invalid" : "form-control pe-5";

  document.title = " SignIn | Grace Labs ";
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <React.Fragment>
      {/* <ParticlesAuth> */}
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div className="site-logo">
                        <Link to="index.html">
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

                    <h5 className="text-primary mt-2">Welcome Back !</h5>
                    <p className="text-muted">Sign in to continue.</p>
                  </div>

                  {error && error ? (
                    <Alert color="danger"> {error} </Alert>
                  ) : null}
                  <div className="p-2 mt-4">
                    <div className="mb-3">
                      <Label htmlFor="mobileNumber" className="form-label">
                        Mobile Number
                      </Label>
                      <Input
                        name="mobileNumber"
                        className={validClassMobileNumber}
                        placeholder="Enter mobile number"
                        type="text"
                        onChange={handleChange}
                        value={mobileNumber}
                        onKeyDown={handleKeyDown}
                      />
                      {isSubmit && (
                        <p className="text-danger">{formErrors.mobileNumber}</p>
                      )}
                    </div>

                    <div>
                      <Label className="form-label" htmlFor="password-input">
                        Password
                      </Label>
                      <div className="position-relative auth-pass-inputgroup ">
                        <Input
                          name="password"
                          value={password}
                          onKeyDown={handleKeyDown}
                          type={showPassword ? "text" : "Password"}
                          className={validClassPassword}
                          placeholder="Enter Password"
                          onChange={handleChange}
                        />
                        {isSubmit && (
                          <p className="text-danger">{formErrors.password}</p>
                        )}
                        <button
                          className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                          type="button"
                          id="password-addon"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <i class="ri-eye-off-fill  align-middle"></i>
                          ) : (
                            <i className="ri-eye-fill align-middle"></i>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* <Row className="mb-3 mt-2">
                      <div>
                        <div className="float-end">
                          <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                        </div>
                      </div>
                    </Row> */}

                    <div className="mt-4">
                      <Button
                        color="success"
                        className="btn btn-success w-100"
                        type="submit"
                        onClick={login}
                      >
                        Sign In
                      </Button>
                      <Row className="mb-3 mt-5">
                      <div>
                        <div className="float-end">
                          <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                        </div>
                      </div>
                    </Row>
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

export default withRouter(Login);

import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";

import { createReferralByPatient } from "../../functions/Loyalty/ReferrFriend";

const initialState = {
  ReceiverEmail: "",
};

const RefferFriend = () => {
  const [values, setValues] = useState(initialState);
  const { ReceiverEmail } = values;
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [errCN, setErrCN] = useState(false);
  const [errC, setErrC] = useState(false);
  const [query, setQuery] = useState("");
  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");
  const [categories, setCategories] = useState([]);
  const [Stakeholderdata, setStakeholderdata] = useState("");
  const [Subscriptiondata, setSubscriptiondata] = useState("");

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
    setIsSubmit(false);
  };

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCheck = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.checked, // Use checked instead of value
    });
  };
  const PatientReferenceNo = localStorage.getItem("PatientReferenceNo");
  const Patient = localStorage.getItem("Patient");
  const ReferredByPatient = localStorage.getItem("AdminUser");
  console.log("Patient", Patient);
  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    // Add LabName to values object
    const updatedValues = {
      ...values,
      PatientReferenceNo,
      Patient,
      ReferredByPatient,
    };
    console.log("country", values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);
    if (Object.keys(erros).length === 0) {
      createReferralByPatient(updatedValues)
        .then((res) => {
          setmodal_list(!modal_list);
          setValues(initialState);
          fetchCategories();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const [errCD, setErrCD] = useState(false);
  const [errSR, setErrSR] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (values.ReceiverEmail === "") {
      errors.ReceiverEmail = "ReceiverEmail is required!";
      setErrCD(true);
    }
    if (values.ReceiverEmail !== "") {
      setErrCD(false);
    }
    return errors;
  };
  const validClassReceiverEmail =
    errCD && isSubmit ? "form-control is-invalid" : "form-control";

  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  useEffect(() => {
    // fetchUsers(1); // fetch page 1 of users
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCategories = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/listReferralsByParamsPatients/${ReferredByPatient}`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setCategories(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setCategories([]);
        }
        // console.log(res);
      });

    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    // setPageNo(page);
    setPerPage(newPerPage);
  };
  const col = [
    {
      name: "Date",
      selector: (row) => row?.date,
      sortable: true,
      sortField: "ReceiverEmail",
      minWidth: "150px",
    },
    {
      name: "Receiver Email",
      selector: (row) => row?.ReceiverEmail,
      sortable: true,
      sortField: "ReceiverEmail",
      minWidth: "150px",
    },
  ];

  document.title = "Refer To Friend | Grace Labs";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Category"
            title="Reffer To Friend"
            pageTitle="Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" sm={6} lg={4} md={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Reffer To Friend
                      </h2>
                    </Col>
                    <Col sm={6} lg={4} md={6}></Col>
                    <Col className="col-sm-auto" sm={12} lg={4} md={12}>
                      <div className="d-flex justify-content-sm-end">
                        <div className="ms-2">
                          <Button
                            color="success"
                            className="add-btn me-1"
                            onClick={() => tog_list()}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Add
                          </Button>
                        </div>
                        <div className="search-box ms-2">
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Search..."
                            onChange={(e) => setQuery(e.target.value)}
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <div className="table-responsive table-card mt-1 mb-1 text-right">
                      <DataTable
                        columns={col}
                        data={categories}
                        progressPending={loading}
                        sortServer
                        onSort={(column, sortDirection, sortedRows) => {
                          handleSort(column, sortDirection);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationRowsPerPageOptions={[10, 50, 100, totalRows]}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={modal_list}
        toggle={() => {
          tog_list();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_list(false);
            setIsSubmit(false);
          }}
        >
          Refer a Friend
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassReceiverEmail}
                placeholder="Enter Category Name"
                required
                name="ReceiverEmail"
                value={ReceiverEmail}
                onChange={handleChange}
              />
              <Label>
                Email of the person you want to refer{" "}
                <span className="text-danger">*</span>
              </Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.ReceiverEmail}</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleClick}
              >
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_list(false);
                  setValues(initialState);
                  setIsSubmit(false);
                }}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* Remove Modal */}
      <Modal
        isOpen={modal_delete}
        toggle={() => {
          tog_delete();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_delete(false);
          }}
        >
          Remove Query card
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="mt-2 text-center">
              <lord-icon
                src="https://cdn.lordicon.com/gsqxdxog.json"
                trigger="loop"
                colors="primary:#f7b84b,secondary:#f06548"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
              <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                <h4>Are you sure ?</h4>
                <p className="text-muted mx-4 mb-0">
                  Are you Sure You want to Remove this Record ?
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default RefferFriend;

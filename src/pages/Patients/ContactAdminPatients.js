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

import {
  createContactAdminPatients,
  removeContactAdminPatients,
  listContactAdminPatients,
  updateContactAdminPatients,
  getContactAdminPatients,
  listActiveContactAdminPatients,
} from "../../functions/PatientMaster/ContactAdminPatients.js";

const initialState = {
  SubscriptionName: "",
  Subject: "",
  Query: "",
  Date: "", // Set the current date in YYYY-MM-DD format

  IsActive: true,
};
const ContactAdminPatients = () => {
  const [values, setValues] = useState(initialState);
  const { Date, Subject, Query, IsActive } = values;
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
    listActiveContactAdminPatients().then((response) => {
      console.log("Subscriptiondata", response);
      setStakeholderdata(response);
      setSubscriptiondata(response);
    });
  }, []);

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

  const [modal_edit, setmodal_edit] = useState(false);
  const handleTog_edit = (_id) => {
    setmodal_edit(!modal_edit);
    setIsSubmit(false);
    set_Id(_id);
    getContactAdminPatients(_id)
      .then((res) => {
        console.log(res);
        let dateValue = new window.Date(res.Date); // Use window.Date to access the built-in Date object
        let formattedDate = dateValue.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD format
        setValues({
          ...values,
          Date: formattedDate,
          Subject: res.Subject,
          Query: res.Query,
          IsActive: res.IsActive,
        });
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleClick = (e) => {
    e.preventDefault();
    setFormErrors({});
    const Patient = localStorage.getItem("Patient");
    // Add LabName to values object
    const updatedValues = { ...values, Patient: Patient };
    console.log("country", values);
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);
    if (Object.keys(erros).length === 0) {
      createContactAdminPatients(updatedValues)
        .then((res) => {
          setmodal_list(!modal_list);
          setValues(initialState);
          fetchCategories();
          // if (res.isOk) {
          //   setmodal_list(!modal_list);
          //   setValues(initialState);
          //   fetchCategories();
          // } else {
          //   if (res.field === 1) {
          //     setErrCN(true);
          //     setFormErrors({
          //       Title: "This Category name is already exists!",
          //     });
          //   }
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    removeContactAdminPatients(remove_id)
      .then((res) => {
        setmodal_delete(!modal_delete);
        fetchCategories();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let erros = validate(values);
    setFormErrors(erros);
    setIsSubmit(true);

    if (Object.keys(erros).length === 0) {
      updateContactAdminPatients(_id, values)
        .then((res) => {
          setmodal_edit(!modal_edit);
          fetchCategories();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const [errCD, setErrCD] = useState(false);
  const [errSR, setErrSR] = useState(false);

  const validate = (values) => {
    const errors = {};

    if (values.Date === "") {
      errors.Date = "Date is required!";
      setErrCN(true);
    }
    if (values.Date !== "") {
      setErrCN(false);
    }
    if (values.Subject === "") {
      errors.Subject = "Subject is required!";
      setErrCD(true);
    }
    if (values.Subject !== "") {
      setErrCD(false);
    }
    if (values.Query === "") {
      errors.Query = "Query is required!";
      setErrSR(true);
    }
    if (values.Query !== "") {
      setErrSR(false);
    }

    return errors;
  };

  const validClassTitle =
    errCN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassSubject =
    errCD && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassQuery =
    errSR && isSubmit ? "form-control is-invalid" : "form-control";

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
        `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/ContactAdminPatients`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          IsActive: filter,
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
  const handleFilter = (e) => {
    setFilter(e.target.checked);
  };
  const col = [
    {
      name: "Date",
      selector: (row) => {
        const dateValue = new window.Date(row?.Date); // Use window.Date to access the built-in Date object
        const day = String(dateValue.getDate()).padStart(2, "0");
        const month = String(dateValue.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
        const year = dateValue.getFullYear();
        return `${day}-${month}-${year}`;
      },
      sortable: true,
      sortField: "StakeholderName",
      minWidth: "150px",
    },
    {
      name: "Subject",
      selector: (row) => row?.Subject,
      sortable: true,
      sortField: "Subject",
      minWidth: "150px",
    },
    {
      name: "Query",
      selector: (row) => row?.Query,
      sortable: true,
      sortField: "Query",
      minWidth: "150px",
    },
    // {
    //     name: "Status",
    //     selector: (row) => {
    //         return <p>{row.IsActive ? "Active" : "InActive"}</p>;
    //     },
    //     sortable: false,
    //     sortField: "Status",
    // },
    // {
    //     name: "Action",
    //     selector: (row) => {
    //         return (
    //             <React.Fragment>
    //                 <div className="d-flex gap-2">
    //                     <div className="edit">
    //                         <button
    //                             className="btn btn-sm btn-success edit-item-btn "
    //                             data-bs-toggle="modal"
    //                             data-bs-target="#showModal"
    //                             onClick={() => handleTog_edit(row._id)}
    //                         >
    //                             Edit
    //                         </button>
    //                     </div>

    //                     <div className="remove">
    //                         <button
    //                             className="btn btn-sm btn-danger remove-item-btn"
    //                             data-bs-toggle="modal"
    //                             data-bs-target="#deleteRecordModal"
    //                             onClick={() => tog_delete(row._id)}
    //                         >
    //                             Remove
    //                         </button>
    //                     </div>
    //                 </div>
    //             </React.Fragment>
    //         );
    //     },
    //     sortable: false,
    //     minWidth: "180px",
    // },
  ];

  document.title = "Contact Admin | Grace Labs";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Category"
            title="Contact Admin "
            pageTitle="Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" sm={6} lg={4} md={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Contact Admin
                      </h2>
                    </Col>

                    <Col sm={6} lg={4} md={6}>
                      {/* <div className="text-end mt-2">
                                                    <Input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="filter"
                                                        value={filter}
                                                        defaultChecked={true}
                                                        onChange={handleFilter}
                                                    />
                                                    <Label className="form-check-label ms-2">Active</Label>
                                                </div> */}
                    </Col>
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
          Send Query To Admin
        </ModalHeader>
        <form>
          <ModalBody>
            <Col lg={12}>
              <div className="form-floating mb-3">
                <Input
                  key={"DoctorRegistrationDate_" + _id}
                  type="date"
                  className={validClassTitle} // Use the same class as before
                  placeholder="Enter blog title"
                  required
                  name="Date"
                  value={values.Date} // Use values.Date instead of Date
                  onChange={handleChange}
                />
                <Label>
                  Date <span className="text-danger">*</span>
                </Label>
                {isSubmit && <p className="text-danger">{formErrors.Date}</p>}
              </div>
            </Col>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassSubject}
                placeholder="Enter Category Name"
                required
                name="Subject"
                value={Subject}
                onChange={handleChange}
              />
              <Label>
                Subject <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Subject}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassQuery}
                placeholder="Enter Category Name"
                required
                name="Query"
                value={Query}
                onChange={handleChange}
              />
              <Label>
                Query <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Query}</p>}
            </div>

            {/* <div className="form-check mb-2">
                                <Input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="IsActive"
                                    value={IsActive}
                                    defaultChecked={true}
                                    onChange={handleCheck}
                                />
                                <Label className="form-check-label">Is Active</Label>
                            </div> */}
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

      {/* Edit Modal */}
      <Modal
        isOpen={modal_edit}
        toggle={() => {
          handleTog_edit();
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_edit(false);
            setIsSubmit(false);
          }}
        >
          Edit Pin Code
        </ModalHeader>
        <form>
          <ModalBody>
            <Col lg={12}>
              <div className="form-floating mb-3">
                <Input
                  key={"DoctorRegistrationDate_" + _id}
                  type="date"
                  className={validClassTitle} // Use the same class as before
                  placeholder="Enter blog title"
                  required
                  name="Date"
                  value={Date}
                  onChange={handleChange}
                />
                <Label>
                  Date <span className="text-danger">*</span>
                </Label>
                {isSubmit && <p className="text-danger">{formErrors.Date}</p>}

              </div>
            </Col>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassSubject}
                placeholder="Enter Category Name"
                required
                name="Subject"
                value={Subject}
                onChange={handleChange}
              />
              <Label>
                Subject <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Subject}</p>}
            </div>

            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassQuery}
                placeholder="Enter Category Name"
                required
                name="Query"
                value={Query}
                onChange={handleChange}
              />
              <Label>
                Query <span className="text-danger">*</span>
              </Label>
              {isSubmit && <p className="text-danger">{formErrors.Query}</p>}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                checked={values.IsActive} // Use checked instead of value
                onChange={handleCheck}
              />
              <Label className="form-check-label">Is Active</Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn"
                onClick={handleUpdate}
              >
                Update
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => {
                  setmodal_edit(false);
                  setIsSubmit(false);
                  setFormErrors({});
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
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-danger"
                id="add-btn"
                onClick={handleDelete}
              >
                Remove
              </button>

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setmodal_delete(false)}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default ContactAdminPatients;

import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getServiceOrderById } from "../../functions/Services/ServiceOrder";

import { Table } from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import { ToastContainer, toast } from "react-toastify";

const initialState = {
  patientName: "",
  ServiceName: "",
  invoiceGenrationDate: "",
  paymentMethod: "",
  isPaid: false,
  totalAmount: "",
  amount: "",
  orderId: "",
  traceId: "",
  timestamp: "",
  payment_category: "",
  transactionid: "",
  payment_method_type: "",
  bankid: "",
  auth_status: "",
  encrypted_create_response: "",
  encrypted_ru_response: "",
  encrypted_retrive_response: "",
  transaction_error_desc: "",
  retriveTransactionRes: {},
  memberFeedback: "",
};

const ServiceOrder = () => {
  const [values, setValues] = useState(initialState);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  const [modal_edit, setmodal_edit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [_id, set_Id] = useState("");
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();
  const [query, setQuery] = useState("");

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  const handleTog_edit = (_id) => {
    setIsSubmit(false);
    set_Id(_id);
    getServiceOrderById(_id)
      .then((res) => {
        setValues(res.customer);
        setmodal_edit(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlefeedback = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/ServiceOrder/feedback/${_id}`,
        { memberFeedback: values.memberFeedback }
      )
      .then((res) => {
        if (res.isOk) {
          toast.success("Feedback Sent Successfully!");
          setmodal_edit(false);
        } else {
          toast.error("Something went wrong!");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        console.log(err);
      });
  };

  const fetchOrders = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(`${process.env.REACT_APP_API_URL}/api/patient/ServiceOrder/list`, {
        skip: skip,
        per_page: perPage,
        sorton: column,
        sortdir: sortDirection,
        match: query,
        patientId: localStorage.getItem("AdminUser"),
      })
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          setLoading(false);
          setOrders(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setOrders([]);
        }
      });

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [pageNo, perPage, column, sortDirection, query]);

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const getValidationClass = (field) => {
    return isSubmit && formErrors[field] ? "is-invalid" : "";
  };

  const col = [
    {
      name: "OrderId",
      cell: (row) => row?.orderId,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Service Name",
      cell: (row) => row.ServiceName?.ServiceName,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Amount(₹)",
      cell: (row) => row.totalAmount,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Ordered At",
      selector: (row) => new Date(row.createdAt).toLocaleString(), // formatted date & time
      sortable: true,
      sortField: "createdAt",
      minWidth: "180px",
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <React.Fragment>
            <div className="d-flex gap-2">
              <div className="edit">
                <button
                  className="btn btn-sm btn-primary edit-item-btn"
                  onClick={() => handleTog_edit(row._id)}
                >
                  View
                </button>
              </div>
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
      minWidth: "180px",
    },
  ];

  document.title = "View Service Orders | GraceLabs";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <BreadCrumb
            maintitle="View Service Orders"
            title="View Service Orders"
            pageTitle="Service Order"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        View Service Orders
                      </h2>
                    </Col>
                    <Col className="col-sm-auto" sm={12} lg={6} md={12}>
                      <div className="d-flex justify-content-sm-end">
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
                  <div className="table-responsive table-card mt-1 mb-1 text-right">
                    <DataTable
                      columns={col}
                      data={orders}
                      progressPending={loading}
                      pagination
                      paginationServer
                      paginationTotalRows={totalRows}
                      paginationRowsPerPageOptions={[10, 50, 100, totalRows]}
                      onChangeRowsPerPage={handlePerRowsChange}
                      onChangePage={handlePageChange}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        isOpen={modal_edit}
        toggle={() => setmodal_edit(!modal_edit)}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => setmodal_edit(!modal_edit)}
        >
          View Service Order
        </ModalHeader>

        <form>
          <ModalBody>
            <Table
              border={1}
              striped
              className="table mb-0"
              style={{
                width: "100%",
                marginBottom: "1rem",
                color: "black",
                fontSize: "16px",
              }}
            >
              <tbody>
                <tr>
                  <th scope="row">Member Name : </th>
                  <td>{values?.patientName?.PatientName}</td>
                </tr>
                <tr>
                  <th scope="row">Member Email : </th>
                  <td>{values?.patientName?.Email}</td>
                </tr>
                <tr>
                  <th scope="row">Member Phone : </th>
                  <td>{values?.patientName?.mobileNumber}</td>
                </tr>
                <tr>
                  <th scope="row">Service Name : </th>
                  <td>{values?.ServiceName?.ServiceName}</td>
                </tr>
                <tr>
                  <th scope="row">Service Description : </th>
                  <td>{values?.ServiceName?.Description}</td>
                </tr>
                <tr>
                  <th scope="row">Service Price : </th>
                  <td>{values?.ServiceName?.Price}</td>
                </tr>
                <tr>
                  <th scope="row">Amount : </th>
                  <td>{values?.totalAmount}</td>
                </tr>
                <tr>
                  <th scope="row">Payment Method : </th>
                  <td>{values?.paymentMethod}</td>
                </tr>
                <tr>
                  <th scope="row">Payment Status : </th>
                  <td>{values.isPaid ? "Paid" : "Unpaid"}</td>
                </tr>
                <tr>
                  <th scope="row">Order Id : </th>
                  <td>{values?.orderId}</td>
                </tr>
                {values?.ServiceName?.imageGallery && (
                  <tr rowSpan={2}>
                    <th scope="row">Service Image : </th>

                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${values?.ServiceName?.imageGallery[0]}`}
                        alt="service"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className="form-floating mt-3">
              <Input
                type="textarea"
                className="form-control"
                placeholder="Enter feedback"
                style={{ height: "100px" }}
                required
                name="SubmemberFeedbackject"
                value={values.memberFeedback}
                onChange={(e) =>
                  setValues({ ...values, memberFeedback: e.target.value })
                }
              />
              <Label>Feedback</Label>
              {/* {isSubmit && <p className="text-danger">{formErrors.Subject}</p>} */}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                onClick={handlefeedback}
              >
                Send Feedback
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setmodal_edit(false)}
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

export default ServiceOrder;

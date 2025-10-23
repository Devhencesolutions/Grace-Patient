import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { ModalTitle, Table } from "react-bootstrap";
import { getMoreServiceRequest } from "../../functions/Services/MoreServiceRequest";
import { toast, ToastContainer } from "react-toastify";

const initialState = {
  patientName: "",
  ServiceName: "",
  ServiceProvider: "",
  name: "",
  contact: "",
  email: "",
  city: "",
  remarks: "",
};

const MoreServiceRequest = () => {
  const [values, setValues] = useState(initialState);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [column, setcolumn] = useState();
  const [sortDirection, setsortDirection] = useState();
  const [pageNo, setPageNo] = useState(0);
  const [modal_edit, setmodal_edit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [_id, set_Id] = useState("");

  const [query, setQuery] = useState("");

  const handleTog_edit = (_id) => {
    setIsSubmit(false);
    set_Id(_id);
    getMoreServiceRequest(_id)
      .then((res) => {
        console.log(res);
        setValues(res);
        setmodal_edit(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSort = (column, sortDirection) => {
    setcolumn(column.sortField);
    setsortDirection(sortDirection);
  };

  const fetchOrders = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/more-services-request/listByParams`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          patientId: localStorage.getItem("AdminUser"),
        }
      )
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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [patient, setPatient] = useState("");
  const [provider, setProvider] = useState("");
  const [serviceRequest, setServiceRequest] = useState("");

  const handleOpenModal = (row) => {
    setModalOpen(true);
    setPatient(row.patientName?._id || "");
    setProvider(row.ServiceProvider || "");
    setServiceRequest(row._id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setAmount("");
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !amount) {
      alert("Please select an image and enter amount.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("ServiceRequest", serviceRequest);
    formData.append("amount", amount);
    formData.append("patientName", patient);
    formData.append("ServiceProvider", provider);

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/update/service-bill/patient-image`,
        formData
      )
      .then((res) => {
        if (res.isOk) {
          setModalOpen(false);
          fetchOrders();
        } else {
          toast.error("something went wrong");
        }
        // console.log("Image uploaded successfully:", res);
        // alert("Image uploaded!");
      })
      .catch((error) => {
        console.error("Upload error:", error);
        // alert("Failed to upload image.");
      });
  };

  const handleViewDocument = (row) => {
    const documentUrl = `${process.env.REACT_APP_API_URL}/${row?.serviceBill?.patientImage}`;
    window.open(documentUrl, "_blank");
  };

  const col = [
    {
      name: "Name",
      cell: (row) => row.patientName?.PatientName,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Contact Details",
      cell: (row) => `${row.email} || ${row.contact}`,
      sortable: true,
      sortField: "Email",
      minWidth: "150px",
    },
    {
      name: "Service",
      cell: (row) => row.service?.ServiceName,
      sortable: true,
      sortField: "row.service?.ServiceName",
      minWidth: "150px",
    },
    {
      name: "City",
      cell: (row) => row.city?.Name,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Status",
      selector: (row) => {
        return (
          <p
            style={{
              color: row?.serviceBill?.isVarified ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {row?.serviceBill?.isVarified ? "Verified" : "Pending"}
          </p>
        );
      },
    },
    {
      name: "Uploaded Bill",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            <button
              className="btn btn-sm btn-primary view-item-btn m-1"
              onClick={() => handleViewDocument(row)}
              disabled={!row?.serviceBill?.patientImage}
            >
              <FaEye />
            </button>
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
              {row.ServiceProvider && (
                <div className="edit">
                  <button
                    className="btn btn-sm btn-primary edit-item-btn"
                    onClick={() => handleOpenModal(row)}
                    disabled={row?.serviceBill?.patientImage}
                  >
                   {row?.serviceBill?.patientImage ? "Uploaded" : "Upload Bill"}
                  </button>
                </div>
              )}
            </div>
          </React.Fragment>
        );
      },
      sortable: false,
      minWidth: "180px",
    },
  ];

  document.title = "Service Requests | GraceLabs";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <BreadCrumb
            maintitle="Service Requests"
            title="Service Requests"
            pageTitle="More Services"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" lg={4} md={6} sm={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Service Requests
                      </h2>
                    </Col>
                    <Col className="col-sm" lg={8} md={6} sm={6}>
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
          View Service Request
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
                  <th scope="row">Service Name : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.ServiceName?.ServiceName}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Member Name : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.patientName?.PatientName}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Member Email : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.email}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Member Phone : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values.contact}
                  </td>
                </tr>
                <tr>
                  <th scope="row">City : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.city?.Name}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Remarks : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.remarks}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Assigned Service Provider : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.ServiceProvider?.ContactPersonName}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Service Provider Email : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.ServiceProvider?.Email}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Service Provider Contact No. : </th>
                  <td
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    {values?.ServiceProvider?.ContactNo}
                  </td>
                </tr>
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              {/* <button
              type="submit"
              className="btn btn-success"
              onClick={handleUpdate}
            >
              Update
            </button> */}
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

      <Modal isOpen={modalOpen} toggle={handleCloseModal} centered>
        <ModalHeader>
          <ModalTitle>Upload Image & Enter Amount</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Enter Amount</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImageUpload}>
            Upload
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default MoreServiceRequest;

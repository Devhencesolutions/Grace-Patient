import axios from "axios";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import failureImg from "../../assets/images/Animation - 1727072299902.json";
import successImg from "../../assets/images/Animation - 1727074423053.json";
import logo from "../../assets/images/logo/grace_lab_logo.jpg";
import BreadCrumb from "../../Components/Common/BreadCrumb";
// import { RemoveJoinHandInquiry } from "../../functions/PatientInquiryWithSociety/PatientInquiryWithSociety";
// import ViewButton from "./ViewButton";

const LabCollectionInquiry = () => {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [Patient, setPatient] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modal_view, setmodal_view] = useState(false);

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [modal_delete, setmodal_delete] = useState(false);
  const tog_delete = (_id) => {
    setmodal_delete(!modal_delete);
    setRemove_id(_id);
  };

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
    fetchUsers();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/list/CollectionRequestByPatientId`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          patient: localStorage.getItem("AdminUser"),
        }
      )
      .then((response) => {
        if (response.length > 0) {
          let res = response[0];
          console.log(">>>", res);
          setLoading(false);
          setPatient(res.data);
          setTotalRows(res.count);
        } else if (response.length === 0) {
          setPatient([]);
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

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setmodal_view(true);
  };

  const handleViewDocument = (file) => {
    const documentUrl = `${process.env.REACT_APP_API_URL}/${file}`;
    window.open(documentUrl, "_blank");
  };

  const [appointmentId, setAppointmentId] = useState("");
    const [payModal, setPayModal] = useState(false);
    const [amount, setAmount] = useState();

  const col = [
    // {
    //   name: "Patient Name",
    //   selector: (row) => row.patient.PatientName,
    //   sortable: true,
    //   sortField: "patientName",
    //   minWidth: "150px",
    // },
    {
      name: "Laboratory",
      cell: (row) => row?.Laboratory?.LabName,
      sortable: true,
      sortField: "Laboratory.LabName",
      minWidth: "150px",
    },
    {
      name: "Contact Details",
      cell: (row) => `${row?.phoneNumber} | ${row?.email}`,
      sortable: true,
      sortField: "lastName",
      minWidth: "150px",
    },
    {
      name: "Request On",
      cell: (row) => moment(row?.createdAt).format("DD-MM-YYYY HH:mm"),
      sortable: true,
      sortField: "createdAt",
      // minWidth: "150px",
    },

    {
      name: "Collection Date & Time",
      selector: (row) => {
        return `${new Date(row?.collectionDate).toLocaleDateString()} ${
          row?.collectionTime
        }`;
      },
      sortable: true,
      sortField: "collectionDate",
      minWidth: "150px",
    },

    // {
    //   name: "Collection Time",
    //   selector: (row) => row.collectionTime,
    //   sortable: true,
    //   sortField: "collectionTime",
    //   minWidth: "150px",
    // },
    {
      name: "Report Uploaded On",
      cell: (row) =>  row?.reportUploadedOn ? moment(row?.reportUploadedOn).format("DD-MM-YYYY HH:mm") : "",
      sortable: true,
      sortField: "reportUploadedOn",
      // minWidth: "150px",
    },

    {
      name: "Collection Details",
      cell: (row) => {
        return (
          <div className="d-flex gap-2">
            <div className="view">
              <button
                className="btn btn-sm btn-primary view-item-btn"
                onClick={() => handleView(row)}
                title="Collection Details"
              >
                <i className="ri-file-list-line"></i>
              </button>
            </div>
          </div>
        );
      },
      width: "121px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "View Report",
      cell: (row) => {
        return (
          <div className="d-flex gap-2">
            <div className="view">
              <button
                className="btn btn-sm btn-warning view-item-btn"
                onClick={() => handleViewDocument(row?.reportDoc)}
                disabled={!row?.reportDoc}
                title="View Report"
              >
                <i className="ri-file-paper-line"></i>
              </button>
            </div>
          </div>
        );
      },
      width: "120px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Payto Lab",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            {!row?.isPaid ? (
              <button
                className="btn btn-sm btn-success view-item-btn m-1"
                disabled={!row.amount}
                // style={{
                //   cursor: !row.amount ? "progress" : "pointer",
                //   opacity: !row.amount ? 0.65 : 1,
                // }}
                onClick={(e) => {
                  e.preventDefault();
                  setAppointmentId(row._id);
                  // handleGetAmount(row._id);
                  setAmount(row?.amount);
                  setPayModal(true);
                }}
              >
                <i className=" ri-edit-box-fill fs-5 mt-1 text-light"></i>
              </button>
            ) : (
              <button className="btn btn-sm m-1 bg-info">
                <i className="ri-checkbox-circle-fill fs-4 mt-1 text-light"></i>
              </button>
            )}
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

   const [order_id, setOrder_id] = useState("");
    const [sucessReceipt, setSuccessReceipt] = useState(false);
    const [failurReceipt, setFailurReceipt] = useState(false);
    const [receiptModal, setReceiptModal] = useState(true);
    const [receiptDetails, setReceiptDetails] = useState({});
  
    const [isLoad, setIsLoad] = useState(false);

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData:
        (failurReceipt && failureImg) || (sucessReceipt && successImg),
      renderer: "svg",
    };
  

  useEffect(() => {
    console.log("NNNNNN",order_id);
    if (order_id) {
      fetchOrderByOrderId();
    }
  }, [order_id]);

  const handleRetriveTransaction = async (orderId) => {
    try {
      setIsLoad(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/CollectionRequest/retrive-transaction`,
        { orderId: orderId }
      );
      if (res.decoded) {
        if (res.decoded.auth_status == "0300") {
          setSuccessReceipt(true);
          setReceiptModal(true);

          console.log("retrive trans", res);

          const resp = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/CollectionRequest/payment/point-transaction/${appointmentId}`
          );

          console.log("point transaction >>>", resp);

          if (resp.isOk) {
            setIsLoad(false);
            setPayModal(false);
            fetchUsers();
          } else {
            setIsLoad(false);
            window.alert(
              "something went wrong with loyalty points transaction!"
            );
          }
        }
      } else {
        setIsLoad(false);
        window.alert("something went wrong!");
      }
    } catch (error) {
      setIsLoad(false);
      console.log(error);
    }
  };

  const fetchOrderByOrderId = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/CollectionRequest-by-orderid/${order_id}`
      );
      console.log("gte app by order id", res);
      if (res.isOk) {
        setReceiptDetails(res.data[0]);
        if (res.data[0].auth_status === "transaction is successful") {
          setSuccessReceipt(true);
          setReceiptModal(true);
        }
        if (res.data[0].auth_status === "transaction failed") {
          setFailurReceipt(true);
          setReceiptModal(true);
        } else {
          handleRetriveTransaction(res.data[0].orderId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSDKLaunch = (response) => {
    var responseHandler = function (txn) {
      console.log(txn);
      setOrder_id(txn.txnResponse.orderid);
    };

    const config = {
      flowConfig: {
        // merchantId: "BDUATV2APT",
        merchantId: "HYDGMPLBAR",
        bdOrderId: response.decoded.bdorderid,
        authToken: response.decoded.links[1].headers.authorization,
        childWindow: true,
        retryCount: 0,
        prefs: {
          payment_categories: [
            "card",
            "emi",
            "nb",
            "upi",
            "wallets",
            "qr",
            "gpay",
          ],
          allowed_bins: ["459150", "525211"],
        },
        netBanking: {
          showPopularBanks: "N",
          popularBanks: ["Kotak Bank", " AXIS Bank [Retail]"],
        },
      },
      responseHandler: responseHandler,
      flowType: "payments",
      merchantLogo: logo,
    };

    const retryInterval = setInterval(() => {
      if (typeof window.loadBillDeskSdk === "function") {
        clearInterval(retryInterval);
        window.loadBillDeskSdk(config);
      } else {
        console.warn("Retrying: BillDesk SDK is not yet loaded...");
      }
    }, 500); // Retry every 500ms
  };

  const handlePay = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/CollectionRequest/patient-pay/${appointmentId}`
      );

      console.log(res);
      if (res.isOk) {
        handleSDKLaunch(res);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  document.title = "Lab Collection | Patient | Grace Labs";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Lab Collection "
            title="Lab Collection "
            pageTitle="Lab Collection "
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" sm={6} lg={4} md={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Lab Collection
                      </h2>
                    </Col>

                    <Col className="col-sm-auto" sm={12} lg={8} md={12}>
                      <div className="d-flex justify-content-sm-end">
                        <div className="ms-2"></div>
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
                        data={Patient}
                        progressPending={loading}
                        sortServer
                        onSort={(column, sortDirection, sortedRows) => {
                          handleSort(column, sortDirection);
                        }}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationRowsPerPageOptions={[
                          20,
                          40,
                          60,
                          80,
                          100,
                          120,
                          140,
                          160,
                          180,
                          200,
                          220,
                          240,
                          260,
                          280,
                          300,
                          totalRows,
                        ]}
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

      {/* View Modal */}
      <Modal
        isOpen={modal_view}
        toggle={() => {
          setmodal_view(!modal_view);
        }}
        centered
      >
        <ModalHeader
          className="bg-light p-3"
          toggle={() => {
            setmodal_view(false);
          }}
        >
          Patient Details
        </ModalHeader>
        <ModalBody>
          {selectedPatient && (
            <div>
              <p>
                <strong>Patient Name:</strong>{" "}
                {selectedPatient.patient.PatientName}
              </p>
              <p>
                <strong>Laboratory:</strong>{" "}
                {selectedPatient.Laboratory.LabName}
              </p>
              <p>
                <strong>Collection Date:</strong>{" "}
                {new Date(selectedPatient.collectionDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Collection Time:</strong>{" "}
                {selectedPatient.collectionTime}
              </p>
              <p>
                <strong>Contact No:</strong> {selectedPatient.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {selectedPatient.address}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Remarks:</strong> {selectedPatient.Remarks}
              </p>
              <p>
                <strong>Prescription Upload:</strong>
              </p>
              {selectedPatient.prescriptionUpload.endsWith(".pdf") ? (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const pdfUrl = `${process.env.REACT_APP_API_URL}/${selectedPatient.prescriptionUpload}`;
                    console.log("Opening PDF:", pdfUrl);
                    window.open(pdfUrl, "_blank");
                  }}
                >
                  Preview PDF
                </button>
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${selectedPatient.prescriptionUpload}`}
                  alt="Prescription"
                  style={{ width: "100%" }}
                />
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setmodal_view(false)}
          >
            Close
          </button>
        </ModalFooter>
      </Modal>

        <Modal
              isOpen={payModal}
              toggle={() => setPayModal(!payModal)}
              // size="lg"
              centered
            >
              <ModalHeader toggle={() => setPayModal(!payModal)}>Payment</ModalHeader>
              <ModalBody className="text-center">
                {isLoad && <h5>Loading...</h5>}
                <h4> Payable Amount: {amount} </h4>
                {/* {isPay && (
                          <h2>
                            <i className="ri-checkbox-circle-fill fs-3 mt-1 text-success"></i>{" "}
                          </h2>
                        )} */}
              </ModalBody>
              <ModalFooter>
                <div className="hstack gap-2 justify-content-end">
                  {/* {!isPay && ( */}
                  <button
                    type="submit"
                    className="btn btn-success"
                    id="add-btn"
                    disabled={!amount || amount < 0 || isLoad}
                    onClick={handlePay}
                  >
                    Pay
                  </button>
                  {/* )} */}
      
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => setPayModal(false)}
                  >
                    Close
                  </button>
                </div>
              </ModalFooter>
            </Modal>
    </React.Fragment>
  );
};

export default LabCollectionInquiry;

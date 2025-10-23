import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { FaIndianRupeeSign } from "react-icons/fa6"
import axios from "axios";
import moment from "moment";
import VideoCall from "./meeting.js"; // Import the VideoCall component
import BreadCrumb from "../../Components/Common/BreadCrumb.js";
import { getAppointment } from "../../functions/Doctor/Appointment.js";
import { toast, ToastContainer, useToastContainer } from "react-toastify";
import { FaEye } from "react-icons/fa";
import failureImg from "../../assets/images/Animation - 1727072299902.json";
import successImg from "../../assets/images/Animation - 1727074423053.json";
import logo from "../../assets/images/logo/grace_lab_logo.jpg";
import Lottie from "react-lottie";

// import { Toast } from "react-toastify/dist/components/Toast.js";

const PatientAppointment = () => {
  const [values, setValues] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [modalVideoCall, setModalVideoCall] = useState(false); // For video call modal
  const [currentPatient, setCurrentPatient] = useState({}); // Track current patient for the call

  const [query, setQuery] = useState("");

  // Fetch categories (existing functionality)
  useEffect(() => {
    fetchCategories();
  }, [pageNo, perPage, query]);

  const fetchCategories = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    const patientId = localStorage.getItem("AdminUser");

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/appointments/listbyPatient/${patientId}`,
        {
          skip: skip,
          per_page: perPage,
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
        setLoading(false);
      });
  };

  const handleViewDocument = (file) => {
    const documentUrl = `${process.env.REACT_APP_API_URL}/${file}`;
    window.open(documentUrl, "_blank");
  };

  const [payModal, setPayModal] = useState(false);
  const [amount, setAmount] = useState();
  const [isPay, setIsPay] = useState(false);

  const handleGetAmount = (id) => {
    // e.preventDefault();
    getAppointment(id)
      .then((res) => {
        setAmount(res?.amount || "");
      })
      .catch((err) => {
        // console.log(err);
        // toast.error("Something went wrong!")
      });
  };

  const [payModalPh, setPayModalPh] = useState(false);

  const handleGetAmountPh = (id) => {
    // e.preventDefault();
    getAppointment(id)
      .then((res) => {
        setAmount(res?.amount_pharmacy || "");
      })
      .catch((err) => {
        // console.log(err);
        // toast.error("Something went wrong!")
      });
  };
  const [showUploads, setShowUploads] = useState(false);
  const [testReportUpload, settestReportUpload] = useState("");
  const [xrayReportUpload, setxrayReportUpload] = useState("");
  const [prescriptionUpload, setprescriptionUpload] = useState("");
  const [rowId, setRowId] = useState("");
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState("");
  // New state variables for lab test modal
  const [labTestModal, setLabTestModal] = useState(false);
  const [currentLabTest, setCurrentLabTest] = useState("");
  const col = [
    // {
    //   name: "Patient Name",
    //   selector: (row) =>
    //     row.PatientDetails.length > 0 && row.PatientDetails
    //       ? row.PatientDetails[0].PatientName
    //       : "No patient name",
    //   sortable: true,
    // },
    {
      name: "Doctor Details",
      cell: (row) =>
        `${row?.DoctorDetails[0]?.DoctorName}  || ${row?.DoctorDetails[0]?.EmailPersonal} || ${row?.DoctorDetails[0]?.mobileNumber}`,
      sortable: true,
    },
    {
      name: "Request On",
      selector: (row) => moment(row?.createdAt).format("DD-MM-YYYY HH:mm"),
      sortable: true,
      sortField: "createdAt",
      minWidth: "150px",
    },
    {
      name: "Meeting Date & Time",
      cell: (row) =>
        `${moment(row?.appointmentDate).format("DD-MM-YYYY")} ${
          row?.appointmentTime
        }`,
      sortable: true,
    },
    {
      name: "Disease",
      cell: (row) => row?.DiseaseDetails[0]?.Symptom,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        const appointmentDate = new Date(row.appointmentDate); // Parse the date part
        const [time, meridian] = row.appointmentTime.split(" "); // Split time and AM/PM
        let [hours, minutes] = time.split(":").map(Number); // Split hours and minutes

        // Convert 12-hour format to 24-hour format
        if (meridian === "PM" && hours < 12) {
          hours += 12;
        } else if (meridian === "AM" && hours === 12) {
          hours = 0;
        }

        // Set the time on the appointmentDate
        appointmentDate.setHours(hours, minutes, 0, 0);

        const currentDateTime = new Date();
        const timeDifference = currentDateTime - appointmentDate;

        let amt = 0;

        if (row.isPaid) {
          amt = row.amount;
        }

        // Condition for "Completed"
        if (
          row.doctorStarted &&
          row.patientStarted &&
          timeDifference > 24 * 60 * 60 * 1000
        ) {
          return "Completed" + ` || Paid Amount:${amt || 0}`;
        }

        // Condition for "Unattended"
        else if (
          (!row.doctorStarted || !row.patientStarted) &&
          timeDifference > 24 * 60 * 60 * 1000
        ) {
          return row.doctorStarted
            ? "Unattended by Patient" + ` || Paid Amount:${amt}`
            : "Unattended by Doctor" + ` || Paid Amount:${amt}`;
        }

        // Other statuses based on doctorAction
        else if (row.doctorAction === "accept") {
          return "Confirmed" + ` || Paid Amount:${amt}`;
        } else if (row.doctorAction === "reject") {
          return "Rejected" + ` || Paid Amount:${amt}`;
        } else if (row.doctorAction === "reschedule") {
          return "Rescheduled" + ` || Paid Amount:${amt}`;
        }

        // Default status
        return "Confirmation pending" + ` || Paid Amount:${amt}`;
      },
      sortable: true,
    },

    {
      name: "Prescription",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            <button
              className="btn btn-sm view-item-btn m-1"
              style={{ backgroundColor: '#2196f3' }}
              onClick={() => {
                setCurrentPrescription(row?.prescription || "");
                setPrescriptionModal(true);
              }}
              disabled={!row?.prescription}
            >
              <i className="ri-clipboard-line text-white"></i>
            </button>
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Prescription Document",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            <button
              className="btn btn-sm btn-primary view-item-btn m-1"
              onClick={() => window.open(`${process.env.REACT_APP_API_URL}/${row?.prescriptionDoc}`, "_blank")}
              disabled={!row?.prescriptionDoc}
            >
              <i className="ri-file-text-line text-white"></i>
            </button>
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Lab Test",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            {/* Button for lab test document */}
            <button
              className="btn btn-sm btn-primary view-item-btn m-1"
              onClick={() => handleViewDocument(row?.labtestDoc)}
              disabled={!row?.labtestDoc}
            >
              <i className="bx bxs-report"></i>
            </button>
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Lab Test",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            {/* Button for lab test content */}
            <button
              className="btn btn-sm view-item-btn m-1"
              style={{ backgroundColor: '#2196f3' }}
              onClick={() => {
                setCurrentLabTest(row?.labTest || "");
                setLabTestModal(true);
              }}
              disabled={!row?.labTest}
            >
              <i className="ri-microscope-line text-white"></i>
            </button>
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Documents",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            <button
              // disabled={row.prescriptionUpload && row.xrayReportUpload && row.testReportUpload}
              className="btn btn-sm btn-warning view-item-btn m-1"
              onClick={() => {
                setShowUploads(true);
                setRowId(row._id);
                setprescriptionUpload(row.prescriptionUpload || "");
                setxrayReportUpload(row.xrayReportUpload || "");
                settestReportUpload(row.testReportUpload || "");
              }}
            >
              <i class="bx bxs-report"></i>
            </button>
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Payto Doctor",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            {!row?.isPaid ? (
              <button
                className="btn btn-sm btn-success view-item-btn m-1"
                disabled={!row.amount}
                onClick={(e) => {
                  e.preventDefault();
                  // set_Id(row._id);
                  setAppointmentId(row._id);
                  handleGetAmount(row._id);
                  setPayModal(true);
                }}
              >
                {/* <i className=" ri-edit-box-fill fs-5 mt-1 text-light"></i>   */}
                <FaIndianRupeeSign className="text-white"  />
              </button>
            ) : (
              <button className="btn btn-sm m-1 bg-info">
                <i className="ri-checkbox-circle-fill fs-4 mt-1 text-light"></i>
              </button>
            )}
            {/* <button
              className="btn btn-sm btn-primary view-item-btn m-1"
              onClick={() => handleViewDocument(row?.labReportDoc)}
              disabled={!row?.labReportDoc}
            >
              Report
            </button> */}
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      name: "Payto Pharmacy",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            {!row?.isPaid_pharmacy ? (
              <button
                className="btn btn-sm btn-success view-item-btn m-1"
                disabled={!row.amount_pharmacy}
                onClick={(e) => {
                  e.preventDefault();
                  // set_Id(row._id);
                  setAppointmentId(row._id);
                  handleGetAmountPh(row._id);
                  setPayModalPh(true);
                }}
              >
                <i className=" ri-edit-box-fill fs-5 mt-1 text-light"></i>
              </button>
            ) : (
              <button className="btn btn-sm m-1 bg-info">
                <i className="ri-checkbox-circle-fill fs-4 mt-1 text-light"></i>
              </button>
            )}
            {/* <button
              className="btn btn-sm btn-primary view-item-btn m-1"
              onClick={() => handleViewDocument(row?.labReportDoc)}
              disabled={!row?.labReportDoc}
            >
              Report
            </button> */}
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          <div className="view">
            <button
              // color="primary"
              className="btn btn-sm m-1 bg-primary"
              onClick={() => startMeeting(row)}
              disabled={!isMeetingEnabled(row) || !row.isPaid}
            >
              <i className="bx bx-video fs-4 m-1 text-light"></i>
            </button>

            {/* <button
              className="btn btn-sm btn-primary view-item-btn m-1"
              onClick={() => handleViewDocument(row?.labReportDoc)}
              disabled={!row?.labReportDoc}
            >
              Report
            </button> */}
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    // {
    //   name: "Edit",
    //   cell: (row) => (
    //     <Button color="secondary" onClick={() => handleTog_edit(row._id)}>
    //       Edit
    //     </Button>
    //   ),
    //   ignoreRowClick: true,
    //   allowOverflow: true,
    //   button: true,
    // },
  ];

  const handleUploadDocument = async (event, rowId, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", rowId);
      formData.append("fieldName", fieldName); // Specify the field to update

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/appointments/upload-document`,
          formData
        );
        console.log(response);

        if (response.isOk) {
          toast.success("Document uploaded Successfully");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error(error);
        console.error("Error uploading document:", error);
      }
    }
  };

  // Example usage
  const handleUploadPrescription = (event, rowId) =>
    handleUploadDocument(event, rowId, "prescriptionUpload");
  const handleUploadXRay = (event, rowId) =>
    handleUploadDocument(event, rowId, "xrayReportUpload");
  const handleUploadTestReport = (event, rowId) =>
    handleUploadDocument(event, rowId, "testReportUpload");

  const isMeetingEnabled = (row) => {
    const appointmentDate = moment(row.appointmentDate); // Convert appointment date to moment object
    const appointmentTime = moment(row.appointmentTime, "hh:mm A"); // Convert appointment time to moment object

    // Combine date and time into one moment object for the start of the meeting
    const appointmentDateTime = appointmentDate.set({
      hour: appointmentTime.hour(),
      minute: appointmentTime.minute(),
      second: 0,
      millisecond: 0,
    });

    // The end time for the meeting button (24 hours after appointment time)
    const expirationTime = appointmentDateTime.clone().add(1, "days");

    // Get the current time
    const now = moment();

    // Enable the button only if the current time is between the appointment start time and expiration time
    return now.isBetween(appointmentDateTime, expirationTime);
  };

  const [appointmentId, setAppointmentId] = useState("");
  const startMeeting = (patient) => {
    setAppointmentId(patient._id);
    setCurrentPatient(patient);
    setModalVideoCall(true); // Open the video call modal
  };

  const [order_id, setOrder_id] = useState("");
  const [sucessReceipt, setSuccessReceipt] = useState(false);
  const [failurReceipt, setFailurReceipt] = useState(false);
  const [receiptModal, setReceiptModal] = useState(true);
  const [receiptDetails, setReceiptDetails] = useState({});

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData:
      (failurReceipt && failureImg) || (sucessReceipt && successImg),
    renderer: "svg",
  };

  useEffect(() => {
    console.log(order_id);
    if (order_id) {
      fetchOrderByOrderId();
    }
  }, [order_id]);

  const handleRetriveTransaction = async (orderId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/appointment/retrive-transaction`,
        { orderId: orderId }
      );
      if (res.decoded) {
        if (res.decoded.auth_status == "0300") {
          setSuccessReceipt(true);
          setReceiptModal(true);
        }
      } else {
        window.alert("something went wrong!");
      }
      console.log("retrive trans", res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderByOrderId = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/get/Appointment-by-orderid/${order_id}`
      );
      console.log("gte app by order id", res);
      if (res.isOk) {
        setReceiptDetails(res.find);
        if (res.find.auth_status === "transaction is successful") {
          setSuccessReceipt(true);
          setReceiptModal(true);
        }
        if (res.find.auth_status === "transaction failed") {
          setFailurReceipt(true);
          setReceiptModal(true);
        } else {
          handleRetriveTransaction(res.find.orderId);
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
        `${process.env.REACT_APP_API_URL}/api/auth/appointment/patient-pay/${appointmentId}`
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

  const [orderph_id, setOrderph_id] = useState("");

  useEffect(() => {
    console.log("fetching pg orderid", orderph_id);
    if (orderph_id) {
      fetchOrderByOrderIdph();
    }
  }, [orderph_id]);

  const handleRetriveTransactionph = async (orderId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/appointment/pharmacy/retrive-transaction`,
        { orderId: orderId }
      );
      console.log("ph retr trans", res);
      if (res.decoded) {
        console.log("11>", res.decoded.auth_status);
        if (res.decoded.auth_status == "0300") {
          console.log("inside>", res.decoded.auth_status);
          fetchCategories();
          setPayModalPh(false);
          setSuccessReceipt(true);
          setReceiptModal(true);
        }
      } else {
        window.alert("something went wrong!");
      }
      console.log("retrive trans", res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrderByOrderIdph = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/get/pharmacy/Appointment-by-orderid/${orderph_id}`
      );
      console.log("ph gte app by order id", res);
      if (res.isOk) {
        setReceiptDetails(res.find);
        if (res.find.auth_status_pharmacy === "transaction is successful") {
          setSuccessReceipt(true);
          setReceiptModal(true);
        }
        if (res.find.auth_status_pharmacy === "transaction failed") {
          setFailurReceipt(true);
          setReceiptModal(true);
        } else {
          handleRetriveTransactionph(res.find.orderId_pharmacy);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSDKLaunchPh = (response) => {
    var responseHandler = function (txn) {
      console.log("ph sdk ", txn);
      console.log("ph sdk orderid", txn.txnResponse.orderid);
      setOrderph_id(txn.txnResponse.orderid);
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

  const handlePayPh = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/appointment/pharmacy/patient-pay/${appointmentId}`
      );
      console.log("ph pay", res);
      if (res.isOk) {
        handleSDKLaunchPh(res);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  document.title = "Appointments | Patient | Grace Labs";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            maintitle="Appointments"
            title="Appointments"
            pageTitle="Appointments"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" sm={6} lg={4} md={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Appointments
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
                        data={categories}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangePage={setPageNo}
                        onChangeRowsPerPage={setPerPage}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Modal for Video Call */}
        <Modal
          isOpen={modalVideoCall}
          toggle={() => setModalVideoCall(!modalVideoCall)}
          size="lg"
          centered
        >
          {/* Remove the toggle prop from ModalHeader */}
          <ModalHeader>
            Video Call with {currentPatient?.PatientDetails?.[0]?.PatientName}
          </ModalHeader>

          <ModalBody>
            <VideoCall
              appointmentId={appointmentId}
              roomName={currentPatient._id ? currentPatient._id : "defaultRoom"}
              doctorName={"Patient Name"}
              patientName={currentPatient?.PatientDetails?.[0]?.PatientName}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalVideoCall(false)}>
              End Call
            </Button>
          </ModalFooter>
        </Modal>

        {/* Document Upload Modal */}
        <Modal
          isOpen={showUploads}
          toggle={() => setShowUploads(!showUploads)}
          // size="lg"
          centered
        >
          <ModalHeader toggle={() => setShowUploads(!showUploads)}>
            Documents Uploaded
          </ModalHeader>
          <ModalBody className="">
            <div className="d-grid gap-3">
              {prescriptionUpload ? (
                <button
                  onClick={() =>
                    window.open(
                      `${process.env.REACT_APP_API_URL}/${prescriptionUpload}`,
                      "_blank"
                    )
                  }
                  className="bg-transparent border-0 m-0 p-0"
                  style={{
                    width: "max-content",
                    fontWeight: "500",
                    color: "#262a2e",
                  }}
                >
                  1)Click to View Prescription Document
                  <FaEye />
                </button>
              ) : (
                <div>
                  <Label>1) Upload Prescription</Label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    onChange={(event) => handleUploadPrescription(event, rowId)}
                  />
                </div>
              )}
              {xrayReportUpload ? (
                <button
                  onClick={() =>
                    window.open(
                      `${process.env.REACT_APP_API_URL}/${xrayReportUpload}`,
                      "_blank"
                    )
                  }
                  className="bg-transparent border-0 m-0 p-0"
                  style={{
                    width: "max-content",
                    fontWeight: "500",
                    color: "#262a2e",
                  }}
                >
                  2) Click to View X-Ray Document <FaEye />
                </button>
              ) : (
                <div>
                  <Label>2) Upload Report</Label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    onChange={(event) => handleUploadXRay(event, rowId)}
                  />
                </div>
              )}
              {testReportUpload ? (
                <button
                  onClick={() =>
                    window.open(
                      `${process.env.REACT_APP_API_URL}/${testReportUpload}`,
                      "_blank"
                    )
                  }
                  className="bg-transparent border-0 m-0 p-0"
                  style={{
                    width: "max-content",
                    fontWeight: "500",
                    color: "#262a2e",
                  }}
                >
                  3) Click to View Test Report Document <FaEye />
                </button>
              ) : (
                <div>
                  <Label>3) Upload Other Document</Label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    onChange={(event) => handleUploadTestReport(event, rowId)}
                  />
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => setShowUploads(false)}
              >
                Cancel
              </button>
            </div>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={payModal}
          toggle={() => setPayModal(!payModal)}
          // size="lg"
          centered
        >
          <ModalHeader toggle={() => setPayModal(!payModal)}>
            Payment
          </ModalHeader>
          <ModalBody className="text-center">
            <h4> Payable Amount: {amount} </h4>
            {isPay && (
              <h2>
                <i className="ri-checkbox-circle-fill fs-3 mt-1 text-success"></i>{" "}
              </h2>
            )}
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              {!isPay && (
                <button
                  type="submit"
                  className="btn btn-success"
                  id="add-btn"
                  disabled={!amount || amount < 0}
                  onClick={handlePay}
                >
                  Pay
                </button>
              )}

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

        {/* pharmacy pay */}
        <Modal
          isOpen={payModalPh}
          toggle={() => setPayModalPh(!payModalPh)}
          // size="lg"
          centered
        >
          <ModalHeader toggle={() => setPayModalPh(!payModalPh)}>
            Payment
          </ModalHeader>
          <ModalBody className="text-center">
            <h4> Payable Amount: {amount} </h4>
            {isPay && (
              <h2>
                <i className="ri-checkbox-circle-fill fs-3 mt-1 text-success"></i>{" "}
              </h2>
            )}
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              {!isPay && (
                <button
                  type="submit"
                  className="btn btn-success"
                  id="add-btn"
                  disabled={!amount || amount < 0}
                  onClick={handlePayPh}
                >
                  Pay
                </button>
              )}

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

        <Modal
          size="md"
          show={receiptModal}
          onHide={() => {
            setReceiptModal(false);
            setSuccessReceipt(false);
            setFailurReceipt(false);
          }}
        >
          <Modal.Header>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "57px", height: "auto" }} // Adjust size as needed
            />
          </Modal.Header>
          <Modal.Body>
            <h6 className="text-center">
              {failurReceipt && "Your transaction has been failed"}
              {sucessReceipt &&
                "Your transaction has been successfully processed"}{" "}
            </h6>
            <div
              style={{
                marginRight: "auto",
                marginLeft: "auto",
                width: "250px",
              }}
            >
              <Lottie options={defaultOptions} />
            </div>
            {receiptDetails.invoiceGenrationDate && (
              <div style={{ textTransform: "capitalize" }}>
                {/* <p><strong>Status Description :</strong>{receiptDetails && receiptDetails.auth_status}</p> */}
                <p>
                  <strong>Payment Mode:</strong>Online
                </p>
                {/* <p><strong>Purpose of Payment:</strong>Product Purchase Payment</p> */}
                <p>
                  <strong>Amount:</strong>
                  {receiptDetails && receiptDetails.totalAmount}
                </p>
                {/* {failurReceipt &&  <p><strong>Error Description : </strong>{receiptDetails && receiptDetails.transaction_error_desc}</p>} */}

                <p>
                  <strong>Date:</strong>{" "}
                  {receiptDetails &&
                    new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(new Date(receiptDetails.invoiceGenrationDate))}
                </p>
                {/* <p><strong>Transaction Id :</strong>{receiptDetails && receiptDetails.transactionid}</p> */}
                <p>
                  <strong>Order Id :</strong>
                  {receiptDetails && receiptDetails.orderId}
                </p>
              </div>
            )}

            <div className="w-100 d-flex justify-content-center">
              <button
                className="btn btn-md btn-success m-2"
                style={{ marginRight: "auto", marginLeft: "auto" }}
                onClick={() => {
                  setReceiptModal(false);
                  setPayModal(false);
                }}
              >
                OK
              </button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Lab Test Modal - Add this before the end of the component */}
        <Modal
          isOpen={labTestModal}
          toggle={() => setLabTestModal(!labTestModal)}
          centered
        >
          <ModalHeader toggle={() => setLabTestModal(!labTestModal)}>
            Lab Test Details
          </ModalHeader>
          <ModalBody>
            <div className="lab-test-content">
              {currentLabTest ? (
                <p>{currentLabTest}</p>
              ) : (
                <p>No lab test details available</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setLabTestModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        {/* Prescription Modal */}
        <Modal
          isOpen={prescriptionModal}
          toggle={() => setPrescriptionModal(!prescriptionModal)}
          centered
        >
          <ModalHeader toggle={() => setPrescriptionModal(!prescriptionModal)}>
            Prescription Details
          </ModalHeader>
          <ModalBody>
            <div className="prescription-content">
              {currentPrescription ? (
                <p>{currentPrescription}</p>
              ) : (
                <p>No prescription available</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setPrescriptionModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default PatientAppointment;

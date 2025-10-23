import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
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

// import {
//   createCategory,
//   getCategory,
//   removeCategory,
//   updateCategory,
// } from "../../functions/Category/CategoryMaster";

const initialState = {
  categoryName: "",
  IsActive: false,
};

const ContactPharmacy = () => {
  const [values, setValues] = useState(initialState);
  const { categoryName, IsActive } = values;
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);

  const [errCN, setErrCN] = useState(false);

  const [query, setQuery] = useState("");

  const [_id, set_Id] = useState("");
  const [remove_id, setRemove_id] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    //console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      //console.log("no errors");
    }
  }, [formErrors, isSubmit]);

  const [modal_list, setmodal_list] = useState(false);
  const tog_list = () => {
    setmodal_list(!modal_list);
    setValues(initialState);
    setIsSubmit(false);
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
    fetchCategories();
  }, [pageNo, perPage, column, sortDirection, query, filter]);

  const fetchCategories = async () => {
    setLoading(true);
    let skip = (pageNo - 1) * perPage;
    if (skip < 0) {
      skip = 0;
    }

    const patientId = localStorage.getItem("AdminUser");

    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/list/listContactpharmacyByPatientId/${patientId}`,
        {
          skip: skip,
          per_page: perPage,
          sorton: column,
          sortdir: sortDirection,
          match: query,
          isActive: filter,
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
  const handleViewDocument = (file) => {
    const documentUrl = `${process.env.REACT_APP_API_URL}/${file}`;
    window.open(documentUrl, "_blank");
  };

  const [appointmentId, setAppointmentId] = useState("");
  const [payModal, setPayModal] = useState(false);
  const [amount, setAmount] = useState();

  // const handleGetAmount = (id) => {
  //   // e.preventDefault();
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/auth/AllContactpharmacy/${id}`)
  //     .then((res) => {
  //       setAmount(res?.data?.amount || "");
  //     })
  //     .catch((err) => {
  //       // console.log(err);
  //       // toast.error("Something went wrong!")
  //     });
  // };

  const col = [
    {
      name: " Patient Name",
      cell: (row) => row.name,
      sortable: true,
      sortField: "PatientName",
      minWidth: "150px",
    },
    {
      name: "Description",
      cell: (row) => row.Description,
      sortable: true,
      sortField: "address",
      minWidth: "150px",
    },
    {
      name: "Mobile No.",
      cell: (row) => row.contactNumber,
      sortable: true,
      sortField: "mobileNumber",
      minWidth: "150px",
    },
    {
      name: "Email",
      cell: (row) => row.email,
      sortable: true,
      sortField: "Email",
      minWidth: "150px",
    },
    {
      name: "Pharmacy",
      cell: (row) => row?.pharmacyDetail?.PharmacyName,
      sortable: true,
      sortField: "pharmacyDetail?.PharmacyName",
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
      name: "Uploaded Document",
      selector: (row) => row.file,
      sortable: true,
      sortField: "Email",
      minWidth: "150px",
      cell: (row) => (
        <button
          onClick={() => handleViewDocument(row.file)}
          className="btn btn-primary"
        >
          View
        </button>
      ),
    },
    {
      name: "Payto Pharmacy",
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
    console.log(order_id);
    if (order_id) {
      fetchOrderByOrderId();
    }
  }, [order_id]);

  const handleRetriveTransaction = async (orderId) => {
    try {
      setIsLoad(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/contact-pharmacy/retrive-transaction`,
        { orderId: orderId }
      );
      if (res.decoded) {
        if (res.decoded.auth_status == "0300") {
          setSuccessReceipt(true);
          setReceiptModal(true);

          console.log("retrive trans", res);

          const resp = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/contact-pharmacy/payment/point-transaction/${appointmentId}`
          );

          console.log("point transaction >>>", resp);

          if (resp.isOk) {
            setIsLoad(false);
            setPayModal(false);
            fetchCategories();
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
        `${process.env.REACT_APP_API_URL}/api/contact-pharmacy-by-orderid/${order_id}`
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
        `${process.env.REACT_APP_API_URL}/api/auth/contact-pharmacy/patient-pay/${appointmentId}`
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

  document.title = "Pharmacy Order Summery | Gracelab";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer />
          <BreadCrumb
            maintitle="Master"
            title="Pharmacy Order Summery"
            pageTitle="Master"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row className="g-4 mb-1">
                    <Col className="col-sm" sm={6} lg={4} md={6}>
                      <h2 className="card-title mb-0 fs-4 mt-2">
                        Pharmacy Order Summery
                      </h2>
                    </Col>

                    {/* <Col sm={6} lg={4} md={6}>
                      <div className="text-end mt-2">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          name="filter"
                          value={filter}
                          defaultChecked={true}
                          onChange={handleFilter}
                        />
                        <Label className="form-check-label ms-2">Active</Label>
                      </div>
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
                    </Col> */}
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

      {/* Add Modal */}
      {/* <Modal
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
          Add Category
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassCategoryName}
                placeholder="Enter Category Name"
                required
                name="categoryName"
                value={categoryName}
                onChange={handleChange}
              />
              <Label>Category Name <span className="text-danger">*</span></Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
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
      </Modal> */}

      {/* Edit Modal */}
      {/* <Modal
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
          Edit Category
        </ModalHeader>
        <form>
          <ModalBody>
            <div className="form-floating mb-3">
              <Input
                type="text"
                className={validClassCategoryName}
                placeholder="Enter Category Name"
                required
                name="categoryName"
                value={categoryName}
                onChange={handleChange}
              />
              <Label>Category Name <span className="text-danger">*</span></Label>
              {isSubmit && (
                <p className="text-danger">{formErrors.categoryName}</p>
              )}
            </div>

            <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
                checked={IsActive}
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
      </Modal> */}

      {/* Remove Modal */}
      {/* <Modal
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
          Remove Category
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
      </Modal> */}
    </React.Fragment>
  );
};

export default ContactPharmacy;

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
import { Flex } from "antd";

// import {
//   createLabReport,
//   getLabReport,
//   listLab,
//   removeLabReport,
//   updateLabReport,
//   listPatients,
//   listActiveLabTests,
//   listDoctors,
// } from "../../functions/LabMaster/LabReport";

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bannerImage: "",
    IsActive: false,
};

const Transactions = () => {
    const [values, setValues] = useState(initialState);
    const { firstName, lastName, email, password, bannerImage, IsActive } =
        values;
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);
    const [query, setQuery] = useState("");
    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");
    const [Adminuser, setAdminuser] = useState([]);
    const [photoAdd, setPhotoAdd] = useState();
    const [checkImagePhoto, setCheckImagePhoto] = useState(false);
    const [blogs, setBlogs] = useState([]);

    const [Report, setReport] = useState("");

    const [Patient, setPatient] = useState("");
    const [pharmacydata, setpharmacydata] = useState("");
    const [Patientdata, setPatientdata] = useState("");
    const [doctordata, setdoctordata] = useState("");
    const [LabTestdata, setLabTestdata] = useState("");
    const [selectedDcotor1, setselectedDcotor1] = useState(""); //new field
    const [LabTest, setLabTest] = useState("");
    const [Date, setDate] = useState("");
    const [Doctor1, setDoctor1] = useState("");

    //   useEffect(() => {
    //     listPatients().then((response) => {
    //       console.log("setPatientdata", response);
    //       setPatientdata(response);
    //       setpharmacydata(response);
    //     });
    //   }, []);

    //   useEffect(() => {
    //     listActiveLabTests().then((response) => {
    //       console.log("setLabTestdata", response);
    //       setLabTestdata(response);
    //     });
    //   }, []);
    //   useEffect(() => {
    //     listDoctors().then((response) => {
    //       console.log("setdoctordata", response);
    //       setdoctordata(response);
    //     });
    //   }, []);

    const downloadFile = async (filePath) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error("Network response was not ok.");

            const blob = await response.blob();
            const contentDisposition = response.headers.get("Content-Disposition");
            let filename = "download"; // Generic filename base

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/); // Regex to extract filename
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            } else {
                // Use MIME type to determine a default extension if filename is not specified
                switch (blob.type) {
                    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        filename += ".xlsx"; // Default for modern Excel files
                        break;
                    case "application/vnd.ms-excel":
                        filename += ".xls"; // Default for older Excel files
                        break;
                    case "application/msword":
                        filename += ".doc"; // Default for DOC files
                        break;
                    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        filename += ".docx"; // Default for modern Word files
                        break;
                    case "image/png":
                        filename += ".png"; // Default for PNG files
                        break;
                    case "image/jpeg":
                        filename += ".jpg"; // Default for JPEG files
                        break;
                    default:
                        filename += ".bin"; // Fallback binary extension
                        break;
                }
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(downloadUrl);
            link.remove();
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

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
    //   const handleTog_edit = (_id) => {
    //     setmodal_edit(!modal_edit);
    //     setIsSubmit(false);
    //     set_Id(_id);
    //     getLabReport(_id)
    //       .then((res) => {
    //         let dateValue = new window.Date(res.Date); // Use window.Date to access the built-in Date object
    //         let formattedDate = dateValue.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD format
    //         setValues({
    //           ...values,
    //           Patient: res.PatientName,
    //           reportDate: formattedDate,
    //           ReferredBy: res.ReferredBy,
    //           Report: res.Report,
    //           ReportType: res.ReportType,

    //           IsActive: res.isActive,
    //         });
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCheck = (e) => {
        setValues({ ...values, IsActive: e.target.checked });
    };

    //   const handleClick = (e) => {
    //     e.preventDefault();
    //     setFormErrors({});
    //     let erros = validate(values);
    //     setFormErrors(erros);
    //     setIsSubmit(true);

    //     if (Object.keys(erros).length === 0) {
    //       const formdata = new FormData();

    //       formdata.append("myFile", Report);
    //       formdata.append("PatientName", Patient);
    //       formdata.append("Date", Date);
    //       formdata.append("ReportType", LabTest);
    //       formdata.append("IsActive", values.IsActive);
    //       formdata.append("ReferredBy", selectedDcotor1);
    //       createLabReport(formdata)
    //         .then((res) => {
    //           setmodal_list(!modal_list);
    //           setValues(initialState);
    //           setCheckImagePhoto(false);
    //           setIsSubmit(false);
    //           setFormErrors({});
    //           setPhotoAdd("");

    //           fetchUsers();
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     }
    //   };

    //   const handleDelete = (e) => {
    //     e.preventDefault();
    //     removeLabReport(remove_id)
    //       .then((res) => {
    //         setmodal_delete(!modal_delete);
    //         fetchUsers();
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   };

    //   const handleUpdate = (e) => {
    //     e.preventDefault();
    //     let erros = validate(values);
    //     setFormErrors(erros);
    //     setIsSubmit(true);

    //     if (Object.keys(erros).length === 0) {
    //       const formdata = new FormData();

    //       formdata.append("myFile", values.Report);

    //       formdata.append("IsActive", values.IsActive);

    //       formdata.append("Patient", values.Patient);
    //       formdata.append("LabTest", values.ReportType);
    //       formdata.append("selectedDcotor1", values.ReferredBy);
    //       formdata.append("Date", values.reportDate);

    //       updateLabReport(_id, formdata)
    //         .then((res) => {
    //           setmodal_edit(!modal_edit);
    //           fetchUsers();
    //           setPhotoAdd("");

    //           setCheckImagePhoto(false);
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     }
    //   };
    const PhotoUpload = (e) => {
        if (e.target.files.length > 0) {
            const image = new Image();

            let imageurl = URL.createObjectURL(e.target.files[0]);
            console.log("img", e.target.files[0]);

            setPhotoAdd(imageurl);
            // setValues({ ...values, blogImage: e.target.files[0] });
            setReport(e.target.files[0]);
            setCheckImagePhoto(true);
        }
    };
    const [errFN, setErrFN] = useState(false);
    const [errLN, setErrLN] = useState(false);
    const [errEM, setErrEM] = useState(false);
    const [errPA, setErrPA] = useState(false);
    const [errBI, setErrBI] = useState(false);
    const validate = (values) => {
        const errors = {};

        // if (values.firstName === "") {
        //   errors.firstName = "First Name is required!";
        //   setErrFN(true);
        // }
        // if (values.firstName !== "") {
        //   setErrFN(false);
        // }

        // if (values.lastName === "") {
        //   errors.lastName = "Last Name is required!";
        //   setErrLN(true);
        // }
        // if (values.lastName !== "") {
        //   setErrLN(false);
        // }

        // if (values.email === "") {
        //   errors.email = "email is required!";
        //   setErrEM(true);
        // }
        // if (values.email !== "") {
        //   setErrEM(false);
        // }

        // if (values.password === "") {
        //   errors.password = "password is required!";
        //   setErrPA(true);
        // }
        // if (values.password !== "") {
        //   setErrPA(false);
        // }

        return errors;
    };

    const validClassFN =
        errFN && isSubmit ? "form-control is-invalid" : "form-control";

    const validClassLN =
        errLN && isSubmit ? "form-control is-invalid" : "form-control";

    const validClassEM =
        errEM && isSubmit ? "form-control is-invalid" : "form-control";

    const validClassPA =
        errPA && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassBI =
        errBI && isSubmit ? "form-control is-invalid" : "form-control";
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
    const renderImage = (uploadimage) => {
        const imageUrl = `${process.env.REACT_APP_API_URL}/${uploadimage}`;

        return (
            <img
                src={imageUrl}
                alt="Image"
                style={{ width: "75px", height: "75px", padding: "5px" }}
            />
        );
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
        const patient = localStorage.getItem("AdminUser")
        await axios
            .post(
                `${process.env.REACT_APP_API_URL}/api/auth/referrals/getPatientTransactions/${patient}`,
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
                    console.log("res12345", res.data);
                    setLoading(false);
                    setBlogs(res.data);
                    setTotalRows(res.count);
                } else if (response.length === 0) {
                    setBlogs([]);
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
        // {
        //     name: "Referred By ",
        //     cell: (row) => row.ReferredByPatient || row?.ReferredByPharmacy || row.RefferedByDoctor || row.ReferredByLaboratory || row.ReferredByHospital || "NA",

        //     sortable: true,
        //     sortField: "LabName",
        //     minWidth: "100px",
        //     maxWidth: "200px",
        // },
        {
            name: "Category",
            cell: (row) => row.ReferredByPharmacy ? "Pharmacy" : row.ReferredByPatient ? "Patient" : row.RefferedByDoctor ? "Doctor" : row.ReferredByLaboratory ? "Lab" : row.ReferredByHospital ? "Hospital" : "Affiliate",
            sortable: false,
            // sortField: "EmailPersonal",
            // minWidth: "150px",
            // maxWidth: "200px",
        },
        // {
        //     name: "Referral Code",
        //     cell: (row) => row?.ReferralCode || "-",
        //     sortable: true,
        //     sortField: "ReferralCode",
        //     // minWidth: "150px",
        //     // maxWidth: "200px",
        // },
        {
            name: "Sub Category",
            cell: (row) => row.ReferredByPharmacy || row.ReferredByPatient || row.RefferedByDoctor || row.ReferredByLaboratory || row.ReferredByHospital || row.ReferredByAffiliate || "NA",
            sortable: false,
            // sortField: "EmailPersonal",
            // minWidth: "150px",
            // maxWidth: "200px",
        },
        {
            name: "Transaction Type",
            cell: (row) => row.transactionType || "NA",
            sortable: true,
            sortField: "transactionType",
            // minWidth: "150px",
            // maxWidth: "200px",
        },
        {
            name: "Loyalty Points",
            cell: (row) => row.loyaltyPoints || "NA",
            sortable: true,
            sortField: "loyaltyPoints",
            // minWidth: "150px",
            // maxWidth: "200px",
        },
        {
            name: "Date",
            selector: (row) => {
                const createdAt = row?.createdAt;
                if (!createdAt) return "";
        
                const parts = createdAt.split(/[-T:.Z]/);
                let year = parseInt(parts[0], 10);
                let month = parseInt(parts[1], 10);
                let day = parseInt(parts[2], 10);
                let hours = parseInt(parts[3], 10);
                let minutes = parseInt(parts[4], 10);
                let seconds = parseInt(parts[5], 10);
        
                minutes += 30;
                hours += 5;
        
                if (minutes >= 60) {
                    minutes -= 60;
                    hours += 1;
                }
                if (hours >= 24) {
                    hours -= 24;
                    day += 1;
        
                    const daysInMonth = [31, (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (day > daysInMonth[month - 1]) {
                        day = 1;
                        month += 1;
                        if (month > 12) {
                            month = 1;
                            year += 1;
                        }
                    }
                }
        
                const formattedDate = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                
                return formattedDate;
            },
            sortable: true,
            sortField: "createdAt", // Use "createdAt" as sortField if you want to sort by this column
            // minWidth: "150px",
            // maxWidth: "220px",
        },
        // {
        //     name: "Report",
        //     cell: (row) => (
        //         <div style={{ display: "flex" }}>
        //             <button
        //                 className="btn btn-sm btn-secondary"
        //                 onClick={() =>
        //                     window.open(
        //                         `${process.env.REACT_APP_API_URL}/${row.Report}`,
        //                         "_blank"
        //                     )
        //                 }
        //                 style={{
        //                     marginRight: "8px",
        //                     width: "70px",
        //                     height: "35px",
        //                     marginTop: "6px",
        //                 }}
        //             >
        //                 View
        //             </button>
        //             <button
        //                 className="btn btn-sm btn-primary"
        //                 onClick={() =>
        //                     downloadFile(`${process.env.REACT_APP_API_URL}/${row.Report}`)
        //                 }
        //                 style={{
        //                     marginRight: "8px",
        //                     width: "110px",
        //                     height: "35px",
        //                     marginTop: "6px",
        //                 }}
        //             >
        //                 ⬇ Download
        //             </button>
        //         </div>
        //     ),
        //     maxWidth: "280px",

        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // },

        // {
        //   name: "Action",
        //   selector: (row) => {
        //     return (
        //       <React.Fragment>
        //         <div className="d-flex gap-2">
        //           <div className="edit">
        //             <button
        //               className="btn btn-sm btn-success edit-item-btn "
        //               data-bs-toggle="modal"
        //               data-bs-target="#showModal"
        //               onClick={() => handleTog_edit(row._id)}
        //             >
        //               Edit
        //             </button>
        //           </div>

        //           <div className="remove">
        //             <button
        //               className="btn btn-sm btn-danger remove-item-btn"
        //               data-bs-toggle="modal"
        //               data-bs-target="#deleteRecordModal"
        //               onClick={() => tog_delete(row._id)}
        //             >
        //               Remove
        //             </button>
        //           </div>
        //         </div>
        //       </React.Fragment>
        //     );
        //   },
        //   sortable: false,
        //   minWidth: "180px",
        // },
    ];

    document.title = "Loyalty Point Transaction | Grace Labs";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb maintitle="Wallet" title="Loyalty Point Transaction" pageTitle="Wallet" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row className="g-4 mb-1">
                                        <Col className="col-sm" sm={6} lg={4} md={6}>
                                            <h2 className="card-title mb-0 fs-4 mt-2">Loyalty Point Transaction</h2>
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
                                                    {/* <Button
                            color="success"
                            className="add-btn me-1"
                            onClick={() => tog_list()}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            Add
                          </Button> */}
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
                                                data={blogs}
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
                    Add Report
                </ModalHeader>
                <form>
                    <ModalBody>
                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <select
                                    key={"Patient_" + _id}
                                    type="text"
                                    className={`form-select ${validClassBI} wide-dropdown`} // Use the same class as the city dropdown and add the wide-dropdown class
                                    placeholder="Select Patient"
                                    required
                                    name="Patient"
                                    value={Patient}
                                    onChange={(e) => {
                                        setPatient(e.target.value);
                                    }}
                                >
                                    <option value="">Select Patient</option>
                                    {Patientdata &&
                                        Patientdata.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.PatientName}
                                            </option>
                                        ))}
                                </select>
                                <Label>
                                    Patient <span className="text-danger">*</span>
                                </Label>
                                {isSubmit && (
                                    <p className="text-danger">{formErrors.Patient}</p>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <select
                                    key={"LabTest_" + _id}
                                    type="text"
                                    className={`form-select ${validClassPA} wide-dropdown`} // Add the wide-dropdown class
                                    placeholder="Select Lab Test"
                                    required
                                    name="LabTest"
                                    value={LabTest}
                                    onChange={(e) => {
                                        setLabTest(e.target.value);
                                    }}
                                >
                                    <option value="">Select Lab Test</option>
                                    {LabTestdata &&
                                        LabTestdata.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.TestName}
                                            </option>
                                        ))}
                                </select>
                                <Label>
                                    Lab Test <span className="text-danger">*</span>
                                </Label>
                                {isSubmit && (
                                    <p className="text-danger">{/* {formErrors.LabTest} */}</p>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <select
                                    className={`form-select ${validClassEM} wide-dropdown`} // Add the wide-dropdown class
                                    placeholder="Select Doctor"
                                    name="selectedDcotor1"
                                    value={selectedDcotor1}
                                    onChange={(e) => {
                                        setselectedDcotor1(e.target.value);
                                    }}
                                >
                                    <option value="">Select Doctor</option>
                                    {doctordata &&
                                        doctordata.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.DoctorName}
                                            </option>
                                        ))}
                                </select>
                                <Label className="form-label">Doctor Name</Label>
                                {isSubmit && (
                                    <p className="text-danger">{/* {formErrors.BrandName} */}</p>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <Input
                                    key={"DoctorRegistrationDate_" + _id}
                                    type="date"
                                    className={`form-control ${validClassLN}`} // Use the same class as before
                                    placeholder="Enter blog title"
                                    required
                                    name="Date"
                                    value={Date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                    }}
                                />
                                <Label>
                                    Date <span className="text-danger">*</span>
                                </Label>
                                {isSubmit && (
                                    <p className="text-danger">
                                        {/* {formErrors.LabRegistrationDate} */}
                                    </p>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <label>
                                Upload Report <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                name="bannerImage"
                                className={`form-control ${validClassBI}`} // Use the same class as before
                                onChange={PhotoUpload}
                            />
                            {isSubmit && (
                                <p className="text-danger">{formErrors.bannerImage}</p>
                            )}
                            {checkImagePhoto ? (
                                <img
                                    className="m-2"
                                    src={photoAdd}
                                    alt="Profile"
                                    width="300"
                                    height="200"
                                />
                            ) : null}
                        </Col>
                        <br />
                        {/* <div className="form-check mb-2">
              <Input
                type="checkbox"
                className="form-check-input"
                name="IsActive"
                value={IsActive}
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
                            // onClick={handleClick}
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
                                    setCheckImagePhoto(false);
                                    setPhotoAdd("");
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
                    //   handleTog_edit();
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
                    Edit Lab Reports
                </ModalHeader>
                <form>
                    <ModalBody>
                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <select
                                    key={"Patient_" + _id}
                                    className={`form-select ${validClassBI} wide-dropdown`} // Use the same class as the city dropdown and add the wide-dropdown class
                                    placeholder="Select Patient"
                                    required
                                    name="Patient"
                                    value={values.Patient}
                                    onChange={(e) =>
                                        setValues({ ...values, Patient: e.target.value })
                                    }
                                >
                                    <option value="">Select Patient</option>
                                    {Patientdata &&
                                        Patientdata.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.PatientName}
                                            </option>
                                        ))}
                                </select>
                                <Label>
                                    Patient <span className="text-danger">*</span>
                                </Label>
                                {isSubmit && (
                                    <p className="text-danger">{formErrors.Patient}</p>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <select
                                    key={"LabTest_" + _id}
                                    className={`form-select ${validClassPA} wide-dropdown`} // Add the wide-dropdown class
                                    placeholder="Select Lab Test"
                                    required
                                    name="LabTest"
                                    value={values.ReportType}
                                    onChange={(e) =>
                                        setValues({ ...values, ReportType: e.target.value })
                                    }
                                >
                                    <option value="">Select Lab Test</option>
                                    {LabTestdata &&
                                        LabTestdata.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.TestName}
                                            </option>
                                        ))}
                                </select>
                                <Label>
                                    Lab Test <span className="text-danger">*</span>
                                </Label>
                                {isSubmit && (
                                    <p className="text-danger">{/* {formErrors.LabTest} */}</p>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <select
                                    className={`form-select ${validClassEM} wide-dropdown`} // Add the wide-dropdown class
                                    placeholder="Select Doctor"
                                    name="selectedDcotor1"
                                    value={values.ReferredBy}
                                    onChange={(e) =>
                                        setValues({ ...values, ReferredBy: e.target.value })
                                    }
                                >
                                    <option value="">Select Doctor</option>
                                    {doctordata &&
                                        doctordata.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.DoctorName}
                                            </option>
                                        ))}
                                </select>
                                <Label className="form-label">Doctor Name</Label>
                                {isSubmit && (
                                    <p className="text-danger">{/* {formErrors.BrandName} */}</p>
                                )}
                            </div>
                        </Col>

                        <Col lg={9}>
                            <div className="form-floating mb-3">
                                <Input
                                    key={"DoctorRegistrationDate_" + _id}
                                    type="date"
                                    className={`form-control ${validClassLN}`} // Use the same class as before
                                    placeholder="Enter blog title"
                                    required
                                    name="Date"
                                    value={values.reportDate}
                                    onChange={
                                        (e) => setValues({ ...values, reportDate: e.target.value }) // Change 'Date' to 'reportDate'
                                    }
                                />
                                <Label>
                                    Date <span className="text-danger">*</span>
                                </Label>
                                {isSubmit && (
                                    <p className="text-danger">
                                        {/* {formErrors.LabRegistrationDate} */}
                                    </p>
                                )}
                            </div>
                        </Col>

                        <Col lg={6}>
                            <label>
                                Profile Photo <span className="text-danger">*</span>
                            </label>

                            <Input
                                key={"blogImage_" + _id}
                                type="file"
                                name="Pharmacyphoto"
                                className={validClassBI}
                                // accept="images/*"
                                accept=".jpg, .jpeg, .png"
                                onChange={PhotoUpload}
                            />
                            {isSubmit && (
                                <p className="text-danger">{formErrors.Pharmacyphoto}</p>
                            )}
                            {values.Report || photoAdd ? (
                                <img
                                    // key={photoAdd}
                                    className="m-2"
                                    src={
                                        checkImagePhoto
                                            ? photoAdd
                                            : `${process.env.REACT_APP_API_URL}/${values.Report}`
                                    }
                                    width="180"
                                    height="200"
                                />
                            ) : null}
                        </Col>
                        <br />
                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                name="IsActive"
                                checked={values.IsActive}
                                onChange={(e) =>
                                    setValues({ ...values, IsActive: e.target.checked })
                                }
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
                            // onClick={handleUpdate}
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
                    Remove Lab Reports
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
                            // onClick={handleDelete}
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

export default Transactions;

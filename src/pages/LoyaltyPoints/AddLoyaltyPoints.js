import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
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
import{
  createVerifyPoints,
getVerifyPoints,
removeVerifyPoints,
updateVerifyPoints,
} from "../../functions/Loyalty/LoyaltyPoints";
import { Navigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
const pntId = localStorage.getItem("AdminUser");
const pntName = localStorage.getItem("Patient");
const initialState = {
Hospital: "",
Patient: pntId,
Image: "",
Amount: "",
IsVerified: false,
IsAdded: false,
};

const AddLoyaltyPoints = () => {
const [values, setValues] = useState(initialState);
const { Hospital, Patient, Image, Amount, IsVerified, IsAdded } = values;
const [formErrors, setFormErrors] = useState({});
const [isSubmit, setIsSubmit] = useState(false);
  const [filter, setFilter] = useState(true);
  const [hospitalList, setHospitalList] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/listHospital`)
      .then((res) => {
        const hospitals = res;
        setHospitalList(hospitals);
        // console.log("hos",res);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

const [query, setQuery] = useState("");

const [_id, set_Id] = useState("");
const [remove_id, setRemove_id] = useState("");

const [data, setData] = useState([]);

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
  getVerifyPoints(_id)
    .then((res) => {
      console.log(res);
      setValues({
        ...values,
        Hospital: res.Hospital._id,
        // Patient: res.Patient,
        Image: res.Image,
        Amount: res.Amount,
        IsVerified: res.IsVerified,
        IsAdded: res.IsAdded,
      });
      setPhotoAdd(`${process.env.REACT_APP_API_URL}/${res.Image}`);
      setCheckImagePhoto(true);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleChange = (e) => {
  setValues({ ...values, [e.target.name]: e.target.value });
};

const handleCheck = (e) => {
  setValues({ ...values, [e.target.name]: e.target.checked });
};

const [errHospital, setErrHospital] = useState(false);
const [errPatient, setErrPatient] = useState(false);
const [errImg, setErrImg] = useState(false);
const [errAmount, setErrAmount] = useState(false);

const validate = (values) => {
  const errors = {};

  if (values.Hospital === "") {
    errors.Hospital = "Hospital is required!";
    setErrHospital(true);
  }
  if (values.Hospital !== "") {
    setErrHospital(false);
  }

  if (values.Patient === "") {
    errors.Patient = "Patient is required!";
    setErrPatient(true);
  }
  if (values.Patient !== "") {
    setErrPatient(false);
  }

  if (values.Image === "") {
    errors.Image = "Image is required!";
    setErrImg(true);
  }
  if (values.Image !== "") {
    setErrImg(false);
  }

  if (values.Amount === "") {
    errors.Amount = "Amount is required!";
    setErrAmount(true);
  }
  if (values.Amount !== "") {
    setErrAmount(false);
  }

  return errors;
};

const validClassHospital =
  errHospital && isSubmit ? "form-control is-invalid" : "form-control";

const validClassPatient =
  errPatient && isSubmit ? "form-control is-invalid" : "form-control";

const validClassImg =
  errImg && isSubmit ? "form-control is-invalid" : "form-control";

const validClassAmount =
  errAmount && isSubmit ? "form-control is-invalid" : "form-control";

const handleClick = (e) => {
  e.preventDefault();
  setFormErrors({});
  let erros = validate(values);
  setFormErrors(erros);
  setIsSubmit(true);

  if (Object.keys(erros).length === 0) {
    const formdata = new FormData();

    formdata.append("myFile", values.Image);
    formdata.append("Hospital", values.Hospital);
    formdata.append("Patient", values.Patient);
    formdata.append("Amount", values.Amount);
    formdata.append("IsVerified", values.IsVerified);
    formdata.append("IsAdded", values.IsAdded);

    createVerifyPoints(formdata)
      .then((res) => {
        setmodal_list(!modal_list);
        setValues(initialState);
        setCheckImagePhoto(false);
        setIsSubmit(false);
        setFormErrors({});
        setPhotoAdd("");

        fetchVerifyPoints();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const handleDelete = (e) => {
  e.preventDefault();
  removeVerifyPoints(remove_id)
    .then((res) => {
      setmodal_delete(!modal_delete);
      fetchVerifyPoints();
    })
    .catch((err) => {
      console.log(err);
    });
};

  const handleVerify = (e) => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_URL}/api/auth/update-is-verified-status`, { _id })
      .then((res) => {
        setmodal_edit(!modal_edit);
        fetchVerifyPoints();
        toast.success("Verified Successfully");
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
    const formdata = new FormData();

    formdata.append("myFile", values.Image);
    formdata.append("Hospital", values.Hospital);
    formdata.append("Patient", values.Patient);
    formdata.append("Amount", values.Amount);
    formdata.append("IsVerified", values.IsVerified);
    formdata.append("IsAdded", values.IsAdded);

    updateVerifyPoints(_id, formdata)
      .then((res) => {
        setmodal_edit(!modal_edit);
        fetchVerifyPoints();
        setPhotoAdd("");

        setCheckImagePhoto(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
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
  fetchVerifyPoints();
}, [pageNo, perPage, column, sortDirection, query, filter]);

const fetchVerifyPoints = async () => {
  setLoading(true);
  let skip = (pageNo - 1) * perPage;
  if (skip < 0) {
    skip = 0;
  }

  await axios
    .post(
      `${process.env.REACT_APP_API_URL}/api/auth/list-by-patient/verify-points`,
      {
        skip: skip,
        per_page: perPage,
        sorton: column,
        sortdir: sortDirection,
        match: query,
        patientId : pntId,
      }
    )
    .then((response) => {
      if (response.length > 0) {
        let res = response[0];
        setLoading(false);
        setData(res.data);
        setTotalRows(res.count);
      } else if (response.length === 0) {
        setData([]);
      }
    });

  setLoading(false);
};

const handlePageChange = (page) => {
  setPageNo(page);
};

const [photoAdd, setPhotoAdd] = useState();
const [checkImagePhoto, setCheckImagePhoto] = useState(false);

const PhotoUpload = (e) => {
  if (e.target.files.length > 0) {
    let imageurl = URL.createObjectURL(e.target.files[0]);
    console.log("img", e.target.files[0]);

    setPhotoAdd(imageurl);
    setValues({ ...values, Image: e.target.files[0] });
    setCheckImagePhoto(true);
  }
};

const handlePerRowsChange = async (newPerPage, page) => {
  setPerPage(newPerPage);
};
const handleFilter = (e) => {
  setFilter(e.target.checked);
};

const col = [
  {
    name: "Hospital",
    selector: (row) => row.HospitalDetails.HospitalName,
    sortable: true,
    sortField: "Hospital",
    minWidth: "150px",
  },
  {
    name: "Amount",
    selector: (row) => row.Amount,
    sortable: true,
    sortField: "Amount",
    minWidth: "150px",
  },
  {
    name: "Status",
    selector: (row) => {
      return <p>{row.IsVerified ? "Verified" : "Not Verified"}</p>;
    },
    sortable: false,
    sortField: "Status",
  },
  {
    name: "Action",
    selector: (row) => {
      return (
        <React.Fragment>
          <div className="d-flex gap-2">
            <div className="edit">
              <button
                className="btn btn-sm btn-success edit-item-btn "
                data-bs-toggle="modal"
                data-bs-target="#showModal"
                onClick={() => handleTog_edit(row._id)}
              >
                {row.IsVerified ? "View" : "Edit"}
              </button>
            </div>

            <div className="remove">
              <button
                className="btn btn-sm btn-danger remove-item-btn"
                data-bs-toggle="modal"
                data-bs-target="#deleteRecordModal"
                onClick={() => tog_delete(row._id)}
              >
                Remove
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

document.title = "Hospital Bills | Grace Lab";

return (
  <React.Fragment>
    <ToastContainer />
    <div className="page-content">
      <Container fluid>
        <BreadCrumb maintitle="CMS" title="Hospital Bills" pageTitle="CMS" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Row className="g-4 mb-1">
                  <Col className="col-sm" sm={6} lg={4} md={6}>
                    <h2 className="card-title mb-0 fs-4 mt-2">Hospital Bills</h2>
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
                      data={data}
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
        Add Hospital Bills
      </ModalHeader>
      <form>
        <ModalBody>
          <div className=" mb-3">
            {/* 
              <Input
              type="text"
              className={validClassHospital}
              placeholder="Enter Hospital "
              required
              name="Hospital"
              value={Hospital?.HospitalName}
              onChange={handleChange}
            />
            */}
  <Label>
              Hospital<span className="text-danger">*</span>{" "}
            </Label>
            <Select
              options={hospitalList.map((item) => ({
                value: item._id, // value for React Select
                label: item.HospitalName, // label displayed in the dropdown
              }))}
              value={
                hospitalList
                  .filter((item) => item._id === Hospital)
                  .map((item) => ({
                    value: item._id,
                    label: item.HospitalName,
                  })) || null
              } // find and pass the full object
              onChange={(e) => setValues({ ...values, Hospital: e.value })} // on change, only pass the _id
              placeholder="Select Hospital"
            />

          
            {isSubmit && <p className="text-danger">{formErrors.Hospital}</p>}
          </div>

          <div className="form-floating mb-3">
            <Input
              type="text"
              className={validClassPatient}
              placeholder="Enter Member "
              required
              name="Patient"
              value={pntName}
              // onChange={handleChange}
              disabled
            />
            <Label>
              Member<span className="text-danger">*</span>{" "}
            </Label>
            {isSubmit && <p className="text-danger">{formErrors.Patient}</p>}
          </div>

          <div className="form-floating mb-3">
            <Input
              type="number"
              className={validClassAmount}
              placeholder="Enter Amount "
              required
              name="Amount"
              value={Amount}
              onChange={handleChange}
            />
            <Label>
              Amount<span className="text-danger">*</span>{" "}
            </Label>
            {isSubmit && <p className="text-danger">{formErrors.Amount}</p>}
          </div>

          <Col lg={12}>
            <label>
              Upload Bill <span className="text-danger">*</span>
            </label>

            <input
              type="file"
              name="Image"
              className={validClassImg}
              accept=".jpg, .jpeg, .png"
              onChange={PhotoUpload}
            />
            {isSubmit && <p className="text-danger">{formErrors.Image}</p>}
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
              name="IsVerified"
              value={IsVerified}
              checked={IsVerified}
              onChange={handleCheck}
            />
            <Label className="form-check-label">Is Verified</Label>
          </div>
          <div className="form-check mb-2">
            <Input
              type="checkbox"
              className="form-check-input"
              name="IsAdded"
              value={IsAdded}
              checked={IsAdded}
              onChange={handleCheck}
            />
            <Label className="form-check-label">Is Added</Label>
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
        Edit Hospital Bills
      </ModalHeader>
      <form>
        <ModalBody>
          <div className="form-floating mb-3">
          <Label>
              Hospital<span className="text-danger">*</span>{" "}
            </Label>
            <Select
              options={hospitalList.map((item) => ({
                value: item._id, // value for React Select
                label: item.HospitalName, // label displayed in the dropdown
              }))}
              value={
                hospitalList
                  .filter((item) => item._id === Hospital)
                  .map((item) => ({
                    value: item._id,
                    label: item.HospitalName,
                  })) || null
              } // find and pass the full object
              onChange={(e) => setValues({ ...values, Hospital: e.value })} // on change, only pass the _id
              placeholder="Select Hospital"
            />

            {isSubmit && <p className="text-danger">{formErrors.Hospital}</p>}
          </div>

          <div className="form-floating mb-3">
            <Input
              type="text"
              className={validClassPatient}
              placeholder="Enter Member "
              required
              name="Patient"
              value={pntName}
              onChange={handleChange}
              disabled
            />
            <Label>
              Member <span className="text-danger">*</span>
            </Label>
            {isSubmit && <p className="text-danger">{formErrors.Patient}</p>}
          </div>

          <div className="form-floating mb-3">
            <Input
              type="number"
              className={validClassAmount}
              placeholder="Enter Amount "
              required
              name="Amount"
              value={Amount}
              onChange={handleChange}
            />
            <Label>
              Amount<span className="text-danger">*</span>{" "}
            </Label>
            {isSubmit && <p className="text-danger">{formErrors.Amount}</p>}
          </div>

          <Col lg={12}>
            <label>
              Image <span className="text-danger">*</span>
            </label>
            <br />
            
            <input
              type="file"
              name="Image"
              className={validClassImg}
              accept=".jpg, .jpeg, .png"
              onChange={PhotoUpload}
            />
            {isSubmit && <p className="text-danger">{formErrors.Image}</p>}
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
              name="IsVerified"
              value={IsVerified}
              checked={IsVerified}
              onChange={handleCheck}
            />
            <Label className="form-check-label">Is Verified</Label>
          </div>
          <div className="form-check mb-2">
            <Input
              type="checkbox"
              className="form-check-input"
              name="IsAdded"
              value={IsAdded}
              checked={IsAdded}
              onChange={handleCheck}
            />
            <Label className="form-check-label">Is Added</Label>
          </div> */}
        </ModalBody>

        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            <button
              type="submit"
              className="btn btn-success"
              id="add-btn"
              onClick={handleUpdate}
              disabled={IsVerified}
            >
              {IsVerified ? "Verified" : "Submit"}
            </button>

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                setmodal_edit(false);
                setIsSubmit(false);
                setCheckImagePhoto(false);
                setFormErrors({});
                setPhotoAdd("");
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
        Remove Hospital Bill
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

export default AddLoyaltyPoints;

              
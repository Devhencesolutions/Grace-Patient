import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import { Container, Row, Col, Card, Alert, CardBody, Button, ModalBody, ModalHeader, Modal, ModalFooter, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { resetProfileFlag } from "../../store/actions";
import axios from "axios";
import { RiPhoneFill } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { listCities, listDoctors, listHospital, listPharmacy, listlabs, updatePatient } from "../../functions/Patient/Patient";

const UserProfile = () => {
  const dispatch = useDispatch();

  // const [email, setEmail] = useState("");
  // const [userId, setUserId] = useState("");
  // const [userName, setUserName] = useState("");
  // const [surname, setUserSurname] = useState("");
  const [logo, setLogo] = useState(null);
  const [doctorphoto, setDoctorphoto] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState("");

  const [PatientName, setPatientName] = useState("");
  const [PatientReferenceNo, setPatientReferenceNo] = useState("");
  const [PatientRegistrationDate, setPatientRegistrationDate] = useState("");
  const [Password, setPassword] = useState("");

  const [MobileNumber, setMobileNumber] = useState("");
  const [EmailP, setEmailP] = useState("");
  const [Area, setArea] = useState("");
  const [City, setCity] = useState("");
  const [Address, setAddress] = useState("");
  const [Pancard, setPancard] = useState("");
  const [Aadharcard, setAadharcard] = useState("");

  const [FamilyDoctor1, setFamilyDoctor1] = useState("");
  const [FamilyDoctorName, setFamilyDoctorName] = useState("");
  const [FamilyDoctorMobile, setFamilyDoctorMobile] = useState("");
  const [FamilyDoctorAddress, setFamilyDoctorAddress] = useState("");
  const [FamilyDoctorPincode, setFamilyDoctorPincode] = useState("");

  const [doctordata, setdoctordata] = useState(null);

  const [Pharmacy1, setPharmacy1] = useState("");
  const [PharmacyName, setPharmacyName] = useState("");
  const [PharmacyMobile, setPharmacyMobile] = useState("");
  const [PharmacyAddress, setPharmacyAddress] = useState("");
  const [PharmacyPincode, setPharmacyPincode] = useState("");


  const [Laboratory1, setLaboratory1] = useState("");
  const [LaboratoryName, setLaboratoryName] = useState("");
  const [LaboratoryMobile, setLaboratoryMobile] = useState("");
  const [LaboratoryAddress, setLaboratoryAddress] = useState("");
  const [LaboratoryPincode, setLaboratoryPincode] = useState("");

  const [laboraterydata, setlaboraterydata] = useState([]);
  const [Hospitaldata, setHospitalData] = useState([]);
  const [citydata, setCityData] = useState([]);
  const [pharmacydata, setpharmacydata] = useState([]);

  const [Hospital1, setHospital1] = useState("");
  const [HospitalName, setHospitalName] = useState("");
  const [HospitalMobile, setHospitalMobile] = useState("");
  const [HospitalAddress, setHospitalAddress] = useState("");
  const [HospitalPincode, setHospitalPincode] = useState("");

  const [userId, setuserId] = useState(localStorage.getItem("AdminUser"));
  const [IsActive, setIsActive] = useState(false);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const [newDoctor, setNewDoctor] = useState(false);
  const [newHospital, setNewHospital] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState(false);
  const [newLaboratory, setNewLaboratory] = useState(false);
  const[cantFindDoc, setCantFindDoc] = useState(true)
  const[cantFindPhar, setCantFindPhar] = useState(true)
  const[cantFindLab, setCantFindLab] = useState(true)
  const[cantFindHosp, setCantFindHosp] = useState(true)

  const [editModal, setEditModal] = useState(false); // State for controlling the modal

  const toggleEditModal = () => setEditModal(!editModal);

  useEffect(() => {//
    listCities().then((response) => {
      console.log("City", response);
      setCityData(response);
    });
  }, []);
  useEffect(() => {//
    listDoctors().then((response) => {
      console.log("doctorsss", response);
      setdoctordata(response);
    });
  }, []);

  useEffect(() => {
    listHospital().then((response) => {
      console.log("Hospital", response);
      setHospitalData(response);
    });
  }, []);

  useEffect(() => {//
    listPharmacy().then((response) => {
      console.log("phramacy", response);
      setpharmacydata(response);
    });
  }, []);

  useEffect(() => {//
    listlabs().then((response) => {
      console.log("labs", response);
      setlaboraterydata(response);
    });
  }, []);
  const getLabNameById = (id, laboraterydata) => {
    if (!Array.isArray(laboraterydata)) return 'Unknown';
    const labObject = laboraterydata.find(lab => lab._id === id);
    return labObject ? labObject.LabName : 'Unknown';
  };
  const getDoctorNameById = (id, doctordata) => {
    if (!Array.isArray(doctordata)) return 'Unknown';
    const labObject = doctordata.find(lab => lab._id === id);
    return labObject ? labObject.DoctorName : 'Unknown';
  };
  const getHospitalNameById = (id, Hospitaldata) => {
    if (!Array.isArray(Hospitaldata)) return 'Unknown';
    const hospitalObject = Hospitaldata.find(hospital => hospital._id === id);
    return hospitalObject ? hospitalObject.HospitalName : 'Unknown';
};

  const getPharmacyNameById = (id, pharmacydata) => {
    if (!Array.isArray(pharmacydata)) return 'Unknown';
    const pharmacyObject = pharmacydata.find(pharmacy => pharmacy._id === id);
    return pharmacyObject ? pharmacyObject.PharmacyName : "Unknown";
  }
  const getCityById = (id, citydata) =>{
    if (!Array.isArray(citydata)) return 'Unknown';
    const cityObject = citydata.find(city => city._id === id);
    return cityObject ? cityObject.Name : "Unknown";
  }

  const { user, success, error } = useSelector((state) => ({
    user: state.Profile.user,
    success: state.Profile.success,
    error: state.Profile.error,
  }));

  const validateForm = () => {
    const errors = {};
    if (!PatientName) errors.PatientName = "Patient Name is required";
    if (!PatientReferenceNo) errors.PatientReferenceNo = "Reference No is required";
    if (!PatientRegistrationDate) errors.PatientRegistrationDate = "Registration Date is required";
    if (!Password) errors.Password = "Password is required";
    if (!MobileNumber) errors.MobileNumber = "Mobile Number is required";
    if (!EmailP) errors.EmailP = "Email is required";
    if (!Area) errors.Area = "Area is required";
    if (!City) errors.City = "City is required";
    if (!Address) errors.Address = "Address is required";
    if (!Pancard) errors.Pancard = "PAN Card is required";
    if (!Aadharcard) errors.Aadharcard = "Aadhar Card is required";
    if (!FamilyDoctor1 && !newDoctor) errors.FamilyDoctor1 = "Family Doctor is required";
    if (newDoctor) {
      if (!FamilyDoctorName) errors.FamilyDoctorName = "Family Doctor Name is required";
      if (!FamilyDoctorMobile) errors.FamilyDoctorMobile = "Family Doctor Mobile is required";
      if (!FamilyDoctorAddress) errors.FamilyDoctorAddress = "Family Doctor Address is required";
      if (!FamilyDoctorPincode) errors.FamilyDoctorPincode = "Family Doctor Pincode is required";
    }
    if (!Pharmacy1 && !newPharmacy) errors.Pharmacy1 = "Pharmacy is required";
    if (newPharmacy) {
      if (!PharmacyName) errors.PharmacyName = "Pharmacy Name is required";
      if (!PharmacyMobile) errors.PharmacyMobile = "Pharmacy Mobile is required";
      if (!PharmacyAddress) errors.PharmacyAddress = "Pharmacy Address is required";
      if (!PharmacyPincode) errors.PharmacyPincode = "Pharmacy Pincode is required";
    }
    if (!Laboratory1 && !newLaboratory) errors.Laboratory1 = "Laboratory is required";
    if(newLaboratory){
      if (!LaboratoryName) errors.LaboratoryName = "Laboratory Name is required";
      if (!LaboratoryMobile) errors.LaboratoryMobile = "Laboratory Mobile is required";
      if (!LaboratoryAddress) errors.LaboratoryAddress = "Laboratory Address is required";
      if (!LaboratoryPincode) errors.LaboratoryPincode = "Laboratory Pincode is required";
    }
    if (!Hospital1 && !newHospital) errors.Hospital1 = "Hospital is required";
    if (newHospital) {
      if (!HospitalName) errors.HospitalName = "Hospital Name is required";
      if (!HospitalMobile) errors.HospitalMobile = "Hospital Mobile is required";
      if (!HospitalAddress) errors.HospitalAddress = "Hospital Address is required";
      if (!HospitalPincode) errors.HospitalPincode = "Hospital Pincode is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const validateForm2 =() =>{
    const errors = {};
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleEditSubmit = async () => {
    let errors = validate(

    );
    setFormErrors(errors);
    setIsSubmit(true);
    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append("PatientName", PatientName);
      formData.append("PatientReferenceNo", PatientReferenceNo);
      formData.append("PatientRegistrationDate", PatientRegistrationDate);
      formData.append("Password", Password);
      formData.append("mobileNumber", MobileNumber);
      formData.append("Email", EmailP);
      formData.append("area", Area);
      formData.append("city", City);
      formData.append("address", Address);
      formData.append("pancard", Pancard);
      formData.append("aadharcard", Aadharcard);
      
        formData.append("FamilyDoctor1", FamilyDoctor1);
      
        formData.append("FamilyDoctorName", FamilyDoctorName);
        formData.append("FamilyDoctorMobile", FamilyDoctorMobile);
        formData.append("FamilyDoctorAddress", FamilyDoctorAddress);
        formData.append("FamilyDoctorPincode", FamilyDoctorPincode);
      
        formData.append("Pharmacy1", Pharmacy1);
     
        formData.append("PharmacyName", PharmacyName);
        formData.append("PharmacyMobile", PharmacyMobile);
        formData.append("PharmacyAddress", PharmacyAddress);
        formData.append("PharmacyPincode", PharmacyPincode);
     
      formData.append("Laboratory1", Laboratory1);
      
      formData.append("LaboratoryName", LaboratoryName);
      formData.append("LaboratoryMobile", LaboratoryMobile);
      formData.append("LaboratoryAddress", LaboratoryAddress);
      formData.append("LaboratoryPincode", LaboratoryPincode);
      
        formData.append("Hospital1", Hospital1);
      
        formData.append("HospitalName", HospitalName);
        formData.append("HospitalMobile", HospitalMobile);
        formData.append("HospitalAddress", HospitalAddress);
        formData.append("HospitalPincode", HospitalPincode);
        formData.append("isActive", IsActive)
      
      if(doctorphoto) {
        formData.append("photo", doctorphoto);
      }
      try {
       
        updatePatient(userId, formData).then((res) => {console.log("ffr",res);
        toggleEditModal();
        })
        
      } catch (error) {
        console.error("Error updating profile", error);
        // Handle error
      }
    }

    
  };

  const [errHospName, setErrHospName] = useState(false);
  const [errHospAdd, setErrHospAdd] = useState(false);
  const [errHospPin, setErrHospPin] = useState(false);
  const [errHospMobile, setErrHospMobile] = useState(false);
  const [errHosp, setErrHosp] = useState(false);

  const [errLabName, setErrLabName] = useState(false);
  const [errLabAdd, setErrLabAdd] = useState(false);
  const [errLabPin, setErrLabPin] = useState(false);
  const [errLabMobile, setErrLabMobile] = useState(false);
  const [errLab, setErrLab] = useState(false);

  const [errPharName, setErrPharName] = useState(false);
  const [errPharAdd, setErrPharAdd] = useState(false);
  const [errPharPin, setErrPharPin] = useState(false);
  const [errPharMobile, setErrPharMobile] = useState(false);
  const [errPhar, setErrPhar] = useState(false);

  const [errDocName, setErrDocName] = useState(false);
  const [errDocAdd, setErrDocAdd] = useState(false);
  const [errDocPin, setErrDocPin] = useState(false);
  const [errDocMobile, setErrDocMobile] = useState(false);
  const [errDoc, setErrDoc] = useState(false);
  const [errBT, setErrBT] = useState(false);
  const [errBD, setErrBD] = useState(false);
  const [errBTD, setErrBTD] = useState(false);
  const [errBI, setErrBI] = useState(false);
  const [errMN, seterrMN] = useState(false);
  const [errEmailP, seterrEmailP] = useState(false);
  const [errArea, seterrArea] = useState(false);
  const [errCity, seterrCity] = useState(false);
  const [errAddress, seterrAddress] = useState(false);
  const [errPancard, seterrPancard] = useState(false);
  const [errAadharcard, seterrAadharcard] = useState(false);
  const [errEmployeecode, seterrEmployeecode] = useState(false);
  const [errEmailO, seterrEmailO] = useState(false);
  const [errOfficeNumber, seterrOfficeNumber] = useState(false);
  const [errBankName, seterrBankName] = useState(false);
  const [errAccountNumber, seterrAccountNumber] = useState(false);
  const [errIFSCCode, seterrIFSCCode] = useState(false);
  const [errLoginID, seterrLoginID] = useState(false);
  const [errLoginPassword, seterrLoginPassword] = useState(false);

  const validate = (

  ) => {
    const errors = {};

    if (PatientName === "") {
      errors.PatientName = "Patient Name is required!";
      setErrBT(true);
    } else {
      setErrBT(false);
    }

    if (doctorphoto === "") {
      errors.doctorphoto = "Profile Picture is required!";
      setErrBI(true);
    } else {
      setErrBI(false);
    }
    console.log("MobileNumber", MobileNumber)
    if (!MobileNumber) {

      errors.MobileNumber = "Mobile Number is required!";
      setErrBTD(true);
    } else if (!/^\d{10}$/.test(MobileNumber)) {
      errors.MobileNumber = "Invalid Mobile Number!";
      setErrBTD(true);
    }
    else {
      setErrBTD(false);
    }
    if (PatientRegistrationDate === "") {
      errors.PatientRegistrationDate = "Patient Registration Date is required!";
      seterrMN(true);
    } else {
      seterrMN(false);
    }
    if (!EmailP) {
      errors.EmailP = "Email ID is required!";
      seterrEmailP(true);
    } else if (!/\S+@\S+\.\S+/.test(EmailP)) {
      errors.EmailP = "Invalid Email";
      seterrEmailP(true);
    } else {
      seterrEmailP(false);
    }
    if (!Area) {
      errors.Area = "Area is required!";
      seterrArea(true);
    } else {
      seterrArea(false);
    }
    if (!City) {
      errors.City = "City is required!";
      seterrCity(true);
    } else {
      seterrCity(false);
    }
    if (!Address) {
      errors.Address = "Address is required!";
      seterrAddress(true);
    } else {
      seterrAddress(false);
    }
    if (!Pancard) {
      errors.Pancard = "Pancard Number is required!";
      seterrPancard(true);
    } else {
      seterrPancard(false);
    }
    if (!Aadharcard) {
      errors.Aadharcard = "Aadharcard Number is required!";
      seterrAadharcard(true);
    } else {
      seterrAadharcard(false);
    }
   
    if (cantFindDoc === true) {
      if (!FamilyDoctor1) {
        errors.FamilyDoctor1 = "Doctor is required is required!";
        setErrDoc(true)
      }
      else {
        setErrDoc(false)
      }
    }
    else {
      setErrDoc(false)
      if (!FamilyDoctorName) {
        errors.FamilyDoctorName = "Doctor Name is required is required!";
        setErrDocName(true)
      }
      else {
        setErrDocName(false)
      }
      if (!FamilyDoctorMobile) {
        errors.FamilyDoctorMobile = "Doctor Mobile is required is required!";
        setErrDocMobile(true)
      }
      else if (!/^\d{10}$/.test(FamilyDoctorMobile)) {
        errors.FamilyDoctorMobile = "Invalid Mobile Number!";
        setErrDocMobile(true);
      }
      else {
        setErrDocMobile(false)
      }
      if (!FamilyDoctorAddress) {
        errors.FamilyDoctorAddress = "Doctor Address is required is required!";
        setErrDocAdd(true)
      }
      else {
        setErrDocAdd(false)
      }
      if (!FamilyDoctorPincode) {
        errors.FamilyDoctorPincode = "Doctor Pin is required is required!";
        setErrDocPin(true)
      }
      else {
        setErrDocPin(false)
      }
    }
    if (cantFindPhar === true) {
      if (!Pharmacy1) {
        errors.Pharmacy1 = "Pharmacy is required is required!";
        setErrPhar(true)
      }
      else {
        setErrPhar(false)
      }
    }
    else {
      setErrPhar(false)
      if (!PharmacyName) {
        errors.PharmacyName = "Pharmacy Name is required is required!";
        setErrPharName(true)
      }
      else {
        setErrPharName(false)
      }
      if (!PharmacyMobile) {
        errors.PharmacyMobile = "Pharmacy Mobile is required is required!";
        setErrPharMobile(true)
      } else if (!/^\d{10}$/.test(PharmacyMobile)) {
        errors.PharmacyMobile = "Invalid Mobile Number!";
        setErrPharMobile(true);
      }
      else {
        setErrPharMobile(false)
      }
      if (!PharmacyAddress) {
        errors.PharmacyAddress = "Pharmacy Address is required is required!";
        setErrPharAdd(true)
      }
      else {
        setErrPharAdd(false)
      }
      if (!PharmacyPincode) {
        errors.PharmacyPincode = "Pharmacy Pin is required is required!";
        setErrPharPin(true)
      }
      else {
        setErrPharPin(false)
      }
    }
    if (cantFindLab === true) {
      if (!Laboratory1) {
        errors.Laboratory1 = "Laboratory is required is required!";
        setErrLab(true)
      }
      else {
        setErrLab(false)
      }
    }
    else {
      setErrLab(false)
      if (!LaboratoryName) {
        errors.LaboratoryName = "Laboratory Name is required is required!";
        setErrLabName(true)
      }
      else {
        setErrLabName(false)
      }
      if (!LaboratoryMobile) {
        errors.LaboratoryMobile = "Laboratory Mobile is required is required!";
        setErrLabMobile(true)
      } else if (!/^\d{10}$/.test(LaboratoryMobile)) {
        errors.LaboratoryMobile = "Invalid Mobile Number!";
        setErrLabMobile(true);
      }
      else {
        setErrLabMobile(false)
      }
      if (!LaboratoryAddress) {
        errors.LaboratoryAddress = "Laboratory Address is required is required!";
        setErrLabAdd(true)
      }
      else {
        setErrLabAdd(false)
      }
      if (!LaboratoryPincode) {
        errors.LaboratoryPincode = "Laboratory Pin is required is required!";
        setErrLabPin(true)
      }
      else {
        setErrLabPin(false)
      }
    }
    if (cantFindHosp === true) {
      if (!Hospital1) {
        errors.Hospital1 = "Laboratory is required is required!";
        setErrHosp(true)
      }
      else {
        setErrHosp(false)
      }
    }
    else {
      setErrHosp(false)
      if (!HospitalName) {
        errors.HospitalName = "Hospital Name is required is required!";
        setErrHospName(true)
      }
      else {
        setErrHospName(false)
      }
      if (!HospitalMobile) {
        errors.HospitalMobile = "Hospital Mobile is required is required!";
        setErrHospMobile(true)
      } else if (!/^\d{10}$/.test(HospitalMobile)) {
        errors.HospitalMobile = "Invalid Mobile Number!";
        setErrHospMobile(true);
      }
      else {
        setErrHospMobile(false)
      }
      if (!HospitalAddress) {
        errors.HospitalAddress = "Hospital Address is required is required!";
        setErrHospAdd(true)
      }
      else {
        setErrHospAdd(false)
      }
      if (!HospitalPincode) {
        errors.HospitalPincode = "Hospital Pin is required is required!";
        setErrHospPin(true)
      }
      else {
        setErrHospPin(false)
      }
    }
    setFormErrors(errors);
    return errors;
  };

  const validClassHosp =
    errHosp && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassHospName =
    errHospName && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassHospMobile =
    errHospMobile && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassHospAdd =
    errHospAdd && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassHospPin =
    errHospPin && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassDocName =
    errDocName && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassDocAdd =
    errDocAdd && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassDocMobile =
    errDocMobile && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassDocPin =
    errDocPin && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPhar =
    errPhar && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPharName =
    errPharName && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPharMobile =
    errPharMobile && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPharAdd =
    errPharAdd && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPharPin =
    errPharPin && isSubmit ? "form-control is-invalid" : "form-control";


  const validClassLab =
    errLab && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLabName =
    errLabName && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLabMobile =
    errLabMobile && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLabAdd =
    errLabAdd && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLabPin =
    errLabPin && isSubmit ? "form-control is-invalid" : "form-control";

  const validClassDoc =
    errDoc && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassBT =
    errBT && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassBD =
    errBD && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassBTD =
    errBTD && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassBI =
    errBI && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassMN =
    errMN && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmailP =
    errEmailP && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassArea =
    errArea && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassCity =
    errCity && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassAddress =
    errAddress && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPan =
    errPancard && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassAadhar =
    errAadharcard && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmployeeCode =
    errEmployeecode && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassEmailO =
    errEmailO && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassOfficeNumber =
    errOfficeNumber && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassBankName =
    errBankName && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassAccountNumber =
    errAccountNumber && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassIFSC =
    errIFSCCode && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassLoginID =
    errLoginID && isSubmit ? "form-control is-invalid" : "form-control";
  const validClassPassword =
    errLoginPassword && isSubmit ? "form-control is-invalid" : "form-control";



  const handleEditCancel = () =>{
    validateForm2();
    toggleEditModal();
    setNewDoctor(false);
    setNewHospital(false);
    setNewLaboratory(false);
    setNewPharmacy(false);
    fetchUserData();
  }


    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("AdminUser");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/getPatient/${userId}`);

        const userData = response;
        console.log("reposneData", response);
        setPatientName(userData.PatientName);
        // setPatientReferenceNo("1234568");
        setPatientReferenceNo(userData.PatientReferenceNo)
        // setPatientRegistrationDate(userData.PatientRegistrationDate);
        const dateObject = new Date(userData.PatientRegistrationDate);
        const formattedDate = `${dateObject.getFullYear()}-${String(dateObject.getMonth() + 1).padStart(2, '0')}-${String(dateObject.getDate()).padStart(2, '0')}`;
        setPatientRegistrationDate(formattedDate);
        // {new Date(userData.PatientRegistrationDate).toLocaleDateString()}
        setPassword(userData.Password);

        setMobileNumber(userData.mobileNumber);
        setEmailP(userData.Email);
        setArea(userData.area);
        setCity(userData.city);
        setAddress(userData.address);
        setPancard(userData.panCard);
        setAadharcard(userData.aadharCard);

        setFamilyDoctor1(userData.FamilyDoctor1);
        setFamilyDoctorName(userData.FamilyDoctorName);
        setFamilyDoctorMobile(userData.FamilyDoctorMobile);
        setFamilyDoctorAddress(userData.FamilyDoctorAddress);
        setFamilyDoctorPincode(userData.FamilyDoctorPincode);

        setPharmacy1(userData.Pharmacy1);
        setPharmacyName(userData.PharmacyName);
        setPharmacyMobile(userData.PharmacyMobile);
        setPharmacyAddress(userData.PharmacyAddress);
        setPharmacyPincode(userData.PharmacyPincode);

        setLaboratory1(userData.Laboratory1);
        setLaboratoryName(userData.LaboratoryName);
        setLaboratoryMobile(userData.LaboratoryMobile);
        setLaboratoryAddress(userData.LaboratoryAddress);
        setLaboratoryPincode(userData.LaboratoryPincode);

        setHospital1(userData.Hospital1);
        setHospitalName(userData.HospitalName);
        setHospitalMobile(userData.HospitalMobile);
        setHospitalAddress(userData.HospitalAddress);
        setHospitalPincode(userData.HospitalPincode);

        setDoctorphoto(`${userData.photo}`);
        setPreviewPhoto(`${process.env.REACT_APP_API_URL}/${userData.photo}`);

        setIsActive(userData.isActive);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));

      if (!isEmpty(user)) {
        obj.data.first_name = user.first_name;
        sessionStorage.removeItem("authUser");
        sessionStorage.setItem("authUser", JSON.stringify(obj));
      }

      

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }

    fetchUserData();
  }, [dispatch, user]);


  document.title = `My Preferred | ${PatientName}`;

  return (
    <React.Fragment>
    <div className="page-content">
  <Container fluid>
    <Row>
      <Col lg="12">
        {error && <Alert color="danger">{error}</Alert>}
        {success && (
          <Alert color="success">Username Updated To {PatientName}</Alert>
        )}

         <Card style={{ width: '600px', margin: '0 auto' }}>
          <CardBody>
            <Row>
              <Col lg="6">
                <div className="text-muted">
                  <p className="mb-3" style={{ fontWeight: "bold" }}>
                    Family Doctor:
                  </p>
                  <p className="mb-3" style={{ fontWeight: "bold" }}>
                    Pharmacy:
                  </p>
                  <p className="mb-3" style={{ fontWeight: "bold" }}>
                    Laboratory:
                  </p>
                  <p className="mb-3" style={{ fontWeight: "bold" }}>
                    Hospital:
                  </p>
                </div>
              </Col>
              <Col lg="6">
                <div className="text-muted">
                  <p className="mb-3">
                    {getDoctorNameById(FamilyDoctor1, doctordata)}
                  </p>
                  <p className="mb-3">
                    {getPharmacyNameById(Pharmacy1, pharmacydata)}
                  </p>
                  <p className="mb-3">
                    {getLabNameById(Laboratory1, laboraterydata)}
                  </p>
                  <p className="mb-3">
                    {getHospitalNameById(Hospital1, Hospitaldata)}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="12" className="text-end mt-4">
                <Button color="primary" onClick={toggleEditModal}>
                  Edit
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
</div>


      <Modal isOpen={editModal} toggle={toggleEditModal} fullscreen="xl" size="lg">
        {" "}
        {/* Edit modal */}
        <ModalHeader toggle={toggleEditModal}>Edit Profile</ModalHeader>
        <ModalBody>       
         
          
         
          
          
          
              {/*  Doctor */}
          <Row>    
            <Col md={6}>
            <FormGroup>
            <Label for="FamilyDoctor1">Family Doctor</Label>
            <Input
              type="select"
              id="FamilyDoctor1"
              value={FamilyDoctor1}
              onChange={(e) => {
                setFamilyDoctor1(e.target.value);
                setFamilyDoctorName("");
                setFamilyDoctorAddress("");
                setFamilyDoctorMobile("");
                setFamilyDoctorPincode("");
                
                setErrDocName(false)
                setErrDocAdd(false)
                setErrDocMobile(false)
                setErrDocPin(false)
                setCantFindDoc(true)
                formErrors.DoctorPincode = ""
                formErrors.DoctorAddress = ""
                formErrors.DoctorMobile = ""
                formErrors.DoctorName = ""
                                            
                if (e.target.value) {
                  setNewDoctor(false)
                }
              }}
              className={validClassDoc}
              
            >
              <option value="">Select Doctor</option>
              {doctordata && doctordata.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>{doctor.DoctorName}</option>
              ))}
            </Input>
            
            <FormFeedback>{formErrors.FamilyDoctor1}</FormFeedback>
          </FormGroup>
          </Col>
            <Col md={6}><Button 
            style={{
             display: "block",
            margin: "20px auto",
             padding: "10px 20px",
             backgroundColor: "#E75480",
             color: "white",
             border: "none",
             borderRadius: "5px",
             cursor: "pointer",
            }} 
            onClick={() => {
             setNewDoctor(true);
             setFamilyDoctor1("");
             setErrDoc(false);
             setCantFindDoc(false);                           /////////////////
             }}
          >Can't Find Doctor?</Button></Col> {/*onClick={() => setNewDoctor(!newDoctor)} */}
          </Row>
          {newDoctor && (
            <>
            <Row>
              <Col md={3}>
              <FormGroup>
                <Label for="FamilyDoctorName">Family Doctor Name</Label>
                <Input
                  type="text"
                  id="FamilyDoctorName"
                  value={FamilyDoctorName}
                  onChange={(e) => setFamilyDoctorName(e.target.value)}
                  className={validClassDocName}
                />
                <FormFeedback>{formErrors.FamilyDoctorName}</FormFeedback>
              </FormGroup>
              </Col>
              <Col md={3}>
              <FormGroup>
                <Label for="FamilyDoctorMobile">Family Doctor Mobile</Label>
                <Input
                  type="text"
                  id="FamilyDoctorMobile"
                  value={FamilyDoctorMobile}
                  onChange={(e) => setFamilyDoctorMobile(e.target.value)}
                  className={validClassDocMobile}
                />
                <FormFeedback>{formErrors.FamilyDoctorMobile}</FormFeedback>
              </FormGroup>
              </Col>
              <Col md={3}>
              <FormGroup>
                <Label for="FamilyDoctorAddress">Family Doctor Address</Label>
                <Input
                  type="text"
                  id="FamilyDoctorAddress"
                  value={FamilyDoctorAddress}
                  onChange={(e) => setFamilyDoctorAddress(e.target.value)}
                  className={validClassDocAdd}
                />
                <FormFeedback>{formErrors.FamilyDoctorAddress}</FormFeedback>
              </FormGroup>
              </Col>
              <Col md={3}>
              <FormGroup>
                <Label for="FamilyDoctorPincode">Family Doctor Pincode</Label>
                <Input
                  type="text"
                  id="FamilyDoctorPincode"
                  value={FamilyDoctorPincode}
                  onChange={(e) => setFamilyDoctorPincode(e.target.value)}
                  className={validClassDocPin}
                />
                <FormFeedback>{formErrors.FamilyDoctorPincode}</FormFeedback>
              </FormGroup>
              </Col>
            </Row>  
            </>
          )}
            
          {/*  Pharmacy */}
          <Row>     
              <Col md={6}>
              <FormGroup>
            <Label for="Pharmacy1">Pharmacy</Label>
            <Input
              type="select"
              id="Pharmacy1"
              value={Pharmacy1}
              className={validClassPhar}
              onChange={(e) => {
                // setPharmacy1(e.target.value);
                // setNewPharmacy(false);
                setPharmacy1(e.target.value);
                setPharmacyName("");
                setPharmacyAddress("");
                setPharmacyMobile("");
                setPharmacyPincode("");
                
                setErrPharName(false)
                setErrPharAdd(false)
                setErrPharMobile(false)
                setErrPharPin(false)
                setCantFindPhar(true)
                formErrors.PharmacyPincode = ""
                formErrors.PharmacyAddress = ""
                formErrors.PharmacyMobile = ""
                formErrors.PharmacyName = ""
                                            
                if (e.target.value) {
                  setNewPharmacy(false)
                }
              }}
            >
              <option value="">Select Pharmacy</option>
              {pharmacydata && pharmacydata.map((pharmacy) => (
                <option key={pharmacy._id} value={pharmacy._id}>{pharmacy.PharmacyName}</option>
              ))}
            </Input>
            <FormFeedback>{formErrors.Pharmacy1}</FormFeedback>
          </FormGroup>
          </Col>
              <Col md={6}>
              <Button 
            style={{
             display: "block",
            margin: "20px auto",
             padding: "10px 20px",
             backgroundColor: "#E75480",
             color: "white",
             border: "none",
             borderRadius: "5px",
             cursor: "pointer",
            }} 
            onClick={() => {
              // setNewPharmacy(!newPharmacy);
              // setPharmacy1("");}
              setNewPharmacy(true);
             setPharmacy1("");
             setErrPhar(false);
             setCantFindPhar(false);     
            }
          }
            
          >Can't Find Pharmacy?</Button>
              </Col>
          </Row>

          {newPharmacy && (
            <>
            <Row>
              <Col md={3}>
              <FormGroup>
                <Label for="PharmacyName">Pharmacy Name</Label>
                <Input
                  type="text"
                  id="PharmacyName"
                  value={PharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className={validClassPharName}
                />
                <FormFeedback>{formErrors.PharmacyName}</FormFeedback>
              </FormGroup>
              </Col>
              <Col md={3}>
              <FormGroup>
                <Label for="PharmacyMobile">Pharmacy Mobile</Label>
                <Input
                  type="text"
                  id="PharmacyMobile"
                  value={PharmacyMobile}
                  onChange={(e) => setPharmacyMobile(e.target.value)}
                  className={validClassPharMobile}
                />
                <FormFeedback>{formErrors.PharmacyMobile}</FormFeedback>
              </FormGroup>
              </Col>
              <Col md={3}>
              <FormGroup>
                <Label for="PharmacyAddress">Pharmacy Address</Label>
                <Input
                  type="text"
                  id="PharmacyAddress"
                  value={PharmacyAddress}
                  onChange={(e) => setPharmacyAddress(e.target.value)}
                  className={validClassPharAdd}
                  />
                <FormFeedback>{formErrors.PharmacyAddress}</FormFeedback>
              </FormGroup>
              </Col>
              <Col md={3}>
              <FormGroup>
                <Label for="PharmacyPincode">Pharmacy Pincode</Label>
                <Input
                  type="text"
                  id="PharmacyPincode"
                  value={PharmacyPincode}
                  onChange={(e) => setPharmacyPincode(e.target.value)}
                  className={validClassPharPin}
                  />
                <FormFeedback>{formErrors.PharmacyPincode}</FormFeedback>
              </FormGroup>
              </Col>
            </Row>  
              </>
          )}
          {/*  Laboratory */}
          <Row> 
            <Col md={6}>
            <FormGroup>
            <Label for="Laboratory1">Laboratory</Label>
            <Input
              className={validClassLab}
              type="select"
              id="Laboratory1"
              value={Laboratory1}
              onChange={(e) => {
                // setLaboratory1(e.target.value);
                // setNewLaboratory(false);
                setLaboratory1(e.target.value);
                setLaboratoryName("");
                setLaboratoryAddress("");
                setLaboratoryMobile("");
                setLaboratoryPincode("");
                
                setErrLabName(false)
                setErrLabAdd(false)
                setErrLabMobile(false)
                setErrLabPin(false)
                setCantFindLab(true)
                formErrors.LaboratoryPincode = ""
                formErrors.LaboratoryAddress = ""
                formErrors.LaboratoryMobile = ""
                formErrors.LaboratoryName = ""
                                            
                if (e.target.value) {
                  setNewLaboratory(false)
                }
              }}
            >
              <option value="">Select Laboratory</option>
              {laboraterydata && laboraterydata.map((lab) => (
                <option key={lab._id} value={lab._id}>{lab.LabName}</option>
              ))}
            </Input>
            <FormFeedback>{formErrors.Laboratory1}</FormFeedback>
          </FormGroup>
            </Col>
            <Col md={6}>
            <Button 
            style={{
             display: "block",
            margin: "20px auto",
             padding: "10px 20px",
             backgroundColor: "#E75480",
             color: "white",
             border: "none",
             borderRadius: "5px",
             cursor: "pointer",
            }} 
            onClick={() => {
              // setNewLaboratory(!newLaboratory);
              // setLaboratory1("");}
              setNewLaboratory(true);
              setLaboratory1("");
             setErrLab(false);
             setCantFindLab(false);  
            }}

            
          >Can't Find Laboratory?</Button>
              
            </Col>
          </Row>
          {newLaboratory && (
            <>
            <Row>
            <Col lg={3}>
              
              <FormGroup>
              <Label>
                  Laboratory Name{" "}                  
                </Label>
                <Input                  
                  type="text"                  
                  placeholder="Enter Laboratory Name"
                  required
                  name="LaboratoryName"
                  value={LaboratoryName}
                  className={validClassLabName}
                  onChange={(e) => {
                    setLaboratoryName(e.target.value);
                  }}
                />
                <FormFeedback>{formErrors.LaboratoryName}</FormFeedback>
                </FormGroup>
              
            </Col>
            <Col lg={3}>
              <FormGroup >
              <Label>
                  Laboratory Mobile{" "}
                </Label>
                <Input                  
                  type="text"
                  placeholder="Enter Laboratory Mobile"
                  required
                  className={validClassLabMobile}
                  name="LaboratoryMobile"
                  value={LaboratoryMobile}
                  onChange={(e) => {
                    setLaboratoryMobile(
                      e.target.value
                    );
                  }}
                />
                <FormFeedback>{formErrors.LaboratoryName}</FormFeedback>                
              </FormGroup>
            </Col>
            <Col lg={3}>
              <FormGroup>
              <Label>
                  Laboratory Address{" "}
                </Label>
                <Input
                  type="text"
                  placeholder="Enter Laboratory Address"
                  required
                  className={validClassLabAdd}
                  name="LaboratoryAddress"
                  value={LaboratoryAddress}
                  onChange={(e) => {
                    setLaboratoryAddress(
                      e.target.value
                    );
                  }}
                />
                <FormFeedback>{formErrors.LaboratoryAddress}</FormFeedback>
                
              </FormGroup>
            </Col>
            <Col lg={3}>
              <FormGroup >
              <Label>
                  Laboratory Pincode{" "}
                </Label>
                <Input
                  type="text"
                  placeholder="Enter Laboratory Pincode"
                  required
                  className={validClassLabPin}
                  name="LaboratoryPincode"
                  value={LaboratoryPincode}
                  onChange={(e) => {
                    setLaboratoryPincode(
                      e.target.value
                    );
                  }}
                />
                <FormFeedback>{formErrors.LaboratoryPincode}</FormFeedback>
              </FormGroup>
            </Col>
            </Row>
          </>
          )}
          {/*  Hospital */}
          <Row>   
            <Col md={6}>
            <FormGroup>
            <Label for="Hospital1">Hospital</Label>
            <Input
              type="select"
              id="Hospital1"
              className={validClassHosp}
              value={Hospital1}
              onChange={(e) => {
                // setHospital1(e.target.value);
                // setNewHospital(false);
                setHospital1(e.target.value);
                setHospitalName("");
                setHospitalAddress("");
                setHospitalMobile("");
                setHospitalPincode("");
                
                setErrHospName(false)
                setErrHospAdd(false)
                setErrHospMobile(false)
                setErrHospPin(false)
                setCantFindHosp(true)
                formErrors.HospitalPincode = ""
                formErrors.HospitalAddress = ""
                formErrors.HospitalMobile = ""
                formErrors.HospitalName = ""
                                            
                if (e.target.value) {
                  setNewHospital(false)
                }
              }}
            >
              <option value="">Select Hospital</option>
              {Hospitaldata && Hospitaldata.map((hospital) => (
                <option key={hospital._id} value={hospital._id}>{hospital.HospitalName}</option>
              ))}
            </Input>
            <FormFeedback>{formErrors.Hospital1}</FormFeedback>
          </FormGroup>
            </Col>

            <Col md={6}>
            <Button 
            style={{
             display: "block",
            margin: "20px auto",
             padding: "10px 20px",
             backgroundColor: "#E75480",
             color: "white",
             border: "none",
             borderRadius: "5px",
             cursor: "pointer",
            }} 
            onClick={() => {
              // setNewHospital(!newHospital);
              // setHospital1("");
              setNewHospital(true);
              setHospital1("");
             setErrHosp(false);
             setCantFindHosp(false);  
            }
            }

            
          >Can't Find Hospital?</Button>
            </Col>
          </Row>

          {newHospital && (
            <>
            <Row>
            <Col lg={3}>
                                        <FormGroup >
                                        <Label>
                                            Hospital Name{" "}
                                          </Label>
                                          <Input
                                            type="text"
                                            placeholder="Enter Laboratory Name"
                                            required
                                            className={validClassHospName}
                                            name="HospitalName"
                                            value={HospitalName}
                                            onChange={(e) => {
                                              setHospitalName(e.target.value);
                                            }}
                                          />
                                           <FormFeedback>{formErrors.HospitalName}</FormFeedback>
                                        </FormGroup>
                                      </Col>
                                      <Col lg={3}>
                                        <FormGroup >
                                        <Label>
                                            Hospital Mobile{" "}
                                          </Label>
                                          <Input
                                            type="text"
                                            placeholder="Enter Laboratory Mobile"
                                            required
                                            className={validClassHospMobile}
                                            name="HospitalMobile"
                                            value={HospitalMobile}
                                            onChange={(e) => {
                                              setHospitalMobile(e.target.value);
                                            }}
                                          />
                                           <FormFeedback>{formErrors.HospitalMobile}</FormFeedback>
                                        </FormGroup>
                                      </Col>
                                      <Col lg={3}>
                                        <FormGroup >
                                        <Label>
                                            Hospital Address{" "}
                                          </Label>
                                          <Input
                                            type="text"
                                            placeholder="Enter Hospital Address"
                                            required
                                            className={validClassHospAdd}
                                            name="HospitalAddress"
                                            value={HospitalAddress}
                                            onChange={(e) => {
                                              setHospitalAddress(
                                                e.target.value
                                              );
                                            }}
                                          />
                                          <FormFeedback>{formErrors.HospitalAddress}</FormFeedback>
                                          
                                        </FormGroup>
                                      </Col>
                                      <Col lg={3}>
                                        <FormGroup >
                                        <Label>
                                            Hospital Pincode{" "}
                                          </Label>
                                          <Input
                                            type="text"
                                            placeholder="Enter Laboratory Pincode"
                                            required
                                            name="HospitalPincode"
                                            value={HospitalPincode}
                                            className={validClassHospPin}
                                            onChange={(e) => {
                                              setHospitalPincode(
                                                e.target.value
                                              );
                                            }}
                                          />
                                           <FormFeedback>{formErrors.HospitalPincode}</FormFeedback>
                                        </FormGroup>
                                      </Col>
            </Row>
            </>
          )}
          
          
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleEditSubmit }> {/**/}
            Save
          </Button>{" "}
          <Button color="secondary" onClick={handleEditCancel}>{/* */}
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default UserProfile;


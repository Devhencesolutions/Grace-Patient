import axios from "axios";

// Base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

// Function to create a referral by patient
export const createReferralByPatient = async (values) => {
  return await axios.post(`${API_URL}/api/auth/referrals/patient`, values);
};

// Function to create a referral by doctor
export const createReferralByDoctor = async (values) => {
  return await axios.post(`${API_URL}/api/referrals/doctor`, values);
};

// Function to create a referral by laboratory
export const createReferralByLaboratory = async (values) => {
  return await axios.post(`${API_URL}/api/referrals/laboratory`, values);
};

// Function to create a referral by hospital
export const createReferralByHospital = async (values) => {
  return await axios.post(`${API_URL}/api/referrals/hospital`, values);
};

// Function to create a referral by pharmacy
export const createReferralByPharmacy = async (values) => {
  return await axios.post(`${API_URL}/api/referrals/pharmacy`, values);
};

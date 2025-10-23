import axios from "axios";

export const createContactAdminPharmacy = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/ContactAdminPharmacy`,
    values
  );
};

export const removeContactAdminPharmacy = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/ContactAdminPharmacy/${_id}`
  );
};

export const listContactAdminPharmacy = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/ContactAdminPharmacy`
  );
};

export const listContactAdminPharmacyByParams = async (params) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/ContactAdminPharmacy`,
    params
  );
};

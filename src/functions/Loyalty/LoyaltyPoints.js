import axios from "axios";

export const createVerifyPoints = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/verify-points`,
    values
  );
};

export const listVerifyPoints = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/verify-points`
  );
};

export const listVerifyPointsByParams = async (params) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/verify-points`,
    params
  );
};

export const getVerifyPoints = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/verify-points/${_id}`
  );
};

export const updateVerifyPoints = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/verify-points/${_id}`,
    values
  );
};

export const removeVerifyPoints = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/verify-points/${_id}`
  );
};
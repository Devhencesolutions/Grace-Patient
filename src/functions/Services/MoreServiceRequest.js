import axios from "axios";

export const createMoreServiceRequest = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/more-services-request`,
    values
  );
};

export const removeMoreServiceRequest = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/delete/more-services-request/${_id}`
  );
};

export const listMoreServiceRequests = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/more-services-request`
  );
};

export const updateMoreServiceRequest = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/more-services-request/${_id}`,
    values
  );
};

export const getMoreServiceRequest = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/more-services-request/${_id}`
  );
};

import axios from "axios";

export const createServiceOrder = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/ServiceOrder`,
    values
  );
};

export const createServiceOrderByBilldesk = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/order-by-billdesk`,
    values
  );
};

export const getAllServiceOrder = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/ServiceOrder`
  );
};

export const getServiceOrderById = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/ServiceOrder/${_id}`
  );
};

export const updateServiceOrder = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/ServiceOrder/${_id}`,
    values
  );
};

export const deleteServiceOrder = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/ServiceOrder/${_id}`
  );
};

export const listServiceOrderByParams = async (params) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/ServiceOrder/list`,
    params
  );
};

export const getServiceOrderInvoiceById = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/ServiceOrder/invoice/${_id}`
  );
};

export const testServiceOrder = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/serviceorder/test`,
    values
  );
};

export const retriveTransaction = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/retrive-transaction`,
    values
  );
};

export const webHookReturn = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/webhook-return`,
    values
  );
};
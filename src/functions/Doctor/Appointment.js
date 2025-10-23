import axios from "axios";

export const updateAppointment = async (_id, amount) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/Appointment/${_id}`,
    {amount: amount}
  );
};

export const getAppointment = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/Appointment/${_id}`
  );
};

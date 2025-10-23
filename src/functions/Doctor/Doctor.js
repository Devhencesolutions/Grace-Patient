import axios from "axios";


export const listDoctor = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/listDoctors`
    );
  };
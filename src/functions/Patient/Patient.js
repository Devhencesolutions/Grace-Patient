import axios from "axios";
export const listlabs = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/listLaborateries`
    );
  };
  export const listPharmacy = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/listPharmacies`
    );
  };
  export const listHospital = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/listHospital`
    );
  };

  export const listDoctors = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/listDoctors`
    );
  };
  export const listCities = async () => {
    return await axios.get(
      `${process.env.REACT_APP_API_URL}/api/auth/list/Cities`
    );
  };
  export const updatePatient = async (_id, values) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/updatePatient/${_id}`,
        values
    );
};
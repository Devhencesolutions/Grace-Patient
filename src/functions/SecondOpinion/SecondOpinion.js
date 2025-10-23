import axios from "axios";

export const createSecondOpinion = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/create/SecondOpinion`,
    values
  );
};

export const removeSecondOpinion = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/SecondOpinion/${_id}`
  );
};

//   export const listContact = async () => {
//     return await axios.get(
//       `${process.env.REACT_APP_API_URL}/api/auth/list/company-locations`
//     );
//   };

export const updateSecondOpinion = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/SecondOpinion/${_id}`,
    values
  );
};

export const getSecondOpinion = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/SecondOpinion/${_id}`
  );
};


export const listSecondOpinion = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/SecondOpinion`
  );
};


export const listSecondOpinionByParams = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/list/SecondOpinionByParams`
  );
};

export const listActiveSecondOpinion = async () => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/listActive/SecondOpinion`
  );
}

// export const findContact = async (_id, country, city) => {
//   return await axios.get(
//     `${process.env.REACT_APP_API_URL}/api/auth/find/company-locations/${country}/${city}`
//   );
// };

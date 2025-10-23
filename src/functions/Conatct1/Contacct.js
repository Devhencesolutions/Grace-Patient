import axios from "axios";

export const createContact = async (values) => {
  return await axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/contact`,
    values
  );
};

export const removeContact = async (_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_API_URL}/api/auth/remove/contact/${_id}`
  );
};

//   export const listContact = async () => {
//     return await axios.get(
//       `${process.env.REACT_APP_API_URL}/api/auth/list/company-locations`
//     );
//   };

export const updateContact = async (_id, values) => {
  return await axios.put(
    `${process.env.REACT_APP_API_URL}/api/auth/update/contact/${_id}`,
    values
  );
};

export const getContact = async (_id) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/api/auth/get/contact/${_id}`
  );
};

// export const findContact = async (_id, country, city) => {
//   return await axios.get(
//     `${process.env.REACT_APP_API_URL}/api/auth/find/company-locations/${country}/${city}`
//   );
// };

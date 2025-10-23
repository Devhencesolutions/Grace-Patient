import axios from "axios";

export const createContactAdminPatients = async (values) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/create/ContactAdminPatients`,
        values
    );
};

export const removeContactAdminPatients = async (_id) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/auth/remove/ContactAdminPatients/${_id}`
    );
};

export const listContactAdminPatients = async () => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/list/ContactAdminPatients`
    );
};

export const updateContactAdminPatients = async (_id, values) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/update/ContactAdminPatients/${_id}`,
        values
    );
};

export const getContactAdminPatients = async (_id) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/get/ContactAdminPatients/${_id}`
    );
};

export const getAllContactAdminPatients = async () => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/get/getAllContactAdminPatients`
    );
};

export const listActiveContactAdminPatients = async () => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/list/activeContactAdminPatients`
    );
};

export const listContactAdminPatientsByParams = async (params) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/ContactAdminPatients`,
        params
    );
};

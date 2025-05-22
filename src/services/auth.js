import API from "../services/api";

// auth.js

export const loginUser = async (credentials) => {
  try {
    
    const response = await API.post(`/api/login`, credentials, {
      withCredentials: true // For cookies if using them
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
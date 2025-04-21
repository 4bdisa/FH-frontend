import axios from "axios";
import API_URL from "../config/apiConfig";

// auth.js

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/login`, credentials, {
      withCredentials: true // For cookies if using them
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
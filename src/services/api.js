import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("authToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Function to mark a job as completed and submit a review
export const completeRequest = async (requestId, data) => {
  return API.patch(`api/v1/requests/complete/${requestId}`, data);
};

export default API;
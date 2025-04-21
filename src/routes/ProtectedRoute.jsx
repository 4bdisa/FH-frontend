import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // Send the token to the backend for verification
        await axios.get(`${import.meta.env.VITE_API_URL}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        setIsAuthenticated(true); // Token is valid
      } catch (err) {
        console.error("Token verification failed:", err);
        setIsAuthenticated(false); // Token is invalid or expired
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    // Show a loading state while verifying the token
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
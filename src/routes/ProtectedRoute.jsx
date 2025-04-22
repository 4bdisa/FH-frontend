import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // Verify the token with the backend
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        setIsAuthenticated(true); // Token is valid
        setUserRole(response.data.user.role); // Set the user's role
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

  if (!isAuthenticated) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/pages/SignIn" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to the login page if the user's role is not allowed
    return <Navigate to="/pages/SignIn" replace />;
  }

  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;


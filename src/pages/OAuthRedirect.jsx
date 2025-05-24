import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");
      const user = queryParams.get("user");

      if (token && user) {
        let parsedUser;
        try {
          parsedUser = JSON.parse(user);
        } catch (error) {
          console.error("Error parsing user data:", error);
          navigate("/pages/SignIn");
          return;
        }

        // Save token and user details in local storage
        localStorage.setItem("authToken", token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: parsedUser.id,
            name: parsedUser.name,
            email: parsedUser.email,
            profileImage: parsedUser.profileImage,
            role: parsedUser.role,
          })
        );

        localStorage.setItem("userId", parsedUser.id);

        // Redirect based on role
        if (parsedUser.role === "service_provider") {
          setTimeout(() => navigate("/service-provider-dashboard"), 0);
        } else if (parsedUser.role === "client") {
          setTimeout(() => navigate("/customer-dashboard"), 0);
        } else {
          setTimeout(() => navigate("/pages/SignIn"), 0);
        }
      } else {
        navigate("/pages/SignIn");
      }
    };

    handleRedirect();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthRedirect;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("token");
      const user = query.get("user");

      if (token && user) {
        try {
          // Store the token and user in localStorage
          await Promise.resolve(localStorage.setItem("authToken", token));
          await Promise.resolve(
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...JSON.parse(user), // Parse the user string into an object
                profileImage: JSON.parse(user).profileImage || "https://placekitten.com/40/40",
              })
            )
            
          );
          console.log("User data stored in localStorage:", user);
          // Navigate to the dashboard
          navigate("/dashboard");
        } catch (error) {
          console.error("Error during OAuth redirect:", error);
          navigate("/pages/SignIn"); // Redirect to login on error
        }
      } else {
        // Redirect to login if token or user is missing
        navigate("/pages/SignIn");
      }
    };

    handleRedirect();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthRedirect;
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
          // Parse the user object from the query string
          const parsedUser = JSON.parse(user);

          // Store the token and user in localStorage
          await Promise.resolve(localStorage.setItem("authToken", token));
          await Promise.resolve(
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...parsedUser,
                profileImage: parsedUser.profileImage || "https://placekitten.com/40/40",
              })
            )
          );

          // Redirect based on the user's role
          if (parsedUser.role === "service_provider") {
            navigate("/service-provider-dashboard");
          } else if (parsedUser.role === "client") {
            navigate("/customer-dashboard");
          } else {
            console.error("Unknown user role:", parsedUser.role);
            navigate("/pages/SignIn"); // Redirect to login if role is unknown
          }
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
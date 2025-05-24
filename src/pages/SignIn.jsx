/* eslint-disable no-undef */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth"; // Ensure this service is implemented correctly
import Nano from "../assets/giflogo.gif"; // Ensure this file exists in the assets folder

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { token, user } = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Save token and user details in local storage
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          role: user.role,
        })
      );

      // Redirect based on role
      if (user.role === "service_provider") {
        navigate("/service-provider-dashboard");
      } else if (user.role === "client") {
        navigate("/customer-dashboard");
      }
    } catch (err) {
      // Check if the error is an AxiosError and has a response
      if (err.response) {
        const { status, data } = err.response;

        // Handle specific error messages based on the backend response
        if (status === 403 && data.error === "Your account is banned. Please contact the administrator.") {
          setError("Your account is banned. Please contact the administration.");
        } else if (status === 401 && data.error === "Invalid email or password") {
          setError("Invalid email or password. Please check your credentials.");
        } else if (status === 500 && data.error === "Authentication failed") {
          setError("Authentication failed. Please try again later.");
        }
        else {
          // Generic error message for other errors
          setError("Login failed. Please check your credentials.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Network error. Please check your internet connection.");
      }
      else {
        // Something happened in setting up the request that triggered an Error
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Trigger the backend Google OAuth login flow
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (error) {
      setError(error.message || "Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6 py-12">
      {/* Wrapper to make the box stand out */}
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl sm:max-w-sm">
        <div className="flex flex-col items-center">
          <img className="h-20 w-auto" src={Nano} alt="Your Company" />
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-2 border-blue-500 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <a href="/contact-admin" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-2 border-blue-500 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            />
          </div>

          {/* Sign-In Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>

          {/* Google Sign-In Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full justify-center items-center rounded-md border-2 border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-md hover:bg-gray-200"
            >
              <img
                src="https://img.icons8.com/?size=100&id=17904&format=png&color=000000"
                alt="Google Logo"
                className="h-5 w-5 mr-2"
              />
              Sign in with Google
            </button>
          </div>
        </form>

        {/* Sign-Up Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a
            //             href="/signup"
            onClick={handleGoogleLogin}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign up for an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
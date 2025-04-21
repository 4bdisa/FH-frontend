/* eslint-disable no-undef */
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import Nano from "../assets/giflogo.gif";

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
      // Destructure the response you expect from the backend
      const { token, user } = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Store the token and user data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.name,
          email: user.email,
          profileImage: user.profileImage || "https://via.placeholder.com/40",
          role: user.role,
        })
      );
      
      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Trigger the backend Google OAuth login flow
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    } catch (error) {
      setError(error.message || "Login failed");
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
        {error && <p className="text-red-500 text-center">{error.error}</p>}

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
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
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
            // href="/signup"
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










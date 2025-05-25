import React, { useState, useEffect } from "react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import API from "../../../src/services/api.js"; // Import your API utility

const ServiceProviderProfileUpdate = () => {
    const [formData, setFormData] = useState({
        skills: "",
        
        country: "",
        workDays: "",
        experienceYears: "",
        homeService: false,
        phoneNumber: "", // Added phoneNumber attribute
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(formData), // Include phoneNumber in the request body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedUser = await response.json();

            // Update localStorage with the new user data
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...JSON.parse(localStorage.getItem("user")), // Keep existing data
                    ...updatedUser.user, // Merge updated data
                })
            );

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg"
            >
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
                    Update Profile
                </h2>

                {/* Avatar Section */}
                <div className="flex justify-center mb-4">
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img
                                src={JSON.parse(localStorage.getItem("user"))?.profileImage || "https://img.daisyui.com/images/stock/photo-1534528741702-a0cfae58b707.jpg"}
                                alt="Profile"
                                className="w-34 h-34 rounded-full border border-blue-200"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://img.daisyui.com/images/stock/photo-1534528741702-a0cfae58b707.jpg";
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Skills</label>
                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g., Plumbing, Electrical"
                        className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
               
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="e.g., USA"
                        className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Work Days</label>
                    <input
                        type="text"
                        name="workDays"
                        value={formData.workDays}
                        onChange={handleChange}
                        placeholder="e.g., Monday, Tuesday"
                        className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Years of Experience
                    </label>
                    <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        placeholder="e.g., 5"
                        className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <PhoneInput
                        international
                        defaultCountry="US"
                        value={formData.phoneNumber}
                        onChange={phone => setFormData({ ...formData, phoneNumber: phone })}
                        className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Home Service
                    </label>
                    <input
                        type="checkbox"
                        name="homeService"
                        checked={formData.homeService}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <span>Available for home service</span>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default ServiceProviderProfileUpdate;
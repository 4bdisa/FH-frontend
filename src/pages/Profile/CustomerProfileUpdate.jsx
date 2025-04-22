import React, { useState } from "react";

const CustomerProfileUpdate = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Customer Profile:", formData);
        // Add API call to update profile
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg"
            >
                <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                    Update Customer Profile
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter your name"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter your phone number"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">City</label>
                    <input
                        type="text"
                        name="City"
                        value={formData.City}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Enter your city"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default CustomerProfileUpdate;
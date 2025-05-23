import React, { useState, useEffect } from "react";
import API from '../../services/api'; // Import your API service
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const CustomerProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        country: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await API.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                });

                if (response.status === 200) {
                    const profileData = response.data.data;
                    // Convert phone number to string
                    const phoneNumberString = String(profileData.phoneNumber || "");
                    setFormData({
                        ...profileData,
                        phoneNumber: phoneNumberString,
                    }); // Assuming the profile data is in response.data.data
                } else {
                    setError('Failed to fetch profile. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
            // Retrieve userId from localStorage
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user ? user.id : null;

            const response = await API.put('/api/profile/updatecustomer', { ...formData, userId }, { // Include userId in the request body
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.status === 200) {
                alert('Profile updated successfully!');
                setIsEditing(false); // Switch back to view mode
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleBackToView = () => {
        setIsEditing(false); // Go back to view mode
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
                    Customer Profile
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

                {isEditing ? (
                    // Edit Mode
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="button"
                                onClick={handleBackToView}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Back to View
                            </button>
                        </div>


                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Phone Number
                            </label>
                            <PhoneInput
                                international
                                defaultCountry="US"
                                value={formData.phoneNumber || ""} // Handle empty phone number
                                onChange={phoneNumber => setFormData({ ...formData, phoneNumber: phoneNumber })}
                                className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Enter your country"
                                className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition"
                        >
                            Update Profile
                        </button>
                    </form>
                ) : (
                    // View Mode
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={handleEditClick}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Edit Profile
                            </button>
                        </div>
                        <div>
                            <p>Name: {formData.name}</p>
                        </div>
                        <div>
                            <p>Email: {formData.email}</p>
                        </div>
                        <div>
                            <p>Phone Number: {formData.phoneNumber}</p>
                        </div>
                        <div>
                            <p>Country: {formData.country}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerProfile;
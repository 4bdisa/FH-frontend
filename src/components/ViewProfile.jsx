import React, { useState, useEffect } from 'react';
import API from '../services/api'; // Adjust the path as needed
import UpdateProfile from './UpdateProfile'; // Import UpdateProfile

const ViewProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State to control edit mode

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await API.get('/api/user/profile'); //  API endpoint
                setProfile(response.data.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to fetch profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex w-52 flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                    <div className="flex flex-col gap-2"> {/* Reduced gap for better appearance */}
                        <div className="skeleton h-4 w-20"></div>
                        <div className="skeleton h-4 w-28"></div>
                    </div>
                </div>
                <div className="skeleton h-32 w-full"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!profile) {
        return <div>No profile data available.</div>;
    }

    const handleEditClick = () => {
        setIsEditing(true); // Enable edit mode
    };

    const handleCancelEdit = () => {
        setIsEditing(false); // Disable edit mode
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full p-8 transition-all duration-300 animate-fade-in">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 text-center mb-8 md:mb-0">
                    {/* User Photo */}
                    {profile.profileImage && (
                        <img
                            src={profile.profileImage}
                            alt="Profile Picture"
                            className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 dark:border-blue-900 transition-transform duration-300 hover:scale-105"
                        />
                    )}
                    <h1 className="text-2xl font-bold text-indigo-800 dark:text-white mb-2">{profile.name}</h1>
                    {/* You might want to add a role or title here */}
                    {/* <p className="text-gray-600 dark:text-gray-300">Software Developer</p> */}
                    {!isEditing && (
                        <button
                            className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300"
                            onClick={handleEditClick}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
                <div className="md:w-2/3 md:pl-8">
                    {isEditing ? (
                        <UpdateProfile onCancel={handleCancelEdit} /> // Render UpdateProfile when in edit mode
                    ) : (
                        <>
                            {/* <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">About Me</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {profile.bio || "No bio available."}
                            </p> */}
                            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Category</h2>
                             <div className="flex flex-wrap gap-2 mb-6">
                                {profile.skills && profile.skills.map((skill, index) => (
                                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">{skill}</span>
                                ))}
                            </div>

                            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Keywords</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {profile.keywords || "Not specified"}
                            </p>

                            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Country</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {profile.country || "Not specified"}
                            </p>

                            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Service Information</h2>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                                {profile.homeService !== undefined && (
                                    <li className="flex items-center">
                                        Home Service: {profile.homeService ? 'Yes' : 'No'}
                                    </li>
                                )}
                                {profile.workDays && profile.workDays.length > 0 && (
                                    <li className="flex items-center">
                                        Work Days: {profile.workDays.join(', ')}
                                    </li>
                                )}
                                {profile.yearsOfExperience && (
                                    <li className="flex items-center">
                                        Years of Experience: {profile.yearsOfExperience}
                                    </li>
                                )}
                            </ul>
                            <h2 className="text-xl font-semibold text-indigo-800 dark:text-white mb-4">Contact Information</h2>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                    </svg>
                                    {profile.email}
                                </li>
                                <li className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                    </svg>
                                    {profile.phoneNumber || "Not available"}
                                </li>
                                {profile.address && (
                                    <li className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                                        </svg>
                                        {profile.address}
                                    </li>
                                )}
                                {profile.website && (
                                    <li className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-800 dark:text-blue-900" viewBox="0 0 20 20" fill="currentColor">
                                            {/* Replace with a website icon */}
                                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.237 2.742 7.814 6.578 9.182l.422-1.775a.975.975 0 01.975-.823H12c.552 0 1 .448 1 1v2H7v-2.583c0-.414.336-.75.75-.75h4.5c.414 0 .75.336.75.75V19h5v-2c0-.552-.448-1-1-1h-2.578a.975.975 0 01-.975.823l.422 1.775C17.258 17.814 20 14.237 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                        </svg>
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a>
                                    </li>
                                )}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
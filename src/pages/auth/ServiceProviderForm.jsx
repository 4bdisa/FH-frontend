import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

 const ServiceProviderForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [locationError, setLocationError] = useState(null);
  

 // Get user's current location
 useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue('latitude', latitude);
        setValue('longitude', longitude);
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError('Please enable location access to continue');
      }
    );
  } else {
    setLocationError('Geolocation is not supported by your browser');
  }
}, [setValue]);


  const onSubmit = async (data) => {
    try {
      // Prepare data to send to the backend
      const requestData = {
        token,
        password: data.password,
        skills: data.skills,
        location: [
          parseFloat(data.longitude),
          parseFloat(data.latitude)
        ],
        experienceYears: parseInt(data.experienceYears)
      };

      // Use the environment variable to get the backend API URL
      const backendUrl = `${import.meta.env.VITE_API_URL}/api/auth/complete/service-provider`;

      // Make the POST request to the backend
      const response = await axios.post(backendUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check the response and redirect to the dashboard if successful
      if (response.status === 200) {
        
        // Redirect to the dashboard after successful registration
        navigate('/oauth/callback'); // Adjust the dashboard URL as needed
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-center">Complete service-provider Registration</h2>
    
    {locationError && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {locationError}
      </div>
    )}
  
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          {...register('password')}
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Password"
          required
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium mb-1">Skills</label>
        <input
          {...register('skills')}
          className="w-full p-2 border rounded"
          placeholder="Skills (comma separated)"
          required
        />
      </div>
  
      <div>
        <label className="block text-sm font-medium mb-1">Experience Years</label>
        <input
          {...register('experienceYears')}
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Experience Years"
          required
        />
      </div>
  
      <div className="pt-4">
        <button
          type="submit"
          disabled={locationError}
          className={`w-full py-2 px-4 rounded text-white ${locationError ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Complete Registration
        </button>
      </div>
    </form>
  
    <div className="mt-4 text-sm text-gray-600">
      <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
    </div>
  </div>
  
  );
}; export default ServiceProviderForm;

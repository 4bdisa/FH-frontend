import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ClientRegistrationForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
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
      const requestData = {
        token,
        password: data.password,
        location: [
          parseFloat(data.longitude),
          parseFloat(data.latitude)
        ]
      };
      const backendUrl = `${import.meta.env.VITE_API_URL}/api/auth/complete/client`;
      const response = await axios.post(
        backendUrl,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true // Required for session cookies
        }
      );

      if (response.status === 200) {
        console.log('Registration successful:', response.data);
        navigate('/oauth/callback'); // Adjust the redirect URL as needed
      } else {
        alert(response.data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Client Registration</h2>

      {locationError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {locationError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register('password', { required: true })}
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Create a password"
            required
          />
        </div>

        {/* Hidden location fields */}
        <input type="hidden" {...register('latitude')} />
        <input type="hidden" {...register('longitude')} />

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
};

export default ClientRegistrationForm;
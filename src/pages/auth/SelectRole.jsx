import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SelectRole = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect based on the selected role
    if (role === 'service_provider') {
      navigate(`/complete-service-provider?token=${token}`);
    } else if (role === 'client') {
      navigate(`/complete-client?token=${token}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Role</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Your Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>Select your role</option>
            <option value="service_provider">Service Provider</option>
            <option value="client">Client</option>
          </select>
        </div>
    
        <div className="pt-4">
          <button
            type="submit"
            disabled={!role} // Disable button if no role is selected
            className={`w-full py-2 px-4 rounded text-white ${role ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );  
};

export default SelectRole;

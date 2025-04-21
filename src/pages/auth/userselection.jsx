import React, { useState } from 'react';

const App = () => {
  const [userType, setUserType] = useState('');

  const handleSelection = (e) => {
    setUserType(e.target.value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Select Your Role</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Are you a service provider or a customer?
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={userType === 'customer'}
                  onChange={handleSelection}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2">Customer</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="serviceProvider"
                  checked={userType === 'serviceProvider'}
                  onChange={handleSelection}
                  className="form-radio text-indigo-600"
                />
                <span className="ml-2">Service Provider</span>
              </label>
            </div>
          </div>

          {/* Display the selected option */}
          {userType && (
            <div className="mt-4 text-center">
              <p>You selected: <strong>{userType}</strong></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default App;

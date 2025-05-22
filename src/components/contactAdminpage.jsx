import React from 'react';

const ContactAdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Contact Admin</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-medium mb-2">Admin Information</h2>
        <p>
          <span className="font-semibold">Name:</span> Abdurahim Hussein
        </p>
        <p>
          <span className="font-semibold">Phone Number:</span> 0976165168
        </p>
        {/* You can add more contact information here, such as email or address */}
      </div>
    </div>
  );
};

export default ContactAdminPage;
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
   const user = JSON.parse(localStorage.getItem("user"))
    || {
      name: "John Doe",
      email: "johndoe@gmail.com",
      profileImage: "https://via.placeholder.com/40",
   };
   const navigate = useNavigate();
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   const handleSignOut = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/pages/SignIn");
   };

   return (
      <div className="flex min-h-screen bg-blue-50">
         {/* Sidebar */}
         <aside className="w-64 bg-white shadow-lg">
            <div className="p-6">
               <h2 className="text-2xl font-semibold text-blue-600">FixerHub</h2>
            </div>
            <nav className="mt-6">
               <ul className="space-y-2">
                  <li>
                     <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md"
                     >
                        <svg
                           className="w-5 h-5 mr-3"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                           ></path>
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 21V9h6v12"
                           ></path>
                        </svg>
                        Dashboard
                     </Link>
                  </li>
                  <li>
                     <Link
                        to="/dashboard/jobs/post"
                        className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md"
                     >
                        <svg
                           className="w-5 h-5 mr-3"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                           ></path>
                        </svg>
                        Post Job
                     </Link>
                  </li>
               </ul>
            </nav>
         </aside>

         {/* Main Content */}
         <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between bg-white shadow p-4">
               <h1 className="text-xl font-semibold text-blue-600">Dashboard</h1>
               <div className="relative">
                  <div
                     className="flex items-center space-x-4 cursor-pointer"
                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                     <span className="text-gray-700">{user.name}</span>
                     <img
                        src={user.profileImage}
                        alt="User Profile"
                        className="w-10 h-10 rounded-full"
                     />
                  </div>
                  {isDropdownOpen && (
                     <div
                        className="absolute right-4 mt-14 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                     >
                        {/* Close Button */}
                        <button
                           onClick={() => setIsDropdownOpen(false)}
                           className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </button>

                        {/* User Info */}
                        <div className="p-4 flex items-center">
                           <img
                              src={user.profileImage}
                              alt="User Profile"
                              className="w-16 h-16 rounded-full"
                           />
                           <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-700">
                                 {user.name}
                              </h3>
                              <p className="text-sm text-gray-500">{user.email}</p>
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-200">
                           <Link
                              to="/dashboard/profile/update"
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                           >
                              Edit Profile
                           </Link>
                           <button
                              onClick={handleSignOut}
                              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                           >
                              Sign Out
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </header>

            {/* Dynamic Content */}
            <main className="flex-1 p-6">
               <Outlet /> {/* This is where the child routes will render */}
            </main>
         </div>
      </div>
   );
};

export default Dashboard;

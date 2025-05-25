import React, { useState } from "react";
import { Link } from "react-router-dom";

const SidebarItem = ({ to, children, icon, requestCount, isSidebarOpen }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <li
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                to={to}
                className={`flex items-center px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-md ${!isSidebarOpen ? "justify-center" : ""
                    }`}
            >
                <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon}></path>
                </svg>
                {isSidebarOpen && children}
                {to === "/service-provider-dashboard/manage-services" && requestCount > 0 && isSidebarOpen && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {requestCount}
                    </span>
                )}
            </Link>
            {isHovered && !isSidebarOpen && (
                <div className="absolute left-full top-0 ml-2 bg-gray-100 border border-gray-300 rounded-md shadow-md p-2 text-sm whitespace-nowrap">
                    {children}
                </div>
            )}
        </li>
    );
};

const ServiceProviderSidebar = ({ requestCount }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <aside
            className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-20"
                }`}
            onMouseEnter={() => setIsSidebarOpen(true)}
            onMouseLeave={() => setIsSidebarOpen(false)}
        >
            <div className="p-6">
                {isSidebarOpen && (
                    <h2 className="text-2xl font-semibold text-blue-600">FixerHub</h2>
                )}
            </div>
            <nav className="mt-6">
                <ul className="space-y-2">
                    <SidebarItem
                        to="/service-provider-dashboard"
                        icon="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 21V9h6v12"
                        requestCount={requestCount}
                        isSidebarOpen={isSidebarOpen}
                    >
                        Dashboard
                    </SidebarItem>
                    <SidebarItem
                        to="/service-provider-dashboard/view-profile"
                        icon="M5 13l4 4L19 7"
                        isSidebarOpen={isSidebarOpen}
                    >
                        View Profile
                    </SidebarItem>
                    <SidebarItem
                        to="/service-provider-dashboard/manage-services"
                        icon="M4 7v10c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1zm11 3h-4v-2h4v2zm0 4h-4v-2h4v2zm-8-4H7v-2h2v2zm0 4H7v-2h2v2z"
                        requestCount={requestCount}
                        isSidebarOpen={isSidebarOpen}
                    >
                        Manage Services
                    </SidebarItem>
                    <SidebarItem
                        to="/service-provider-dashboard/job-history"
                        icon="M12 4v16m8-8H4"
                        isSidebarOpen={isSidebarOpen}
                    >
                        Job History
                    </SidebarItem>
                </ul>
            </nav>
        </aside>
    );
};

export default ServiceProviderSidebar;
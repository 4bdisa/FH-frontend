import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests

export function JobPostFlow() {
  const [step, setStep] = useState(1);
  const [jobDetails, setJobDetails] = useState({ description: "", category: "" });
  const [categories, setCategories] = useState([]); // State to hold categories
  const [providers, setProviders] = useState([]);
  const [sort, setSort] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({ longitude: null, latitude: null });
  const [media, setMedia] = useState([]); // State to store uploaded media URLs
  const [uploading, setUploading] = useState(false); // State to track uploading status

  // Cloudinary configuration
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to fetch categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData
      );

      if (response.status === 200) {
        return response.data.secure_url;
      } else {
        console.error("Cloudinary upload failed:", response);
        alert("Failed to upload media to Cloudinary.");
        return null;
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload media to Cloudinary.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array

    if (files.length === 0) return;

    setLoading(true); // Start loading

    try {
      const uploadPromises = files.map(async (file) => {
        return await uploadToCloudinary(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Filter out any failed uploads (null values)
      const validUrls = uploadedUrls.filter(url => url !== null);

      // Update the media state with validUrls
      setMedia(validUrls);
      
    } catch (error) {
      console.error("Media upload error:", error);
      alert("Failed to upload all media. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleJobDetailsSubmit = async () => {
    if (!jobDetails.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!jobDetails.category.trim()) {
      setError("Category is required");
      return;
    }

    setError("");

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          setLoading(true);
          
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/search-providers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
              description: jobDetails.description,
              category: jobDetails.category,
              customerLocation: [longitude, latitude],
              media: media,
              // Include media URLs in the request
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setProviders(data.providers || []);
          setStep(2);
        });
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      alert("Failed to fetch providers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = async (providerId) => {
    try {
      setLoading(true);
      

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/select-provider`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          providerId,
          description: jobDetails.description,
          category: jobDetails.category,
          location: { type: "Point", coordinates: [coordinates.longitude, coordinates.latitude] },
          budget: jobDetails.budget,
          isFixedPrice: jobDetails.isFixedPrice,
          media: media, // Include media URLs in the request
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // eslint-disable-next-line no-unused-vars
      const data = await response.json();

      setStep(3); // Move to the confirmation step
    } catch (error) {
      console.error("Error creating service request:", error);
      alert("Failed to create service request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sortedProviders = [...providers].sort((a, b) => {
    if (sort === "averageRating") return b.averageRating - a.averageRating;
    if (sort === "price") return a.hourlyRate - b.hourlyRate;
    if (sort === "experience") return b.experience - a.experience; // Sort by experience
    if (sort === "completedJobs") return b.completedJobs - a.completedJobs; // Sort by completed jobs
    if (sort === "distance") return a.distance - b.distance;
    return 0;
  });

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      {step === 1 && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4 text-center">
            Post a Job
          </h2>

          {/* Media Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Photos/Videos
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {uploading && <p className="text-gray-500">Uploading...</p>}
            {media.length > 0 && (
              <div className="mt-2 flex flex-wrap">
                {media.map((url, index) => (
                  <div key={index} className="w-24 h-24 m-1 relative">
                    {url.match(/.(jpeg|jpg|gif|png)$/) ? (
                      <img src={url} alt={`Uploaded media ${index}`} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <video src={url} alt={`Uploaded media ${index}`} className="w-full h-full object-cover rounded-md" controls />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown for Categories */}
          <select
            value={jobDetails.category}
            onChange={(e) => setJobDetails({ ...jobDetails, category: e.target.value })}
            className="w-full p-3 border border-blue-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>

          {/* Job Description */}
          <textarea
            placeholder="Enter job description..."
            value={jobDetails.description}
            onChange={(e) =>
              setJobDetails({ ...jobDetails, description: e.target.value })
            }
            className="w-full p-3 border border-blue-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            onClick={handleJobDetailsSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              "Find Providers"
            )}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl relative">
          {/* Back Button */}
          <button
            onClick={() => {
              setStep(1); // Go back to Step 1
              setLoading(false); // Reset loading state
            }}
            className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-100 text-blue-600 rounded-md shadow-md hover:bg-gray-200 transition"
          >
            <img
              src="https://img.icons8.com/?size=100&id=1DQ3UxqezXN2&format=png&color=000000"
              alt="Back"
              className="h-5 w-5 mr-2"
            />
            Back
          </button>

          <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            Select a Service Provider
          </h3>
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setSort("averageRating")}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
            >
              Sort by averageRating
            </button>
            <button
              onClick={() => setSort("price")}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
            >
              Sort by Price
            </button>
            <button
              onClick={() => setSort("completedJobs")}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
            >
              Sort by completed Jobs
            </button>
          </div>

          {sortedProviders && sortedProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedProviders.map((provider) => (
                <div
                  key={provider._id}
                  className="p-4 border border-blue-300 rounded-lg shadow-sm bg-blue-50"
                >
                  <h4 className="text-lg font-semibold text-blue-700">
                    {provider.email}
                  </h4>
                  
                  <p className="text-sm text-gray-700">
                    Hourly Rate: ${provider.hourlyRate}
                  </p>
                  <p className="text-sm text-gray-700">
                    Completed Jobs: {provider.completedJobs}
                  </p>
                  <p className="text-sm text-gray-700">
                    Distance: {provider.distance ? (provider.distance / 1000).toFixed(2) : "Not Available"} km
                  </p> {/* Display distance in kilometers */}
                  {/* Display Average Rating */}
                  {provider.averageRating !== undefined && (
                    <p className="text-sm text-gray-700">
                      Average Rating: {provider.averageRating.toFixed(2)}
                    </p>
                  )}
                  <button
                    onClick={() => handleProviderSelect(provider._id)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition"
                  >
                    Select Provider
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No providers found.</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Service Request Created Successfully!
          </h3>
          <p className="text-gray-700">
            Your service request has been sent to the selected provider. They will contact you soon.
          </p>
        </div>
      )}
    </div>
  );
}
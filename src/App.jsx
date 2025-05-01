import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./pages/SignIn";
import OAuthRedirect from "./pages/OAuthRedirect";
import ProtectedRoute from "./routes/ProtectedRoute";
import SelectRole from "./pages/auth/SelectRole";
import ServiceProviderForm from "./pages/auth/ServiceProviderForm";
import ClientRegistrationForm from "./pages/auth/client";
import Home from "./pages/home";
import { JobPostFlow } from "./pages/Jobs/PostJob";
import UpdateProfile from "./pages/Profile/UpdateProfile";
import LearnMore from "./pages/LearnMore";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ServiceProviderProfileUpdate from "./pages/Profile/ServiceProviderProfileUpdate";
import CustomerProfileUpdate from "./pages/Profile/CustomerProfileUpdate";
import ManageRequests from "./pages/Provider/ManageRequests";
import BrowseServices from "./pages/BrowseServices";
import JobHistory from "./pages/Jobs/JobHistory";
import AcceptedJobs from "./pages/Jobs/acceptedJobs";
import ChangeStateAndReview from "./pages/Jobs/ChangeStateAndReview";
import ProviderJobHistory from "./pages/Jobs/ProviderJobHistory";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/pages/SignIn" element={<SignIn />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/complete-service-provider" element={<ServiceProviderForm />} />
      <Route path="/complete-client" element={<ClientRegistrationForm />} />
      <Route path="/oauth/callback" element={<OAuthRedirect />} />
      <Route path="/learn-more" element={<LearnMore />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={["service_provider"]} />}>
        <Route path="/service-provider-dashboard" element={<ServiceProviderDashboard />}>
          <Route path="profile-update" element={<ServiceProviderProfileUpdate />} />
          <Route path="manage-services" element={<ManageRequests />} />
          <Route path="AcceptedJobs" element={<AcceptedJobs />} />
          <Route path="job-history" element={<ProviderJobHistory />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route path="/customer-dashboard" element={<CustomerDashboard />}>
          <Route index element={<BrowseServices />} />
          <Route path="profile-update" element={<CustomerProfileUpdate />} />
          <Route path="job-history" element={<JobHistory />} />
          <Route path="post-job" element={<JobPostFlow />} />
          <Route path="/customer-dashboard/job-history/:requestId/review" element={<ChangeStateAndReview />} />
        </Route>
        <Route path="/dashboard/jobs/post" element={<JobPostFlow />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["service_provider", "client"]} />}>
        <Route path="/dashboard/profile/update" element={<UpdateProfile />} />
      </Route>
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
  </BrowserRouter>
);

export default App;

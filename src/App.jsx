import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import OAuthRedirect from "./pages/OAuthRedirect";
import ProtectedRoute from "./routes/ProtectedRoute";
import SelectRole from "./pages/auth/SelectRole";
import ServiceProviderForm from "./pages/auth/ServiceProviderForm";
import ClientRegistrationForm from "./pages/auth/client";
import Home from "./pages/home";
import { JobPostFlow } from "./pages/Jobs/PostJob";
import UpdateProfile from "./pages/Profile/UpdateProfile";
import LearnMore from "./pages/LearnMore";
 
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pages/SignIn" element={<SignIn />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/complete-service-provider" element={<ServiceProviderForm />} />
      <Route path="/complete-client" element={<ClientRegistrationForm />} />
      <Route path="/oauth/callback" element={<OAuthRedirect />} />
      <Route path="/learn-more" element={<LearnMore />} />

      {/* Dashboard Layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<div>Welcome to the Dashboard!</div>} />
          <Route path="jobs/post" element={<JobPostFlow />} />
          <Route path="profile/update" element={<UpdateProfile />} />
        </Route>
      </Route>
    </Routes>
  </Router>
);

export default App;

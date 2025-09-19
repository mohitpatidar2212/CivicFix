import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/CitizenDashboard";  // New unified dashboard
import ReportDetails from "./pages/ReportDetails";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import { setAuthToken } from "./api/apiClient";
import ReportForm from "./components/ReportForm";
import ComplaintsPage from "./pages/ComplaintsPage";
import ResolvedCasesPage from "./pages/ResolvedCasesPage";

const token = localStorage.getItem("token");
if (token) setAuthToken(token);

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Citizen routes */}
          <Route path="profile" element={<Profile />} />
          <Route path="report" element={<ReportForm />} />

          {/* Authority routes */}
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="resolved" element={<ResolvedCasesPage />} />

          {/* Shared */}
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Shared details route */}
        <Route path="/report/:id" element={<ReportDetails />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

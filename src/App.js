import React from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AddCollectionPoint from "./pages/AddCollectionPoint";
import AddDonation from "./pages/AddDonation";
import DonationsList from "./pages/DonationsList";

function RequireAuth({ children }) {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RequireAdmin({ children }) {
  const userInfoJson = localStorage.getItem("userInfo");
  if (!userInfoJson) return <Navigate to="/login" replace />;

  const userInfo = JSON.parse(userInfoJson);
  if (userInfo.role !== "Admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function Dashboard() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>SL UK Aid – Dashboard</h1>
      <p>
        Welcome, {userInfo.fullName} ({userInfo.role})
      </p>

      <div style={{ marginTop: "1.5rem" }}>
        <p>
          <Link to="/donations/new">➕ Add Donation</Link>
        </p>
        <p>
          <Link to="/donations">📋 View Donations</Link>
        </p>
        {userInfo.role === "Admin" && (
          <p>
            <Link to="/collection-points/new">🏛️ Add Collection Center</Link>
          </p>
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "2rem",
          padding: "0.4rem 0.9rem",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
          background: "#f9fafb",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/collection-points/new"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AddCollectionPoint />
            </RequireAdmin>
          </RequireAuth>
        }
      />
      <Route
        path="/donations/new"
        element={
          <RequireAuth>
            <AddDonation />
          </RequireAuth>
        }
      />
      <Route
        path="/donations"
        element={
          <RequireAuth>
            <DonationsList />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;

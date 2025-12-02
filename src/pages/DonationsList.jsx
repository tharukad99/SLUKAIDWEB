// src/pages/DonationsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../apiClient";


function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString();
}

function DonationsList() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isAdmin = userInfo.role === "Admin";

  const loadDonations = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const res = await api.get("/Donations", { params });
      setDonations(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    loadDonations();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "white",
          padding: "1.5rem 2rem",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Donations</h2>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              {isAdmin
                ? "Viewing all donations (filtered by date)."
                : "Viewing donations for your collection center."}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ marginBottom: "0.3rem" }}>
              <Link to="/donations/new">➕ Add Donation</Link>
            </p>
            <p>
              <Link to="/">← Back to Dashboard</Link>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleFilter}
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-end",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label
              htmlFor="fromDate"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              From date
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                padding: "0.35rem 0.6rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="toDate"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              To date
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                padding: "0.35rem 0.6rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: "1.3rem",
            }}
          >
            {loading ? "Loading..." : "Apply Filter"}
          </button>
        </form>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Donor</th>
                <th style={thStyle}>Item</th>
                <th style={thStyle}>Qty</th>
                <th style={thStyle}>Weight (kg)</th>
                <th style={thStyle}>Center</th>
                <th style={thStyle}>Collected By</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 && !loading && (
                <tr>
                  <td colSpan="7" style={{ padding: "1rem", textAlign: "center" }}>
                    No donations found.
                  </td>
                </tr>
              )}
              {donations.map((d) => (
                <tr key={d.donationId} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={tdStyle}>{formatDate(d.collectedAt)}</td>
                  <td style={tdStyle}>
                    <div>{d.donorName}</div>
                    {d.donorEmail && (
                      <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {d.donorEmail}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>{d.itemDescription}</td>
                  <td style={tdStyle}>{d.quantity ?? "-"}</td>
                  <td style={tdStyle}>{d.weightKg ?? "-"}</td>
                  <td style={tdStyle}>{d.collectionPointName}</td>
                  <td style={tdStyle}>{d.collectedByName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "0.5rem 0.75rem",
  borderBottom: "1px solid #e5e7eb",
};

const tdStyle = {
  padding: "0.5rem 0.75rem",
  verticalAlign: "top",
};

export default DonationsList;

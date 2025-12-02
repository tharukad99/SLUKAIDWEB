// src/pages/AddCollectionPoint.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../apiClient";

function AddCollectionPoint() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/CollectionPoints", {
        name,
        address,
        district,
        phone,
        isActive,
      });

      setSuccess("Collection center created successfully.");
      // reset form
      setName("");
      setAddress("");
      setDistrict("");
      setPhone("");
      setIsActive(true);

      // optional: redirect back to dashboard after short delay
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response && err.response.status === 403) {
        setError("You do not have permission to create collection centers.");
      } else {
        setError("Something went wrong while saving. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        justifyContent: "center",
        paddingTop: "3rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
          <h2>Add Collection Center</h2>
          <Link to="/" style={{ fontSize: "0.9rem" }}>
            ← Back to Dashboard
          </Link>
        </div>

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

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Center Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="address"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="district"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              District
            </label>
            <input
              id="district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="phone"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            <label htmlFor="isActive">Active collection center</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Save Center"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCollectionPoint;

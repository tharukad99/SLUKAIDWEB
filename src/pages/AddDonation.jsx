// src/pages/AddDonation.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../apiClient";
import { sendDonationEmail } from "../emailService";


function AddDonation() {
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [notes, setNotes] = useState("");

  const [collectionPointId, setCollectionPointId] = useState("");
  const [collectionPoints, setCollectionPoints] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isAdmin = userInfo.role === "Admin";

  useEffect(() => {
    // Only admins need to load the list of collection centers
    if (isAdmin) {
      (async () => {
        try {
          const res = await api.get("/CollectionPoints");
          setCollectionPoints(res.data || []);
        } catch (err) {
          console.error(err);
          setError("Failed to load collection centers.");
        }
      })();
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        donorName,
        donorEmail: donorEmail || null,
        donorPhone: donorPhone || null,
        itemDescription,
        quantity: quantity ? parseInt(quantity, 10) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        notes: notes || null,
      };

      if (isAdmin && collectionPointId) {
        payload.collectionPointId = parseInt(collectionPointId, 10);
      }

      await api.post("/Donations", payload);

      setSuccess("Donation recorded successfully.");

        try {
        const response = await api.post("/Donations", payload);

        // If donor email exists, send receipt
        if (donorEmail) {
            await sendDonationEmail({
            donor_name: donorName,
            donor_email: donorEmail,
            item_description: itemDescription,
            quantity: quantity || "-",
            weight: weightKg || "-",
            collection_center: isAdmin
                ? collectionPoints.find(x => x.collectionPointId == collectionPointId)?.name
                : userInfo.collectionPointName,
            collected_at: new Date().toLocaleString()
            });
        }

        setSuccess("Donation recorded and email sent!");
        } catch (err) {
        setError("Failed to save donation.");
        }


      // reset form
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setItemDescription("");
      setQuantity("");
      setWeightKg("");
      setNotes("");
      if (isAdmin) setCollectionPointId("");

      // Optional redirect after short delay
      setTimeout(() => navigate("/donations"), 800);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError(err.response.data || "Invalid data. Please check the form.");
      } else if (err.response && err.response.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response && err.response.status === 403) {
        setError("You do not have permission to add donations.");
      } else {
        setError("Failed to save donation. Please try again.");
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
          maxWidth: "700px",
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2>Add Donation</h2>
          <Link to="/donations" style={{ fontSize: "0.9rem" }}>
            ← Back to Donations
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
              htmlFor="donorName"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Donor Name *
            </label>
            <input
              id="donorName"
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label
                htmlFor="donorEmail"
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                Donor Email
              </label>
              <input
                id="donorEmail"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="donorPhone"
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                Donor Phone
              </label>
              <input
                id="donorPhone"
                type="text"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
          </div>

          {isAdmin && (
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="collectionPoint"
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                Collection Center *
              </label>
              <select
                id="collectionPoint"
                value={collectionPointId}
                onChange={(e) => setCollectionPointId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              >
                <option value="">-- Select Center --</option>
                {collectionPoints.map((cp) => (
                  <option key={cp.collectionPointId} value={cp.collectionPointId}>
                    {cp.name} ({cp.district})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="itemDescription"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Item Description *
            </label>
            <input
              id="itemDescription"
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label
                htmlFor="quantity"
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="weightKg"
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                Weight (kg)
              </label>
              <input
                id="weightKg"
                type="number"
                min="0"
                step="0.01"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="notes"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                resize: "vertical",
              }}
            />
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
            {loading ? "Saving..." : "Save Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ClaimHistory.css"; // Import the CSS file
import { FaTags, FaUserShield, FaCog, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
const ClaimHistory = () => {
  const { token,logout } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect if not authenticated
      return;
    }

    const fetchClaims = async () => {
      try {
        const res = await fetch("https://round-robin-backend-liard.vercel.app/api/admin/claims", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch claim history.");
        }

        const data = await res.json();
        setClaims(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [token, navigate]);

  if (loading) return <p className="loading-message">Loading claim history...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="dashboard-container">
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <a href="/dashboard">
          <FiHome /> Dashboard
        </a>
        <a href="/coupons">
          <FaTags /> Manage Coupons
        </a>
        <a href="/claims">
          <FaUserShield /> Claim History
        </a>
      
        <button onClick={logout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </div>
  
    <div className="main-content">
      <div className="claim-history-container">
        <h2 className="claim-history-title">Claim History</h2>
        {claims.length ? (
          <ul className="claim-list">
            {claims.map((claim) => (
              <li key={claim._id} className="claim-item">
                <strong>Coupon:</strong> {claim.code} | 
                <strong> Time:</strong> {new Date(claim.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-history">No claim history available.</p>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default ClaimHistory;

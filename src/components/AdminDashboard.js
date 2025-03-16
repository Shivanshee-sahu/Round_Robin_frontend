import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaTags, FaUserShield, FaCog, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [message, setMessage] = useState("Loading dashboard..."," ");
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetch("http://localhost:5000/api/admin/coupons", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch coupons.");
      }

      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCoupons();
    }
  }, [token, navigate]);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetch("http://localhost:5000/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCoupon),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add coupon.");
      }

      setNewCoupon({ code: "", discount: "" });
      fetchCoupons(); // Refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 >Admin Dashboard</h1>
        <p>{setMessage}</p>
        <div className="coupon-section">
          <div className="coupon-header">
            <h3>Add Coupon</h3>
          </div>
          <form onSubmit={handleAddCoupon}>
            <input
              type="text"
              placeholder="Coupon Code"
              value={newCoupon.code}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, code: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Discount"
              value={newCoupon.discount}
              onChange={(e) =>
                setNewCoupon({ ...newCoupon, discount: e.target.value })
              }
              required
            />
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Coupon"}
            </button>
          </form>
          {loading && <p>Loading coupons...</p>}
          {error && <p className="error">{error}</p>}
          {coupons.length > 0 && (
            <table className="coupon-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.code}</td>
                    <td>{coupon.discount}%</td>
                    <td
                      className={coupon.isClaimed ? "claimed" : "available"}
                    >
                      {coupon.isClaimed ? "Claimed" : "Available"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
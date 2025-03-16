import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './Coupon.css';
import { FaTags, FaUserShield, FaSignOutAlt,  } from "react-icons/fa";
import { FiHome } from "react-icons/fi";

const CouponList = () => {
  const { token,logout } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "" });
  const [editCoupon, setEditCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/admin/coupons", { // Corrected endpoint
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
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCoupon),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add coupon.");
      }

      setNewCoupon({ code: "", discount: "" });
      fetchCoupons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCoupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/coupons/${editCoupon._id}`, // Corrected endpoint
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            discount: editCoupon.discount,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update coupon.");
      }

      setEditCoupon(null);
      fetchCoupons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/coupons/${id}`, { // Corrected endpoint
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete coupon.");
      }

      fetchCoupons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClaim = async (id, currentStatus) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/coupons/${id}/availability`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isClaimed: !currentStatus }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update claim status.");
      }

      fetchCoupons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading coupons...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="coupon-list-container">
      <div className="sidebar">
        <h3>Admin Panel</h3>
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
        
        <h2>Manage Coupons</h2>

        <form onSubmit={handleAddCoupon}>
          <input
            type="text"
            placeholder="Coupon Code"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Discount"
            value={newCoupon.discount}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, discount: e.target.value })
            }
            required
          />
          <button type="submit">Add Coupon</button>
        </form>

        {editCoupon && (
          <form onSubmit={handleEditCoupon}>
            <input
              type="text"
              value={editCoupon.code}
              onChange={(e) =>
                setEditCoupon({ ...editCoupon, code: e.target.value })
              }
              required
              disabled
            />
            <input
              type="number"
              value={editCoupon.discount}
              onChange={(e) =>
                setEditCoupon({ ...editCoupon, discount: e.target.value })
              }
              required
            />
            <button type="submit">Update</button>
            <button onClick={() => setEditCoupon(null)}>Cancel</button>
          </form>
        )}

        <table className="coupon-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.discount}%</td>
                <td>{coupon.isClaimed ? "Claimed" : "Available"}</td>
                <td>
                  <div className="button-container">
                    <button onClick={() => setEditCoupon({ ...coupon })}>Edit</button>
                    <button onClick={() => handleDeleteCoupon(coupon._id)}>Delete</button>
                    <button onClick={() => handleToggleClaim(coupon._id, coupon.isClaimed)}>
                      {coupon.isClaimed ? "Mark Available" : "Claim"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponList;
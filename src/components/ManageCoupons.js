import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ManageCoupons = () => {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState("");

  useEffect(() => {
    fetch("https://round-robin-backend-liard.vercel.app/api/admin/coupons", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setCoupons);
  }, [token]);

  const addCoupon = async () => {
    if (!newCoupon) return;

    const res = await fetch("https://round-robin-backend-liard.vercel.app/api/admin/coupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: newCoupon }),
    });

    const data = await res.json();
    if (res.ok) {
      setCoupons([...coupons, data]); // Update the list
      setNewCoupon(""); // Clear input
    }
  };

  return (
    <div>
      <h2>Manage Coupons</h2>

      <input
        type="text"
        value={newCoupon}
        onChange={(e) => setNewCoupon(e.target.value)}
        placeholder="Enter Coupon Code"
      />
      <button onClick={addCoupon}>Add Coupon</button>

      <ul>
        {coupons.map(coupon => (
          <li key={coupon._id}>
            {coupon.code} - {coupon.isClaimed ? "Claimed" : "Available"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCoupons;

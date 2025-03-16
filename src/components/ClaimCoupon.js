import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './ClaimCoupon.css'; // Import CSS file

const ClaimCoupon = () => {
   const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rolling, setRolling] = useState(false); // New state for rolling animation
  const handleGoBack = () => {
    navigate('/'); // Redirect to the login page
  };
  const handleClaim = async () => {
    setLoading(true);
    setMessage('');
    setCouponCode('');
    setDiscount(null);
    setError('');
    setRolling(true); // Start rolling animation

    try {
      const response = await fetch('https://round-robin-backend-liard.vercel.app/api/coupons/claim');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim coupon.');
      }

      const data = await response.json();

      setTimeout(() => { // Delay to simulate rolling effect
        setMessage(data.message);
        setCouponCode(data.coupon);
        setDiscount(data.Discount);
        setRolling(false); // Stop rolling animation
      }, 2000); // 2 seconds delay
    } catch (err) {
      setError(err.message);
      setRolling(false); // Stop rolling animation on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-coupon-container">
         <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
      <h1>Claim Your Coupon</h1>
      <button onClick={handleClaim} disabled={loading || rolling} className="claim-coupon-button">
        {loading || rolling ? <div className="rolling-wheel"></div> : 'Claim Coupon'}
      </button>

      {message && (
        <div className="success-message">
          <p>{message}</p>
          {couponCode && <p>Your Coupon Code: {couponCode}</p>}
          {discount !== null && <p>Discount: {discount}%</p>}
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ClaimCoupon;
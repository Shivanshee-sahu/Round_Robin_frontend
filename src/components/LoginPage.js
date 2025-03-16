import { useState,useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './LoginPage.css'




const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const [scale, setScale] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for increasing, -1 for decreasing

useEffect(() => {
  const interval = setInterval(() => {
    setScale((prevScale) => {
      let newScale = prevScale + 0.02 * direction;

      if (newScale >= 1.2) {
        setDirection(-1);
        newScale = 1.2;
      } else if (newScale <= 1) {
        setDirection(1);
        newScale = 1;
      }

      return newScale;
    });
  }, 100); // Adjust interval for speed

  return () => clearInterval(interval);
}, [direction]);
  const navigate = useNavigate();


  const handleClaimCouponClick = () => {
    navigate('/claim');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(username, password);

    if (data.success) {
      setTimeout(() => navigate("/dashboard"), 100); // Redirect after 1s
    } else {
      setMessage(data.message);
    }
  };

  return (
    <section className="container">
    <div className="login-container">
      <div className="circle circle-one"></div>
      <div className="form-container">
        <img
          src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
          alt="illustration"
          className="illustration"
        />
        <h2 className="opacity" style={{ color: "black" }}>Login As Admin</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            required
          />
          <button className="opacity" type="submit">
            SUBMIT
          </button>
        </form>
     
      </div>
      <div className="circle circle-two"></div>
    </div>
    <div className="theme-btn-container">
        <button
          className="claim-coupon-btn"
          onClick={handleClaimCouponClick}
          style={{ transform: `scale(${scale})` }}
        >
        Claim Coupon
        <br />
        <span style={{ fontSize: '0.8em' }}> (Click Here)</span>
          
        </button>
       
      </div>
      {message && <p className="message">{message}</p>}
    </section>
  );
};

export default LoginPage;
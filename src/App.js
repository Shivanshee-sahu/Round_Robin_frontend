import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import CouponList from "./components/CouponList";
import ClaimHistory from "./components/ClaimHistory";
import ClaimCoupon from "./components/ClaimCoupon";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/coupons" element={<CouponList />} />
          <Route path="/claims" element={<ClaimHistory />} />
          <Route path="/claim" element={<ClaimCoupon />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

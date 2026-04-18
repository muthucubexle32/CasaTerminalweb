import { Navigate, Outlet } from 'react-router-dom';

const MemberRoute = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');

  // If user is logged in as a business user, redirect to their dashboard
  if (isLoggedIn && (userType === 'seller' || userType === 'contractor' || userType === 'rental')) {
    switch (userType) {
      case 'seller': return <Navigate to="/seller/dashboard" replace />;
      case 'contractor': return <Navigate to="/contractor/dashboard" replace />;
      case 'rental': return <Navigate to="/rental/dashboard" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  // For customers or non‑logged‑in users, allow access to registration page
  return <Outlet />;
};

export default MemberRoute;
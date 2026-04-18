import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedTypes?: string[];
}

const ProtectedRoute = ({ allowedTypes }: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');

  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }


  if (userType === 'customer') {
    return <Navigate to="/" replace />;
  }


  if (allowedTypes && !allowedTypes.includes(userType || '')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
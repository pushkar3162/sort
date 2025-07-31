import { Outlet, Navigate } from 'react-router-dom';

const ProtectedLayout = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // This will render any nested routes
};

export default ProtectedLayout;
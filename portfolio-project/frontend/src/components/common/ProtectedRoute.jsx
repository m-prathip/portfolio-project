import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../common/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <PageLoader />;
  return isAuth ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;

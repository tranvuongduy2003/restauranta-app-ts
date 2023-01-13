import { useAppSelector } from 'app/hooks';
import { useLocation, Navigate } from 'react-router-dom';
import Layout from 'pages/Dashboard/Layout';
import { useEffect, useState } from 'react';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const user = useAppSelector((state) => state.user);
  const [node, setNode] = useState(<></>);
  useEffect(() => {
    if (user.admin) {
      setNode(<Layout></Layout>);
    } else {
      setNode(<Navigate to="/login" state={{ from: location }} replace />);
    }
  }, [user, location]);

  return node;
};

export default ProtectedRoute;

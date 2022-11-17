import { useAppSelector } from 'app/hooks';
import { useLocation, Navigate } from 'react-router-dom';
import Layout from 'pages/Dashboard/Layout';
import { useEffect, useState } from 'react';

const ProtectedRoute: React.FC<{ allowPermission: string }> = ({
  allowPermission,
}) => {
  const location = useLocation();
  const user = useAppSelector((state) => state.user);
  // const [userPermission, setUserPermission] = useState('');
  const [node, setNode] = useState(<></>);
  useEffect(() => {
    // setUserPermission(user.role);
    if (allowPermission === user.role) {
      setNode(<Layout></Layout>);
    } else {
      setNode(<Navigate to="/login" state={{ from: location }} replace />);
    }
  }, [user, allowPermission, location]);

  // return userPermission === allowPermission ? (
  //   <Layout></Layout>
  // ) : (
  //   <Navigate to="/login" state={{ from: location }} replace />
  // );

  return node;
};

export default ProtectedRoute;

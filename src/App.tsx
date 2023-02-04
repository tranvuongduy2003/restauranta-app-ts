import React, { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from 'components/ProtectedRoute';
import BookingPage from 'pages/BookingPage/BookingPage';
import OrderPage from 'pages/OrderPage/OrderPage';
import RolesPage from 'pages/RolesPage/RolesPage';
const PageNotFound = lazy(() => import('pages/PageNotFound/PageNotFound'));
const LoginPage = lazy(() => import('pages/LoginPage/LoginPage'));
const CategoryPage = lazy(() => import('pages/CategoryPage/CategoryPage'));
const FoodPage = lazy(() => import('pages/FoodPage/FoodPage'));
const UserPage = lazy(() => import('pages/UserPage/UserPage'));
const HomePage = lazy(() => import('pages/HomePage/HomePage'));

const App: React.FC = () => {
  return (
    <Fragment>
      <ToastContainer />
      <Suspense>
        <Routes>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/roles" element={<RolesPage></RolesPage>}></Route>
            <Route
              path="/category"
              element={<CategoryPage></CategoryPage>}
            ></Route>
            <Route path="/food" element={<FoodPage></FoodPage>}></Route>
            <Route path="/user" element={<UserPage></UserPage>}></Route>
            <Route
              path="/booking"
              element={<BookingPage></BookingPage>}
            ></Route>
            <Route path="/orders" element={<OrderPage></OrderPage>}></Route>
            <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          </Route>
          <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        </Routes>
      </Suspense>
    </Fragment>
  );
};

export default App;

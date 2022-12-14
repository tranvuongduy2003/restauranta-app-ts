import React, { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from 'components/ProtectedRoute';
import CategoryAddNew from 'pages/CategoryPage/CategoryAddNew';
import DeletedFoodPage from 'pages/FoodPage/DeletedFoodPage';
import DeletedCategoryPage from 'pages/CategoryPage/DeletedCategoryPage';
import DeletedUserPage from 'pages/UserPage/DeletedUserPage';
import BookingPage from 'pages/BookingPage/BookingPage';
import OrderPage from 'pages/OrderPage/OrderPage';
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
          <Route
            element={<ProtectedRoute allowPermission="admin"></ProtectedRoute>}
          >
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route
              path="/category"
              element={<CategoryPage></CategoryPage>}
            ></Route>
            <Route
              path="/category/deleted"
              element={<DeletedCategoryPage></DeletedCategoryPage>}
            ></Route>
            <Route
              path="/category/add-new"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route path="/food" element={<FoodPage></FoodPage>}></Route>
            <Route
              path="/food/deleted"
              element={<DeletedFoodPage></DeletedFoodPage>}
            ></Route>
            <Route path="/user" element={<UserPage></UserPage>}></Route>
            <Route
              path="/user/deleted"
              element={<DeletedUserPage></DeletedUserPage>}
            ></Route>
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

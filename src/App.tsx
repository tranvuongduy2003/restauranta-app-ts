import React, { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from 'components/ProtectedRoute';
const PageNotFound = lazy(() => import('pages/PageNotFound/PageNotFound'));
const LoginPage = lazy(() => import('pages/LoginPage/LoginPage'));
const CategoryPage = lazy(() => import('pages/CategoryPage/CategoryPage'));
const FoodPage = lazy(() => import('pages/FoodPage/FoodPage'));
const UserPage = lazy(() => import('pages/UserPage/UserPage'));
const HomePage = lazy(() => import('pages/HomePage/HomePage'));
const CategoryAddNew = lazy(() => import('pages/CategoryPage/CategoryAddNew'));

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
              path="/category/add-new"
              element={<CategoryAddNew></CategoryAddNew>}
            ></Route>
            <Route path="/food" element={<FoodPage></FoodPage>}></Route>
            <Route path="/user" element={<UserPage></UserPage>}></Route>
          </Route>
          <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
        </Routes>
      </Suspense>
    </Fragment>
  );
};

export default App;

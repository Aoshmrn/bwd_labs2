import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from '../components/Loading/Loading';
import { PrivateRoute } from '../components/PrivateRoute/PrivateRoute';

const Home = React.lazy(() => import('../pages/Home/Home'));
const Events = React.lazy(() => import('../pages/Events/Events'));
const Login = React.lazy(() => import('../pages/Login/Login'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const Profile = React.lazy(() => import('../pages/Profile/Profile'));
const MyEvents = React.lazy(() => import('../pages/MyEvents/MyEvents'));
const NotFound = React.lazy(() => import('../pages/NotFound/NotFound'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <PrivateRoute>
              <MyEvents />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
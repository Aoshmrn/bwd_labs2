import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loading } from '../components/Loading/Loading';
import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute/AdminRoute';
import { Layout } from '../components/Layout/Layout';

const Home = React.lazy(() => import('../pages/Home/Home'));
const Events = React.lazy(() => import('../pages/Events/Events'));
const Login = React.lazy(() => import('../pages/Login/Login'));
const Register = React.lazy(() => import('../pages/Register/Register'));
const Profile = React.lazy(() => import('../pages/Profile/Profile'));
const MyEvents = React.lazy(() => import('../pages/MyEvents/MyEvents'));
const Users = React.lazy(() => import('../pages/Users/Users'));
const NotFound = React.lazy(() => import('../pages/NotFound/NotFound'));
const EventForm = React.lazy(() => import('../pages/Events/components/EventForm/EventForm'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          {/* Публичные маршруты */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Защищенные маршруты */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="/event/new" element={<EventForm />} />
            <Route path="/event/:id/edit" element={<EventForm />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
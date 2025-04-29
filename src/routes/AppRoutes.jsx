import { Routes, Route } from 'react-router-dom';
import  ProtectedRoute  from '../components/common/ProtectedRoute';
import  AdminRoute  from '../components/common/AdminRoute';
import Layout from '../components/common/Layout';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import Profile from '../pages/profile/Profile';
import Users from '../pages/users/Users';
import Home from '../pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route element={<AdminRoute />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
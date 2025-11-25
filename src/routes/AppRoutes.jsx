// src/AppRoutes.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Layout from '../layouts/Layout'
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import CourseDetail from '../pages/CourseDetail'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Login from '../pages/auth/Login'
import Signup from '../pages/auth/Signup'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import Dashboard from '../pages/dashboard/Dashboard'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsOfService from '../pages/TermsOfService'
import SetPassword from '../pages/auth/SetPassword'

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Signup />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="/set-password/:email" element={<SetPassword />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect old student dashboard URL */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default AppRoutes

// src/layouts/Layout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../layouts/Header'
import Footer from '../layouts/Footer'
// import Header from '../components/Header'
// import Footer from '../components/Footer'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
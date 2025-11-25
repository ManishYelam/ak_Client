// src/components/layout/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Learn SAP ABAP</h1>
                <p className="text-primary-200 text-sm">with Akshay</p>
              </div>
            </Link>
            <p className="text-primary-200 mb-4 max-w-md">
              Transform your career with comprehensive SAP ABAP training. Learn from certified
              professionals and get job-ready in just 3 months.
            </p>
            <div className="flex items-center space-x-4 text-primary-200">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>akshay@sapabap.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-primary-200 hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-primary-200 hover:text-white transition-colors">
                  Book Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/courses/sap-abap-beginner"
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  SAP ABAP Beginner
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/sap-abap-advanced"
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  SAP ABAP Advanced
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/abap-on-hana"
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  ABAP on HANA
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/oo-abap"
                  className="text-primary-200 hover:text-white transition-colors"
                >
                  OO ABAP
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-200 text-sm">
            © 2024 Learn SAP ABAP with Akshay. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-primary-200 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-primary-200 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

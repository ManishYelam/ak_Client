import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaArrowUp,
  FaCheck,
  FaBalanceScale,
  FaAward,
  FaFileAlt,
  FaUserFriends,
  FaShieldAlt,
  FaClock,
  FaEnvelope
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { submitContactForm } from "../services/contactService"; // Import your contact service

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare the data for API submission
      const contactData = {
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone || "", // Optional field
        subject: "Landing Page Contact Form Submission" // Default subject
      };

      // Submit to your backend API
      const response = await submitContactForm(contactData);

      // Check if the submission was successful
      if (response.data && response.data.success) {
        toast.success("🎉 Message sent successfully! We'll get back to you soon.");
        reset();
      } else {
        throw new Error(response.data?.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Server error occurred";
        toast.error(`❌ ${errorMessage}`);
      } else if (error.request) {
        // Network error
        toast.error("❌ Network error. Please check your connection and try again.");
      } else {
        // Other errors
        toast.error("❌ Failed to send message. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FaFileAlt,
      title: "Easy Application Process",
      description: "Simple and straightforward application form that takes just minutes to complete.",
      benefits: ["Quick Submission", "User-Friendly Interface", "Instant Confirmation"]
    },
    {
      icon: FaUserFriends,
      title: "Expert Legal Assistance",
      description: "Get guidance from experienced legal professionals throughout your application.",
      benefits: ["Legal Expertise", "Personal Support", "Case Evaluation"]
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Confidential",
      description: "Your information is protected with bank-level security and complete confidentiality.",
      benefits: ["Data Encryption", "Privacy Protected", "Secure Processing"]
    },
    {
      icon: FaClock,
      title: "Quick Processing",
      description: "Fast application review and processing to get you the help you need promptly.",
      benefits: ["Rapid Review", "Timely Updates", "Efficient Service"]
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Fill Application Form",
      description: "Complete our simple online application form with your details and case information."
    },
    {
      step: "02",
      description: "Our legal team reviews your application and assesses your case requirements."
    },
    {
      step: "03",
      title: "Get Expert Assistance",
      description: "Receive professional legal guidance and support tailored to your specific situation."
    },
    {
      step: "04",
      title: "Case Progress Tracking",
      description: "Monitor your application status and case progress through our secure portal."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Client",
      content: "The application process was incredibly smooth. I got the legal help I needed within hours of submitting my form!",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Applicant",
      content: "Very professional and efficient service. The team guided me through every step of the process.",
      rating: 5
    },
    {
      name: "Amit Patel",
      role: "Client",
      content: "I was nervous about the legal process, but the simple application form made everything easy to understand.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <FaBalanceScale className="text-green-700 text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif">Satyamev Jayate</h1>
                <p className="text-xs text-green-200">Justice Management System</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-green-200 transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-green-200 transition-colors">
                About
              </Link>
              <Link to="/apply" className="text-sm font-medium hover:text-green-200 transition-colors">
                Apply Now
              </Link>
              <Link to="/contact" className="text-sm font-medium hover:text-green-200 transition-colors">
                Contact
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-green-800 bg-white rounded-lg hover:bg-gray-100 transition-all shadow-md"
              >
                Login
              </Link>
              <Link
                to="/apply"
                className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-all shadow-md"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <FaFileAlt className="text-yellow-400" />
              <span className="text-sm font-medium">1000+ Applications Processed</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Get Legal Assistance
              <span className="text-yellow-400 block">Made Simple</span>
            </h1>

            <p className="text-xl lg:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Start your journey to justice with our easy-to-use application form.
              Get expert legal guidance in just a few simple steps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/apply"
                className="px-8 py-4 bg-yellow-400 text-green-900 font-bold rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-2xl text-lg flex items-center justify-center space-x-2"
              >
                <FaFileAlt />
                <span>Start Application</span>
              </Link>
              <a
                href="#process"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-900 transition-all transform hover:scale-105 text-lg"
              >
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-700 mb-2">1000+</div>
              <div className="text-gray-600 text-sm">Applications Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700 mb-2">24h</div>
              <div className="text-gray-600 text-sm">Average Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700 mb-2">95%</div>
              <div className="text-gray-600 text-sm">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700 mb-2">50+</div>
              <div className="text-gray-600 text-sm">Legal Experts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-green-900 mb-4">
              Why Apply With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've made the legal application process simple, secure, and accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 text-center"
              >
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="text-green-700 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2 text-left">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-green-700">
                      <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600">
              Getting legal assistance has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  {step.title || `Step ${step.step}`}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/apply"
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg text-lg inline-flex items-center space-x-2"
            >
              <FaFileAlt />
              <span>Begin Your Application</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from people who found legal solutions through our application process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaAward key={i} className="text-lg" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-green-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Don't wait to get the legal assistance you need. Our simple application process is designed to help you quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/apply"
              className="px-8 py-4 bg-white text-green-700 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg inline-flex items-center justify-center space-x-2"
            >
              <FaFileAlt />
              <span>Start Application Now</span>
            </Link>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-green-700 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Have Questions?
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Need Help With Your Application?
            </h2>
            <p className="text-lg text-gray-600">
              Our support team is here to help you with any questions about the application process.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg border border-green-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                      }
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Your Email *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone Number (Optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                    {...register("phone", {
                      pattern: {
                        value: /^[\+]?[0-9\s\-\(\)]{10,}$/,
                        message: "Please enter a valid phone number"
                      }
                    })}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    value="Application Help Request"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <textarea
                  placeholder="How can we help you with your application? *"
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all resize-none"
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters"
                    },
                    maxLength: {
                      value: 1000,
                      message: "Message must be less than 1000 characters"
                    }
                  })}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
                <div className="text-sm text-gray-500 mt-1">
                  Please describe your question or concern in detail so we can better assist you.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Your Message...</span>
                  </>
                ) : (
                  <>
                    <FaEnvelope />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>We typically respond within 24 hours</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-900 to-green-700 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <FaBalanceScale className="text-2xl text-yellow-400" />
                <span className="text-xl font-bold font-serif">Satyamev Jayate</span>
              </div>
              <p className="text-green-100 mb-6">
                Making legal assistance accessible to everyone through our simple and secure application process.
              </p>
              <div className="flex space-x-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-green-200 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Access</h3>
              <ul className="space-y-3 text-green-100">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Get Help</h3>
              <ul className="space-y-3 text-green-100">
                <li className="flex items-center space-x-2">
                  <FaEnvelope className="text-yellow-400" />
                  <span>support@satyamevjayate.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaWhatsapp className="text-yellow-400" />
                  <span>+91 93732 00525</span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaClock className="text-yellow-400" />
                  <span>24/7 Application Support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-green-600 pt-8 text-center">
            <p className="text-green-200 text-sm">
              © {new Date().getFullYear()} Satyamev Jayate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={import.meta.env.VITE_WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
        aria-label="Get help with your application on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </a>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LandingPage;
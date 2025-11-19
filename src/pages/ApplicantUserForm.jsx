import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { showErrorToast, showSuccessToast } from "../utils/Toastify";
import { calculateAgeFromDOB, calculateDOBFromAge } from "../utils/Age";
import { userApplicant, updateUserApplicant, checkExistsEmail } from "../services/applicationService";

const ApplicantUserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    age: "",
    gender: "",
    phone_number: "",
    email: "",
    occupation: "",
    adhar_number: "",
    address: "",
    password: "",
    confirm_password: "",
    additional_notes: "",
  });

  const [originalEmail, setOriginalEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [linkExpired, setLinkExpired] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    return strength;
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const validateAadhar = (aadhar) => {
    if (!aadhar) return true;
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar.replace(/\s|-/g, ''));
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 10);
  };

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await userApplicant(userId);
        const data = response.data.user;

        if (!data || Object.keys(data).length === 0 || data.password) {
          setLinkExpired(true);
        } else {
          setFormData({
            full_name: data.full_name || "",
            date_of_birth: data.date_of_birth || "",
            age: data.age || "",
            gender: data.gender || "",
            phone_number: data.phone_number || "",
            email: data.email || "",
            occupation: data.occupation || "",
            adhar_number: data.adhar_number || "",
            address: data.address || "",
            password: "",
            confirm_password: "",
            additional_notes: data.additional_notes || "",
          });
          setOriginalEmail(data.email || "");
        }
      } catch (error) {
        console.error(error);
        setLinkExpired(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone_number: formattedPhone }));
  };

  const handleDOBChange = (e) => {
    const date_of_birth = e.target.value;
    const age = calculateAgeFromDOB(date_of_birth);
    setFormData((prev) => ({ ...prev, date_of_birth, age }));
  };

  const handleAgeChange = (e) => {
    const age = e.target.value;
    const date_of_birth = calculateDOBFromAge(age);
    setFormData((prev) => ({ ...prev, age, date_of_birth }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    // Required fields validation
    const requiredFields = ['full_name', 'email', 'phone_number', 'gender', 'occupation', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      showErrorToast("Please fill all required fields!");
      return;
    }

    // Password validation
    if (!formData.password || !formData.confirm_password) {
      showErrorToast("Please enter password and confirm password!");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      showErrorToast("Passwords do not match!");
      return;
    }

    if (!validatePassword(formData.password)) {
      showErrorToast("Password must be at least 8 characters with uppercase, lowercase, number, and special character!");
      return;
    }

    // Aadhar validation
    if (!validateAadhar(formData.adhar_number)) {
      showErrorToast("Please enter a valid 12-digit Aadhar number!");
      return;
    }

    try {
      setSubmitting(true);
      setFormDisabled(true);

      if (formData.email !== originalEmail) {
        const res = await checkExistsEmail(formData.email);
        if (res.data.exists) {
          showErrorToast("This email is already registered. Please use another one.");
          setSubmitting(false);
          setFormDisabled(false);
          return;
        }
      }

      // ✅ Add reg_link_status = 'active' and reg_type = 'reg_link' before updating user
      const updatedData = { ...formData, reg_link_status: 'active', reg_type: 'reg_link', };

      const response = await updateUserApplicant(userId, updatedData);

      if (response.data.message) {
        showSuccessToast("Registration completed successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showErrorToast("Failed to update user data.");
        setSubmitting(false);
        setFormDisabled(false);
      }
    } catch (error) {
      console.error("Update error:", error);

      if (error.response?.status === 400) {
        showErrorToast(error.response.data.message || "Invalid data provided.");
      } else if (error.response?.status === 404) {
        showErrorToast("User not found. The link may have expired.");
        setLinkExpired(true);
      } else if (error.response?.status === 409) {
        showErrorToast("Email already exists. Please use a different email.");
      } else {
        showErrorToast("An error occurred while updating user data. Please try again.");
      }

      setSubmitting(false);
      setFormDisabled(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return "bg-gray-200";
      case 1: return "bg-red-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-yellow-500";
      case 4: return "bg-blue-500";
      case 5: return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      case 5: return "Very Strong";
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-800 text-lg font-medium">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (linkExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Expired</h2>
          <p className="text-gray-600 mb-6">
            This registration link is no longer valid. Please contact support for assistance.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Applicant Registration</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your registration by filling out the form below. All fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div className="w-24 h-1 bg-emerald-600 mx-2"></div>
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div className="w-24 h-1 bg-emerald-300 mx-2"></div>
            <div className="w-8 h-8 bg-emerald-300 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1 bg-gradient-to-b from-emerald-600 to-teal-700 p-6 text-white">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-emerald-100 mb-3">Registration Steps</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-emerald-50">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      Personal Information
                    </li>
                    <li className="flex items-center text-emerald-200">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Contact Details
                    </li>
                    <li className="flex items-center text-emerald-200">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      Security Setup
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-emerald-500">
                  <h3 className="font-semibold text-emerald-100 mb-3">Requirements</h3>
                  <ul className="space-y-2 text-sm text-emerald-50">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Valid email address
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Strong password required
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Complete all required fields
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-emerald-600 text-sm font-bold">1</span>
                    </div>
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleDOBChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleAgeChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        min="18"
                        max="100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Your profession"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhar Number
                      </label>
                      <input
                        type="text"
                        name="adhar_number"
                        value={formData.adhar_number}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="12-digit Aadhar number"
                        maxLength="12"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-emerald-600 text-sm font-bold">2</span>
                    </div>
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handlePhoneChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="your.email@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                        rows="3"
                        placeholder="Enter your complete address"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-emerald-600 text-sm font-bold">3</span>
                    </div>
                    Security Setup
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        required
                      />

                      {/* Password Strength Meter */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Password Strength:</span>
                            <span className={`font-medium ${passwordStrength >= 4 ? 'text-green-600' :
                              passwordStrength >= 3 ? 'text-blue-600' :
                                passwordStrength >= 2 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        name="additional_notes"
                        value={formData.additional_notes}
                        onChange={handleInputChange}
                        disabled={formDisabled}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                        rows="3"
                        placeholder="Any additional information you'd like to share..."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-4">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    <p>By submitting this form, you agree to our terms and conditions.</p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formDisabled || submitting}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Complete Registration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default ApplicantUserForm;
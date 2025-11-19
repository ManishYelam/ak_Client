import React, { useState, useEffect } from "react";
import { FiEdit, FiArrowLeft, FiSave, FiRefreshCcw, FiInfo } from "react-icons/fi";
import Toast from "../components/Toast";
import { showErrorToast, showSuccessToast, showWarningToast } from "../utils/Toastify";
import { calculateAgeFromDOB, calculateDOBFromAge } from "../utils/Age";
import { updateUserApplicant, userApplicant } from "../services/applicationService";
import { getUserId } from "../utils/getUserId";

const Profile = () => {
  const userId = getUserId();

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
    additional_notes: "",
  });

  const [initialData, setInitialData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  // Input formatting functions
  const formatPhoneNumber = (value) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  const formatAadharNumber = (value) => {
    return value.replace(/\D/g, '').slice(0, 12);
  };

  // Field validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'phone_number':
        if (value && !/^\d{10}$/.test(value)) {
          newErrors.phone_number = 'Phone number must be 10 digits';
        } else {
          delete newErrors.phone_number;
        }
        break;
      case 'adhar_number':
        if (value && !/^\d{12}$/.test(value)) {
          newErrors.adhar_number = 'Aadhar number must be 12 digits';
        } else {
          delete newErrors.adhar_number;
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
      case 'full_name':
        if (!value.trim()) {
          newErrors.full_name = 'Full name is required';
        } else {
          delete newErrors.full_name;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      if (!userId) {
        showErrorToast("User not logged in!");
        return;
      }

      const res = await userApplicant(userId);
      const data = res?.data?.user || res?.data || {};

      if (!data || Object.keys(data).length === 0) {
        showWarningToast("Profile not found.");
        return;
      }

      const profileData = {
        full_name: data.full_name || "",
        date_of_birth: data.date_of_birth || "",
        age: data.age || "",
        gender: data.gender || "",
        phone_number: data.phone_number || "",
        email: data.email || "",
        occupation: data.occupation || "",
        adhar_number: data.adhar_number || "",
        address: data.address || "",
        additional_notes: data.additional_notes || "",
      };

      setFormData(profileData);
      setInitialData({ ...profileData });
    } catch (error) {
      console.error("Fetch profile error:", error);
      showWarningToast("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing && JSON.stringify(formData) !== JSON.stringify(initialData)) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditing, formData, initialData]);

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone_number') {
      formattedValue = formatPhoneNumber(value);
    } else if (name === 'adhar_number') {
      formattedValue = formatAadharNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    validateField(name, formattedValue);
  };

  const handleDOBChange = (e) => {
    const dob = e.target.value;
    setFormData((prev) => ({ 
      ...prev, 
      date_of_birth: dob, 
      age: calculateAgeFromDOB(dob) 
    }));
  };

  const handleAgeChange = (e) => {
    let age = e.target.value;
    if (age < 1) age = 1;
    if (age > 120) age = 120;
    setFormData((prev) => ({ 
      ...prev, 
      age, 
      date_of_birth: calculateDOBFromAge(age) 
    }));
  };

  // Edit, back, reset, update
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
    setFormData(initialData);
    setErrors({});
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrors({});
    showWarningToast("Form reset to last saved data.");
  };

  // FIXED: Handle update with edit_flag
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.full_name || !formData.phone_number || !formData.email) {
      return showErrorToast("Please fill all required fields!");
    }

    // Validate field formats
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
      return showErrorToast("Phone number must be exactly 10 digits.");
    }

    if (formData.adhar_number && !/^\d{12}$/.test(formData.adhar_number)) {
      return showErrorToast("Aadhar number must be exactly 12 digits.");
    }

    setUpdating(true);
    try {
      // Send edit_flag to indicate this is a profile edit (not password change)
      const updateData = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        age: formData.age,
        gender: formData.gender,
        phone_number: formData.phone_number,
        email: formData.email,
        occupation: formData.occupation,
        adhar_number: formData.adhar_number,
        address: formData.address,
        additional_notes: formData.additional_notes,
        edit_flag: 'profile_edit' // This tells backend not to update password
      };

      const res = await updateUserApplicant(userId, updateData);
      
      if (res.data.message) {
        showSuccessToast("Profile updated successfully!");
        setIsEditing(false);
        if (res.data.user) {
          setFormData(res.data.user);
          setInitialData(res.data.user);
        }
      } else {
        showErrorToast("Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
      
      // More specific error handling
      if (error.response?.status === 500) {
        if (error.response?.data?.message?.includes('data and salt arguments required')) {
          showErrorToast("Server configuration error. Please contact support.");
        } else {
          showErrorToast("Server error. Please try again later.");
        }
      } else if (error.response?.data?.message) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("Error updating profile. Please check your connection.");
      }
    } finally {
      setUpdating(false);
    }
  };

  // Character count component
  const CharacterCount = ({ text, maxLength }) => {
    const currentLength = text?.length || 0;
    return (
      <div className={`text-right text-xs ${
        currentLength > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'
      }`}>
        {currentLength}/{maxLength}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
        <p className="text-green-900 text-xl font-semibold ml-4">Loading Profile...</p>
      </div>
    );
  }

  const mandatoryLabel = (label) => (
    <>
      {label} <span className="text-red-600">*</span>
    </>
  );

  const ErrorMessage = ({ message }) => (
    message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null
  );

  const hasUnsavedChanges = isEditing && JSON.stringify(formData) !== JSON.stringify(initialData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-green-50 py-10 px-4">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded shadow-lg">
        Skip to main content
      </a>
      
      <Toast />
      <div className="max-w-4xl mx-auto bg-white rounded shadow-md p-4 relative">
        {/* Unsaved changes indicator */}
        {hasUnsavedChanges && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Unsaved changes
          </div>
        )}

        <h2 className="font-bold text-center text-green-900 mb-4">
          User Profile
        </h2>

        {/* Top Icons */}
        <div className="absolute top-4 w-full px-4 flex justify-between">
          {isEditing && (
            <button
              onClick={handleBack}
              className="flex items-center text-green-700 hover:text-green-900 transition-all"
              title="Back"
              aria-label="Back to view mode"
            >
              <FiArrowLeft size={18} />
            </button>
          )}
          {!isEditing && (
            <div className="ml-auto mr-12">
              <button
                onClick={handleEditClick}
                className="flex items-center text-green-900 hover:text-green-700 transition-all"
                title="Edit Profile"
                aria-label="Edit profile"
              >
                <FiEdit size={18} />
              </button>
            </div>
          )}
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] mt-8"
          onSubmit={handleUpdate}
          id="main-content"
        >
          {/* Column 1 */}
          <div className="flex flex-col gap-2">
            <label>{mandatoryLabel("Full Name")}</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className={`p-1 border rounded ${
                errors.full_name ? 'border-red-500' : ''
              } ${!isEditing ? 'bg-gray-100' : ''}`}
              disabled={!isEditing}
              required
              aria-required="true"
              aria-invalid={!!errors.full_name}
              aria-describedby={errors.full_name ? "full-name-error" : undefined}
            />
            <ErrorMessage message={errors.full_name} />

            <label>{mandatoryLabel("Date of Birth")}</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleDOBChange}
              className="p-1 border rounded"
              disabled={!isEditing}
              required
              aria-required="true"
            />

            <label>{mandatoryLabel("Age")}</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleAgeChange}
              min="1"
              max="120"
              className="p-1 border rounded"
              disabled={!isEditing}
              required
              aria-required="true"
            />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2">
            <label>{mandatoryLabel("Phone Number")}</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className={`p-1 border rounded ${
                errors.phone_number ? 'border-red-500' : ''
              } ${!isEditing ? 'bg-gray-100' : ''}`}
              pattern="[0-9]{10}"
              disabled={!isEditing}
              required
              aria-required="true"
              aria-invalid={!!errors.phone_number}
              aria-describedby={errors.phone_number ? "phone-error" : undefined}
            />
            <ErrorMessage message={errors.phone_number} />

            <label>{mandatoryLabel("Email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className={`p-1 border rounded bg-gray-100 text-gray-600 cursor-not-allowed ${
                errors.email ? 'border-red-500' : ''
              }`}
              disabled
              required
              aria-required="true"
              aria-invalid={!!errors.email}
            />
            <ErrorMessage message={errors.email} />

            <label>{mandatoryLabel("Gender")}</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="p-1 border rounded"
              disabled={!isEditing}
              required
              aria-required="true"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-2">
            <label>{mandatoryLabel("Occupation")}</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="p-1 border rounded"
              disabled={!isEditing}
              required
              aria-required="true"
            />

            <label>Aadhar Number</label>
            <input
              type="text"
              name="adhar_number"
              value={formData.adhar_number}
              onChange={handleInputChange}
              className={`p-1 border rounded ${
                errors.adhar_number ? 'border-red-500' : ''
              } ${!isEditing ? 'bg-gray-100' : ''}`}
              pattern="[0-9]{12}"
              disabled={!isEditing}
              aria-invalid={!!errors.adhar_number}
              aria-describedby={errors.adhar_number ? "aadhar-error" : undefined}
            />
            <ErrorMessage message={errors.adhar_number} />

            <label>{mandatoryLabel("Address")}</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
              className="p-1 border rounded resize-none"
              disabled={!isEditing}
              required
              aria-required="true"
            />
            <CharacterCount text={formData.address} maxLength={200} />
          </div>

          {/* Full-width field */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <label>Additional Notes</label>
            <textarea
              name="additional_notes"
              value={formData.additional_notes}
              onChange={handleInputChange}
              rows={2}
              className="p-1 border rounded resize-none"
              disabled={!isEditing}
              maxLength={500}
            />
            <CharacterCount text={formData.additional_notes} maxLength={500} />
          </div>

          {/* Save & Reset buttons */}
          {isEditing && (
            <div className="md:col-span-3 flex justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-2 bg-blue-400 text-white rounded hover:bg-blue-500 flex items-center gap-1 transition-colors"
                title="Reset"
                disabled={updating}
              >
                <FiRefreshCcw size={14} />
                <span>Reset</span>
              </button>
              <button
                type="submit"
                className={`p-2 bg-green-800 text-white rounded flex items-center gap-1 transition-colors ${
                  updating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-900'
                }`}
                title="Save"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={14} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Helpful Notes */}
        <div className="text-center mt-6 pt-3 border-t border-gray-200">
          <p className="text-[10px] text-gray-500 italic flex justify-center items-center gap-1">
            <FiInfo className="text-green-700" />
            Please ensure all details are accurate before saving. Fields marked with{" "}
            <span className="text-red-600">*</span> are mandatory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
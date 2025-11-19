import React, { useState, useCallback, useMemo, useEffect } from "react";
import { showSuccessToast, showWarningToast } from "../utils/Toastify";
import { calculateAgeFromDOB, calculateDOBFromAge } from "../utils/Age";
import { checkExistsEmail } from "../services/applicationService";
import { getUserData } from "../utils/getUserId";

// Validation configuration - FASTEST APPROACH
const VALIDATION_RULES = {
  full_name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Full name must be 2-100 characters"
  },
  date_of_birth: {
    required: true,
    isFuture: false,
    message: "Date of birth cannot be in future"
  },
  age: {
    required: true,
    min: 1,
    max: 120,
    message: "Age must be between 1-120"
  },
  phone_number: {
    required: true,
    pattern: /^[0-9]{10}$/,
    message: "Phone number must be 10 digits"
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter valid email"
  },
  gender: {
    required: true,
    message: "Gender is required"
  },
  occupation: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Occupation must be 2-50 characters"
  },
  adhar_number: {
    required: true,
    pattern: /^[0-9]{12}$/,
    message: "Aadhar number must be 12 digits"
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: "Address must be 10-500 characters"
  },
  additional_notes: {
    required: false,
    maxLength: 1000,
    message: "Notes must be under 1000 characters"
  }
};

const BasicInfoForm = ({ formData, handleInputChange, onNext, errors, mode, isLoading }) => {
  const user = getUserData();
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  console.log("🔍 BasicInfoForm Debug - mode:", mode, "isLoading:", isLoading, "formData:", {
    full_name: formData.full_name,
    email: formData.email,
    hasData: !!formData.full_name
  });

  // Reset field errors when formData changes (for fetched data)
  useEffect(() => {
    if (mode !== 'create' && formData.full_name) {
      console.log("🔄 Resetting field errors for loaded data");
      setFieldErrors({});
      setTouchedFields({});
    }
  }, [formData.full_name, mode]);

  // Memoized user data
  const userEmail = useMemo(() => user?.email?.toLowerCase(), [user]);

  // Ultra-fast field validation
  const validateField = useCallback((name, value) => {
    if (mode === 'view') return null; // Skip validation in view mode

    const rule = VALIDATION_RULES[name];
    if (!rule) return null;

    const { required, minLength, maxLength, min, max, pattern, isFuture } = rule;

    if (required && (!value || value.toString().trim() === '')) {
      return rule.message;
    }

    if (value) {
      const strValue = value.toString().trim();

      if (minLength && strValue.length < minLength) return rule.message;
      if (maxLength && strValue.length > maxLength) return rule.message;
      if (min !== undefined && Number(value) < min) return rule.message;
      if (max !== undefined && Number(value) > max) return rule.message;
      if (pattern && !pattern.test(strValue)) return rule.message;
      if (isFuture === false && new Date(value) > new Date()) return rule.message;
    }

    return null;
  }, [mode]);

  // Check if form is completely valid
  const isFormValid = useMemo(() => {
    if (mode === 'view') return true;
    const isValid = Object.keys(VALIDATION_RULES).every(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      return !error;
    });
    console.log("✅ Form validation result:", isValid);
    return isValid;
  }, [formData, validateField, mode]);

  // Mark field as touched
  const handleFieldTouch = useCallback((fieldName) => {
    if (mode === 'view') return;
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, [mode]);

  // Fast field change handler with real-time validation
  const handleFieldChange = useCallback((e) => {
    if (mode === 'view') return;

    const { name, value } = e.target;
    console.log("📝 Field change:", name, value);

    handleInputChange(e);

    // Mark field as touched
    handleFieldTouch(name);

    // Validate field in real-time
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [handleInputChange, validateField, handleFieldTouch, mode]);

  // Handle field blur - validate when user leaves field
  const handleFieldBlur = useCallback((e) => {
    if (mode === 'view') return;

    const { name, value } = e.target;
    handleFieldTouch(name);

    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField, handleFieldTouch, mode]);

  // Handle DOB change - FIXED: Properly update both fields
  const handleDOBChange = (e) => {
    if (mode === 'view') return;

    const date_of_birth = e.target.value;
    console.log("🎂 DOB changed:", date_of_birth);

    const age = calculateAgeFromDOB(date_of_birth);
    console.log("🔢 Calculated age:", age);

    // Update both fields in the parent form data
    // First update DOB
    handleInputChange({ target: { name: "date_of_birth", value: date_of_birth } });

    // Then update age with calculated value
    setTimeout(() => {
      handleInputChange({ target: { name: "age", value: age.toString() } });
    }, 0);

    // Mark fields as touched
    handleFieldTouch("date_of_birth");
    handleFieldTouch("age");

    // Validate both fields in real-time
    const dobError = validateField("date_of_birth", date_of_birth);
    const ageError = validateField("age", age);

    setFieldErrors(prev => ({
      ...prev,
      date_of_birth: dobError,
      age: ageError
    }));
  };

  // Handle Age change - FIXED: Properly update both fields
  const handleAgeChange = (e) => {
    if (mode === 'view') return;

    const age = e.target.value;
    console.log("🔢 Age changed:", age);

    const date_of_birth = calculateDOBFromAge(age);
    console.log("🎂 Calculated DOB:", date_of_birth);

    // Update both fields in the parent form data
    // First update age
    handleInputChange({ target: { name: "age", value: age } });

    // Then update DOB with calculated value
    setTimeout(() => {
      handleInputChange({ target: { name: "date_of_birth", value: date_of_birth } });
    }, 0);

    // Mark fields as touched
    handleFieldTouch("age");
    handleFieldTouch("date_of_birth");

    // Validate both fields in real-time
    const ageError = validateField("age", age);
    const dobError = validateField("date_of_birth", date_of_birth);

    setFieldErrors(prev => ({
      ...prev,
      age: ageError,
      date_of_birth: dobError
    }));
  };

  // Fast border class calculator - show red border if field is touched and has error
  const getFieldBorderClass = useCallback((fieldName) => {
    if (mode === 'view') return 'border-gray-300 bg-gray-50';
    return touchedFields[fieldName] && fieldErrors[fieldName] ? 'border-red-500' : 'border-gray-300';
  }, [fieldErrors, touchedFields, mode]);

  // Get input disabled state
  const getInputDisabled = useCallback((fieldName) => {
    const disabled = mode === 'view' || isLoading;
    console.log(`🔒 Input ${fieldName} disabled:`, disabled);
    return disabled;
  }, [mode, isLoading]);

  // Optimized form submission
  const handleNextClick = async (e) => {
    e.preventDefault();
    console.log("🚀 Next button clicked - mode:", mode);

    // Debug: Check current form data before submission
    console.log("📊 Current form data before submission:", {
      full_name: formData.full_name,
      date_of_birth: formData.date_of_birth,
      age: formData.age,
      email: formData.email
    });

    if (mode === 'view') {
      console.log("👀 View mode - proceeding to next step");
      onNext();
      return;
    }

    // Mark all fields as touched to show all errors
    const allTouched = {};
    Object.keys(VALIDATION_RULES).forEach(fieldName => {
      allTouched[fieldName] = true;
    });
    setTouchedFields(allTouched);

    // Check if form is valid
    if (!isFormValid) {
      console.log("❌ Form validation failed");
      // Validate all fields to show errors
      const errors = {};
      Object.keys(VALIDATION_RULES).forEach(fieldName => {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) errors[fieldName] = error;
      });
      setFieldErrors(errors);

      const firstError = Object.values(errors)[0];
      showWarningToast(firstError || "Please fill all required fields correctly");
      return;
    }

    // Validate that both age and date_of_birth are properly set
    if (!formData.date_of_birth || !formData.age) {
      console.log("❌ Age or Date of Birth is missing:", {
        date_of_birth: formData.date_of_birth,
        age: formData.age
      });
      showWarningToast("Please ensure both Date of Birth and Age are properly set");
      return;
    }

    const { email } = formData;

    // Skip email check in edit mode
    if (mode === 'edit') {
      console.log("✏️ Edit mode - skipping email check");
      showSuccessToast("Basic information updated successfully!");
      onNext();
      return;
    }

    if (user) formData.isLogin = true;

    setIsCheckingEmail(true);
    console.log("📧 Checking email existence:", email);

    try {
      // Skip check if user is editing their own email
      if (user && user.email && user.email.toLowerCase() === email.toLowerCase()) {
        console.log("✅ Same user email - skipping check");
        showSuccessToast("Basic information filled successfully!");
        onNext();
        return;
      }

      // Check email existence (only in create mode)
      const res = await checkExistsEmail(email);
      console.log("📧 Email check response:", res);

      if (res.data.exists) {
        showWarningToast("This email is already registered. Please use another one.");
        return;
      }

      showSuccessToast("Basic information filled successfully!");
      onNext();
    } catch (error) {
      console.error("❌ Error checking email:", error);
      showWarningToast("Something went wrong while checking the email.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  if (isLoading && mode !== 'create') {
    return (
      <div className="p-4 bg-white rounded shadow-md space-y-4 text-[10px]">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading applicant data...</span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleNextClick}
      className="p-4 bg-white rounded shadow-md space-y-4 text-[10px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1 - EXACT ORIGINAL DESIGN */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('full_name')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('full_name')} ${getInputDisabled('full_name') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            required
          />
          {touchedFields.full_name && fieldErrors.full_name && (
            <p className="text-red-500 text-[9px]">{fieldErrors.full_name}</p>
          )}

          <label className="font-semibold">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth || ""}
            onChange={handleDOBChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('date_of_birth')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('date_of_birth')} ${getInputDisabled('date_of_birth') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            required
          />
          {touchedFields.date_of_birth && fieldErrors.date_of_birth && (
            <p className="text-red-500 text-[9px]">{fieldErrors.date_of_birth}</p>
          )}

          <label className="font-semibold">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age || ""}
            onChange={handleAgeChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('age')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('age')} ${getInputDisabled('age') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="1"
            max="120"
            required
          />
          {touchedFields.age && fieldErrors.age && (
            <p className="text-red-500 text-[9px]">{fieldErrors.age}</p>
          )}
        </div>

        {/* Column 2 - EXACT ORIGINAL DESIGN */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('phone_number')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('phone_number')} ${getInputDisabled('phone_number') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            pattern="[0-9]{10}"
            required
          />
          {touchedFields.phone_number && fieldErrors.phone_number && (
            <p className="text-red-500 text-[9px]">{fieldErrors.phone_number}</p>
          )}

          <label className="font-semibold">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('email') || mode === 'edit'} // Disable email in edit mode
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('email')} ${getInputDisabled('email') || mode === 'edit' ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            required
          />
          {touchedFields.email && fieldErrors.email && (
            <p className="text-red-500 text-[9px]">{fieldErrors.email}</p>
          )}

          <label className="font-semibold">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('gender')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('gender')} ${getInputDisabled('gender') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {touchedFields.gender && fieldErrors.gender && (
            <p className="text-red-500 text-[9px]">{fieldErrors.gender}</p>
          )}
        </div>

        {/* Column 3 - EXACT ORIGINAL DESIGN */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Occupation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('occupation')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('occupation')} ${getInputDisabled('occupation') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            required
          />
          {touchedFields.occupation && fieldErrors.occupation && (
            <p className="text-red-500 text-[9px]">{fieldErrors.occupation}</p>
          )}

          <label className="font-semibold">Aadhar Number</label>
          <input
            type="text"
            name="adhar_number"
            placeholder="Aadhar Number"
            value={formData.adhar_number || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('adhar_number')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('adhar_number')} ${getInputDisabled('adhar_number') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            pattern="[0-9]{12}"
            required
          />
          {touchedFields.adhar_number && fieldErrors.adhar_number && (
            <p className="text-red-500 text-[9px]">{fieldErrors.adhar_number}</p>
          )}

          <label className="font-semibold">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            placeholder="Full Address with Pin Code"
            value={formData.address || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('address')}
            className={`p-1 border rounded text-[10px] resize-none ${getFieldBorderClass('address')} ${getInputDisabled('address') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            rows={2}
            required
          />
          {touchedFields.address && fieldErrors.address && (
            <p className="text-red-500 text-[9px]">{fieldErrors.address}</p>
          )}
        </div>

        {/* Full-width field - EXACT ORIGINAL DESIGN */}
        <div className="md:col-span-3 flex flex-col">
          <label className="font-semibold">Additional Notes</label>
          <textarea
            name="additional_notes"
            placeholder="Any additional information"
            value={formData.additional_notes || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('additional_notes')}
            className={`p-1 border rounded text-[10px] resize-none ${getFieldBorderClass('additional_notes')} ${getInputDisabled('additional_notes') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            rows={2}
          />
          {touchedFields.additional_notes && fieldErrors.additional_notes && (
            <p className="text-red-500 text-[9px]">{fieldErrors.additional_notes}</p>
          )}
        </div>
      </div>

      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-[8px] text-gray-600">
        <strong>Debug Info:</strong> Mode: {mode} | Loading: {isLoading ? 'Yes' : 'No'} |
        Form Valid: {isFormValid ? 'Yes' : 'No'} | Has Data: {formData.full_name ? 'Yes' : 'No'} |
        DOB: {formData.date_of_birth || 'Empty'} | Age: {formData.age || 'Empty'}
      </div>

      {/* Next button - Show in ALL modes including view mode */}
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={mode !== 'view' && (!isFormValid || isCheckingEmail || isLoading)}
          className={`px-3 py-1 text-white rounded text-[10px] transition-colors flex items-center gap-2 ${mode !== 'view' && (!isFormValid || isCheckingEmail || isLoading)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isCheckingEmail ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              Checking Email...
            </>
          ) : isLoading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              Loading...
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </form>
  );
};

export default BasicInfoForm;
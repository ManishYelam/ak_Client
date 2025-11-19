import React, { useState, useCallback, useMemo, useEffect } from "react";
import { showSuccessToast, showWarningToast } from "../utils/Toastify";

// Validation configuration - ALL FIELDS MANDATORY
const VALIDATION_RULES = {
  saving_account_start_date: {
    required: true,
    message: "Saving account start date is required"
  },
  deposit_type: {
    required: true,
    message: "Deposit type is required"
  },
  deposit_duration_years: {
    required: true,
    min: 0,
    max: 50,
    message: "Duration must be between 0-50 years"
  },
  fixed_deposit_total_amount: {
    required: true,
    min: 0,
    message: "Fixed deposit amount is required and cannot be negative"
  },
  interest_rate_fd: {
    required: true,
    min: 0,
    max: 100,
    message: "FD interest rate is required and must be between 0-100%"
  },
  saving_account_total_amount: {
    required: true,
    min: 0,
    message: "Savings account amount is required and cannot be negative"
  },
  interest_rate_saving: {
    required: true,
    min: 0,
    max: 100,
    message: "Savings interest rate is required and must be between 0-100%"
  },
  recurring_deposit_total_amount: {
    required: true,
    min: 0,
    message: "Recurring deposit amount is required and cannot be negative"
  },
  interest_rate_recurring: {
    required: true,
    min: 0,
    max: 100,
    message: "RD interest rate is required and must be between 0-100%"
  },
  dnyanrudha_investment_total_amount: {
    required: true,
    min: 0,
    message: "Dnyanrudha investment amount is required and cannot be negative"
  },
  dynadhara_rate: {
    required: true,
    min: 0,
    max: 100,
    message: "Dynadhara rate is required and must be between 0-100%"
  }
};

const NUMERIC_FIELDS = [
  'deposit_duration_years',
  'fixed_deposit_total_amount',
  'interest_rate_fd',
  'saving_account_total_amount',
  'interest_rate_saving',
  'recurring_deposit_total_amount',
  'interest_rate_recurring',
  'dnyanrudha_investment_total_amount',
  'dynadhara_rate'
];

const CaseFormDetails = ({ formData, handleInputChange, onNext, onBack, errors, mode, isLoading }) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(false);

  console.log("🔍 CaseFormDetails Debug - mode:", mode, "isLoading:", isLoading, "formData:", {
    deposit_type: formData.deposit_type,
    hasData: !!formData.deposit_type
  });

  // Reset field errors when formData changes
  useEffect(() => {
    if (mode !== 'create' && formData.deposit_type) {
      console.log("🔄 Resetting field errors for loaded deposit data");
      setFieldErrors({});
      setTouchedFields({});
    }
  }, [formData.deposit_type, mode]);

  // Field validation
  const validateField = useCallback((name, value) => {
    if (mode === 'view') return null;

    const rule = VALIDATION_RULES[name];
    if (!rule) return null;

    const { required, min, max } = rule;

    if (required && (value === undefined || value === null || value === '')) {
      return rule.message;
    }

    if (value !== undefined && value !== null && value !== '') {
      const numValue = Number(value);

      if (min !== undefined && numValue < min) return rule.message;
      if (max !== undefined && numValue > max) return rule.message;
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
    console.log("✅ Deposit form validation result:", isValid);
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

  // Input change handler
  const handleEnhancedInputChange = useCallback((e) => {
    if (mode === 'view') return;

    const { name, value } = e.target;
    console.log("📝 Deposit field change:", name, value);

    // Update form data
    handleInputChange({
      target: {
        name,
        value: NUMERIC_FIELDS.includes(name) ? value : value
      }
    });

    // Mark field as touched
    handleFieldTouch(name);

    // Validate field in real-time
    const error = validateField(name, value);

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [handleInputChange, handleFieldTouch, validateField, mode]);

  // Handle field blur
  const handleFieldBlur = useCallback((e) => {
    if (mode === 'view') return;

    const { name, value } = e.target;
    handleFieldTouch(name);

    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [handleFieldTouch, validateField, mode]);

  // Border class calculator - red border for invalid touched fields
  const getFieldBorderClass = useCallback((fieldName) => {
    if (mode === 'view') return 'border-gray-300 bg-gray-50';
    return touchedFields[fieldName] && fieldErrors[fieldName] ? 'border-red-500' : 'border-gray-300';
  }, [fieldErrors, touchedFields, mode]);

  // Get input disabled state
  const getInputDisabled = useCallback((fieldName) => {
    const disabled = mode === 'view' || isLoading;
    console.log(`🔒 Deposit input ${fieldName} disabled:`, disabled);
    return disabled;
  }, [mode, isLoading]);

  const mandatoryLabel = (label) => (
    <>
      {label} <span className="text-red-500">*</span>
    </>
  );

  const handleNextClick = async (e) => {
    e.preventDefault();
    console.log("🚀 Deposit Next button clicked - mode:", mode);

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
      console.log("❌ Deposit form validation failed");
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

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccessToast(mode === 'edit' ? "Deposit details updated successfully!" : "Deposit details filled successfully!");
      onNext();
    } catch (error) {
      console.error("❌ Error processing deposit details:", error);
      showWarningToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    console.log("🔙 Deposit Back button clicked");
    onBack();
  };

  if (isLoading && mode !== 'create') {
    return (
      <div className="p-4 bg-white rounded shadow-md space-y-4 text-[10px]">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading deposit details...</span>
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
        {/* Column 1 - Basic Deposit Info */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {mandatoryLabel("Saving Account Starting Date")}
          </label>
          <input
            type="date"
            name="saving_account_start_date"
            value={formData.saving_account_start_date || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('saving_account_start_date')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('saving_account_start_date')} ${getInputDisabled('saving_account_start_date') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            required
          />
          {touchedFields.saving_account_start_date && fieldErrors.saving_account_start_date && (
            <p className="text-red-500 text-[9px]">{fieldErrors.saving_account_start_date}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Deposit Type")}
          </label>
          <select
            name="deposit_type"
            value={formData.deposit_type || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('deposit_type')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('deposit_type')} ${getInputDisabled('deposit_type') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            required
          >
            <option value="">Select Deposit Type</option>
            <option value="Fixed Deposit">Fixed Deposit</option>
            <option value="Savings Account Deposit">Savings Account Deposit</option>
            <option value="Recurring Deposit">Recurring Deposit</option>
            <option value="Investment Scheme (Exhibit A)">
              Investment Scheme (Exhibit A)
            </option>
          </select>
          {touchedFields.deposit_type && fieldErrors.deposit_type && (
            <p className="text-red-500 text-[9px]">{fieldErrors.deposit_type}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Deposit Duration (Years)")}
          </label>
          <input
            type="number"
            name="deposit_duration_years"
            placeholder="Duration in Years"
            value={formData.deposit_duration_years || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('deposit_duration_years')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('deposit_duration_years')} ${getInputDisabled('deposit_duration_years') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            max="50"
            step="1"
            required
          />
          {touchedFields.deposit_duration_years && fieldErrors.deposit_duration_years && (
            <p className="text-red-500 text-[9px]">{fieldErrors.deposit_duration_years}</p>
          )}
        </div>

        {/* Column 2 - FD and Savings Details */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {mandatoryLabel("Fixed Deposit Total Amount")}
          </label>
          <input
            type="number"
            name="fixed_deposit_total_amount"
            placeholder="₹ FD Total Amount"
            value={formData.fixed_deposit_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('fixed_deposit_total_amount')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('fixed_deposit_total_amount')} ${getInputDisabled('fixed_deposit_total_amount') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            step="1"
            required
          />
          {touchedFields.fixed_deposit_total_amount && fieldErrors.fixed_deposit_total_amount && (
            <p className="text-red-500 text-[9px]">{fieldErrors.fixed_deposit_total_amount}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Interest Rate (FD %)")}
          </label>
          <input
            type="number"
            name="interest_rate_fd"
            placeholder="FD Interest Rate %"
            value={formData.interest_rate_fd || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('interest_rate_fd')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('interest_rate_fd')} ${getInputDisabled('interest_rate_fd') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            max="100"
            step="0.01"
            required
          />
          {touchedFields.interest_rate_fd && fieldErrors.interest_rate_fd && (
            <p className="text-red-500 text-[9px]">{fieldErrors.interest_rate_fd}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Savings Account Total Amount")}
          </label>
          <input
            type="number"
            name="saving_account_total_amount"
            placeholder="₹ Savings Total Amount"
            value={formData.saving_account_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('saving_account_total_amount')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('saving_account_total_amount')} ${getInputDisabled('saving_account_total_amount') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            step="1"
            required
          />
          {touchedFields.saving_account_total_amount && fieldErrors.saving_account_total_amount && (
            <p className="text-red-500 text-[9px]">{fieldErrors.saving_account_total_amount}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Interest Rate (Savings %)")}
          </label>
          <input
            type="number"
            name="interest_rate_saving"
            placeholder="Savings Interest Rate %"
            value={formData.interest_rate_saving || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('interest_rate_saving')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('interest_rate_saving')} ${getInputDisabled('interest_rate_saving') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            max="100"
            step="0.01"
            required
          />
          {touchedFields.interest_rate_saving && fieldErrors.interest_rate_saving && (
            <p className="text-red-500 text-[9px]">{fieldErrors.interest_rate_saving}</p>
          )}
        </div>

        {/* Column 3 - RD and Investment Details */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {mandatoryLabel("Recurring Deposit Total Amount")}
          </label>
          <input
            type="number"
            name="recurring_deposit_total_amount"
            placeholder="₹ RD Total Amount"
            value={formData.recurring_deposit_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('recurring_deposit_total_amount')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('recurring_deposit_total_amount')} ${getInputDisabled('recurring_deposit_total_amount') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            step="1"
            required
          />
          {touchedFields.recurring_deposit_total_amount && fieldErrors.recurring_deposit_total_amount && (
            <p className="text-red-500 text-[9px]">{fieldErrors.recurring_deposit_total_amount}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Interest Rate (RD %)")}
          </label>
          <input
            type="number"
            name="interest_rate_recurring"
            placeholder="RD Interest Rate %"
            value={formData.interest_rate_recurring || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('interest_rate_recurring')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('interest_rate_recurring')} ${getInputDisabled('interest_rate_recurring') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            max="100"
            step="0.01"
            required
          />
          {touchedFields.interest_rate_recurring && fieldErrors.interest_rate_recurring && (
            <p className="text-red-500 text-[9px]">{fieldErrors.interest_rate_recurring}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Dnyanrudha Investment Total Amount")}
          </label>
          <input
            type="number"
            name="dnyanrudha_investment_total_amount"
            placeholder="₹ Investment Total Amount"
            value={formData.dnyanrudha_investment_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('dnyanrudha_investment_total_amount')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('dnyanrudha_investment_total_amount')} ${getInputDisabled('dnyanrudha_investment_total_amount') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            step="1"
            required
          />
          {touchedFields.dnyanrudha_investment_total_amount && fieldErrors.dnyanrudha_investment_total_amount && (
            <p className="text-red-500 text-[9px]">{fieldErrors.dnyanrudha_investment_total_amount}</p>
          )}

          <label className="font-semibold">
            {mandatoryLabel("Dynadhara Rate (%)")}
          </label>
          <input
            type="number"
            name="dynadhara_rate"
            placeholder="Dynadhara Rate %"
            value={formData.dynadhara_rate || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            disabled={getInputDisabled('dynadhara_rate')}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('dynadhara_rate')} ${getInputDisabled('dynadhara_rate') ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
              }`}
            min="0"
            max="100"
            step="0.01"
            required
          />
          {touchedFields.dynadhara_rate && fieldErrors.dynadhara_rate && (
            <p className="text-red-500 text-[9px]">{fieldErrors.dynadhara_rate}</p>
          )}
        </div>
      </div>

      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 rounded text-[8px] text-gray-600">
        <strong>Debug Info:</strong> Mode: {mode} | Loading: {isLoading ? 'Yes' : 'No'} |
        Form Valid: {isFormValid ? 'Yes' : 'No'} | Has Data: {formData.deposit_type ? 'Yes' : 'No'}
      </div>

      {/* Navigation Buttons - Show in ALL modes including view mode */}
      <div className="flex justify-between mt-3">
        <button
          onClick={handleBackClick}
          disabled={loading}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-[10px] flex items-center gap-1 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={mode !== 'view' && (!isFormValid || loading)}
          className={`px-3 py-1 text-white rounded text-[10px] flex items-center gap-2 transition-colors ${mode !== 'view' && (!isFormValid || loading)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              {mode === 'edit' ? 'Updating...' : 'Validating...'}
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </form>
  );
};

export default CaseFormDetails;
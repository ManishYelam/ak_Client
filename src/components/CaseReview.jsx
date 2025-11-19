import React, { useState, useCallback, useMemo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { showWarningToast, showSuccessToast, showErrorToast } from "../utils/Toastify";

const CaseReview = ({ formData, setFormData, onNext, onBack, onSave, mode, isLoading }) => {
  const [check, setCheck] = useState(formData.verified || false);
  const [submitting, setSubmitting] = useState(false);

  console.log("🔍 CaseReview Debug - mode:", mode, "isLoading:", isLoading, "formData:", {
    full_name: formData.full_name,
    verified: formData.verified,
    hasData: !!formData.full_name
  });

  // ✅ Handle checkbox verification
  const handleCheckboxChange = useCallback((e) => {
    if (mode === 'view') return;

    const verified = e.target.checked;
    console.log("✅ Checkbox changed:", verified);
    setCheck(verified);
    setFormData((prev) => ({ ...prev, verified }));

    if (verified) {
      showSuccessToast("Declaration verified successfully!");
    } else {
      showWarningToast("Please verify the declaration to proceed.");
    }
  }, [setFormData, mode]);

  // ✅ Format currency for display - OPTIMIZED
  const formatCurrency = useCallback((value) => {
    if (!value && value !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

  // ✅ Format percentage for display - OPTIMIZED
  const formatPercentage = useCallback((value) => {
    if (!value && value !== 0) return 'N/A';
    return `${parseFloat(value).toFixed(2)}%`;
  }, []);

  // ✅ Format date for display - OPTIMIZED
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  }, []);

  // ✅ Current date memoized
  const currentDate = useMemo(() => formatDate(new Date().toISOString()), [formatDate]);

  // ✅ Check if all required fields are filled - OPTIMIZED
  const isFormComplete = useMemo(() => {
    const requiredFields = [
      'full_name', 'date_of_birth', 'age', 'gender', 'phone_number',
      'email', 'occupation', 'address', 'saving_account_start_date',
      'deposit_type', 'deposit_duration_years'
    ];

    const complete = requiredFields.every(field => formData[field]);
    console.log("📋 Form completeness check:", complete);
    return complete;
  }, [formData]);

  // ✅ Validation and submission - OPTIMIZED
  const handleNext = useCallback(async () => {
    console.log("🚀 CaseReview Next clicked - mode:", mode);

    if (mode === 'view') {
      onNext();
      return;
    }

    if (!check) {
      showWarningToast("Please verify the declaration before proceeding.");
      return;
    }

    if (!isFormComplete) {
      showWarningToast("Please complete all required fields in previous steps.");
      return;
    }

    setSubmitting(true);
    console.log("📄 Generating PDF...");

    try {
      const element = document.getElementById("printableArea");

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Application_${formData.full_name || "Applicant"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        },
      };

      const pdfBlob = await html2pdf()
        .set(opt)
        .from(element)
        .outputPdf('blob');

      const pdfFile = new File([pdfBlob], `application_${formData.full_name || 'applicant'}.pdf`, {
        type: 'application/pdf'
      });

      const updatedData = {
        ...formData,
        verified: check,
        application_form: pdfFile,
        submitted_at: new Date().toISOString(),
      };

      setFormData(updatedData);
      
      // Call onSave for edit mode to persist changes
      if (mode === 'edit' && onSave) {
        await onSave(updatedData);
        showSuccessToast("Case updated successfully!");
      } else {
        showSuccessToast("Application submitted successfully!");
      }
      
      onNext(updatedData);
    } catch (error) {
      console.error("❌ Submission error:", error);
      showErrorToast("Failed to generate application PDF. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [check, isFormComplete, formData, setFormData, onNext, onSave, mode]);

  // ✅ Handle back button
  const handleBack = useCallback(() => {
    console.log("🔙 CaseReview Back clicked");
    onBack();
  }, [onBack]);

  if (isLoading && mode !== 'create') {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading case review data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded text-[11px] leading-5">

      {/* Debug info */}
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-[9px] text-blue-700">
        <strong>Debug:</strong> Mode: {mode} | Loading: {isLoading ? 'Yes' : 'No'} |
        Complete: {isFormComplete ? 'Yes' : 'No'} | Verified: {check ? 'Yes' : 'No'}
      </div>

      {/* Status Alert */}
      {!isFormComplete && mode !== 'view' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-[10px]">
          ⚠️ Please complete all required fields in previous steps before submitting.
        </div>
      )}

      {/* Printable Section - Optimized */}
      <div id="printableArea" className="space-y-4">
        {/* Header */}
        <header className="text-center mb-4 border-b border-gray-300 pb-3">
          <h1 className="font-bold text-[16px] uppercase tracking-wide text-green-800">
            Investment Application Form
          </h1>
          <div className="flex justify-between items-center mt-2">
            <div className="text-left text-[10px] text-gray-600">
              Ref No: {formData.reference_number || 'N/A'}
            </div>
            <div className="text-right text-[11px] text-gray-700 italic">
              Date: {currentDate}
            </div>
          </div>
        </header>

        {/* Partition 1: Basic Information */}
        <section className="border border-gray-400 p-4 rounded mb-4">
          <h4 className="font-bold underline mb-3 text-[12px] text-green-700">
            1. BASIC INFORMATION
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p><strong className="text-gray-700">Full Name:</strong> {formData.full_name || 'N/A'}</p>
              <p><strong className="text-gray-700">Date of Birth:</strong> {formatDate(formData.date_of_birth)}</p>
              <p><strong className="text-gray-700">Gender:</strong> {formData.gender || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">Phone No.:</strong> {formData.phone_number || 'N/A'}</p>
              <p><strong className="text-gray-700">Age:</strong> {formData.age || 'N/A'} years</p>
              <p><strong className="text-gray-700">Occupation:</strong> {formData.occupation || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">Aadhar No.:</strong> {formData.adhar_number || 'N/A'}</p>
              <p><strong className="text-gray-700">Email:</strong> {formData.email || 'N/A'}</p>
              <p><strong className="text-gray-700">Address:</strong> {formData.address || 'N/A'}</p>
            </div>
          </div>
          {formData.additional_notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p><strong className="text-gray-700">Notes:</strong> {formData.additional_notes}</p>
            </div>
          )}
        </section>

        {/* Partition 2: Deposit Details */}
        <section className="border border-gray-400 p-4 rounded mb-4">
          <h4 className="font-bold underline mb-3 text-[12px] text-green-700">
            2. DEPOSIT DETAILS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p><strong className="text-gray-700">Account Start Date:</strong> {formatDate(formData.saving_account_start_date)}</p>
              <p><strong className="text-gray-700">Deposit Type:</strong> {formData.deposit_type || 'N/A'}</p>
              <p><strong className="text-gray-700">Duration:</strong> {formData.deposit_duration_years || 'N/A'} years</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">FD Amount:</strong> {formatCurrency(formData.fixed_deposit_total_amount)}</p>
              <p><strong className="text-gray-700">FD Interest Rate:</strong> {formatPercentage(formData.interest_rate_fd)}</p>
              <p><strong className="text-gray-700">Savings Amount:</strong> {formatCurrency(formData.saving_account_total_amount)}</p>
              <p><strong className="text-gray-700">Savings Interest Rate:</strong> {formatPercentage(formData.interest_rate_saving)}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">RD Amount:</strong> {formatCurrency(formData.recurring_deposit_total_amount)}</p>
              <p><strong className="text-gray-700">RD Interest Rate:</strong> {formatPercentage(formData.interest_rate_recurring)}</p>
              <p><strong className="text-gray-700">Investment Amount:</strong> {formatCurrency(formData.dnyanrudha_investment_total_amount)}</p>
              <p><strong className="text-gray-700">Dynadhara Rate:</strong> {formatPercentage(formData.dynadhara_rate)}</p>
            </div>
          </div>
        </section>

        {/* Declaration */}
        <section className="border border-gray-400 p-4 rounded mb-4 bg-gray-50">
          <p className="italic text-gray-700 mb-3">
            I hereby solemnly affirm that the information provided above is true and
            correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.
            I understand that any false information may lead to rejection of my application.
          </p>
          <label className={`flex items-center space-x-3 mt-2 ${mode === 'view' ? 'cursor-default' : 'cursor-pointer'}`}>
            <input
              type="checkbox"
              checked={check}
              onChange={handleCheckboxChange}
              disabled={mode === 'view'}
              className={`${mode === 'view' ? 'cursor-default' : 'cursor-pointer'} accent-green-600 w-4 h-4`}
            />
            <span className="font-semibold text-green-700">
              {check ? (
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  I verify and confirm the above declaration
                </span>
              ) : (
                "I verify and confirm the above declaration"
              )}
            </span>
          </label>
        </section>

        {/* Signature Block */}
        <section className="text-right mt-6 text-[11px] border-t border-gray-300 pt-4">
          <p className="mb-4">Place: _______________________</p>
          <p className="mb-4">Date: ____ / ____ / ______</p>
          <p className="font-bold text-gray-800">Signature of Applicant</p>
          <p className="text-gray-600">(Authorized Signatory)</p>
        </section>

        {/* Footer Section */}
        <footer className="mt-6 border-t border-gray-400 pt-3 text-center text-[10px] text-gray-600 italic">
          <p>This is a system-generated document. No manual signature is required.</p>
          <p>Generated on: {currentDate}</p>
        </footer>
      </div>

      {/* Action Buttons - Updated: Only Next button for create/edit, no button for view */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handleBack}
          disabled={submitting}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-[10px] flex items-center gap-1 transition-colors"
        >
          Back
        </button>

        {/* Only show Next button in create and edit modes */}
        {mode !== 'view' && (
          <button
            onClick={handleNext}
            disabled={!check || submitting || !isFormComplete}
            className={`px-3 py-1 text-white rounded text-[11px] flex items-center gap-2 transition-colors ${!check || submitting || !isFormComplete
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                {mode === 'edit' ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              'Next'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CaseReview;
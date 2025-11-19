import React from "react";

const ApplicationForm = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Header and Save button */}
      <div className="flex justify-between items-center w-full">
        <h4 className="text-[8px] font-semibold text-gray-800">Application Form</h4>
        <button
          type="submit"
          className="w-12 h-5 text-[8px] font-semibold text-white bg-green-600 rounded-md shadow-inner hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center transition-shadow duration-300"
        >
          Save
        </button>
      </div>

      {/* Input Fields */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          name="applicantName"
          placeholder="Applicant Name"
          value={formData.applicantName}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-40 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-48 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-32 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="text"
          name="caseType"
          placeholder="Case Type"
          value={formData.caseType}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-32 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="date"
          name="applicationDate"
          placeholder="Application Date"
          value={formData.applicationDate}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-32 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <textarea
          name="description"
          placeholder="Brief Description"
          value={formData.description}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-full h-20 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          required
        />
      </div>
    </form>
  );
};

export default ApplicationForm;

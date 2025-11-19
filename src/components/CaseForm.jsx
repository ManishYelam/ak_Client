import React from "react";

const CaseForm = ({ newCase, handleInputChange, handleSubmit }) => {
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Header and Save button */}
      <div className="flex justify-between items-center w-full">
        <h4 className="text-[8px] font-semibold text-gray-800">Add New Case</h4>
        <button
          type="submit"
          className="w-12 h-5 text-[8px] font-semibold text-white bg-green-600 rounded-md shadow-inner hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center transition-shadow duration-300"
        >
          Save
        </button>
      </div>

      {/* Input Row */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={newCase.caseName}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-40 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={newCase.age}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-20 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="caseName"
          placeholder="Case Name"
          value={newCase.caseName}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-40 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="Court "
          placeholder="Court Name"
          value={newCase.advocate}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-40 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="caseType"
          placeholder="Case Type"
          value={newCase.caseType}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-32 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="caseNumber"
          placeholder="Case Number"
          value={newCase.caseNumber}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-32 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="contact"
          value={newCase.contact}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-32 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="description"
          value={newCase.description}
          onChange={handleInputChange}
          className="p-1 border border-gray-300 rounded-md shadow-sm w-32 h-6 text-[8px] placeholder:text-[8px] focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        
      </div>
    </form>
  );
};

export default CaseForm;

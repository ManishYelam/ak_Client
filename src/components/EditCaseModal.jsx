import React, { useState, useEffect } from "react";

const EditCaseModal = ({ caseData, onClose, onSave }) => {
  const [editedCase, setEditedCase] = useState({ ...caseData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedCase);
    onClose(); // Close the modal after saving
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Edit Case</h3>
        <form className="space-y-4">
          <div>
            <label htmlFor="case_name" className="block text-sm">Case Name</label>
            <input
              id="case_name"
              name="case_name"
              value={editedCase.case_name}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded"
            />
          </div>
          <div>
            <label htmlFor="client_name" className="block text-sm">Client Name</label>
            <input
              id="client_name"
              name="client_name"
              value={editedCase.client_name}
              onChange={handleChange}
              className="w-full px-3 py-1 border rounded"
            />
          </div>
          {/* Add more input fields as necessary */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCaseModal;

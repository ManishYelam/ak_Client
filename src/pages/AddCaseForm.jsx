import React, { useState } from "react"; 
import CaseDocumentUploader from "../components/CaseDocumentUploader";
import CaseForm from "../components/CaseForm";

const AddCaseForm = ({ onAdd }) => {
  const [newCase, setNewCase] = useState({
    caseName: "",
    age: "",             
    status: "Running",
    nextDate: "",
    advocate: "",
    caseType: "",
    documents: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentsChange = (updatedDocuments) => {
    setNewCase((prev) => ({
      ...prev,
      documents: updatedDocuments,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newCase);
    setNewCase({
      caseName: "",
      age: "",
      status: "Running",
      nextDate: "",
      advocate: "",
      caseType: "",
      documents: [],
    });
  };

  return (
    <div className="p-4 w-full rounded-lg shadow-lg min-h-screen">

      {/* Flex container for side-by-side layout */}
      {/* <div className="flex flex-col lg:flex-row gap-8"> */}
        {/* Left: Form */}
        <div className="flex-1">
          <CaseForm
            newCase={newCase}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>

        {/* Right: Document Uploader */}
        <div className="flex-1">
          <CaseDocumentUploader
            documents={newCase.documents}
            onDocumentsChange={handleDocumentsChange}
          />
        </div>
      </div>
    // </div>
  );
};

export default AddCaseForm;

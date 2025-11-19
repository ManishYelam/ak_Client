import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import Button from '../components/Button';

const PrintCase = ({ caseData }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Case_${caseData.id}_${new Date().toISOString().split('T')[0]}`,
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={handlePrint}>
          Print Case
        </Button>
      </div>

      <div ref={componentRef} className="bg-white p-6">
        {/* Print Header */}
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Case Details Report</h1>
          <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Case Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
            Case Information
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Case ID:</strong> {caseData.id}</div>
            <div><strong>Deposit Type:</strong> {caseData.deposit_type}</div>
            <div><strong>Status:</strong> {caseData.status}</div>
            <div><strong>Priority:</strong> {caseData.priority}</div>
            <div><strong>Verified:</strong> {caseData.verified ? 'Yes' : 'No'}</div>
            <div><strong>Start Date:</strong> {caseData.saving_account_start_date}</div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
            Financial Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Duration:</strong> {caseData.deposit_duration_years} years</div>
            <div><strong>FD Amount:</strong> ₹{caseData.fixed_deposit_total_amount?.toLocaleString()}</div>
            <div><strong>FD Interest Rate:</strong> {caseData.interest_rate_fd}%</div>
            <div><strong>Savings Amount:</strong> ₹{caseData.saving_account_total_amount?.toLocaleString()}</div>
            <div><strong>Savings Interest Rate:</strong> {caseData.interest_rate_saving}%</div>
            <div><strong>Recurring Deposit Amount:</strong> ₹{caseData.recurring_deposit_total_amount?.toLocaleString()}</div>
            <div><strong>Recurring Interest Rate:</strong> {caseData.interest_rate_recurring}%</div>
            <div><strong>Dnyanrudha Investment:</strong> ₹{caseData.dnyanrudha_investment_total_amount?.toLocaleString()}</div>
            <div><strong>Dynadhara Rate:</strong> {caseData.dynadhara_rate}%</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
            Timeline
          </h2>
          <div className="text-sm">
            <p><strong>Created:</strong> {new Date(caseData.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(caseData.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
          <p>Confidential - For authorized use only</p>
          <p>Page 1 of 1</p>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-area, #printable-area * {
              visibility: visible;
            }
            #printable-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintCase;
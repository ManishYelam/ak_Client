import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";

const CaseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch case details by ID
    const fetchCaseDetails = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setCaseData({
            id: id,
            deposit_type: "Fixed Deposit",
            status: "Running",
            priority: "High",
            verified: true,
            saving_account_start_date: "2024-01-15",
            deposit_duration_years: 5,
            fixed_deposit_total_amount: 500000,
            interest_rate_fd: 7.5,
            saving_account_total_amount: 150000,
            interest_rate_saving: 4.0,
            recurring_deposit_total_amount: 200000,
            interest_rate_recurring: 6.5,
            dnyanrudha_investment_total_amount: 100000,
            dynadhara_rate: 8.0,
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-10-18T14:20:00Z",
            documents: [
              { name: "Agreement.pdf", url: "#" },
              { name: "KYC_Documents.pdf", url: "#" }
            ],
            payments: [
              {
                id: 1,
                payment_id: "PAY_001",
                amount: 50000,
                currency: "INR",
                status: "paid",
                method: "Bank Transfer",
                receipt: "RCPT_001",
                createdAt: "2024-01-15T10:30:00Z"
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching case details:", error);
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Case Not Found</h2>
          <Button onClick={() => navigate("/cases")}>Back to Cases</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="m-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Case Details</h1>
            <p className="text-gray-600">Case ID: {caseData.id}</p>
          </div>
          <Button onClick={() => navigate("/cases")}>
            Back to Cases
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deposit Type</label>
                  <p className="mt-1 text-sm text-gray-900">{caseData.deposit_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    caseData.status === 'Running' ? 'bg-green-100 text-green-800' :
                    caseData.status === 'Closed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {caseData.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    caseData.priority === 'High' ? 'bg-red-100 text-red-800' :
                    caseData.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {caseData.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verified</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    caseData.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {caseData.verified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Financial Details Card */}
            <Card title="Financial Details">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">{caseData.saving_account_start_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="mt-1 text-sm text-gray-900">{caseData.deposit_duration_years} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FD Amount</label>
                  <p className="mt-1 text-sm text-gray-900">₹{caseData.fixed_deposit_total_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FD Interest Rate</label>
                  <p className="mt-1 text-sm text-gray-900">{caseData.interest_rate_fd}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Savings Amount</label>
                  <p className="mt-1 text-sm text-gray-900">₹{caseData.saving_account_total_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Savings Interest Rate</label>
                  <p className="mt-1 text-sm text-gray-900">{caseData.interest_rate_saving}%</p>
                </div>
              </div>
            </Card>

            {/* Documents Card */}
            <Card title="Documents">
              <div className="space-y-2">
                {caseData.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">PDF</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{doc.name}</span>
                    </div>
                    <a
                      href={doc.url}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline Card */}
            <Card title="Timeline">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Case Created</p>
                    <p className="text-xs text-gray-500">
                      {new Date(caseData.createdAt).toLocaleDateString()} at {new Date(caseData.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">
                      {new Date(caseData.updatedAt).toLocaleDateString()} at {new Date(caseData.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card title="Quick Actions">
              <div className="space-y-2">
                <Button className="w-full justify-center" onClick={() => navigate(`/cases/${id}/edit`)}>
                  Edit Case
                </Button>
                <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700">
                  Generate Report
                </Button>
                <Button className="w-full justify-center bg-gray-600 hover:bg-gray-700">
                  Print Details
                </Button>
              </div>
            </Card>

            {/* Payment Summary Card */}
            <Card title="Payment Summary">
              <div className="space-y-3">
                {caseData.payments?.map((payment) => (
                  <div key={payment.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">{payment.payment_id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Amount: ₹{payment.amount?.toLocaleString()}</p>
                      <p>Method: {payment.method}</p>
                      <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CaseDetails;
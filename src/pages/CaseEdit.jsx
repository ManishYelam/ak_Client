import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";

const CaseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    deposit_type: "",
    status: "",
    priority: "",
    verified: false,
    saving_account_start_date: "",
    deposit_duration_years: "",
    fixed_deposit_total_amount: "",
    interest_rate_fd: "",
    saving_account_total_amount: "",
    interest_rate_saving: "",
    recurring_deposit_total_amount: "",
    interest_rate_recurring: "",
    dnyanrudha_investment_total_amount: "",
    dynadhara_rate: ""
  });

  useEffect(() => {
    // Fetch case data for editing
    const fetchCaseData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setFormData({
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
            dynadhara_rate: 8.0
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching case data:", error);
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Case updated:", formData);
      navigate(`/cases/${id}`);
    } catch (error) {
      console.error("Error updating case:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
            <h1 className="text-3xl font-bold text-gray-800">Edit Case</h1>
            <p className="text-gray-600">Case ID: {id}</p>
          </div>
          <Button onClick={() => navigate(`/cases/${id}`)} variant="outline">
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card title="Basic Information" className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Type
                  </label>
                  <select
                    name="deposit_type"
                    value={formData.deposit_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Fixed Deposit">Fixed Deposit</option>
                    <option value="Savings Account">Savings Account</option>
                    <option value="Recurring Deposit">Recurring Deposit</option>
                    <option value="Dnyanrudha Investment">Dnyanrudha Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Running">Running</option>
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={formData.verified}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Verified
                  </label>
                </div>
              </div>
            </Card>

            {/* Financial Details */}
            <Card title="Financial Details">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="saving_account_start_date"
                    value={formData.saving_account_start_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Years)
                  </label>
                  <input
                    type="number"
                    name="deposit_duration_years"
                    value={formData.deposit_duration_years}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fixed Deposit Amount
                  </label>
                  <input
                    type="number"
                    name="fixed_deposit_total_amount"
                    value={formData.fixed_deposit_total_amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FD Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    name="interest_rate_fd"
                    value={formData.interest_rate_fd}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </Card>

            {/* Additional Financial Details */}
            <Card title="Additional Financial Details">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Savings Amount
                  </label>
                  <input
                    type="number"
                    name="saving_account_total_amount"
                    value={formData.saving_account_total_amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Savings Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    name="interest_rate_saving"
                    value={formData.interest_rate_saving}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recurring Deposit Amount
                  </label>
                  <input
                    type="number"
                    name="recurring_deposit_total_amount"
                    value={formData.recurring_deposit_total_amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recurring Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    name="interest_rate_recurring"
                    value={formData.interest_rate_recurring}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </Card>

            {/* Investment Details */}
            <Card title="Investment Details" className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dnyanrudha Investment Amount
                  </label>
                  <input
                    type="number"
                    name="dnyanrudha_investment_total_amount"
                    value={formData.dnyanrudha_investment_total_amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dynadhara Rate (%)
                  </label>
                  <input
                    type="number"
                    name="dynadhara_rate"
                    value={formData.dynadhara_rate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => navigate(`/cases/${id}`)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CaseEdit;
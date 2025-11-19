import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import ViewAllCases from "./ViewAllCases";
import AddNewCase from "./AddNewCase";
import MyProfile from "./MyProfile";
import AdminFeedbackManagement from "./AdminFeedbackManagement";
import {
  FaFolderOpen,
  FaPlus,
  FaUser,
  FaComments,
  FaChartBar,
  FaUsers,
  FaCog
} from "react-icons/fa";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("cases");

  const tabs = [
    { id: "cases", label: "View All Cases", icon: FaFolderOpen },
    { id: "add-case", label: "Add New Case", icon: FaPlus },
    { id: "feedback", label: "Feedback Management", icon: FaComments },
    { id: "profile", label: "My Profile", icon: FaUser },
  ];

  return (
    <DashboardLayout>
      <div className="m-3">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage cases, feedback, and system settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Admin Quick Actions */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1">
                    Generate Reports
                  </button>
                  <button className="w-full text-left text-sm text-green-600 hover:text-green-800 py-1">
                    System Analytics
                  </button>
                  <button className="w-full text-left text-sm text-purple-600 hover:text-purple-800 py-1">
                    User Management
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View All Cases */}
            {activeTab === "cases" && (
              <Card>
                <div className="p-6">
                  <ViewAllCases />
                </div>
              </Card>
            )}

            {/* Add New Case */}
            {activeTab === "add-case" && (
              <Card>
                <div className="p-6">
                  <AddNewCase />
                </div>
              </Card>
            )}

            {/* Feedback Management */}
            {activeTab === "feedback" && (
              <Card>
                <div className="p-6">
                  <AdminFeedbackManagement />
                </div>
              </Card>
            )}

            {/* My Profile */}
            {activeTab === "profile" && (
              <Card>
                <div className="p-6">
                  <MyProfile />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
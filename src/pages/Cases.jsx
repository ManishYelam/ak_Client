import DashboardLayout from "../layouts/DashboardLayout";
import CaseTable from "./CaseTable";
import { useNavigate } from "react-router-dom"; // ✅ for navigation

const Cases = () => {
  const navigate = useNavigate();

  // Callback for back button
  const handleBack = () => {
    navigate(-1); // goes back to the previous page
  };

  return (
    <DashboardLayout>
      <CaseTable onBack={handleBack} />
    </DashboardLayout>
  );
};

export default Cases;

import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/Button";

const Payments = () => {
  const handlePayment = async () => {
    // Razorpay integration code goes here
    alert("Razorpay Payment Integration coming soon!");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <Button onClick={handlePayment}>Pay Now</Button>
    </DashboardLayout>
  );
};

export default Payments;

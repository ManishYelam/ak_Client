import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      

      {/* Global Toast Notifications */}
      <Toast />

      {/* Page Content */}
      <main className="flex-grow container mx-auto ">
        {children}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default MainLayout;

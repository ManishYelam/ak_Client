import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss={true}
      draggable={true}
      pauseOnHover={true}
      theme="light"
      style={{
        zIndex: 9999,
      }}
      toastStyle={{
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e5e7eb',
        fontSize: '14px',
        fontWeight: '500',
        minHeight: '60px',
      }}
      progressStyle={{
        height: '3px',
      }}
      bodyStyle={{
        padding: '12px 16px',
        margin: 0,
      }}
      className="toast-container"
    />
  );
};

export default Toast;
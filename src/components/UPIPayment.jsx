import React, { useState } from "react";
import upiimg from "../assets/upi-qr.png"; // Adjust the path if needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCopy, 
  faQrcode, 
  faMobileScreen, 
  faCheckCircle 
} from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showWarningToast } from "../utils/Toastify";

const UPIPayment = ({ upiId = "yourname@bank", showInstructions = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      showSuccessToast("UPI ID copied to clipboard!");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy UPI ID:", err);
      showWarningToast("Failed to copy UPI ID. Please copy manually.");
    }
  };

  const handleDownloadQR = () => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = upiimg;
    link.download = `UPI-QR-${upiId.split('@')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessToast("QR code downloaded!");
  };

  const upiInstructions = [
    {
      icon: faQrcode,
      text: "Open your UPI app and tap on 'Scan QR Code'"
    },
    {
      icon: faMobileScreen,
      text: "Point your camera at the QR code above"
    },
    {
      icon: faCheckCircle,
      text: "Verify amount and complete the payment"
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FontAwesomeIcon icon={faQrcode} className="text-green-600 text-lg" />
          <h3 className="text-xl font-bold text-gray-800">Pay Using UPI</h3>
        </div>
        <p className="text-sm text-gray-600">
          Scan the QR code with any UPI app like Google Pay, PhonePe, Paytm, etc.
        </p>
      </div>

      {/* QR Code Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <img
              src={upiimg} 
              alt="UPI QR Code"
              className="mx-auto w-48 h-48 object-contain"
            />
          </div>
          
          {/* Download QR Button */}
          <button
            onClick={handleDownloadQR}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
          >
            <FontAwesomeIcon icon={faQrcode} />
            Download QR Code
          </button>
        </div>

        {/* UPI ID Section */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Or send payment directly to:</p>
          <div className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3">
            <span className="font-mono text-lg font-bold text-gray-800">
              {upiId}
            </span>
            <button
              onClick={handleCopyUPI}
              className={`p-2 rounded-lg transition-colors ${
                copied 
                  ? "bg-green-100 text-green-600" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Copy UPI ID"
            >
              <FontAwesomeIcon 
                icon={copied ? faCheckCircle : faCopy} 
                className={copied ? "text-green-600" : ""}
              />
            </button>
          </div>
          {copied && (
            <p className="text-green-600 text-xs mt-2 flex items-center justify-center gap-1">
              <FontAwesomeIcon icon={faCheckCircle} />
              Copied to clipboard!
            </p>
          )}
        </div>
      </div>

      {/* Instructions Section */}
      {showInstructions && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faMobileScreen} />
            How to Pay:
          </h4>
          <div className="space-y-3">
            {upiInstructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <FontAwesomeIcon 
                    icon={instruction.icon} 
                    className="text-blue-600 text-xs" 
                  />
                </div>
                <p className="text-sm text-blue-700">{instruction.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supported Apps */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 mb-2">Supported UPI Apps:</p>
        <div className="flex justify-center items-center gap-4 opacity-60">
          <span className="text-xs font-medium text-gray-600">Google Pay</span>
          <span className="text-xs font-medium text-gray-600">PhonePe</span>
          <span className="text-xs font-medium text-gray-600">Paytm</span>
          <span className="text-xs font-medium text-gray-600">BHIM</span>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800 text-center">
          💡 <strong>Important:</strong> After payment, don't forget to save the transaction ID and take a screenshot of the payment confirmation.
        </p>
      </div>
    </div>
  );
};

export default UPIPayment;
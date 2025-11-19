import React, { useState, useEffect, useCallback, useMemo } from "react";
import UPIPayment from "./UPIPayment";
import { createPaymentOrder, verifyPayment } from "../services/paymentsService";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast
} from "../utils/Toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faShieldAlt,
  faMobileAlt,
  faCheckCircle,
  faArrowRight,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { FaArrowLeft } from "react-icons/fa";

// Memoized components outside main component to prevent re-renders
const InstructionStep = React.memo(({ icon, text, description, isLast = false }) => (
  <div className="flex items-start gap-4">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <FontAwesomeIcon icon={icon} className="text-green-600 text-lg" />
      </div>
      {!isLast && <div className="w-0.5 h-12 bg-green-200 mt-2"></div>}
    </div>
    <div className="flex-1 pb-6">
      <h4 className="font-semibold text-gray-800 text-sm">{text}</h4>
      <p className="text-gray-600 text-xs mt-1">{description}</p>
    </div>
  </div>
));

const Payment = ({ amount, onPaymentSuccess, onBack, userData = {} }) => {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [txnId, setTxnId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayError, setRazorpayError] = useState(false);

  // Memoized instructions to prevent recreation on every render
  const razorpayInstructions = useMemo(() => [
    {
      icon: faCreditCard,
      text: "Click 'Pay with Razorpay' button",
      description: "You'll be redirected to secure payment page"
    },
    {
      icon: faShieldAlt,
      text: "Complete payment on Razorpay",
      description: "Use credit/debit card, UPI, net banking, or wallets"
    },
    {
      icon: faCheckCircle,
      text: "Automatic verification",
      description: "Payment is verified automatically - no manual steps needed"
    }
  ], []);

  const upiInstructions = useMemo(() => [
    {
      icon: faMobileAlt,
      text: "Scan QR code with UPI app",
      description: "Use Google Pay, PhonePe, Paytm, or any UPI app"
    },
    {
      icon: faCreditCard,
      text: "Complete payment in your app",
      description: "Enter amount and complete the transaction"
    },
    {
      icon: faExclamationTriangle,
      text: "Save transaction details",
      description: "Take screenshot and note Transaction ID for verification"
    }
  ], []);

  // Optimized Razorpay script loading with cleanup
  const razorpayScriptRef = React.useRef(null);
  const loadTimeoutRef = React.useRef(null);

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      // Fast path: already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      // Fast path: script already in DOM
      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) {
        const checkLoaded = () => {
          if (window.Razorpay) {
            resolve(true);
          } else {
            setTimeout(checkLoaded, 50);
          }
        };

        loadTimeoutRef.current = setTimeout(() => {
          resolve(false);
        }, 3000);

        checkLoaded();
        return;
      }

      // Create and load new script
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = import.meta.env.RAZORPAY_CHECKOUT;
      script.async = true;
      script.defer = true;

      razorpayScriptRef.current = script;

      script.onload = () => {
        clearTimeout(loadTimeoutRef.current);
        resolve(!!window.Razorpay);
      };

      script.onerror = () => {
        clearTimeout(loadTimeoutRef.current);
        resolve(false);
      };

      document.body.appendChild(script);

      loadTimeoutRef.current = setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }, []);

  // Optimized initialization
  const initializeRazorpay = useCallback(async () => {
    try {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        setRazorpayError(true);
        showInfoToast("Using UPI payment method as backup");
      }
    } catch (error) {
      console.error("Razorpay initialization failed:", error);
      setRazorpayError(true);
    }
  }, [loadRazorpayScript]);

  // Cleanup on unmount
  useEffect(() => {
    initializeRazorpay();

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [initializeRazorpay]);

  // Helper function to convert paise to rupees in backend responses
  const convertBackendResponseToRupees = useCallback((backendData) => {
    if (!backendData) return backendData;

    const convertAmount = (amt) => {
      // If amount is likely in paise (large number, divisible by 100), convert to rupees
      if (amt && amt > 1000 && amt % 100 === 0) {
        return amt / 100;
      }
      return amt;
    };

    // Deep clone and convert amounts
    const converted = JSON.parse(JSON.stringify(backendData));

    if (converted.order && converted.order.amount) {
      converted.order.amount_in_paise = converted.order.amount;
      converted.order.amount = convertAmount(converted.order.amount);
      converted.order.amount_display = formatAmount(converted.order.amount);
    }

    if (converted.amount && !converted.order) {
      converted.amount_in_paise = converted.amount;
      converted.amount = convertAmount(converted.amount);
      converted.amount_display = formatAmount(converted.amount);
    }

    return converted;
  }, []);

  // Memoized payment handler with optimized error handling
  const handleRazorpayPayment = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const isLoaded = razorpayLoaded || await loadRazorpayScript();

      if (!isLoaded || !window.Razorpay) {
        showWarningToast("Razorpay not available. Switching to UPI payment.");
        setRazorpayError(true);
        setPaymentMethod("upi");
        return;
      }

      const { data: backendOrder } = await createPaymentOrder({ amount });

      if (!backendOrder.order?.id) {
        showErrorToast("Failed to create payment order. Please try UPI payment instead.");
        return;
      }

      // Convert backend response from paise to rupees
      const order = convertBackendResponseToRupees(backendOrder);

      // console.log("Original order amount in paise:", backendOrder.order.amount);
      // console.log("Converted order amount in rupees:", order.order.amount);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: backendOrder.order.amount, // Use original paise amount for Razorpay
        currency: backendOrder.order.currency || "INR",
        name: "Satyamev Jayate",
        description: `Case Application Fee - ${formatAmount(amount)}`,
        order_id: backendOrder.order.id,
        handler: async (response) => {
          const verification_data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            const verifyRes = await verifyPayment(verification_data);

            // Convert verification response from paise to rupees
            const verifiedPayment = convertBackendResponseToRupees(verifyRes.data);

            if (verifiedPayment.success) {
              showSuccessToast(`✅ Payment of ${formatAmount(amount)} Successful!`);
              onPaymentSuccess({
                method: "razorpay",
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: amount, // In rupees
                currency: "INR",
                status: "completed",
                order: order.order, // Use converted order in rupees
                paymentResponse: verifiedPayment,
                timestamp: new Date().toISOString(),
              });
            } else {
              throw new Error("Verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            showErrorToast("Payment verification failed! Please contact support.");
          }
        },
        prefill: {
          name: userData.full_name || "",
          email: userData.email || "",
          contact: userData.phone_number || ""
        },
        notes: {
          case_type: "Application Fee",
          user_id: userData.id || "unknown",
          amount_inr: amount // Store original amount in rupees
        },
        theme: {
          color: "#22c55e",
        },
        modal: {
          ondismiss: () => {
            showInfoToast(`Payment of ${formatAmount(amount)} cancelled. You can retry or use UPI payment.`);
          },
        },
        retry: {
          enabled: true,
          max_count: 2
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        showErrorToast(`Payment of ${formatAmount(amount)} failed: ${response.error.description}. Please try UPI payment.`);
      });

      rzp.open();

    } catch (error) {
      console.error("Razorpay payment error:", error);

      if (error.response?.status === 500 || error.message?.includes('network') || !navigator.onLine) {
        showWarningToast(`Payment service unavailable. Switching to UPI payment.`);
        setRazorpayError(true);
        setPaymentMethod("upi");
      } else {
        showErrorToast(`Payment of ${formatAmount(amount)} failed. Please try UPI payment method.`);
      }
    } finally {
      setLoading(false);
    }
  }, [amount, userData, loading, razorpayLoaded, loadRazorpayScript, onPaymentSuccess, convertBackendResponseToRupees]);

  // Optimized UPI submit handler
  const handleUPISubmit = useCallback(async () => {
    if (!txnId.trim()) {
      showWarningToast("Please enter transaction ID.");
      return;
    }

    if (!screenshot) {
      showWarningToast("Please upload payment proof screenshot.");
      return;
    }

    setLoading(true);
    try {
      showSuccessToast(`✅ UPI payment of ${formatAmount(amount)} submitted successfully!`);
      onPaymentSuccess({
        method: "upi_manual",
        txnId: txnId.trim(),
        screenshot: screenshot,
        amount: amount, // In rupees
        currency: "INR",
        status: "pending_verification",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      showErrorToast(`Failed to submit payment of ${formatAmount(amount)}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [txnId, screenshot, amount, onPaymentSuccess]);

  // Optimized screenshot handler with debouncing
  const handleScreenshotChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Fast validation checks
    if (!file.type.startsWith('image/')) {
      showWarningToast("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showWarningToast("File size must be less than 5MB");
      return;
    }

    setScreenshot(file);
  }, []);

  // Memoized format function
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }, []);

  const removeScreenshot = useCallback(() => {
    setScreenshot(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  }, []);

  // Memoized payment method change handler
  const handlePaymentMethodChange = useCallback((method) => {
    setPaymentMethod(method);
  }, []);

  // Optimized effect for razorpay error handling
  useEffect(() => {
    if (razorpayError && paymentMethod === "razorpay") {
      setPaymentMethod("upi");
    }
  }, [razorpayError, paymentMethod]);

  // Memoized current instructions
  const currentInstructions = useMemo(() =>
    paymentMethod === "razorpay" ? razorpayInstructions : upiInstructions,
    [paymentMethod, razorpayInstructions, upiInstructions]
  );

  // Memoized screenshot preview URL with cleanup
  const screenshotPreview = useMemo(() => {
    if (!screenshot) return null;
    const url = URL.createObjectURL(screenshot);
    return () => URL.revokeObjectURL(url);
  }, [screenshot]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h3>
        <div className="text-3xl font-bold text-green-600">
          {formatAmount(amount)}
        </div>
        <p className="text-sm text-gray-600 mt-1">Case Application Fee</p>

        {razorpayError && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700 flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Using UPI payment (Razorpay unavailable)
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Method & Instructions */}
        <div className="space-y-6">
          {/* Payment Method Selection */}
          {!razorpayError && (
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onMethodChange={handlePaymentMethodChange}
              amount={amount}
              formatAmount={formatAmount}
            />
          )}

          {/* Payment Instructions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
              How to Pay - {paymentMethod === "razorpay" ? "Razorpay" : "UPI"}
            </h4>
            <div className="space-y-2">
              {currentInstructions.map((instruction, index, array) => (
                <InstructionStep
                  key={index}
                  icon={instruction.icon}
                  text={instruction.text}
                  description={instruction.description}
                  isLast={index === array.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Payment Action */}
        <PaymentActionSection
          paymentMethod={paymentMethod}
          razorpayError={razorpayError}
          loading={loading}
          txnId={txnId}
          screenshot={screenshot}
          screenshotPreview={screenshotPreview}
          onRazorpayPayment={handleRazorpayPayment}
          onUPISubmit={handleUPISubmit}
          onTxnIdChange={setTxnId}
          onScreenshotChange={handleScreenshotChange}
          onRemoveScreenshot={removeScreenshot}
          onMethodChange={handlePaymentMethodChange}
          onBack={onBack}
          amount={amount}
          formatAmount={formatAmount}
        />
      </div>

      {/* Security Footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
          Your payment is 100% secure and encrypted. We do not store your payment details.
        </p>
      </div>
    </div>
  );
};

// Extracted Payment Method Selector Component
const PaymentMethodSelector = React.memo(({ paymentMethod, onMethodChange, amount, formatAmount }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Choose Payment Method</h4>
    <div className="space-y-3">
      <PaymentMethodButton
        method="razorpay"
        currentMethod={paymentMethod}
        icon={faCreditCard}
        title="Razorpay"
        description={`Recommended - Pay ${formatAmount(amount)} securely`}
        color="green"
        onMethodChange={onMethodChange}
      />
      <PaymentMethodButton
        method="upi"
        currentMethod={paymentMethod}
        icon={faMobileAlt}
        title="UPI Payment"
        description={`Scan QR Code & Pay ${formatAmount(amount)}`}
        color="blue"
        onMethodChange={onMethodChange}
      />
    </div>
  </div>
));

// Extracted Payment Method Button Component
const PaymentMethodButton = React.memo(({
  method,
  currentMethod,
  icon,
  title,
  description,
  color,
  onMethodChange
}) => {
  const isSelected = currentMethod === method;
  const colorClasses = {
    green: {
      selected: "border-green-500 bg-green-50",
      icon: "bg-green-100 text-green-600",
    },
    blue: {
      selected: "border-blue-500 bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
    }
  };

  return (
    <button
      onClick={() => onMethodChange(method)}
      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${isSelected
        ? colorClasses[color].selected
        : "border-gray-300 bg-white hover:bg-gray-50"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? colorClasses[color].icon : "bg-gray-100"
          }`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <h5 className="font-semibold text-gray-800">{title}</h5>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {isSelected && (
          <FontAwesomeIcon icon={faCheckCircle} className={`text-${color}-500 ml-auto`} />
        )}
      </div>
    </button>
  );
});

// Extracted Payment Action Section Component
const PaymentActionSection = React.memo(({
  paymentMethod,
  razorpayError,
  loading,
  txnId,
  screenshot,
  screenshotPreview,
  onRazorpayPayment,
  onUPISubmit,
  onTxnIdChange,
  onScreenshotChange,
  onRemoveScreenshot,
  onMethodChange,
  onBack,
  amount,
  formatAmount
}) => (
  <div className="space-y-6">
    {/* Razorpay Payment Section */}
    {paymentMethod === "razorpay" && !razorpayError && (
      <RazorpayPaymentSection
        loading={loading}
        onPayment={onRazorpayPayment}
        onMethodChange={onMethodChange}
        amount={amount}
        formatAmount={formatAmount}
      />
    )}

    {/* UPI Payment Section */}
    {paymentMethod === "upi" && (
      <UPIPaymentSection
        razorpayError={razorpayError}
        loading={loading}
        txnId={txnId}
        screenshot={screenshot}
        screenshotPreview={screenshotPreview}
        onUPISubmit={onUPISubmit}
        onTxnIdChange={onTxnIdChange}
        onScreenshotChange={onScreenshotChange}
        onRemoveScreenshot={onRemoveScreenshot}
        onMethodChange={onMethodChange}
        amount={amount}
        formatAmount={formatAmount}
      />
    )}

    {/* Back Button */}
    <div className="text-center flex items-center justify-center">
      <button
        onClick={onBack}
        disabled={loading}
        className="px-8 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <FaArrowLeft /> Back to Previous Step
      </button>
    </div>
  </div>
));

// Extracted Razorpay Payment Section
const RazorpayPaymentSection = React.memo(({ loading, onPayment, onMethodChange, amount, formatAmount }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
    <h4 className="font-semibold text-green-800 mb-4 text-lg">Pay with Razorpay</h4>
    <p className="text-green-700 text-sm mb-6">
      You'll be redirected to Razorpay's secure payment gateway to complete your payment of {formatAmount(amount)} safely.
    </p>

    <div className="space-y-4">
      <button
        onClick={onPayment}
        disabled={loading}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            Pay {formatAmount(amount)} with Razorpay
            <FontAwesomeIcon icon={faArrowRight} />
          </>
        )}
      </button>

      <div className="text-center">
        <button
          onClick={() => onMethodChange("upi")}
          className="text-blue-600 text-sm hover:text-blue-700 underline"
        >
          Having issues? Use UPI payment instead
        </button>
      </div>
    </div>
  </div>
));

// Extracted UPI Payment Section
const UPIPaymentSection = React.memo(({
  razorpayError,
  loading,
  txnId,
  screenshot,
  screenshotPreview,
  onUPISubmit,
  onTxnIdChange,
  onScreenshotChange,
  onRemoveScreenshot,
  onMethodChange,
  amount,
  formatAmount
}) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
    {razorpayError && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-yellow-700 text-sm text-center">
          Razorpay is currently unavailable. Please use UPI payment method.
        </p>
      </div>
    )}

    <UPIPayment amount={amount} />

    {/* UPI Transaction Details */}
    <UPITransactionDetails
      txnId={txnId}
      screenshot={screenshot}
      screenshotPreview={screenshotPreview}
      onTxnIdChange={onTxnIdChange}
      onScreenshotChange={onScreenshotChange}
      onRemoveScreenshot={onRemoveScreenshot}
      amount={amount}
      formatAmount={formatAmount}
    />

    {/* UPI Action Buttons */}
    <div className="flex gap-3 mt-6">
      {!razorpayError && (
        <button
          onClick={() => onMethodChange("razorpay")}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faCreditCard} />
          Try Razorpay
        </button>
      )}

      <button
        onClick={onUPISubmit}
        disabled={loading || !txnId.trim() || !screenshot}
        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Submitting...
          </>
        ) : (
          <>
            Submit Payment Proof
            <FontAwesomeIcon icon={faCheckCircle} />
          </>
        )}
      </button>
    </div>
  </div>
));

// Extracted UPI Transaction Details
const UPITransactionDetails = React.memo(({
  txnId,
  screenshot,
  screenshotPreview,
  onTxnIdChange,
  onScreenshotChange,
  onRemoveScreenshot,
  amount,
  formatAmount
}) => (
  <div className="mt-6 space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Transaction ID *
      </label>
      <input
        type="text"
        placeholder={`Enter UPI Transaction ID for ${formatAmount(amount)}`}
        value={txnId}
        onChange={(e) => onTxnIdChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <ScreenshotUpload
      screenshot={screenshot}
      screenshotPreview={screenshotPreview}
      onScreenshotChange={onScreenshotChange}
      onRemoveScreenshot={onRemoveScreenshot}
      amount={amount}
      formatAmount={formatAmount}
    />
  </div>
));

// Extracted Screenshot Upload Component
const ScreenshotUpload = React.memo(({
  screenshot,
  screenshotPreview,
  onScreenshotChange,
  onRemoveScreenshot,
  amount,
  formatAmount
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Payment Proof Screenshot for {formatAmount(amount)} *
    </label>
    <div className="space-y-3">
      <label className="block">
        <input
          type="file"
          accept="image/*"
          onChange={onScreenshotChange}
          className="hidden"
        />
        <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors text-center">
          {screenshot ? 'Change Screenshot' : `Upload Payment Confirmation Screenshot for ${formatAmount(amount)}`}
        </div>
      </label>

      {screenshot && (
        <ScreenshotPreview
          screenshot={screenshot}
          screenshotPreview={screenshotPreview}
          onRemoveScreenshot={onRemoveScreenshot}
        />
      )}
    </div>
  </div>
));

// Extracted Screenshot Preview Component
const ScreenshotPreview = React.memo(({ screenshot, screenshotPreview, onRemoveScreenshot }) => (
  <>
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          📷
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {screenshot.name}
          </p>
          <p className="text-xs text-gray-500">
            {(screenshot.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
      <button
        onClick={onRemoveScreenshot}
        className="text-red-500 hover:text-red-700 p-2"
      >
        ×
      </button>
    </div>

    <div className="border rounded-lg p-3 bg-white">
      <p className="text-xs text-gray-600 mb-2">Screenshot Preview:</p>
      <img
        src={screenshotPreview}
        alt="Payment proof preview"
        className="max-h-40 mx-auto rounded border"
      />
    </div>
  </>
));

export default React.memo(Payment);
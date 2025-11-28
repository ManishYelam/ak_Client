// src/components/enrollment/PaymentStep.jsx
import React, { useState } from 'react'
import { Shield, CreditCard, Loader2, Check } from 'lucide-react'

const PaymentStep = ({ course, data, user, onBack, onPayment, paymentProcessing }) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const formatPrice = price => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPlanName = () => {
    switch (data.paymentPlan) {
      case 'full':
        return 'One-Time Payment'
      case 'installment':
        return '3-Month Installment Plan'
      default:
        return 'Payment Plan'
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Secure Payment</h3>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Course:</span>
          <span className="font-medium text-gray-900 text-right">{course.title}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Payment Plan:</span>
          <span className="font-medium text-gray-900">{getPlanName()}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
          <span className="text-lg font-bold text-primary-600">{formatPrice(course.fee)}</span>
        </div>
      </div>

      {/* Payment Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900">Secure Payment</h4>
            <p className="text-blue-700 text-sm mt-1">
              Your payment is secured with Razorpay. We never store your card details or banking
              information.
            </p>
          </div>
        </div>
      </div>

      {/* Accepted Payment Methods */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">We accept all major payment methods:</p>
        <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4" />
            <span>Credit/Debit Cards</span>
          </div>
          <div>UPI</div>
          <div>Net Banking</div>
          <div>Wallet</div>
        </div>
      </div>

      {/* Terms Agreement */}
      <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          checked={agreeToTerms}
          onChange={e => setAgreeToTerms(e.target.checked)}
          className="mt-0.5 text-primary-500 focus:ring-primary-500 w-4 h-4"
        />
        <span className="text-sm text-gray-600">
          I agree to the{' '}
          <a
            href="/terms"
            className="text-primary-600 hover:text-primary-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="text-primary-600 hover:text-primary-700 font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          . I understand that I will gain immediate access to the course materials upon successful
          payment.
        </span>
      </label>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={paymentProcessing}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={onPayment}
          disabled={!agreeToTerms || paymentProcessing}
          className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          {paymentProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatPrice(course.fee)}`
          )}
        </button>
      </div>
    </div>
  )
}

export default PaymentStep

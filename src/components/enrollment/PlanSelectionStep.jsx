// src/components/enrollment/PlanSelectionStep.jsx
import React from 'react'
import { BookOpen, Clock, Play, Check } from 'lucide-react'

const PlanSelectionStep = ({
  course,
  data,
  onChange,
  onNext,
  onBack,
  user,
  isAuthenticated,
  getCourseImage,
}) => {
  const pricingPlans = [
    {
      id: 'full',
      name: 'One-Time Payment',
      price: course.fee,
      savings: 'Save 15%',
      popular: false,
      features: [
        'Full course access',
        'Lifetime updates',
        'Certificate included',
        'Priority support',
      ],
    },
    {
      id: 'installment',
      name: '3-Month Installment',
      price: Math.ceil(course.fee / 3),
      total: course.fee * 1.1,
      note: '+10% processing fee',
      popular: true,
      features: [
        'Pay in 3 months',
        'Full course access',
        'Certificate included',
        'Standard support',
      ],
    },
  ]

  const formatPrice = price => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleFreeDemo = () => {
    window.open('/free-demo', '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Course Summary */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <img
            src={getCourseImage()}
            alt={course.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 hidden">
            <BookOpen className="w-6 h-6 text-primary-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{course.title}</h3>
          <p className="text-gray-600 text-sm mt-1 truncate">{course.instructor}</p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{course.duration}</span>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Choose Payment Plan</h4>
        <div className="space-y-3">
          {pricingPlans.map(plan => (
            <label
              key={plan.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                data.paymentPlan === plan.id
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name="paymentPlan"
                      value={plan.id}
                      checked={data.paymentPlan === plan.id}
                      onChange={e => onChange({ ...data, paymentPlan: e.target.value })}
                      className="text-primary-500 focus:ring-primary-500 w-4 h-4"
                    />
                    <span className="font-semibold text-gray-900">{plan.name}</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    {plan.id !== 'full' && <span className="text-sm text-gray-600">/month</span>}
                    {plan.savings && (
                      <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                        {plan.savings}
                      </span>
                    )}
                  </div>

                  {plan.note && <p className="text-sm text-gray-500 mb-3">{plan.note}</p>}

                  {plan.total && (
                    <p className="text-sm text-gray-600 mb-3">
                      Total: <span className="font-semibold">{formatPrice(plan.total)}</span>
                    </p>
                  )}

                  <div className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Free Demo Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 text-lg mb-2">Not sure yet?</h4>
          <p className="text-gray-600 mb-4">
            Try our free demo sessions to experience the course quality before enrolling
          </p>
          <button
            onClick={handleFreeDemo}
            className="w-full px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" />
            Watch Free Demo Sessions
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Includes 2 demo classes + detailed course syllabus + instructor introduction
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

export default PlanSelectionStep

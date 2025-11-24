// src/components/enrollment/EnrollmentFlow.jsx
import React, { useState, useEffect } from 'react'
import { 
  X, 
  Check, 
  Star, 
  Loader2, 
  User, 
  CreditCard, 
  FileText, 
  Shield,
  Clock,
  BookOpen,
  Play
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { loadRazorpay } from '../../utils/loadRazorpay'
import { paymentsAPI } from '../../services/api'

const EnrollmentFlow = ({ course, onClose }) => {
  const { user, updateUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [enrollmentData, setEnrollmentData] = useState({
    courseId: course?.course_id,
    paymentPlan: 'full',
    profileComplete: user?.user?.profileComplete || false
  })

  const userData = user?.user || user

  // Sample course images for fallback
  const sampleCourseImages = [
    '/images/courses/abap-basic.jpg',
    '/images/courses/abap-advanced.jpg',
    '/images/courses/abap-oop.jpg',
    '/images/courses/abap-performance.jpg'
  ]

  // Get course image with fallback
  const getCourseImage = () => {
    if (course?.thumbnail_image) {
      return course.thumbnail_image;
    }
    
    // Use course_id to get consistent fallback image, or random if no course_id
    const courseId = course?.course_id;
    if (courseId) {
      const index = courseId % sampleCourseImages.length;
      return sampleCourseImages[index];
    }
    
    // Random fallback if no course_id
    const randomIndex = Math.floor(Math.random() * sampleCourseImages.length);
    return sampleCourseImages[randomIndex];
  }

  // Debug: Check course object structure
  useEffect(() => {
    console.log('📚 Course object:', course)
    console.log('🔍 Course course_id:', course?.course_id)
  }, [course])

  // Check if user needs to complete profile
  useEffect(() => {
    if (userData && !userData.profileComplete) {
      setCurrentStep(0) // Start with profile completion
    } else {
      setCurrentStep(1) // Start with plan selection
    }
  }, [userData])

  // Update enrollmentData when course changes
  useEffect(() => {
    if (course?.course_id) {
      setEnrollmentData(prev => ({
        ...prev,
        courseId: course.course_id
      }))
    }
  }, [course?.course_id])

  const steps = [
    { id: 0, title: 'Complete Profile', icon: User },
    { id: 1, title: 'Choose Plan', icon: FileText },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Confirmation', icon: Check }
  ]

  const handleRazorpayPayment = async () => {
    setPaymentProcessing(true)
    
    try {
      console.log('🔄 Starting payment process...')
      console.log('📚 Course object for payment:', course)
      
      // Get the actual course ID
      const courseId = course?.course_id
      console.log('🎯 Using course ID:', courseId)

      if (!courseId) {
        throw new Error('Course ID is missing. Cannot proceed with payment.')
      }

      const Razorpay = await loadRazorpay()
      if (!Razorpay) {
        throw new Error('Failed to load Razorpay SDK')
      }
      console.log('✅ Razorpay SDK loaded')

      // Convert amount to paise - ensure course.fee is a number
      const courseFee = parseFloat(course.fee) || 0
      const amountInPaise = Math.round(courseFee * 100)
      console.log(`💰 Amount: ${courseFee} INR = ${amountInPaise} paise`)

      // Create order data with proper course ID
      const orderData = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `course_${courseId}_${Date.now()}`,
        courseId: courseId,
        notes: {
          courseId: courseId,
          courseTitle: course.title,
          userId: userData.user_id,
          userName: userData.full_name,
          userEmail: userData.email,
          paymentPlan: enrollmentData.paymentPlan,
          actualAmount: courseFee
        }
      }

      console.log('📦 Order data:', orderData)

      const orderResponse = await paymentsAPI.createRazorpayOrder(orderData)
      console.log('✅ Order response:', orderResponse.data)

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.error || 'Failed to create payment order')
      }

      const razorpayOrder = orderResponse.data.data.order
      console.log('🎫 Razorpay order created:', razorpayOrder)
      // console.log('🎫 Razorpay order created:', orderResponse.data.data.key_id)

      const options = {
        key: orderResponse.data.data.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'SAP ABAP Academy',
        description: `Enrollment for ${course.title}`,
        image: '/logo.png',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          console.log('💳 Payment successful:', response)
          await handlePaymentSuccess(response, razorpayOrder.id)
        },
        prefill: {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          contact: userData.phone || ''
        },
        notes: {
          course: course.title,
          courseId: courseId,
          userId: userData.user_id,
          paymentPlan: enrollmentData.paymentPlan,
          actualAmount: courseFee
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Payment modal dismissed')
            setPaymentProcessing(false)
          }
        }
      }

      console.log('🎯 Opening Razorpay checkout...')
      const razorpayInstance = new Razorpay(options)
      
      // Add error handlers
      razorpayInstance.on('payment.failed', function (response) {
        console.error('💥 Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description}`)
        setPaymentProcessing(false)
      })

      razorpayInstance.open()
      
    } catch (error) {
      console.error('💥 Payment initialization failed:', error)
      setPaymentProcessing(false)
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Payment initialization failed. Please try again.'
      
      alert(`Payment Error: ${errorMessage}`)
    }
  }

  const handlePaymentSuccess = async (paymentResponse, orderId) => {
    try {
      console.log('🔍 Verifying payment...', paymentResponse)
      
      const courseId = course?.course_id
      
      const verificationData = {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        courseId: courseId,
        userId: userData.user_id,
        amount: parseFloat(course.fee) || 0,
        paymentPlan: enrollmentData.paymentPlan
      }

      const verificationResponse = await paymentsAPI.verifyPayment(verificationData)
      console.log('✅ Verification response:', verificationResponse.data)

      if (verificationResponse.data.success) {
        await completeEnrollment(verificationResponse.data.paymentId)
      } else {
        throw new Error(verificationResponse.data.error || 'Payment verification failed')
      }
    } catch (error) {
      console.error('❌ Payment verification failed:', error)
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Payment verification failed. Please contact support.'
      alert(`Verification Error: ${errorMessage}`)
      setPaymentProcessing(false)
    }
  }

  const completeEnrollment = async (paymentId) => {
    setLoading(true)
    try {
      const courseId = course?.course_id
      console.log('🎓 Completing enrollment for course:', courseId)
      
      const updatedUser = {
        ...userData,
        enrolledCourses: [...(userData.enrolledCourses || []), courseId]
      }
      updateUser(updatedUser)
      setCurrentStep(3)
    } catch (error) {
      console.error('Enrollment failed:', error)
      alert('Enrollment failed. Please try again.')
    } finally {
      setLoading(false)
      setPaymentProcessing(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[85vh] flex flex-col">
        
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentStep === 0 ? 'Complete Profile' : 'Enroll in Course'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {currentStep + 1} of {steps.length}
              {userData?.profileComplete && <span className="text-primary-600"> • Returning</span>}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={loading || paymentProcessing}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Steps - Compact */}
        <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs ${
                  index <= currentStep
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : index === currentStep + 1
                    ? 'border-primary-500 text-primary-500'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <step.icon className="w-3 h-3" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1.5 ${
                    index < currentStep ? 'bg-primary-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content with Scroll */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentStep === 0 && (
            <ProfileCompletionStep
              user={userData}
              onComplete={(profileData) => {
                const updatedUser = {
                  ...userData,
                  ...profileData,
                  profileComplete: true
                }
                updateUser(updatedUser)
                setEnrollmentData(prev => ({...prev, profileComplete: true}))
                setCurrentStep(1)
              }}
            />
          )}
          
          {currentStep === 1 && (
            <PlanSelectionStep
              course={course}
              data={enrollmentData}
              onChange={setEnrollmentData}
              onNext={() => setCurrentStep(2)}
              onBack={userData?.profileComplete ? () => setCurrentStep(0) : undefined}
              user={userData}
              getCourseImage={getCourseImage}
            />
          )}
          
          {currentStep === 2 && (
            <PaymentStep
              course={course}
              data={enrollmentData}
              user={userData}
              onBack={() => setCurrentStep(1)}
              onPayment={handleRazorpayPayment}
              paymentProcessing={paymentProcessing}
            />
          )}
          
          {currentStep === 3 && (
            <ConfirmationStep
              course={course}
              user={userData}
              onComplete={() => window.location.href = `/learning/course/${course?.course_id}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Profile Completion Step Component - Compact
const ProfileCompletionStep = ({ user, onComplete }) => {
  const [profileData, setProfileData] = useState({
    profession: '',
    experience: '',
    goals: [],
    timeCommitment: ''
  })
  const [loading, setLoading] = useState(false)

  const professions = ['Student', 'Developer', 'Consultant', 'Manager', 'Freelancer', 'Other']
  const experienceLevels = ['0-1 years', '1-3 years', '3-5 years', '5+ years']
  const goals = ['Career Change', 'Skill Upgrade', 'Project Work', 'Certification', 'Personal Interest']
  const timeCommitments = ['1-5 hrs/week', '5-10 hrs/week', '10-15 hrs/week', '15+ hrs/week']

  const handleSubmit = async () => {
    setLoading(true)
    try {
      onComplete(profileData)
    } catch (error) {
      console.error('Profile completion failed:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFormComplete = profileData.profession && 
                        profileData.experience && 
                        profileData.goals.length > 0 && 
                        profileData.timeCommitment

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-5 h-5 text-primary-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Tell us about yourself</h3>
        <p className="text-xs text-gray-600 mt-1">Help us personalize your experience</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Current Profession</label>
          <select
            value={profileData.profession}
            onChange={(e) => setProfileData({...profileData, profession: e.target.value})}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select your profession</option>
            {professions.map(profession => (
              <option key={profession} value={profession}>{profession}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">SAP Experience Level</label>
          <div className="grid grid-cols-2 gap-2">
            {experienceLevels.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => setProfileData({...profileData, experience: level})}
                className={`p-2 border rounded-lg text-xs font-medium transition-all ${
                  profileData.experience === level
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Learning Goals</label>
          <div className="space-y-1.5">
            {goals.map(goal => (
              <label key={goal} className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={profileData.goals.includes(goal)}
                  onChange={(e) => {
                    const newGoals = e.target.checked
                      ? [...profileData.goals, goal]
                      : profileData.goals.filter(g => g !== goal)
                    setProfileData({...profileData, goals: newGoals})
                  }}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 w-3 h-3"
                />
                <span className="ml-2 text-gray-700">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Weekly Time Commitment</label>
          <div className="grid grid-cols-2 gap-2">
            {timeCommitments.map(commitment => (
              <button
                key={commitment}
                type="button"
                onClick={() => setProfileData({...profileData, timeCommitment: commitment})}
                className={`p-2 border rounded-lg text-xs font-medium transition-all ${
                  profileData.timeCommitment === commitment
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {commitment}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isFormComplete || loading}
        className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Profile & Continue'
        )}
      </button>
    </div>
  )
}

// Plan Selection Step Component - Compact
const PlanSelectionStep = ({ course, data, onChange, onNext, onBack, user, getCourseImage }) => {
  // Debug course object
  useEffect(() => {
    console.log('📚 PlanSelectionStep - Course:', course)
    console.log('🔍 PlanSelectionStep - Course ID:', course?.course_id)
  }, [course])

  const pricingPlans = [
    {
      id: 'full',
      name: 'One-Time Payment',
      price: course.fee,
      savings: 'Save 15%',
      popular: false
    },
    {
      id: 'installment',
      name: '3-Month Installment',
      price: Math.ceil(course.fee / 3),
      total: course.fee * 1.1,
      note: '+10% processing fee',
      popular: true
    }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleFreeDemo = () => {
    // Redirect to free demo page
    window.open('/free-demo', '_blank');
  }

  return (
    <div className="space-y-4">
      {/* Returning User Header - Compact */}
      {user?.profileComplete && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900 text-xs">Welcome back, {user.firstName}!</h4>
              <p className="text-green-700 text-xs">As a returning student</p>
            </div>
          </div>
        </div>
      )}

      {/* Course Summary - Compact */}
      <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="relative">
          <img 
            src={getCourseImage()} 
            alt={course.title}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            onError={(e) => {
              // If image fails to load, show book icon
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 hidden">
            <BookOpen className="w-5 h-5 text-primary-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{course.title}</h3>
          <p className="text-gray-600 text-xs mt-0.5 truncate">{course.instructor}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-600">{course.duration}</span>
          </div>
        </div>
      </div>

      {/* Pricing Plans - Compact */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm">Choose Payment Plan</h4>
        {pricingPlans.map(plan => (
          <label 
            key={plan.id}
            className={`block p-3 border-2 rounded-lg cursor-pointer transition-all text-sm ${
              data.paymentPlan === plan.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${plan.popular ? 'ring-1 ring-yellow-400' : ''}`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentPlan"
                value={plan.id}
                checked={data.paymentPlan === plan.id}
                onChange={(e) => onChange({ ...data, paymentPlan: e.target.value })}
                className="text-primary-500 focus:ring-primary-500 w-3 h-3"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900 text-sm">{plan.name}</span>
                  {plan.popular && (
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full whitespace-nowrap">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(plan.price)}
                  </span>
                  {plan.id !== 'full' && (
                    <span className="text-xs text-gray-600">/month</span>
                  )}
                  {plan.savings && (
                    <span className="text-xs text-green-600 font-medium">{plan.savings}</span>
                  )}
                </div>
                {plan.note && (
                  <p className="text-xs text-gray-500 mt-0.5">{plan.note}</p>
                )}
                {plan.total && (
                  <p className="text-xs text-gray-500">Total: {formatPrice(plan.total)}</p>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Free Demo Section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">Not sure yet?</h4>
          <p className="text-xs text-gray-600 mb-3">
            Try our free demo sessions to experience the course quality
          </p>
          <button
            onClick={handleFreeDemo}
            className="w-full px-4 py-2.5 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Watch Free Demo Sessions
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Includes 2 demo classes + course syllabus
          </p>
        </div>
      </div>

      {/* Action Buttons - Compact */}
      <div className="flex gap-2 pt-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          className="flex-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  )
}

// Payment Step Component - Compact
const PaymentStep = ({ course, data, user, onBack, onPayment, paymentProcessing }) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">Secure Payment</h3>
      
      {/* Order Summary - Compact */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Course:</span>
          <span className="font-medium truncate">{course.title}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment Plan:</span>
          <span className="font-medium">
            {data.paymentPlan === 'full' ? 'One-Time' : 
             data.paymentPlan === 'installment' ? '3-Month Installment' : 'Monthly'}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
          <span>Total Amount:</span>
          <span>{formatPrice(course.fee)}</span>
        </div>
      </div>

      {/* Payment Security Info - Compact */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-900 text-xs">Secure Payment</h4>
            <p className="text-blue-700 text-xs">
              Secured with Razorpay. We never store card details.
            </p>
          </div>
        </div>
      </div>

      {/* Accepted Payment Methods - Compact */}
      <div className="text-center">
        <p className="text-xs text-gray-600 mb-1.5">We accept:</p>
        <div className="flex justify-center items-center gap-3">
          <div className="text-xs text-gray-500">Cards</div>
          <div className="text-xs text-gray-500">UPI</div>
          <div className="text-xs text-gray-500">Net Banking</div>
        </div>
      </div>

      {/* Terms Agreement - Compact */}
      <label className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg text-xs">
        <input
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="mt-0.5 text-primary-500 focus:ring-primary-500 w-3 h-3"
        />
        <span className="text-gray-600">
          I agree to the{' '}
          <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
            Privacy Policy
          </a>
        </span>
      </label>

      {/* Action Buttons - Compact */}
      <div className="flex gap-2 pt-3">
        <button
          onClick={onBack}
          className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Back
        </button>
        <button
          onClick={onPayment}
          disabled={!agreeToTerms || paymentProcessing}
          className="flex-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-1.5"
        >
          {paymentProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
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

// Confirmation Step Component - Compact
const ConfirmationStep = ({ course, user, onComplete }) => {
  const courseId = course?.course_id
  
  return (
    <div className="text-center py-6">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Check className="w-6 h-6 text-green-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Enrollment Successful!</h3>
      <p className="text-sm text-gray-600 mb-4">
        Welcome to <strong>{course.title}</strong>
      </p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => window.location.href = `/learning/course/${courseId}`}
          className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
        >
          Go to Course
        </button>
        <button
          onClick={() => window.location.href = '/courses'}
          className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Back to Courses
        </button>
      </div>
    </div>
  )
}

export default EnrollmentFlow
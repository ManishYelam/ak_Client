// src/pages/TermsOfService.jsx
import React, { useMemo } from 'react'
import { FileText, BookOpen, AlertCircle, CreditCard, GraduationCap, Users, ChevronRight, ArrowUp } from 'lucide-react'

// Reuse SmoothScrollLink and ScrollToTop components from PrivacyPolicy
const SmoothScrollLink = ({ href, children, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      const offset = 80
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      onClick?.()
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="flex items-center justify-between text-sm text-gray-600 hover:text-primary-600 py-2 px-3 rounded-lg hover:bg-primary-50 transition-all duration-200 group"
    >
      <span>{children}</span>
      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}

const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}

// Memoized section component
const TermsSection = React.memo(({ id, icon: Icon, title, children }) => (
  <div id={id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
      {children}
    </div>
  </div>
))

TermsSection.displayName = 'TermsSection'

const TermsOfService = () => {
  const termsSections = useMemo(() => [
    {
      id: 'enrollment',
      icon: BookOpen,
      title: 'Course Enrollment & Access',
      content: `By enrolling in our SAP ABAP courses, you agree to the following terms:

🎯 **Account Requirements**:
• Provide accurate and complete registration information
• Maintain the confidentiality of your account credentials
• Not share course materials with unauthorized individuals

📚 **Course Access**:
• Complete courses within the specified timeframe
• Follow all course guidelines and instructions
• Access content only through authorized means

🔄 **Account Management**:
• One active enrollment per paid account
• Immediate access upon successful payment
• Lifetime access to course materials (subject to platform availability)`
    },
    {
      id: 'payments',
      icon: CreditCard,
      title: 'Payments & Refunds',
      content: `Our payment and refund policies ensure fair treatment for all students:

💳 **Payment Terms**:
• Course fees must be paid in full before access is granted
• We accept various payment methods including credit cards, UPI, and bank transfers
• All prices are in INR unless otherwise specified

↩️ **Refund Policy**:
• 7-day money-back guarantee if no content has been accessed
• No refunds once course materials have been accessed
• Refund requests must be submitted via email

📈 **Price Changes**:
• We reserve the right to change course fees with 30 days notice
• Existing enrollments are not affected by price changes`
    },
    {
      id: 'responsibilities',
      icon: GraduationCap,
      title: 'Student Responsibilities',
      content: `As a valued student, you agree to:

👨‍🎓 **Academic Conduct**:
• Act professionally and respectfully in all interactions
• Complete assignments and projects independently
• Maintain academic integrity and avoid plagiarism

🛡️ **Content Usage**:
• Not distribute or share copyrighted course materials
• Use course content for personal learning only
• Respect intellectual property rights

📱 **Platform Usage**:
• Participate actively in learning activities
• Not attempt to disrupt platform functionality
• Report any technical issues promptly`
    },
    {
      id: 'intellectual-property',
      icon: Users,
      title: 'Intellectual Property',
      content: `All educational content is protected intellectual property:

📹 **Course Materials**:
• Video lectures, tutorials, and demonstrations
• Documentation, study materials, and guides
• Code examples, projects, and solutions
• Assessment questions and answers

© **Copyright Notice**:
• All content is copyright of LearnSAPABAP
• No reproduction, distribution, or sharing without explicit permission
• Personal learning use is permitted

🔒 **Protection**:
• Legal action will be taken against copyright violations
• Platform access may be terminated for IP violations`
    },
    {
      id: 'liability',
      icon: AlertCircle,
      title: 'Limitations of Liability',
      content: `Important disclaimers and limitations:

🎓 **Educational Outcomes**:
• We provide quality education but don't guarantee employment
• Course completion doesn't guarantee specific job outcomes
• Success depends on individual effort and market conditions

💻 **Technical Issues**:
• We're not responsible for technical issues on student's devices
• We maintain 99% platform uptime but can't guarantee 100%
• Regular maintenance may cause temporary unavailability

📝 **Content Accuracy**:
• Course content is regularly updated for accuracy
• SAP ABAP concepts may evolve over time
• We reserve the right to update or modify course content`
    }
  ], [])

  const quickFacts = useMemo(() => [
    {
      icon: '⏱️',
      title: 'Course Access',
      content: 'Lifetime access to enrolled courses'
    },
    {
      icon: '🎯',
      title: 'Support',
      content: 'Dedicated support during course duration'
    },
    {
      icon: '🔄',
      title: 'Updates',
      content: 'Free course content updates'
    },
    {
      icon: '📜',
      title: 'Certification',
      content: 'Certificate upon successful completion'
    },
    {
      icon: '💳',
      title: 'Payment',
      content: 'Secure payment processing'
    },
    {
      icon: '📞',
      title: 'Help',
      content: '24/7 email support'
    }
  ], [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold font-display mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before enrolling in our SAP ABAP courses. Your education journey starts with understanding our commitment to you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Navigation & Facts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Navigation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Quick Navigation</h3>
              </div>
              <nav className="space-y-1">
                {termsSections.map((section, index) => (
                  <SmoothScrollLink key={index} href={`#${section.id}`}>
                    {section.title}
                  </SmoothScrollLink>
                ))}
                <SmoothScrollLink href="#termination">
                  Termination Policy
                </SmoothScrollLink>
                <SmoothScrollLink href="#contact">
                  Contact Information
                </SmoothScrollLink>
              </nav>

              {/* Effective Date */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Effective Date</p>
                <p className="text-sm font-semibold text-gray-900">December 2023</p>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickFacts.map((fact, index) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors">
                    <div className="text-lg mb-1">{fact.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-xs mb-1">{fact.title}</h4>
                    <p className="text-xs text-gray-600">{fact.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Important Notice */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8 shadow-lg">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Important Legal Notice</h3>
                  <p className="text-orange-100 leading-relaxed">
                    By accessing our website and enrolling in our courses, you agree to be bound by these Terms of Service. 
                    If you do not agree with any part of these terms, you may not use our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Effective Date Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-lg">📅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg">Terms Version 3.0</h3>
                  <p className="text-blue-700">Effective from December 15, 2023</p>
                </div>
              </div>
            </div>

            {/* Terms Sections */}
            {termsSections.map((section, index) => (
              <TermsSection key={index} id={section.id} icon={section.icon} title={section.title}>
                {section.content}
              </TermsSection>
            ))}

            {/* Termination Clause */}
            <div id="termination" className="bg-red-50 border border-red-200 rounded-2xl p-8 mt-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Termination Policy</h3>
              </div>
              <div className="text-gray-700 space-y-4">
                <p>
                  We reserve the right to terminate or suspend access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="font-semibold">
                  Upon termination, your right to use the service will cease immediately. If you wish to terminate your account, you may simply discontinue using the service.
                </p>
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-700 mb-2">Grounds for Immediate Termination:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Sharing course materials with unauthorized users</li>
                    <li>• Attempting to disrupt platform services</li>
                    <li>• Violating intellectual property rights</li>
                    <li>• Fraudulent activities or payment issues</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact for Questions */}
            <div id="contact" className="mt-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
              <p className="text-primary-100 mb-6 text-lg">
                Our team is here to clarify any aspect of our Terms of Service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Contact Legal Team</h4>
                  <div className="space-y-2 text-primary-100">
                    <p>📧 legal@learnsapabap.com</p>
                    <p>📞 +91 9876543210</p>
                    <p>📍 Pune, India</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support Hours</h4>
                  <p className="text-primary-100">
                    Monday - Friday: 9:00 AM - 6:00 PM IST<br/>
                    Weekend: Emergency support only
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </div>
  )
}

export default React.memo(TermsOfService)
// src/pages/dashboard/Certificates.jsx
import React, { useState } from 'react'

const Certificates = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const certificates = [
    {
      id: 'CERT-001',
      course: {
        id: 1,
        title: "SAP ABAP Basics",
        instructor: "Akshay Kumar",
        duration: "6 weeks",
        completedDate: "2024-02-10"
      },
      issueDate: "2024-02-11",
      expiryDate: null,
      grade: "A+",
      score: 98,
      certificateUrl: "/certificates/cert-001.pdf",
      verificationCode: "ABAP-BASICS-2024-001",
      status: "issued",
      thumbnail: "/images/certificate-placeholder.jpg"
    },
    {
      id: 'CERT-002',
      course: {
        id: 5,
        title: "SAP ABAP Debugging Techniques",
        instructor: "Akshay Kumar",
        duration: "4 weeks",
        completedDate: "2024-02-08"
      },
      issueDate: "2024-02-09",
      expiryDate: "2025-02-09",
      grade: "A",
      score: 95,
      certificateUrl: "/certificates/cert-002.pdf",
      verificationCode: "DEBUG-2024-001",
      status: "issued",
      thumbnail: "/images/certificate-placeholder.jpg"
    },
    {
      id: 'CERT-003',
      course: {
        id: 2,
        title: "Advanced ABAP Programming",
        instructor: "Akshay Kumar",
        duration: "8 weeks",
        completedDate: null
      },
      issueDate: null,
      expiryDate: null,
      grade: null,
      score: null,
      certificateUrl: null,
      verificationCode: null,
      status: "in-progress",
      progress: 45,
      thumbnail: "/images/certificate-placeholder.jpg"
    },
    {
      id: 'CERT-004',
      course: {
        id: 3,
        title: "SAP Fiori Development",
        instructor: "Akshay Kumar",
        duration: "10 weeks",
        completedDate: null
      },
      issueDate: null,
      expiryDate: null,
      grade: null,
      score: null,
      certificateUrl: null,
      verificationCode: null,
      status: "in-progress",
      progress: 20,
      thumbnail: "/images/certificate-placeholder.jpg"
    }
  ]

  const filters = [
    { id: 'all', name: 'All Certificates', count: certificates.length },
    { id: 'issued', name: 'Issued', count: certificates.filter(c => c.status === 'issued').length },
    { id: 'in-progress', name: 'In Progress', count: certificates.filter(c => c.status === 'in-progress').length },
    { id: 'expired', name: 'Expired', count: certificates.filter(c => c.status === 'expired').length }
  ]

  const filteredCertificates = certificates.filter(certificate => 
    activeFilter === 'all' || certificate.status === activeFilter
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800'
    if (grade === 'A+') return 'bg-green-100 text-green-800'
    if (grade === 'A') return 'bg-blue-100 text-blue-800'
    if (grade === 'B') return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-600">Your earned certificates and course completions</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Download All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Certificates</p>
          <p className="text-2xl font-bold text-gray-900">
            {certificates.filter(c => c.status === 'issued').length}
          </p>
          <p className="text-sm text-green-600">Earned</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-gray-900">
            {certificates.filter(c => c.status === 'in-progress').length}
          </p>
          <p className="text-sm text-blue-600">Working on</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Avg Score</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(certificates.filter(c => c.score).reduce((acc, cert) => acc + cert.score, 0) / certificates.filter(c => c.score).length)}%
          </p>
          <p className="text-sm text-purple-600">Performance</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Skills Certified</p>
          <p className="text-2xl font-bold text-gray-900">8</p>
          <p className="text-sm text-orange-600">Mastered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeFilter === filter.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter.name} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCertificates.map(certificate => (
          <div key={certificate.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              {/* Certificate Thumbnail */}
              <div className="md:w-2/5">
                <img 
                  src={certificate.thumbnail} 
                  alt={certificate.course.title}
                  className="w-full h-48 md:h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNEOEU5RTYiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSI3MCIgeT0iODAiIHdpZHRoPSIyNjAiIGhlaWdodD0iNDAiIGZpbGw9IiNEOEU5RTYiLz4KPHJlY3QgeD0iNzAiIHk9IjE0MCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIyIiBmaWxsPSIjRDhFOUU2Ii8+CjxyZWN0IHg9IjcwIiB5PSIxNjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iOCIkZmlsbD0iI0Q4RTlFNiIvPgo8cmVjdCB4PSI3MCIgeT0iMTgwIiB3aWR0aD0iODAiIGhlaWdodD0iOCIkgZmlsbD0iI0Q4RTlFNiIvPgo8L3N2Zz4K'
                  }}
                />
              </div>

              {/* Certificate Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{certificate.course.title}</h3>
                    <p className="text-sm text-gray-600">by {certificate.course.instructor}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(certificate.status)}`}>
                    {certificate.status === 'issued' ? 'Issued' : 
                     certificate.status === 'in-progress' ? 'In Progress' : 'Expired'}
                  </span>
                </div>

                {certificate.status === 'issued' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Issue Date:</span>
                        <p>{new Date(certificate.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Completed:</span>
                        <p>{new Date(certificate.course.completedDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">Grade:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getGradeColor(certificate.grade)}`}>
                          {certificate.grade} ({certificate.score}%)
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p>{certificate.course.duration}</p>
                      </div>
                    </div>

                    {certificate.expiryDate && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">Expires:</span>{' '}
                          {new Date(certificate.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors">
                        Download PDF
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Share
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Verification Code: <code className="bg-gray-100 px-2 py-1 rounded">{certificate.verificationCode}</code>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Course Progress</span>
                        <span className="font-medium text-gray-900">{certificate.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${certificate.progress}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">
                      Complete the course to earn your certificate. Continue learning to unlock this achievement!
                    </p>

                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium transition-colors">
                      Continue Learning
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCertificates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
          <p className="text-gray-600 mb-4">
            {activeFilter === 'issued' 
              ? 'Complete courses to earn certificates' 
              : 'No certificates match your current filter'
            }
          </p>
          {activeFilter !== 'all' && (
            <button 
              onClick={() => setActiveFilter('all')}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              View All Certificates
            </button>
          )}
        </div>
      )}

      {/* Certificate Verification */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Verify Certificate</h3>
        <p className="text-blue-800 mb-4">
          Use the verification code on your certificate to validate its authenticity.
        </p>
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Enter verification code..."
            className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Verify
          </button>
        </div>
      </div>
    </div>
  )
}

export default Certificates
// src/pages/dashboard/CourseManagement.jsx
import React, { useState } from 'react'

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const courses = [
    {
      id: 1,
      title: "SAP ABAP Basics",
      description: "Learn the fundamentals of SAP ABAP programming",
      instructor: "Akshay Kumar",
      category: "Programming",
      level: "Beginner",
      duration: "6 weeks",
      students: 120,
      rating: 4.8,
      price: 99,
      status: "published",
      created: "2024-01-10",
      thumbnail: "/images/course-placeholder.jpg"
    },
    {
      id: 2,
      title: "Advanced ABAP Programming",
      description: "Master advanced ABAP concepts and techniques",
      instructor: "Akshay Kumar",
      category: "Programming",
      level: "Intermediate",
      duration: "8 weeks",
      students: 85,
      rating: 4.9,
      price: 149,
      status: "published",
      created: "2024-01-15",
      thumbnail: "/images/course-placeholder.jpg"
    },
    {
      id: 3,
      title: "SAP Fiori Development",
      description: "Build modern SAP Fiori applications",
      instructor: "Akshay Kumar",
      category: "UI Development",
      level: "Advanced",
      duration: "10 weeks",
      students: 65,
      rating: 4.7,
      price: 199,
      status: "draft",
      created: "2024-02-01",
      thumbnail: "/images/course-placeholder.jpg"
    },
    {
      id: 4,
      title: "ABAP Object-Oriented Programming",
      description: "Learn OOP concepts in ABAP",
      instructor: "Akshay Kumar",
      category: "Programming",
      level: "Intermediate",
      duration: "7 weeks",
      students: 45,
      rating: 4.6,
      price: 129,
      status: "published",
      created: "2024-01-20",
      thumbnail: "/images/course-placeholder.jpg"
    }
  ]

  const tabs = [
    { id: 'all', name: 'All Courses', count: courses.length },
    { id: 'published', name: 'Published', count: courses.filter(c => c.status === 'published').length },
    { id: 'draft', name: 'Drafts', count: courses.filter(c => c.status === 'draft').length },
    { id: 'archived', name: 'Archived', count: 0 }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || course.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-blue-100 text-blue-800'
      case 'Intermediate': return 'bg-purple-100 text-purple-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Create, manage, and monitor all courses</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium mt-4 lg:mt-0">
          Create New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Courses</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-green-600">+2 this month</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-gray-900">487</p>
          <p className="text-sm text-blue-600">Active enrollments</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Avg Rating</p>
          <p className="text-2xl font-bold text-gray-900">4.8</p>
          <p className="text-sm text-yellow-600">Out of 5 stars</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-600">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">$12.5K</p>
          <p className="text-sm text-green-600">This month</p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full lg:w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Course Image */}
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDQwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgOTZDMjAwIDExOS43NjUgMTgwLjc2NSAxMzkgMTU3IDEzOUMxMzMuMjM1IDEzOSAxMTQgMTE5Ljc2NSAxMTQgOTZDMTE0IDcyLjIzNSAxMzMuMjM1IDUzIDE1NyA1M0MxODAuNzY1IDUzIDIwMCA3Mi4yMzUgMjAwIDk2WiIgZmlsbD0iIzhFOUEBMiIvPgo8cGF0aCBkPSJNMjg2IDE5Mkg3OEM3MCAxOTIgNjQgMTg2IDY0IDE3OFYxMzhIMjg2VjE3OEMyODYgMTg2IDI4MCAxOTIgMjcyIDE5MloiIGZpbGw9IiM4RTlBQTIiLz4KPC9zdmc+Cg=='
                }}
              />
              <div className="absolute top-3 right-3 flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {course.rating}
                </span>
                <span className="mx-2">•</span>
                <span>{course.students} students</span>
                <span className="mx-2">•</span>
                <span>{course.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">${course.price}</div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or create a new course.</p>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium">
            Create Your First Course
          </button>
        </div>
      )}
    </div>
  )
}

export default CourseManagement
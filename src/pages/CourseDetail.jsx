// src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Clock,
  Users,
  Star,
  CheckCircle,
  Play,
  ArrowLeft,
  BookOpen,
  BarChart,
  Target,
  Calendar,
} from 'lucide-react'
import { coursesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const response = await coursesAPI.getById(id)
        setCourse(response.data)
      } catch (err) {
        setError('Course not found')
        console.error('Error fetching course:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }
    // Handle enrollment logic here
    console.log('Enrolling in course:', course.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The course you are looking for does not exist.'}
          </p>
          <Link to="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {course.category}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-700">{course.rating}</span>
                  <span className="text-gray-500">({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolledCount} students enrolled</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {course.instructor?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {course.instructor?.name || 'Akshay'}
                    </p>
                    <p className="text-sm text-gray-500">SAP ABAP Expert</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-large border border-gray-200 p-6 h-fit sticky top-24">
              <div className="aspect-video bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl mb-6 flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-2">
                {course.price === 0 ? 'Free' : `₹${course.price}`}
              </div>

              <button
                onClick={handleEnroll}
                className="w-full btn-primary py-4 text-lg font-semibold mb-4"
              >
                Enroll Now
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>1:1 mentorship support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Real-world projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-medium border border-gray-200 overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {['overview', 'curriculum', 'instructor'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                        activeTab === tab
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {course.fullDescription || course.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-6 h-6 text-primary-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Skill Level</h4>
                          <p className="text-gray-600">{course.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Target className="w-6 h-6 text-primary-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Prerequisites</h4>
                          <p className="text-gray-600">Basic programming knowledge</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BarChart className="w-6 h-6 text-primary-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Projects</h4>
                          <p className="text-gray-600">5+ real-world projects</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-primary-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Duration</h4>
                          <p className="text-gray-600">{course.duration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Course Curriculum</h3>
                    <div className="space-y-4">
                      {course.modules?.map((module, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                          <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-900">
                              Module {index + 1}: {module.title}
                            </h4>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {module.lessons?.map((lesson, lessonIndex) => (
                                <div
                                  key={lessonIndex}
                                  className="flex items-center justify-between py-2"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Play className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700">{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                        {course.instructor?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {course.instructor?.name || 'Akshay'}
                        </h3>
                        <p className="text-gray-600">SAP ABAP Expert & Corporate Trainer</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary-600">10+</div>
                        <div className="text-gray-600">Years Experience</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary-600">1000+</div>
                        <div className="text-gray-600">Students Trained</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-primary-600">50+</div>
                        <div className="text-gray-600">Corporate Clients</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">About the Instructor</h4>
                      <p className="text-gray-600 leading-relaxed">
                        With over a decade of experience in SAP ABAP development and consulting,
                        Akshay has trained thousands of professionals and helped them build
                        successful careers in the SAP ecosystem. His practical approach to teaching
                        focuses on real-world scenarios and industry best practices.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail

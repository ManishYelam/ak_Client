// src/pages/Home.jsx
import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  Clock, 
  Users,
  BarChart,
  Play,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Shield,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  Rocket,
  Heart
} from 'lucide-react'
import { coursesAPI } from '../services/api'

// Lazy load CourseCard for better performance
const CourseCard = lazy(() => import('../components/ui/CourseCard'))

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoized data to prevent unnecessary re-renders
  const features = useMemo(() => [
    {
      name: 'Expert-Led Training',
      description: 'Learn from industry expert Akshay with 10+ years of SAP ABAP experience',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      name: 'Flexible Learning',
      description: 'Online live sessions with recorded videos accessible 24/7',
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      name: 'Career Support',
      description: '1:1 mentorship and resume preparation for job placements',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      name: 'Real-world Projects',
      description: 'Hands-on experience with actual SAP ABAP development scenarios',
      icon: BarChart,
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
  ], [])

  const stats = useMemo(() => [
    { 
      label: 'Students Trained', 
      value: '1000+',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Success Rate', 
      value: '95%',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Course Duration', 
      value: '3 Months',
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Placement Support', 
      value: '100%',
      icon: Award,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
  ], [])

  const curriculumHighlights = useMemo(() => [
    "Core ABAP Programming Fundamentals",
    "ABAP on HANA & S/4HANA",
    "Object-Oriented ABAP (OOABAP)",
    "Web Dynpro & Fiori Development",
    "ALV Reports & Dialog Programming",
    "BDC, BAPI, RFC & Enhancement Framework",
    "Real-time Project Experience",
    "Interview Preparation & Mock Tests"
  ], [])

  const testimonials = useMemo(() => [
    {
      name: "Rahul Sharma",
      role: "SAP ABAP Consultant",
      company: "Tech Mahindra",
      content: "The SAP ABAP course completely transformed my career. The practical approach and real-world projects helped me secure a job immediately after completion.",
      rating: 5,
      avatar: "RS"
    },
    {
      name: "Priya Patel",
      role: "Senior ABAP Developer",
      company: "Infosys",
      content: "Excellent training methodology! The instructor's industry experience made all the difference. Got placed within 2 months of course completion.",
      rating: 5,
      avatar: "PP"
    },
    {
      name: "Amit Kumar",
      role: "SAP Consultant",
      company: "Wipro",
      content: "Comprehensive curriculum covering all aspects of ABAP. The placement support and interview preparation were incredibly helpful.",
      rating: 5,
      avatar: "AK"
    }
  ], [])

  useEffect(() => {
    let isMounted = true

    const fetchCoursesForHomepage = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let allCourses = []
        
        // Parallel fetching for better performance
        const [featuredResponse, regularResponse] = await Promise.allSettled([
          coursesAPI.getAll({
            page: 1,
            limit: 6,
            filters: { featured: true },
            sortBy: 'created_at',
            sortOrder: 'DESC'
          }),
          coursesAPI.getAll({
            page: 1,
            limit: 8,
            filters: { featured: false },
            sortBy: 'view_count',
            sortOrder: 'DESC'
          })
        ])

        // Process featured courses
        if (featuredResponse.status === 'fulfilled') {
          const featuredData = featuredResponse.value.data?.data || featuredResponse.value.data
          if (Array.isArray(featuredData)) {
            allCourses = featuredData
          } else if (featuredData?.courses) {
            allCourses = featuredData.courses
          }
        }

        // If we need more courses, add from regular
        if (allCourses.length < 6 && regularResponse.status === 'fulfilled') {
          const regularData = regularResponse.value.data?.data || regularResponse.value.data
          let regularCourses = []
          
          if (Array.isArray(regularData)) {
            regularCourses = regularData
          } else if (regularData?.courses) {
            regularCourses = regularData.courses
          }

          const existingIds = new Set(allCourses.map(course => course.course_id || course.id))
          const uniqueRegularCourses = regularCourses.filter(course => 
            !existingIds.has(course.course_id || course.id)
          )
          
          allCourses = [...allCourses, ...uniqueRegularCourses.slice(0, 6 - allCourses.length)]
        }

        // Final fallback if still not enough
        if (allCourses.length < 6) {
          try {
            const fallbackResponse = await coursesAPI.getAll({
              page: 1,
              limit: 8,
              sortBy: 'view_count',
              sortOrder: 'DESC'
            })
            
            const fallbackData = fallbackResponse.data?.data || fallbackResponse.data
            let fallbackCourses = []
            
            if (Array.isArray(fallbackData)) {
              fallbackCourses = fallbackData
            } else if (fallbackData?.courses) {
              fallbackCourses = fallbackData.courses
            }

            const existingIds = new Set(allCourses.map(course => course.course_id || course.id))
            const uniqueFallbackCourses = fallbackCourses.filter(course => 
              !existingIds.has(course.course_id || course.id)
            )
            
            allCourses = [...allCourses, ...uniqueFallbackCourses.slice(0, 6 - allCourses.length)]
          } catch (fallbackError) {
            console.error('Fallback fetch failed:', fallbackError)
          }
        }

        if (isMounted) {
          setFeaturedCourses(allCourses.slice(0, 6))
        }
        
      } catch (err) {
        if (isMounted) {
          setError('Failed to load courses for homepage')
          console.error('Error fetching courses:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCoursesForHomepage()

    return () => {
      isMounted = false
    }
  }, [])

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-pulse"
        >
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-40 w-full" />
          <div className="p-5">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-full mb-1" />
            <div className="h-3 bg-gray-200 rounded w-4/5 mb-3" />
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-16" />
              <div className="h-9 bg-gray-200 rounded-lg w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const getSectionTitle = () => {
    if (featuredCourses.length === 0) return "All Courses"
    if (featuredCourses.every(course => course.featured)) return "Featured Courses"
    if (featuredCourses.some(course => course.featured)) return "Popular Courses"
    return "Recommended Courses"
  }

  const getSectionDescription = () => {
    if (featuredCourses.length === 0) return "Browse our complete catalog of SAP ABAP courses"
    if (featuredCourses.every(course => course.featured)) return "Explore our handpicked SAP ABAP courses designed for maximum career impact"
    if (featuredCourses.some(course => course.featured)) return "Discover our most popular SAP ABAP courses recommended for you"
    return "Check out these recommended SAP ABAP courses to start your learning journey"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-700">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/3 -right-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-accent-500/30 rounded-full blur-3xl animate-float animation-delay-4000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-center lg:text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-accent-300 animate-bounce" />
                  <span className="text-xs font-semibold text-white">Premium SAP ABAP Training</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black font-display leading-tight bg-gradient-to-r from-white via-accent-100 to-accent-300 bg-clip-text text-transparent">
                  Master
                  <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                    SAP ABAP
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-primary-100 leading-relaxed max-w-2xl">
                  Transform your career with industry-leading SAP ABAP training. 
                  Learn from certified experts and become job-ready in just{' '}
                  <span className="text-accent-300 font-semibold">3 months</span>.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/courses"
                  className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border-2 border-accent-400/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Explore Courses
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center px-6 py-3 text-base font-bold text-primary-900 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-transparent hover:border-accent-200"
                >
                  <BookOpen className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Book Free Demo
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div 
                      key={index} 
                      className="text-center group cursor-pointer"
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-xl mb-2 group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                        <IconComponent className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                      </div>
                      <div className="text-lg font-black text-white group-hover:text-accent-300 transition-colors">
                        {stat.value}
                      </div>
                      <div className="text-xs text-primary-200 group-hover:text-primary-100 transition-colors font-medium">
                        {stat.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Enhanced Curriculum Highlights */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center shadow-md">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-400" />
                  Comprehensive Curriculum
                </h3>
                <div className="space-y-2">
                  {curriculumHighlights.map((highlight, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 group hover:translate-x-2 transition-transform duration-300"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-primary-100 group-hover:text-white transition-colors font-medium">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-1/2 -left-6 w-12 h-12 bg-primary-400/20 rounded-full blur-lg animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-12 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 border border-primary-200">
              <Rocket className="w-3.5 h-3.5" />
              Why Choose Us
            </div>
            <h2 className="text-2xl lg:text-4xl font-black font-display text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              Transform Your Career
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience the difference with our comprehensive SAP ABAP training program designed for real-world success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div 
                key={feature.name}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 hover:border-primary-300/50 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
                }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className={`relative inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-md`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors relative z-10">
                  {feature.description}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Courses Section */}
      <section className="py-12 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 border border-primary-200">
              {featuredCourses.every(course => course.featured) ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Featured Selection
                </>
              ) : featuredCourses.some(course => course.featured) ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5" />
                  Popular Choices
                </>
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5" />
                  Course Catalog
                </>
              )}
            </div>
            <h2 className="text-2xl lg:text-4xl font-black font-display text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              {getSectionTitle()}
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {getSectionDescription()}
            </p>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Unable to Load Courses</h3>
              <p className="text-sm text-gray-600 mb-3 max-w-md mx-auto">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {featuredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Suspense fallback={<LoadingSkeleton />}>
                    {featuredCourses.map((course, index) => (
                      <CourseCard 
                        key={course.course_id || course.id} 
                        course={course}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      />
                    ))}
                  </Suspense>
                </div>
              ) : (
                <div className="text-center py-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                  <div className="w-16 h-16 bg-gray-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">No Courses Available</h3>
                  <p className="text-sm text-gray-600 mb-3 max-w-md mx-auto">
                    We're working on adding new courses. Please check back soon!
                  </p>
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-semibold"
                  >
                    Get Notified
                  </Link>
                </div>
              )}
            </>
          )}

          {featuredCourses.length > 0 && (
            <div className="text-center mt-8">
              <Link
                to="/courses"
                className="group inline-flex items-center justify-center px-8 py-3 text-base font-black text-primary-600 bg-white border-2 border-primary-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                View All Courses
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-12 bg-gradient-to-br from-slate-900 via-primary-900 to-accent-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/50 via-slate-900/50 to-accent-800/50"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold mb-3 border border-white/20">
              <Heart className="w-3.5 h-3.5 text-accent-400" />
              Success Stories
            </div>
            <h2 className="text-2xl lg:text-4xl font-black font-display mb-3 bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              Transformations
            </h2>
            <p className="text-base text-primary-200 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who transformed their careers with our SAP ABAP training
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 hover:border-accent-400/50 transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2"
              >
                {/* Quote Icon */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <span className="text-xl font-bold text-white">"</span>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-primary-100 mb-4 leading-relaxed group-hover:text-white transition-colors italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-110 transition-transform duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-white group-hover:text-accent-300 transition-colors text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-primary-200 text-xs">{testimonial.role}</p>
                    <p className="text-primary-300 text-xs">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl"></div>
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 mb-4">
            <Target className="w-4 h-4 text-accent-300" />
            <span className="text-xs font-semibold text-white">Limited Time Offer</span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-4">
            Ready to Launch Your Career?
          </h2>
          <p className="text-base text-primary-100 mb-6 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful professionals who transformed their careers with our industry-leading SAP ABAP training program.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link
              to="/courses"
              className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-black text-primary-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 border-2 border-transparent hover:border-accent-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-50 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <BookOpen className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">View All Courses</span>
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center px-8 py-3 text-base font-black text-white bg-primary-700/80 rounded-xl hover:bg-primary-800 transition-all duration-300 border-2 border-white/20 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <GraduationCap className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Get Course Syllabus
            </Link>
          </div>
          
          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-primary-200 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-accent-400" />
              <span className="font-semibold">Industry-Recognized Certification</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-accent-400" />
              <span className="font-semibold">1000+ Students Trained</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-accent-400" />
              <span className="font-semibold">95% Success Rate</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
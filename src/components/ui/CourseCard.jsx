// src/components/ui/CourseCard.jsx
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Zap, 
  TrendingUp, 
  Award,
  CheckCircle,
  PlayCircle,
  BarChart3,
  Heart,
  Share2,
  Eye
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// High-quality professional images for different course categories
const sampleImages = {
  beginner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
  intermediate: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
  advanced: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
  abap: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=250&fit=crop',
  hana: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
  workflow: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
  fiori: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
  default: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=250&fit=crop'
}

// Level configurations with colors and icons
const levelConfig = {
  beginner: {
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: BookOpen,
    label: 'Beginner'
  },
  intermediate: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: TrendingUp,
    label: 'Intermediate'
  },
  advanced: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Zap,
    label: 'Advanced'
  }
}

// Mode configurations
const modeConfig = {
  online_live: {
    label: 'Live Online',
    color: 'text-orange-600'
  },
  online_self_paced: {
    label: 'Self Paced',
    color: 'text-green-600'
  },
  hybrid: {
    label: 'Hybrid',
    color: 'text-blue-600'
  }
}

const getCourseImage = (course) => {
  // If course has a valid thumbnail image, use it
  if (course.thumbnail_image && course.thumbnail_image.startsWith('http')) {
    return course.thumbnail_image;
  }
  
  if (course.thumbnail_image && course.thumbnail_image.startsWith('/')) {
    return course.thumbnail_image;
  }

  // Otherwise, use sample images based on course content
  const title = course.title?.toLowerCase() || '';
  const level = course.level || 'default';
  
  if (title.includes('hana')) {
    return sampleImages.hana;
  } else if (title.includes('workflow') || title.includes('brf')) {
    return sampleImages.workflow;
  } else if (title.includes('fiori') || title.includes('web dynpro')) {
    return sampleImages.fiori;
  } else if (title.includes('abap')) {
    return sampleImages.abap;
  } else {
    return sampleImages[level] || sampleImages.default;
  }
}

const CourseCard = ({ course, viewMode = 'grid', showActions = true, className = '' }) => {
  const { isAuthenticated } = useAuth()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const discountPercentage = useMemo(() => {
    if (course.original_fee && course.original_fee > course.fee) {
      return Math.round(((course.original_fee - course.fee) / course.original_fee) * 100)
    }
    return 0
  }, [course.original_fee, course.fee])

  const courseImage = useMemo(() => getCourseImage(course), [course])
  const levelInfo = levelConfig[course.level] || levelConfig.beginner
  const modeInfo = modeConfig[course.mode] || modeConfig.online_live
  const LevelIcon = levelInfo.icon

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = (e) => {
    const level = course.level || 'default'
    e.target.src = sampleImages[level] || sampleImages.default
    setImageLoaded(true)
  }

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    // TODO: Integrate with wishlist API
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.short_description,
        url: `/courses/${course.slug}`
      })
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getEnrollmentStatus = () => {
    if (course.seats_available === 0) return 'sold-out'
    if (course.seats_available && course.seats_available < 10) return 'limited'
    return 'available'
  }

  const enrollmentStatus = getEnrollmentStatus()

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className={`group bg-white rounded-2xl shadow-soft border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-1 ${className}`}>
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-gray-300 w-full h-full" />
              </div>
            )}
            <img
              src={courseImage}
              alt={course.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {course.featured && (
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </div>
              )}
              {enrollmentStatus === 'limited' && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  Limited Seats
                </div>
              )}
              {enrollmentStatus === 'sold-out' && (
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                  Sold Out
                </div>
              )}
            </div>
            
            {/* Right Side Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Action Buttons Overlay */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleWishlist}
                className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isWishlisted 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/90 text-gray-600 backdrop-blur-sm hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
              <div className="flex items-center gap-2 text-white text-sm">
                <Eye className="w-4 h-4" />
                <span>{course.view_count || 0} views</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${levelInfo.color}`}>
                <LevelIcon className="w-3 h-3 inline mr-1" />
                {levelInfo.label}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Course Mode */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${modeInfo.color} flex items-center gap-1`}>
              <PlayCircle className="w-4 h-4" />
              {modeInfo.label}
            </span>
            {course.metadata?.modules && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                {course.metadata.modules.length} Modules
              </span>
            )}
          </div>
          
          {/* Course Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {course.title}
          </h3>
          
          {/* Course Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {course.short_description || course.description}
          </p>
          
          {/* Meta Information */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              {course.seats_available !== undefined && course.seats_available > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.seats_available} seats</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {course.original_fee && course.original_fee > course.fee && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(course.original_fee)}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(course.fee)}
              </span>
            </div>
            {discountPercentage > 0 && (
              <span className="text-sm font-semibold text-green-600">
                Save {formatPrice(course.original_fee - course.fee)}
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          {showActions && (
            <div className="flex gap-2 mt-auto">
              <Link
                to={`/courses/${course.slug}`}
                className="btn-primary flex-1 text-center group/btn flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                View Details
              </Link>
              <button 
                className={`btn-secondary flex-1 flex items-center justify-center gap-2 ${
                  enrollmentStatus === 'sold-out' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={enrollmentStatus === 'sold-out'}
              >
                {enrollmentStatus === 'sold-out' ? (
                  <>
                    <Award className="w-4 h-4" />
                    Sold Out
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Enroll Now
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-soft border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div className="md:w-64 flex-shrink-0 relative">
          <div className="relative w-full h-40 md:h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-gray-300 w-full h-full" />
              </div>
            )}
            <img
              src={courseImage}
              alt={course.title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {course.featured && (
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  Featured
                </div>
              )}
              {discountPercentage > 0 && (
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  {discountPercentage}% OFF
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelInfo.color}`}>
                  <LevelIcon className="w-3 h-3 inline mr-1" />
                  {levelInfo.label}
                </div>
                <span className={`text-sm font-medium ${modeInfo.color}`}>
                  {modeInfo.label}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                {course.title}
              </h3>
              
              <p className="text-gray-600 line-clamp-2 mb-4">
                {course.short_description || course.description}
              </p>
            </div>
            
            <div className="mt-2 lg:mt-0 lg:text-right lg:pl-6 lg:min-w-[180px]">
              <div className="flex items-center gap-2 mb-1 justify-end">
                {course.original_fee && course.original_fee > course.fee && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(course.original_fee)}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(course.fee)}
                </span>
              </div>
              {discountPercentage > 0 && (
                <div className="text-sm font-semibold text-green-600 mb-2">
                  Save {formatPrice(course.original_fee - course.fee)}
                </div>
              )}
              <div className="text-sm text-gray-500 flex items-center justify-end gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
          
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            {course.metadata?.modules && (
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span>{course.metadata.modules.length} Modules</span>
              </div>
            )}
            {course.seats_available && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className={enrollmentStatus === 'limited' ? 'text-orange-600 font-semibold' : ''}>
                  {course.seats_available} seats {enrollmentStatus === 'limited' && 'left'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{course.view_count || 0} views</span>
            </div>
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex gap-3 items-center">
              <Link
                to={`/courses/${course.slug}`}
                className="btn-primary flex-1 text-center max-w-[200px] flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                View Details
              </Link>
              <button 
                className={`btn-secondary flex-1 max-w-[200px] flex items-center justify-center gap-2 ${
                  enrollmentStatus === 'sold-out' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={enrollmentStatus === 'sold-out'}
              >
                {enrollmentStatus === 'sold-out' ? (
                  <>
                    <Award className="w-4 h-4" />
                    Sold Out
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Enroll Now
                  </>
                )}
              </button>
              
              {/* Additional Actions */}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={toggleWishlist}
                  className={`p-2 rounded-lg border transition-all duration-200 ${
                    isWishlisted 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard
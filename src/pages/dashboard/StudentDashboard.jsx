// src/pages/dashboard/StudentDashboard.jsx
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Icons (same as before)
const BookOpen = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
)

const Clock = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Award = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const TrendingUp = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const Play = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Calendar = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const FileText = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const Users = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const Star = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const Download = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const Share2 = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

const Bell = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.81-2.68 6 6 0 00-1.9 5.22 2.5 2.5 0 01-2.35 2.68A2.5 2.5 0 014.5 16H8a3 3 0 006 0h4.5a2.5 2.5 0 00.33-4.98 2.5 2.5 0 01-2.35-2.68 6 6 0 00-1.9-5.22 5.97 5.97 0 01-3.81 2.68z" />
  </svg>
)

const Target = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Zap = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const Brain = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

// Pre-loaded mock data - NO API CALLS
const STUDENT_MOCK_DATA = {
  overview: {
    total_courses: 5,
    active_courses: 3,
    completed_courses: 2,
    average_progress: 68,
    course_trend: '+2',
    active_trend: '+1',
    completion_trend: '0',
    progress_trend: '+5'
  },
  recent_enrollments: [
    {
      id: 1,
      progress: 85,
      Course: {
        id: 1,
        title: "SAP ABAP Basics",
        level: "Beginner",
        instructor: "Akshay Kumar",
        duration: "6 weeks",
        rating: 4.8,
        thumbnail_image: "/images/course-placeholder.jpg"
      }
    },
    {
      id: 2,
      progress: 45,
      Course: {
        id: 2,
        title: "Advanced ABAP Programming",
        level: "Intermediate",
        instructor: "Akshay Kumar",
        duration: "8 weeks",
        rating: 4.9,
        thumbnail_image: "/images/course-placeholder.jpg"
      }
    },
    {
      id: 3,
      progress: 20,
      Course: {
        id: 3,
        title: "SAP Fiori Development",
        level: "Advanced",
        instructor: "Akshay Kumar",
        duration: "10 weeks",
        rating: 4.7,
        thumbnail_image: "/images/course-placeholder.jpg"
      }
    }
  ],
  learning_stats: {
    last_active: new Date().toISOString(),
    streak_days: 12,
    total_study_hours: 45,
    assignments_completed: 8,
    skills_mastered: 15,
    total_achievements: 7,
    recent_achievements: ['Fast Learner', 'Consistent Student', 'ABAP Beginner']
  },
  upcoming_sessions: [
    {
      id: 1,
      title: "Live Q&A Session",
      course: "SAP ABAP Basics",
      date: new Date(Date.now() + 86400000).toISOString(),
      duration: "60 mins",
      instructor: "Akshay Kumar"
    }
  ],
  progress: {
    goals: [
      {
        title: "Complete ABAP Basics",
        deadline: "2024-02-15",
        progress: 85
      },
      {
        title: "Finish 5 Practice Exercises",
        deadline: "2024-02-20",
        progress: 60
      }
    ],
    pending_exercises: 3
  }
}

// Study Streak Component with React.memo
const StudyStreak = React.memo(({ streak = 0 }) => (
  <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
    <Zap className="w-4 h-4 text-yellow-300" />
    <span className="text-sm font-bold">{streak}</span>
    <span className="text-xs opacity-90">day streak</span>
  </div>
))

// Achievement Badges Component with React.memo
const AchievementBadges = React.memo(({ achievements = [], total = 0 }) => (
  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors cursor-pointer">
    <div className="text-2xl font-bold">{total}</div>
    <div className="text-primary-200 text-sm">Achievements</div>
    <div className="flex justify-center mt-2 space-x-1">
      {achievements.slice(0, 3).map((achievement, index) => (
        <div key={index} className="w-2 h-2 bg-yellow-400 rounded-full"></div>
      ))}
      {achievements.length > 3 && (
        <div className="text-xs text-primary-200">+{achievements.length - 3}</div>
      )}
    </div>
  </div>
))

// Quick Stats Component with React.memo
const QuickStats = React.memo(({ stats = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, index) => (
      <div 
        key={stat.name} 
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500">{stat.description}</p>
              {stat.trend && (
                <span className={`text-xs font-medium ${
                  stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${stat.bgColor} transition-transform duration-300 hover:scale-110`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      </div>
    ))}
  </div>
))

// Course Progress Component with React.memo
const CourseProgress = React.memo(({ enrollments = [], onCourseClick }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
      <Link 
        to="/dashboard/courses" 
        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
      >
        <span>View all</span>
        <Play className="w-4 h-4" />
      </Link>
    </div>
    
    <div className="space-y-4">
      {enrollments?.slice(0, 4).map((enrollment) => (
        <div 
          key={enrollment.id} 
          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group cursor-pointer"
          onClick={() => onCourseClick && onCourseClick(enrollment.Course.id)}
        >
          <div className="relative">
            <img
              src={enrollment.Course.thumbnail_image || '/images/course-placeholder.jpg'}
              alt={enrollment.Course.title}
              className="w-14 h-14 rounded-lg object-cover shadow-sm"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCA1NiA1NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAyMEMzMS4zMTM3IDIwIDM0IDE3LjMxMzcgMzQgMTVDMzQgMTIuNjg2MyAzMS4zMTM3IDEwIDI4IDEwQzI0LjY4NjMgMTAgMjIgMTIuNjg2MyAyMiAxNUMyMiAxNy4zMTM3IDI0LjY4NjMgMjAgMjggMjBaIiBmaWxsPSIjOEU5MEEyIi8+CjxwYXRoIGQ9Ik0zNiAzNkgyMEMxNy43OTA5IDM2IDE2IDM0LjIwOTEgMTYgMzJWMjRIMzZWMzZaIiBmaWxsPSIjOEU5MEEyIi8+Cjwvc3ZnPgo='
              }}
            />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {enrollment.Course.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">{enrollment.Course.level}</span>
              <span className="text-xs text-gray-300">•</span>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500">{enrollment.Course.rating}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{enrollment.progress}%</div>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  enrollment.progress >= 80 ? 'bg-green-500' : 
                  enrollment.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                }`}
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
      
      {(!enrollments || enrollments.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No courses enrolled yet</p>
          <p className="text-sm mb-4">Start your SAP ABAP journey today!</p>
          <Link 
            to="/courses" 
            className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Courses</span>
          </Link>
        </div>
      )}
    </div>
  </div>
))

// Learning Goals Component with React.memo
const LearningGoals = React.memo(({ goals = [], currentProgress = 0 }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Goals</h2>
    <div className="space-y-4">
      {goals.length > 0 ? goals.slice(0, 3).map((goal, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{goal.title}</p>
              <p className="text-sm text-gray-600">{goal.deadline}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">{goal.progress}%</div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        </div>
      )) : (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No learning goals set</p>
          <p className="text-sm">Set goals to track your progress</p>
        </div>
      )}
    </div>
  </div>
))

// Recent Activity Component with React.memo
const RecentActivity = React.memo(({ sessions = [], activities = [] }) => (
  <div className="space-y-4">
    {sessions?.length > 0 ? (
      sessions.map((session) => (
        <div key={session.id} className="p-4 border border-blue-100 bg-blue-50 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{session.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{session.course}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>📅 {new Date(session.date).toLocaleDateString()}</span>
                <span>⏱️ {session.duration}</span>
                <span>👨‍🏫 {session.instructor}</span>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="font-medium">No upcoming sessions</p>
        <p className="text-sm">Your next live session will appear here</p>
      </div>
    )}
    
    {/* Quick Join Section */}
    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl">
      <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
        <Play className="w-4 h-4 text-green-600" />
        <span>Continue Learning</span>
      </h4>
      <p className="text-sm text-gray-600 mb-3">
        Pick up where you left off and continue your SAP ABAP journey.
      </p>
      <Link 
        to="/dashboard/courses" 
        className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        <Play className="w-4 h-4" />
        <span>Resume Learning</span>
      </Link>
    </div>
  </div>
))

// Progress Chart Component with React.memo
const ProgressChart = React.memo(() => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
    <div className="flex items-end justify-between h-32">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
        <div key={day} className="flex flex-col items-center">
          <div 
            className="w-8 bg-gradient-to-t from-primary-500 to-primary-600 rounded-t-lg transition-all duration-500 hover:from-primary-600 hover:to-primary-700"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
          <span className="text-xs text-gray-600 mt-2">{day}</span>
        </div>
      ))}
    </div>
  </div>
))

// Main StudentDashboard Component - INSTANT LOADING
const StudentDashboard = () => {
  const { user } = useAuth()
  
  // Use pre-loaded data directly - NO LOADING STATE
  const dashboardData = STUDENT_MOCK_DATA

  // Access user data
  const userData = user?.user || user

  const { overview, recent_enrollments, learning_stats, upcoming_sessions, progress } = dashboardData

  // Use useMemo for derived data
  const stats = useMemo(() => [
    {
      name: 'Total Courses',
      value: overview?.total_courses || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Enrolled courses',
      trend: overview?.course_trend || '+2'
    },
    {
      name: 'Active Courses',
      value: overview?.active_courses || 0,
      icon: Play,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Currently learning',
      trend: overview?.active_trend || '+1'
    },
    {
      name: 'Completed',
      value: overview?.completed_courses || 0,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Courses finished',
      trend: overview?.completion_trend || '0'
    },
    {
      name: 'Avg Progress',
      value: `${overview?.average_progress || 0}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Overall progress',
      trend: `${overview?.progress_trend || '+5'}%`
    }
  ], [overview])

  const learningAchievements = useMemo(() => [
    {
      icon: Clock,
      label: 'Study Streak',
      value: `${learning_stats?.streak_days || 0} days`,
      color: 'text-green-600',
      max: 30
    },
    {
      icon: FileText,
      label: 'Assignments',
      value: `${learning_stats?.assignments_completed || 0} completed`,
      color: 'text-blue-600',
      max: learning_stats?.total_assignments || 10
    },
    {
      icon: Users,
      label: 'Study Hours',
      value: `${learning_stats?.total_study_hours || 0} hours`,
      color: 'text-purple-600',
      max: 100
    },
    {
      icon: Brain,
      label: 'Skills Mastered',
      value: `${learning_stats?.skills_mastered || 0} skills`,
      color: 'text-red-600',
      max: 50
    }
  ], [learning_stats])

  const quickActions = useMemo(() => [
    {
      title: "Continue Learning",
      description: "Pick up where you left off",
      icon: Play,
      color: "bg-green-500",
      href: "/learn/continue"
    },
    {
      title: "Practice Exercises",
      description: "Reinforce your knowledge",
      icon: Brain,
      color: "bg-blue-500",
      href: "/practice",
      badge: progress?.pending_exercises > 0 ? progress.pending_exercises : null
    },
    {
      title: "Join Live Session",
      description: "Interactive learning",
      icon: Users,
      color: "bg-purple-500",
      href: "/live",
      disabled: !upcoming_sessions?.length
    },
    {
      title: "Skill Assessment",
      description: "Test your knowledge",
      icon: Target,
      color: "bg-orange-500",
      href: "/assessments"
    }
  ], [progress, upcoming_sessions])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full animate-bounce"></div>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <h1 className="text-3xl lg:text-4xl font-bold mr-3">
                Welcome back, {userData?.full_name || userData?.name || 'Student'}! 👋
              </h1>
              <StudyStreak streak={learning_stats?.streak_days} />
            </div>
            
            <p className="text-primary-100 text-lg mb-6 max-w-2xl">
              {learning_stats?.streak_days > 7 ? 
                `Amazing! You're on a ${learning_stats.streak_days}-day streak! Keep up the great work!` :
                'Continue your SAP ABAP learning journey. Every step brings you closer to mastery!'
              }
            </p>
            
            <div className="flex flex-wrap gap-4">
              {learningAchievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <achievement.icon className={`w-5 h-5 ${achievement.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-semibold">{achievement.value}</span>
                  <span className="text-primary-200 text-sm">{achievement.label}</span>
                </div>
              ))}
            </div>
          </div>
         
        </div>
      </div>

      {/* Quick Stats Grid */}
      <QuickStats stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Courses and Goals */}
        <div className="xl:col-span-2 space-y-8">
          <CourseProgress 
            enrollments={recent_enrollments} 
            onCourseClick={(courseId) => {
              // Track analytics
              if (window.gtag) {
                window.gtag('event', 'course_click', {
                  course_id: courseId,
                  user_id: userData?.user_id || userData?.id
                })
              }
            }}
          />
          
          <LearningGoals 
            goals={progress?.goals || []}
            currentProgress={overview?.average_progress || 0}
          />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Upcoming Schedule
              </h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1 transition-colors duration-200">
                <span>Export</span>
                <Download className="w-4 h-4" />
              </button>
            </div>
            
            <RecentActivity 
              sessions={upcoming_sessions}
              activities={[]}
            />
          </div>

          {/* Study Recommendations */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Study Recommendations
            </h3>
            <div className="space-y-3">
              {recent_enrollments
                ?.filter(course => course.progress < 80)
                .slice(0, 2)
                .map(course => (
                  <div key={course.id} className="bg-white/80 rounded-lg p-3 hover:bg-white transition-colors">
                    <p className="font-medium text-sm text-gray-900">{course.Course.title}</p>
                    <p className="text-xs text-gray-600">Continue from {course.progress}%</p>
                    <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded transition-colors">
                      Resume Learning
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`p-6 rounded-xl border-2 border-dashed border-gray-200 text-center hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 hover:scale-105 group relative ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {action.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {action.badge}
                </span>
              )}
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-700 group-hover:text-primary-600 mb-1">
                {action.title}
              </p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <ProgressChart />
      </div>
    </div>
  )
}

export default React.memo(StudentDashboard)
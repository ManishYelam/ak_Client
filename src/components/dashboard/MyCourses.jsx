// src/pages/dashboard/MyCourses.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const MyCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'SAP ABAP Basics',
      progress: 85,
      instructor: 'Akshay Kumar',
      duration: '6 weeks',
      level: 'Beginner',
      lastAccessed: '2 hours ago',
      thumbnail: '/images/course-placeholder.jpg',
    },
    {
      id: 2,
      title: 'Advanced ABAP Programming',
      progress: 45,
      instructor: 'Akshay Kumar',
      duration: '8 weeks',
      level: 'Intermediate',
      lastAccessed: '1 day ago',
      thumbnail: '/images/course-placeholder.jpg',
    },
    {
      id: 3,
      title: 'SAP Fiori Development',
      progress: 20,
      instructor: 'Akshay Kumar',
      duration: '10 weeks',
      level: 'Advanced',
      lastAccessed: '3 days ago',
      thumbnail: '/images/course-placeholder.jpg',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <Link
          to="/courses"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Browse Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover"
              onError={e => {
                e.target.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDQwMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgODBDMTYwIDk3LjY3MTQgOTcuNjcxNCAxNjAgMCAxNjBDLTk3LjY3MTQgMTYwIC0xNjAgOTcuNjcxNCAtMTYwIDgwQy0xNjAgNjIuMzI4NiAtOTcuNjcxNCA0MCAwIDQwQzk3LjY3MTQgNDAgMTYwIDYyLjMyODYgMTYwIDgwWiIgZmlsbD0iIzhFOUEBMiIvPgo8L3N2Zz4K'
              }}
            />
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{course.duration}</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{course.level}</span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/learn/${course.id}`}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
                >
                  Continue
                </Link>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  ...
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">Last accessed {course.lastAccessed}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyCourses

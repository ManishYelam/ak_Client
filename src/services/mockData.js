// frontend/src/services/mockData.js
export const mockCourses = [
  {
    id: 'course-beginner-1234-5678-90ab-cdef12345678',
    title: 'SAP ABAP for Beginners - Complete Foundation',
    slug: 'sap-abap-for-beginners-complete-foundation',
    description:
      'Master the fundamentals of SAP ABAP programming with this comprehensive beginner course...',
    short_description: 'Start your SAP ABAP journey with comprehensive foundation training...',
    duration: '3 Months',
    fee: 25000,
    original_fee: 30000,
    mode: 'online_live',
    level: 'beginner',
    thumbnail_image: '/images/courses/abap-beginner.jpg',
    featured: true,
    is_active: true,
    seats_available: 25,
    view_count: 156,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    testimonials: [
      {
        id: 'testimonial-001-1234-5678-90ab-cdef12345678',
        rating: 5,
        title: 'Life-changing Course!',
        content: 'This course completely transformed my career...',
        user: {
          name: 'Rajesh Sharma',
          company: 'Tech Solutions Inc',
          profile_image: null,
        },
      },
    ],
  },
  {
    id: 'course-advanced-1234-5678-90ab-cdef12345679',
    title: 'Advanced ABAP Programming - OOPS & Performance',
    slug: 'advanced-abap-programming-oops-performance',
    description: 'Take your ABAP skills to the next level with advanced programming concepts...',
    short_description: 'Master advanced ABAP concepts including OOPS, performance optimization...',
    duration: '3 Months',
    fee: 35000,
    original_fee: 40000,
    mode: 'online_live',
    level: 'advanced',
    thumbnail_image: '/images/courses/abap-advanced.jpg',
    featured: true,
    is_active: true,
    seats_available: 20,
    view_count: 89,
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z',
    testimonials: [],
  },
]

export const mockTestimonials = [
  {
    id: 'testimonial-001-1234-5678-90ab-cdef12345678',
    rating: 5,
    title: 'Life-changing Course!',
    content:
      'This course completely transformed my career. From having zero knowledge of ABAP, I now feel confident to work on real projects...',
    is_approved: true,
    featured: true,
    created_at: '2024-03-01T00:00:00.000Z',
    user: {
      name: 'Rajesh Sharma',
      company: 'Tech Solutions Inc',
      profile_image: null,
    },
    course: {
      title: 'SAP ABAP for Beginners - Complete Foundation',
      slug: 'sap-abap-for-beginners-complete-foundation',
    },
  },
]

export const mockBlogs = [
  {
    id: 'blog-001-1234-5678-90ab-cdef12345678',
    title: 'Why Learn SAP ABAP in 2024? Career Opportunities and Scope',
    slug: 'why-learn-sap-abap-2024-career-opportunities-scope',
    excerpt:
      'Discover why SAP ABAP remains a highly sought-after skill in 2024 with growing career opportunities...',
    featured_image: '/images/blogs/abap-career-2024.jpg',
    tags: ['SAP ABAP', 'Career', '2024 Trends', 'Programming'],
    read_time: 6,
    is_published: true,
    published_at: '2024-01-15T00:00:00.000Z',
    view_count: 234,
    author: {
      name: 'Akshay Kumar',
      profile_image: null,
    },
  },
]

export const mockDashboardData = {
  student: {
    overview: {
      total_courses: 3,
      active_courses: 2,
      completed_courses: 1,
      average_progress: 65,
      next_class: '2024-03-25T10:00:00.000Z',
    },
    recent_enrollments: [
      {
        id: 'enroll-001-1234-5678-90ab-cdef12345678',
        progress: 65,
        course: {
          title: 'SAP ABAP for Beginners - Complete Foundation',
          slug: 'sap-abap-for-beginners-complete-foundation',
          thumbnail_image: '/images/courses/abap-beginner.jpg',
          duration: '3 Months',
          level: 'beginner',
        },
      },
    ],
    learning_stats: {
      total_study_hours: 45,
      last_active: '2024-03-20T15:30:00.000Z',
      streak_days: 12,
    },
  },
  admin: {
    overview: {
      total_students: 5,
      total_courses: 4,
      total_enrollments: 5,
      total_revenue: 155000,
      monthly_revenue: 75000,
      conversion_rate: 25,
    },
    recent_enrollments: [
      {
        id: 'enroll-001-1234-5678-90ab-cdef12345678',
        enrollment_date: '2024-01-20T00:00:00.000Z',
        user: {
          name: 'Rajesh Sharma',
          email: 'rajesh.sharma@example.com',
        },
        course: {
          title: 'SAP ABAP for Beginners - Complete Foundation',
        },
      },
    ],
    course_performance: [
      {
        id: 'course-beginner-1234-5678-90ab-cdef12345678',
        title: 'SAP ABAP for Beginners - Complete Foundation',
        enrollment_count: 2,
        avg_progress: 72.5,
      },
    ],
  },
}

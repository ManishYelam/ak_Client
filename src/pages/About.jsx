// src/pages/About.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Award,
  Users,
  Target,
  CheckCircle,
  Star,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  BookOpen,
  Heart,
} from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'Expert Training',
      description: 'Learn from industry experts with 10+ years of SAP experience',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      title: 'Certification Ready',
      description: 'Curriculum designed to prepare you for SAP certifications',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a community of 1000+ learners and professionals',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Career Focused',
      description: 'Training programs designed for job placement and career growth',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const stats = [
    { number: '1000+', label: 'Students Trained', icon: Users, color: 'text-blue-400' },
    { number: '95%', label: 'Success Rate', icon: TrendingUp, color: 'text-green-400' },
    { number: '50+', label: 'Corporate Clients', icon: Shield, color: 'text-purple-400' },
    { number: '10+', label: 'Years Experience', icon: Clock, color: 'text-orange-400' },
  ]

  const instructorHighlights = [
    '10+ years in SAP ABAP development',
    'Trained 1000+ professionals worldwide',
    'Worked with Fortune 500 companies',
    'SAP certification specialist',
    'Corporate training expert',
    'Real-world project experience',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-accent-700 text-white py-12 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-8 -left-8 w-32 h-32 bg-accent-400/20 rounded-full blur-2xl"></div>
          <div className="absolute top-16 -right-8 w-48 h-48 bg-primary-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 left-1/4 w-40 h-40 bg-accent-500/30 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 mb-4">
              <Heart className="w-3.5 h-3.5 text-accent-300" />
              <span className="text-xs font-semibold">About Our Mission</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-black font-display mb-3 bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">
              Learn SAP ABAP
            </h1>
            <p className="text-sm lg:text-base text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Transforming careers through comprehensive SAP ABAP training and industry-focused
              mentorship
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="py-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 border border-primary-200">
                <Target className="w-3 h-3" />
                Our Vision
              </div>
              <h2 className="text-xl lg:text-2xl font-black text-gray-900 bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
                Empowering Future SAP Experts
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                To empower aspiring SAP professionals with industry-relevant skills, practical
                knowledge, and career guidance that bridges the gap between learning and employment
                in the competitive tech landscape.
              </p>
              <div className="space-y-2">
                {[
                  'Industry-aligned curriculum',
                  'Hands-on project experience',
                  '1:1 mentorship support',
                  'Job placement assistance',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Stats Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
              <h3 className="text-base font-black text-gray-900 mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent-500" />
                Why We Excel
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                We combine traditional teaching methods with modern technology to deliver the most
                effective SAP ABAP training experience.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="text-center group cursor-pointer">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-50 rounded-lg mb-1.5 group-hover:scale-110 transition-transform duration-300 border border-gray-200">
                        <IconComponent
                          className={`w-3.5 h-3.5 ${stat.color} group-hover:scale-110 transition-transform`}
                        />
                      </div>
                      <div className="text-base font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                        {stat.number}
                      </div>
                      <div className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors font-medium">
                        {stat.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-10 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 border border-primary-200">
              <Award className="w-3 h-3" />
              What Sets Us Apart
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              Our Unique Approach
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
              Innovative training methodology that delivers real results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/50 hover:border-primary-300/50 transition-all duration-500 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <div
                  className={`relative inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-md`}
                >
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-black text-gray-900 mb-1.5 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500 to-transparent group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Instructor Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 border border-primary-200">
              <GraduationCap className="w-3 h-3" />
              Meet Your Guide
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-primary-600 bg-clip-text text-transparent">
              Expert Instructor
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-center lg:text-left">
              <h3 className="text-lg font-black text-gray-900">Akshay</h3>
              <p className="text-sm text-gray-600 font-medium">
                SAP ABAP Expert & Corporate Trainer with 10+ years of industry experience
              </p>
              <div className="space-y-1.5 mb-4">
                {instructorHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-1.5 group">
                    <Star className="w-3 h-3 text-yellow-400 fill-current group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                to="/courses"
                className="group inline-flex items-center justify-center px-4 py-2 text-xs font-black text-primary-600 bg-white border border-primary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-3 h-3 mr-1.5 group-hover:scale-110 transition-transform" />
                Explore Courses
              </Link>
            </div>

            {/* Enhanced Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  A
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-2.5 h-2.5 text-white fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-10 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-500/20 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 mb-3">
            <Target className="w-3.5 h-3.5 text-accent-300" />
            <span className="text-xs font-semibold text-white">Start Your Journey</span>
          </div>

          <h2 className="text-xl lg:text-2xl font-black text-white mb-3">
            Ready to Master SAP ABAP?
          </h2>
          <p className="text-sm text-primary-100 mb-4 max-w-xl mx-auto leading-relaxed">
            Join thousands of successful professionals who transformed their careers with our
            industry-leading training program.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/courses"
              className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-black text-primary-600 bg-white rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-md transform hover:-translate-y-0.5 hover:scale-105 border border-transparent hover:border-accent-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-50 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <BookOpen className="w-3.5 h-3.5 mr-1.5 group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">Explore Courses</span>
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center px-4 py-2 text-xs font-black text-white bg-primary-700/80 rounded-lg hover:bg-primary-800 transition-all duration-300 border border-white/20 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-md transform hover:-translate-y-0.5"
            >
              <GraduationCap className="w-3.5 h-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

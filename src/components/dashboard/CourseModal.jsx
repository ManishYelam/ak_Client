// src/pages/dashboard/components/CourseModal.jsx
import React, { useState, useEffect } from 'react'
import { 
  X, Save, Send, FileArchive, BookOpen, Clock,
  BookOpen as BookIcon, SlidersHorizontal,
  Sparkles, Zap, TrendingUp
} from 'lucide-react'
import { coursesAPI } from '../../services/api'

const CourseModal = ({ show, course, onClose, onSaved }) => {
  const [saveLoading, setSaveLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    duration: '',
    fee: '',
    original_fee: '',
    mode: 'online_live',
    level: 'beginner',
    featured: false,
    seats_available: '',
    thumbnail_image: '',
    status: 'draft'
  })

  const levels = [
    { value: 'beginner', label: 'Beginner', icon: BookOpen },
    { value: 'intermediate', label: 'Intermediate', icon: TrendingUp },
    { value: 'advanced', label: 'Advanced', icon: Zap }
  ]

  const modes = [
    { value: 'online_live', label: 'Live Online', icon: Clock },
    { value: 'online_self_paced', label: 'Self Paced', icon: BookIcon },
    { value: 'hybrid', label: 'Hybrid', icon: SlidersHorizontal }
  ]

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        short_description: course.short_description || '',
        duration: course.duration || '',
        fee: course.fee || '',
        original_fee: course.original_fee || '',
        mode: course.mode || 'online_live',
        level: course.level || 'beginner',
        featured: course.featured || false,
        seats_available: course.seats_available || '',
        thumbnail_image: course.thumbnail_image || '',
        status: course.status || 'draft'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        short_description: '',
        duration: '',
        fee: '',
        original_fee: '',
        mode: 'online_live',
        level: 'beginner',
        featured: false,
        seats_available: '',
        thumbnail_image: '',
        status: 'draft'
      })
    }
  }, [course])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveCourse = async (action) => {
    try {
      setSaveLoading(true)

      const courseData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        duration: formData.duration,
        fee: parseFloat(formData.fee) || 0,
        original_fee: formData.original_fee ? parseFloat(formData.original_fee) : null,
        mode: formData.mode,
        level: formData.level,
        featured: formData.featured,
        seats_available: formData.seats_available ? parseInt(formData.seats_available) : null,
        status: action
      }

      if (formData.thumbnail_image) {
        courseData.thumbnail_image = formData.thumbnail_image
      }

      let response
      if (course) {
        // Extract just the ID to avoid object issues
        const courseId = course.course_id || course.id
        response = await coursesAPI.update(courseId, courseData)
      } else {
        response = await coursesAPI.create(courseData)
      }

      if (response.data?.success) {
        onSaved()
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save course')
    } finally {
      setSaveLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-md max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-lg text-sm">
        
        {/* Header - More Compact */}
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h2 className="text-base font-semibold">
              {course ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              {course ? `Editing: ${course.title}` : 'Add course details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            disabled={saveLoading}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form - More Compact */}
        <div className="p-3 space-y-3">

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Course Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Enter course title"
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Short Description</label>
            <textarea
              rows="2"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Brief description for course cards"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Full Description *</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-2 py-1 border rounded text-sm"
              placeholder="Detailed course description"
            />
          </div>

          {/* Duration + Thumbnail */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Duration *</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="e.g., 8 weeks, 3 months"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Thumbnail URL</label>
              <input
                type="text"
                value={formData.thumbnail_image}
                onChange={(e) => handleInputChange('thumbnail_image', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Fee *</label>
              <input
                type="number"
                value={formData.fee}
                onChange={(e) => handleInputChange('fee', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Original Fee</label>
              <input
                type="number"
                value={formData.original_fee}
                onChange={(e) => handleInputChange('original_fee', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Seats</label>
              <input
                type="number"
                value={formData.seats_available}
                onChange={(e) => handleInputChange('seats_available', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="Available seats"
                min="0"
              />
            </div>
          </div>

          {/* Level + Mode + Featured */}
          <div className="grid grid-cols-3 gap-3">

            {/* Level */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Level *</label>
              <div className="space-y-1">
                {levels.map(l => {
                  const Icon = l.icon
                  return (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => handleInputChange('level', l.value)}
                      className={`w-full flex items-center gap-1 px-2 py-1 border rounded text-xs ${
                        formData.level === l.value ? 'bg-primary-50 border-primary-500' : ''
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {l.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Mode *</label>
              <div className="space-y-1">
                {modes.map(m => {
                  const Icon = m.icon
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => handleInputChange('mode', m.value)}
                      className={`w-full flex items-center gap-1 px-2 py-1 border rounded text-xs ${
                        formData.mode === m.value ? 'bg-primary-50 border-primary-500' : ''
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Featured */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Course Type</label>
              <button
                onClick={() => handleInputChange('featured', !formData.featured)}
                className={`w-full flex items-center gap-1 px-2 py-1 border rounded text-xs ${
                  formData.featured ? 'bg-yellow-50 border-yellow-500' : ''
                }`}
              >
                <Sparkles className="w-3 h-3" />
                {formData.featured ? 'Featured' : 'Regular'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons - More Compact */}
        <div className="flex items-center justify-between p-3 border-t bg-gray-50">
          <p className="text-xs text-gray-500">
            {course ? `Last updated: ${course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'Unknown'}` : 'New course'}
          </p>

          <div className="flex gap-1">
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-50 transition-colors"
              disabled={saveLoading}
            >
              Cancel
            </button>

            <button
              onClick={() => handleSaveCourse('archived')}
              className="p-1 text-xs border rounded bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors"
              disabled={saveLoading}
              title="Archive"
            >
              <FileArchive className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleSaveCourse('draft')}
              className="p-1 text-xs border rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              disabled={saveLoading}
              title="Save Draft"
            >
              <Save className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleSaveCourse('published')}
              className="p-1 text-xs border rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              disabled={saveLoading}
              title="Publish"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CourseModal
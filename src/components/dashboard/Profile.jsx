import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const userData = user?.user || user

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [formData, setFormData] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touchedFields, setTouchedFields] = useState({})
  const [currentSkill, setCurrentSkill] = useState('')

  // Calculate profile completion percentage
  const calculateProfileCompletion = useCallback((data) => {
    if (!data) return 0;

    const sections = {
      basicInfo: {
        weight: 40,
        check: (data) => {
          let completed = 0;
          const fields = ['full_name', 'email', 'phone_number', 'address', 'date_of_birth', 'age', 'gender'];
          fields.forEach(field => {
            if (data[field] && data[field].toString().trim() !== '') {
              completed++;
            }
          });
          return (completed / fields.length) * 40;
        }
      },
      professional: {
        weight: 25,
        check: (data) => {
          let completed = 0;
          const fields = ['occupation', 'job_title', 'company'];
          fields.forEach(field => {
            if (data[field] && data[field].toString().trim() !== '') {
              completed++;
            }
          });
          return (completed / fields.length) * 25;
        }
      },
      aboutMe: {
        weight: 35,
        check: (data) => {
          let completed = 0;
          const metadata = data.user_metadata || {};
          const totalFields = 6; // bio, about_me, skills, experience, education, interests
          
          if (data.bio && data.bio.trim() !== '' && data.bio !== 'SAP ABAP enthusiast learning enterprise programming.') {
            completed++;
          }
          if (metadata.about_me && metadata.about_me.trim() !== '') {
            completed++;
          }
          if (metadata.skills && metadata.skills.length > 0) {
            completed++;
          }
          if (metadata.experience && metadata.experience.trim() !== '') {
            completed++;
          }
          if (metadata.education && metadata.education.trim() !== '') {
            completed++;
          }
          if (metadata.interests && metadata.interests.trim() !== '') {
            completed++;
          }
          
          return (completed / totalFields) * 35;
        }
      }
    };

    let totalPercentage = 0;
    totalPercentage += sections.basicInfo.check(data);
    totalPercentage += sections.professional.check(data);
    totalPercentage += sections.aboutMe.check(data);

    return Math.min(Math.round(totalPercentage), 100);
  }, []);

  // Memoized completion data
  const completionData = useMemo(() => {
    if (!formData) return { overall: 0, sections: {} };

    const overall = calculateProfileCompletion(formData);
    
    const sections = {
      basicInfo: {
        label: 'Basic Info',
        percentage: Math.round((() => {
          let completed = 0;
          const fields = ['full_name', 'email', 'phone_number', 'address', 'date_of_birth', 'age', 'gender'];
          fields.forEach(field => {
            if (formData[field] && formData[field].toString().trim() !== '') {
              completed++;
            }
          });
          return (completed / fields.length) * 100;
        })()),
        color: 'green',
        fields: ['full_name', 'email', 'phone_number', 'address', 'date_of_birth', 'age', 'gender']
      },
      professional: {
        label: 'Professional',
        percentage: Math.round((() => {
          let completed = 0;
          const fields = ['occupation', 'job_title', 'company'];
          fields.forEach(field => {
            if (formData[field] && formData[field].toString().trim() !== '') {
              completed++;
            }
          });
          return (completed / fields.length) * 100;
        })()),
        color: 'blue',
        fields: ['occupation', 'job_title', 'company']
      },
      aboutMe: {
        label: 'About Me',
        percentage: Math.round((() => {
          let completed = 0;
          const metadata = formData.user_metadata || {};
          const totalFields = 6; // bio, about_me, skills, experience, education, interests
          
          if (formData.bio && formData.bio.trim() !== '' && formData.bio !== 'SAP ABAP enthusiast learning enterprise programming.') completed++;
          if (metadata.about_me && metadata.about_me.trim() !== '') completed++;
          if (metadata.skills && metadata.skills.length > 0) completed++;
          if (metadata.experience && metadata.experience.trim() !== '') completed++;
          if (metadata.education && metadata.education.trim() !== '') completed++;
          if (metadata.interests && metadata.interests.trim() !== '') completed++;
          
          return (completed / totalFields) * 100;
        })()),
        color: 'yellow',
        fields: ['bio', 'about_me', 'skills', 'experience', 'education', 'interests']
      }
    };

    return { overall, sections };
  }, [formData, calculateProfileCompletion]);

  // Get completion tips based on missing fields
  const getCompletionTips = useMemo(() => {
    if (!formData) return [];
    
    const tips = [];
    const metadata = formData.user_metadata || {};

    if (!formData.full_name?.trim()) tips.push('Add your full name');
    if (!formData.phone_number?.trim()) tips.push('Add your phone number');
    if (!formData.address?.trim()) tips.push('Add your location');
    if (!formData.date_of_birth) tips.push('Add your date of birth');
    if (!formData.gender?.trim()) tips.push('Specify your gender');
    if (!formData.occupation?.trim()) tips.push('Add your occupation');
    if (!formData.job_title?.trim()) tips.push('Add your job title');
    if (!formData.company?.trim()) tips.push('Add your company');
    if (!formData.bio?.trim() || formData.bio === 'SAP ABAP enthusiast learning enterprise programming.') tips.push('Write a personal bio');
    if (!metadata.about_me?.trim()) tips.push('Add detailed about me');
    if (!metadata.skills?.length) tips.push('Add your skills');
    if (!metadata.experience?.trim()) tips.push('Add your experience');
    if (!metadata.education?.trim()) tips.push('Add your education');
    if (!metadata.interests?.trim()) tips.push('Add your interests');

    return tips.slice(0, 3);
  }, [formData]);

  // Utility Functions
  const calculateAgeFromDOB = useCallback((dateString) => {
    if (!dateString) return '';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age.toString() : '';
  }, []);

  const calculateDOBFromAge = useCallback((age) => {
    if (!age || isNaN(age) || age <= 0) return '';
    const today = new Date();
    const birthYear = today.getFullYear() - parseInt(age);
    return new Date(birthYear, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  }, []);

  // Validation function
  const validateField = useCallback((fieldName, value) => {
    const validations = {
      date_of_birth: () => !value ? 'Date of birth is required' : new Date(value) > new Date() ? 'Date of birth cannot be in the future' : '',
      age: () => !value ? 'Age is required' : isNaN(value) || value < 1 || value > 120 ? 'Age must be between 1 and 120' : '',
      full_name: () => !value?.trim() ? 'Full name is required' : value.length < 2 ? 'Full name must be at least 2 characters' : ''
    };
    return validations[fieldName]?.() || '';
  }, []);

  // Handle field touch
  const handleFieldTouch = useCallback((fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  // Handle DOB change
  const handleDOBChange = useCallback((e) => {
    if (!isEditing || !formData) return;
    const date_of_birth = e.target.value;
    const age = calculateAgeFromDOB(date_of_birth);
    
    setFormData(prev => ({ ...prev, date_of_birth, age }));
    handleFieldTouch("date_of_birth");
    handleFieldTouch("age");
    
    setFieldErrors(prev => ({
      ...prev,
      date_of_birth: validateField("date_of_birth", date_of_birth),
      age: validateField("age", age)
    }));
  }, [isEditing, formData, calculateAgeFromDOB, validateField, handleFieldTouch]);

  // Handle Age change
  const handleAgeChange = useCallback((e) => {
    if (!isEditing || !formData) return;
    const age = e.target.value;
    const date_of_birth = calculateDOBFromAge(age);
    
    setFormData(prev => ({ ...prev, age, date_of_birth }));
    handleFieldTouch("age");
    handleFieldTouch("date_of_birth");
    
    setFieldErrors(prev => ({
      ...prev,
      age: validateField("age", age),
      date_of_birth: validateField("date_of_birth", date_of_birth)
    }));
  }, [isEditing, formData, calculateDOBFromAge, validateField, handleFieldTouch]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData?.user_id) {
        setIsProfileLoading(false);
        return;
      }
      try {
        setIsProfileLoading(true);
        const response = await authAPI.getProfile(userData.user_id);
        const profile = response.data?.user || response.data;
        setProfileData(profile);
        initializeFormData(profile || userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        initializeFormData(userData);
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchProfile();
  }, [userData]);

  // Initialize form data
  const initializeFormData = useCallback((data) => {
    const metadata = data?.user_metadata || {};
    const newFormData = {
      full_name: data?.full_name || '',
      email: data?.email || '',
      phone_number: data?.phone_number || '',
      bio: metadata?.bio || 'SAP ABAP enthusiast learning enterprise programming.',
      occupation: data?.occupation || '',
      job_title: metadata?.job_title || '',
      address: data?.address || '',
      date_of_birth: data?.date_of_birth || '',
      gender: data?.gender || '',
      age: data?.age ? data.age.toString() : '',
      company: metadata?.company || '',
      user_metadata: {
        about_me: metadata?.about_me || '',
        skills: metadata?.skills || [],
        experience: metadata?.experience || '',
        education: metadata?.education || '',
        interests: metadata?.interests || ''
      }
    };
    setFormData(newFormData);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (!formData) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    handleFieldTouch(name);
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  }, [formData, validateField, handleFieldTouch]);

  const handleMetadataChange = (field, value) => {
    if (!formData) return;
    setFormData(prev => ({
      ...prev,
      user_metadata: { ...prev.user_metadata, [field]: value }
    }));
  }

  // Skills management
  const handleAddSkill = () => {
    if (!currentSkill.trim() || !formData) return;
    const newSkill = currentSkill.trim();
    const currentSkills = formData.user_metadata.skills || [];
    
    if (!currentSkills.includes(newSkill)) {
      const updatedSkills = [...currentSkills, newSkill];
      setFormData(prev => ({
        ...prev,
        user_metadata: { ...prev.user_metadata, skills: updatedSkills }
      }));
      setCurrentSkill('');
      handleFieldTouch("skills");
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!formData) return;
    const updatedSkills = formData.user_metadata.skills.filter(skill => skill !== skillToRemove);
    setFormData(prev => ({
      ...prev,
      user_metadata: { ...prev.user_metadata, skills: updatedSkills }
    }));
    handleFieldTouch("skills");
  };

  const handleBulkSkillsImport = (skillsString) => {
    if (!formData) return;
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
    const currentSkills = formData.user_metadata.skills || [];
    const uniqueNewSkills = skillsArray.filter(skill => !currentSkills.includes(skill));
    
    if (uniqueNewSkills.length > 0) {
      const updatedSkills = [...currentSkills, ...uniqueNewSkills];
      setFormData(prev => ({
        ...prev,
        user_metadata: { ...prev.user_metadata, skills: updatedSkills }
      }));
      handleFieldTouch("skills");
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!formData) return;
    
    const errors = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'user_metadata') {
        const error = validateField(field, formData[field]);
        if (error) errors[field] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const allTouched = Object.keys(formData).reduce((acc, field) => {
        if (field !== 'user_metadata') acc[field] = true;
        return acc;
      }, {});
      setTouchedFields(allTouched);
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        occupation: formData.occupation,
        address: formData.address,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        age: parseInt(formData.age) || 0,
        user_metadata: {
          bio: formData.bio,
          job_title: formData.job_title,
          company: formData.company,
          about_me: formData.user_metadata.about_me,
          skills: formData.user_metadata.skills,
          experience: formData.user_metadata.experience,
          education: formData.user_metadata.education,
          interests: formData.user_metadata.interests
        }
      };

      const response = await authAPI.updateProfile(userData.user_id, updateData);
      if (response.data) {
        const updatedUser = response.data.user || response.data;
        if (updateUser) updateUser(updatedUser);
        setIsEditing(false);
        setTouchedFields({});
        setFieldErrors({});
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const data = profileData || userData;
    initializeFormData(data);
    setIsEditing(false);
    setCurrentSkill('');
    setFieldErrors({});
    setTouchedFields({});
  };

  // Date formatting
  const formatDateForInput = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
  };

  const formatDateForDisplay = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'Not provided';
  };

  const shouldShowError = (fieldName) => {
    return touchedFields[fieldName] && fieldErrors[fieldName];
  };

  // Get completion message based on percentage
  const getCompletionMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent! Your profile is almost complete!';
    if (percentage >= 70) return 'Great progress! Keep going!';
    if (percentage >= 50) return 'Good start! Add more details to improve your profile.';
    if (percentage >= 30) return 'Getting started! Add basic information to continue.';
    return 'Profile just created! Start by adding your basic information.';
  };

  // Field configurations
  const personalFields = [
    { label: 'Full Name *', name: 'full_name', type: 'text', placeholder: 'Enter your full name', required: true },
    { label: 'Email Address *', name: 'email', type: 'email', readOnly: true },
    { label: 'Phone Number', name: 'phone_number', type: 'tel', placeholder: '+1 (555) 123-4567' },
    { label: 'Location', name: 'address', type: 'text', placeholder: 'City, Country' },
    { label: 'Date of Birth', name: 'date_of_birth', type: 'date' },
    { label: 'Age', name: 'age', type: 'number', placeholder: 'Enter your age', min: 1, max: 120 },
    { label: 'Gender', name: 'gender', type: 'select' }
  ];

  const professionalFields = [
    { label: 'Occupation', name: 'occupation', type: 'text', placeholder: 'Your occupation' },
    { label: 'Job Title', name: 'job_title', type: 'text', placeholder: 'Your job title' },
    { label: 'Company', name: 'company', type: 'text', placeholder: 'Your company' }
  ];

  // Loading state
  if (isProfileLoading || !formData) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-3">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-500 text-xs mt-1">Manage your personal and professional information</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-3 py-2 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs shadow-sm hover:shadow-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          
          {/* Left Column - Form Sections */}
          <div className="xl:col-span-2 space-y-4">
            
            {/* Personal Information */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
                  <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">
                    {completionData.sections.basicInfo?.percentage || 0}%
                  </span>
                  <div className="w-12 bg-gray-200 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{ width: `${completionData.sections.basicInfo?.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {personalFields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">
                      {field.label}
                    </label>
                    {isEditing && field.name !== 'email' ? (
                      field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={field.name === 'date_of_birth' ? handleDOBChange : field.name === 'age' ? handleAgeChange : handleInputChange}
                          className={`w-full px-2.5 py-2 text-xs border rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                            shouldShowError(field.name) ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                          }`}
                          placeholder={field.placeholder}
                          min={field.min}
                          max={field.max}
                        />
                      )
                    ) : (
                      <div className="px-2.5 py-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 text-xs font-medium">
                          {field.name === 'email' ? userData?.email : 
                           field.name === 'date_of_birth' ? formatDateForDisplay(userData?.date_of_birth) :
                           field.name === 'age' ? (userData?.age ? `${userData.age} years` : 'Not provided') :
                           field.name === 'gender' ? (userData?.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'Not provided') :
                           userData?.[field.name] || 'Not provided'}
                        </p>
                      </div>
                    )}
                    {field.name === 'email' && (
                      <p className="text-xs text-gray-400 mt-0.5">Email cannot be changed</p>
                    )}
                    {shouldShowError(field.name) && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <span>⚠</span> {fieldErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                  <h2 className="text-base font-semibold text-gray-900">Professional Information</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">
                    {completionData.sections.professional?.percentage || 0}%
                  </span>
                  <div className="w-12 bg-gray-200 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${completionData.sections.professional?.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {professionalFields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">
                      {field.label}
                    </label>
                    {isEditing ? (
                      <input
                        type={field.type}
                        value={formData[field.name]}
                        onChange={(e) => handleInputChange({ target: { name: field.name, value: e.target.value } })}
                        className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <div className="px-2.5 py-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 text-xs font-medium">
                          {formData[field.name] || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* About Me Section */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  <h2 className="text-base font-semibold text-gray-900">About Me</h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">
                    {completionData.sections.aboutMe?.percentage || 0}%
                  </span>
                  <div className="w-12 bg-gray-200 rounded-full h-1">
                    <div 
                      className="h-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                      style={{ width: `${completionData.sections.aboutMe?.percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                
                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange({ target: { name: 'bio', value: e.target.value } })}
                      rows="2"
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <div className="px-2.5 py-2 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {formData.bio || 'No bio provided yet.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Detailed About Me */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">Detailed About Me</label>
                  {isEditing ? (
                    <textarea
                      value={formData.user_metadata.about_me}
                      onChange={(e) => handleMetadataChange('about_me', e.target.value)}
                      rows="2"
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white resize-none"
                      placeholder="Share more about yourself..."
                    />
                  ) : (
                    <div className="px-2.5 py-2 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {formData.user_metadata.about_me || 'No detailed information provided yet.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Skills & Expertise</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={handleSkillKeyPress}
                          className="flex-1 px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                          placeholder="Add a new skill..."
                        />
                        <button
                          onClick={handleAddSkill}
                          className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 text-xs font-medium shadow-sm hover:shadow-md"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Add multiple skills (comma separated)"
                          className="flex-1 px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white"
                          onBlur={(e) => handleBulkSkillsImport(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (handleBulkSkillsImport(e.target.value), e.target.value = '')}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {formData.user_metadata.skills?.map((skill, index) => (
                          <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1 border border-blue-200">
                            <span className="font-medium">{skill}</span>
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-blue-500 hover:text-blue-700 text-xs font-bold transition-colors duration-200"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      {formData.user_metadata.skills?.length > 0 && (
                        <p className="text-xs text-gray-500 font-medium">
                          {formData.user_metadata.skills.length} skill{formData.user_metadata.skills.length !== 1 ? 's' : ''} added
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {formData.user_metadata.skills?.length > 0 ? (
                        formData.user_metadata.skills.map((skill, index) => (
                          <span key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-200">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <div className="px-2.5 py-2 bg-gray-50 rounded-lg w-full">
                          <p className="text-gray-500 text-xs">No skills added yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Experience & Education Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">Experience</label>
                    {isEditing ? (
                      <textarea
                        value={formData.user_metadata.experience}
                        onChange={(e) => handleMetadataChange('experience', e.target.value)}
                        rows="2"
                        className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white resize-none"
                        placeholder="Your professional experience..."
                      />
                    ) : (
                      <div className="px-2.5 py-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-xs leading-relaxed">
                          {formData.user_metadata.experience || 'No experience information provided.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700">Education</label>
                    {isEditing ? (
                      <textarea
                        value={formData.user_metadata.education}
                        onChange={(e) => handleMetadataChange('education', e.target.value)}
                        rows="2"
                        className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white resize-none"
                        placeholder="Your educational background..."
                      />
                    ) : (
                      <div className="px-2.5 py-2 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 text-xs leading-relaxed">
                          {formData.user_metadata.education || 'No education information provided.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">Interests</label>
                  {isEditing ? (
                    <textarea
                      value={formData.user_metadata.interests}
                      onChange={(e) => handleMetadataChange('interests', e.target.value)}
                      rows="2"
                      className="w-full px-2.5 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white resize-none"
                      placeholder="Your hobbies and interests..."
                    />
                  ) : (
                    <div className="px-2.5 py-2 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {formData.user_metadata.interests || 'No interests provided.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Summary */}
          <div className="space-y-4">
            
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-md">
                {userData?.full_name?.charAt(0) || 'U'}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1 truncate">
                {userData?.full_name || 'User'}
              </h3>
              <p className="text-gray-500 text-xs mb-3 truncate">{userData?.email}</p>
              <div className="flex flex-col space-y-1.5 mb-3">
                <span className="text-xs text-gray-600 capitalize bg-gradient-to-r from-gray-100 to-gray-50 rounded-full px-2 py-1 inline-block border border-gray-200 font-medium">
                  {userData?.role} Account
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  userData?.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {userData?.status || 'Unknown'}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-left border-t border-gray-100 pt-3">
                {[
                  { label: 'Member since', value: formatDateForDisplay(userData?.createdAt), icon: '📅' },
                  { label: 'Last login', value: userData?.last_login_at ? formatDateForDisplay(userData.last_login_at) : 'Never', icon: '🔐' },
                  { label: 'User ID', value: `#${userData?.user_id}`, icon: '🆔' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide">Profile Completion</h3>
                <span className="text-xs font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {completionData.overall}%
                </span>
              </div>
              
              {/* Main Progress */}
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100">
                    <div 
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-green-600 opacity-20"
                      style={{ clipPath: `inset(0 ${100 - completionData.overall}% 0 0)` }}
                    ></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{completionData.overall}%</div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Message */}
              <p className="text-xs text-gray-600 text-center mb-3 px-1">
                {getCompletionMessage(completionData.overall)}
              </p>

              {/* Section Progress Bars */}
              <div className="space-y-2">
                {Object.entries(completionData.sections).map(([key, section]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 font-medium">{section.label}</span>
                      <span className={`font-bold ${
                        section.color === 'green' ? 'text-green-600' :
                        section.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {section.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-500 ${
                          section.color === 'green' ? 'bg-green-500' :
                          section.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`} 
                        style={{ width: `${section.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Completion Tips */}
              {getCompletionTips.length > 0 && completionData.overall < 100 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1.5">Next steps to complete:</h4>
                  <ul className="space-y-1">
                    {getCompletionTips.map((tip, index) => (
                      <li key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {completionData.overall === 100 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                    <span>🎉</span>
                    <span>Profile Complete! Excellent work!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
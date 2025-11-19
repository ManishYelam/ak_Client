// src/utils/helpers.js
export const getUserData = (user) => {
  if (!user) return null
  
  // If user has a nested user property (from AuthContext structure)
  if (user.user && typeof user.user === 'object') {
    return user.user
  }
  
  // If user is the direct user object (from API response)
  if (user.user_id || user.id || user.email) {
    return user
  }
  
  // Fallback: return the user object as is
  return user
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const isActivePath = (currentPath, targetPath, exact = false) => {
  if (exact) {
    return currentPath === targetPath
  }
  return currentPath.startsWith(targetPath)
}
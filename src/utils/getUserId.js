export const getUserRole = user => {
  return user?.user?.role || user?.role || 'student'
}

export const getUserInfo = user => {
  return {
    id: user?.user?.id || user?.id,
    email: user?.user?.email || user?.email,
    fullName: user?.user?.full_name || user?.full_name,
    role: getUserRole(user),
  }
}

export const isAdmin = user => {
  return getUserRole(user) === 'admin'
}

export const getUserData = user => {
  if (!user) return null
  return user.user || user
}

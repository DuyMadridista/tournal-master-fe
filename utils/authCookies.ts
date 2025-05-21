import Cookies from 'js-cookie'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage'

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const
}

// Set token in both cookie and localStorage for compatibility
export const setAuthToken = (token: string) => {
  Cookies.set('token', token, cookieOptions)
  setLocalStorage('token', token)
}

// Get token from cookie (preferred) or localStorage
export const getAuthToken = () => {
  const cookieToken = Cookies.get('token')
  if (cookieToken) return cookieToken
  
  // Fallback to localStorage
  return getLocalStorage('token')
}

// Remove token from both cookie and localStorage
export const removeAuthToken = () => {
  Cookies.remove('token', { path: '/' })
  removeLocalStorage('token')
}

// Set user data in localStorage
export const setUserData = (userData: any) => {
  setLocalStorage('user', JSON.stringify(userData))
}

// Get user data from localStorage
export const getUserData = () => {
  const userStr = getLocalStorage('user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch (error) {
    return null
  }
}

// Remove user data from localStorage
export const removeUserData = () => {
  removeLocalStorage('user')
}

// Clear all auth data (both token and user data)
export const clearAuthData = () => {
  removeAuthToken()
  removeUserData()
}

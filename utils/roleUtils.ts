import { getLocalStorage } from './localStorage';

export const getUserRole = (): string => {
  if (typeof window === 'undefined') return 'GUEST';
  
  try {
    const user = getLocalStorage('user');
    if (!user) return 'GUEST';
    
    const userObject = JSON.parse(user);
    return userObject?.role || 'USER';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'GUEST';
  }
};

export const canEdit = (): boolean => {
  const role = getUserRole();
  return role !== 'USER' && role !== 'GUEST';
};

export const canCreate = (): boolean => {
  const role = getUserRole();
  return role !== 'USER' && role !== 'GUEST';
};

export const canDelete = (): boolean => {
  const role = getUserRole();
  return role !== 'USER' && role !== 'GUEST';
};

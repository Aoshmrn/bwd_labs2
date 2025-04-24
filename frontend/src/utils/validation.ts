export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3;
};

export const getValidationMessage = (field: string, value: string): string | null => {
  switch (field) {
    case 'email':
      return !value ? 'Email is required' :
        !validateEmail(value) ? 'Please enter a valid email address' : null;
    case 'password':
      return !value ? 'Password is required' :
        !validatePassword(value) ? 'Password must be at least 6 characters' : null;
    case 'username':
      return !value ? 'Username is required' :
        !validateUsername(value) ? 'Username must be at least 3 characters' : null;
    default:
      return null;
  }
};
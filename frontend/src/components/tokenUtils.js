import jwt from 'jsonwebtoken';

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true; // Assume expired if no exp field
  return Date.now() >= decoded.exp * 1000;
};

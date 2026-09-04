// api/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = 'http://192.168.29.78:8000';

// Get token from AsyncStorage - USING YOUR STORAGE KEYS
const getToken = async () => {
  try {
    // Your login stores as 'access' not 'accessToken'
    const token = await AsyncStorage.getItem('access');
    console.log('Retrieved Token:', token ? 'Token exists' : 'No token found');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Refresh token function
const refreshAccessToken = async () => {
  try {
    // Your login stores as 'refresh' not 'refreshToken'
    const refreshToken = await AsyncStorage.getItem('refresh');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    console.log('Refreshing token...');
    const response = await axios.post(`${API_URL}/auth/refresh/`, {
      refresh: refreshToken
    });

    if (response.data.access) {
      await AsyncStorage.setItem('access', response.data.access);
      console.log('Token refreshed successfully');
      return response.data.access;
    }
    throw new Error('No access token in refresh response');
  } catch (error) {
    console.error('Refresh token error:', error);
    // Clear tokens and redirect to login
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    throw error;
  }
};

// Get top students with auto-refresh
export const getTopStudents = async () => {
  try {
    let token = await getToken();
    
    if (!token) {
      console.log('No token found, attempting to refresh...');
      token = await refreshAccessToken();
    }
    
    console.log('GET TOP STUDENTS API URL:', `${API_URL}/top-students/`);
    console.log('Using token:', token ? 'Token exists' : 'No token');
    
    const response = await axios.get(`${API_URL}/top-students/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('GET TOP STUDENTS RESPONSE:', response?.data);
    return response.data;
  } catch (error) {
    console.log('GET TOP STUDENTS ERROR:', error?.response?.data || error.message);
    
    // If token is invalid, try to refresh once
    if (error.response?.status === 401) {
      try {
        console.log('Token expired, refreshing...');
        const newToken = await refreshAccessToken();
        
        // Retry with new token
        const retryResponse = await axios.get(`${API_URL}/top-students/`, {
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Retry successful');
        return retryResponse.data;
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
        throw new Error('Session expired. Please login again.');
      }
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Failed to fetch top students'
    );
  }
};

// Helper function to check token status
export const checkTokenStatus = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access');
    const refreshToken = await AsyncStorage.getItem('refresh');
    const userData = await AsyncStorage.getItem('userData');
    
    console.log('=== TOKEN STATUS ===');
    console.log('Access Token exists:', !!accessToken);
    console.log('Refresh Token exists:', !!refreshToken);
    console.log('User Data exists:', !!userData);
    
    if (accessToken) {
      console.log('Access Token (first 20 chars):', accessToken.substring(0, 20) + '...');
    }
    console.log('=====================');
    
    return { accessToken, refreshToken, userData };
  } catch (error) {
    console.error('Error checking token status:', error);
    return null;
  }
};
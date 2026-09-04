import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = 'http://192.168.29.78:8000';

export const allClassFetch = async (search) => {
  try {
    const response = await axios.get(`${API_URL}/class/?search=${search}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSubject = async ({ id, search }) => {
  try {
    const response = await axios.get(
      `${API_URL}/class/${id}/subjects/?search=${search}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// NEW API: login user ke board + class ke according subject
export const fetchBoardClassSubjects = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');

    if (!userDataString) {
      throw new Error('User data not found');
    }

    const userData = JSON.parse(userDataString);

    const response = await axios.get(`${API_URL}/subjects/`, {
      params: {
        board_name: userData?.Education_board,
        class_name: userData?.class,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchQuiz = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/quizzes/${id}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSloka = async () => {
  try {
    const response = await axios.get(`${API_URL}/sloka-of-the-day/`);
    return response.data; // ✅ Return response.data, not response
  } catch (error) {
    console.error("Error fetching sloka:", error);
    throw error;
  }
};

// apiHome.js
export const getSpecialDayMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-today-special-day-message/`);
    return response;
  } catch (error) {
    // If error is 404, return the error object
    if (error.response && error.response.status === 404) {
      return error.response;
    }
    throw error;
  }
};


export const getBirthdayUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/birthday-users/`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getPointsHistory = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;

    const userId = userData?.id;

    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await axios.get(`${API_URL}/points-history/${userId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


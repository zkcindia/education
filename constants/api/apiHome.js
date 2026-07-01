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
    return response;
  } catch (error) {
    throw error;
  }
};
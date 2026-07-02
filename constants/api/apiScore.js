import axios from 'axios';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = 'http://192.168.29.78:8000';

// export const submitQuiz = async({userId,subjectId,score})=>{
//     try {
//         const response = await axios.post(`${API_URL}/store_score/`,{userId,subjectId,score});
//         return response;
//     } catch (error) {
//         throw error
//     }
// }


import AsyncStorage from '@react-native-async-storage/async-storage';


export const submitQuiz = async ({ userId, subjectId, score }) => {
  try {
    console.log('📤 Submitting to store_score:', { userId, subjectId, score });

    const response = await axios.post(`${API_URL}/store_score/`, {
      userId: Number(userId),
      subjectId: Number(subjectId),
      score: Number(score) || 0,
    });

    console.log('✅ Score stored:', response.data);
    return response;
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
    throw error;
  }
};


// ✅ New API - Submit Quiz with Pass/Fail (18/20)
export const submitQuizWithAuth = async ({ subjectId, score }) => {
  try {
    const token = await AsyncStorage.getItem('access');

    console.log('ACCESS TOKEN:', token);

    if (!token) {
      throw new Error('Access token not found. Please login again.');
    }

    const response = await axios.post(
      `${API_URL}/submit-quiz/`,
      {
        subject_id: Number(subjectId),
        score: Number(score),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.log('❌ Submit Quiz Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getLastQuizAttempt = async () => {
  try {
    const token = await AsyncStorage.getItem('access');

    const response = await axios.get(`${API_URL}/last-quiz-attempt/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log('❌ Last Quiz Attempt Error:', error.response?.data || error.message);
    throw error;
  }
};
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = 'http://192.168.29.78:8000';

// ============================================================
// 🔑 TOKEN HELPER (Only added — nothing else changed)
// ============================================================
const getToken = async (key) => {
  let token = await AsyncStorage.getItem(key);
  if (!token && typeof window !== 'undefined' && window.localStorage) {
    token = window.localStorage.getItem(key);
  }
  return token;
};

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
    return response.data;
  } catch (error) {
    console.error("Error fetching sloka:", error);
    throw error;
  }
};

export const getSpecialDayMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/get-today-special-day-message/`);
    return response;
  } catch (error) {
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

export const fetchUserPoints = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');
    if (!userDataString) return 0;

    const userData = JSON.parse(userDataString);
    const userId = userData?.id;
    if (!userId) return 0;

    const response = await axios.get(`${API_URL}/user/${userId}/points/`);
    return response.data?.["total_points"] || 0;
  } catch (error) {
    return 0;
  }
};

export const fetchUserRank = async () => {
  try {
    const token = await getToken('access');

    console.log('🔑 RANK TOKEN:', token);

    if (!token) {
      console.warn('⚠️ No access token found — user not logged in?');
      return { rank: 0, totalPoints: 0, totalUsers: 0 };
    }

    const response = await axios.get(`${API_URL}/user/rank/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;

    if (data?.status) {
      return {
        rank: data.rank || 0,
        totalPoints: data.total_points || 0,
        totalUsers: data.total_users || 0,
        userId: data.user_id,
        email: data.email,
      };
    }

    return { rank: 0, totalPoints: 0, totalUsers: 0 };
  } catch (error) {
    console.error('❌ fetchUserRank error:', error.response?.data || error.message);
    return { rank: 0, totalPoints: 0, totalUsers: 0 };
  }
};

// ============================================================
// 🆕 PROFILE APIs
// ============================================================

// 1️⃣ PROFILE DATA FETCH
export const fetchUserProfile = async (id) => {
  try {
    const token = await getToken('access');   // ✅ Only this line changed

    console.log('🔑 PROFILE TOKEN:', token);
    console.log('🔑 TOKEN LENGTH:', token?.length);

    const response = await axios.get(`${API_URL}/user-data/${id}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    console.log('📄 PROFILE DATA:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ fetchUserProfile error:', error.response?.data || error.message);
    throw error;
  }
};

// 2️⃣ PROFILE IMAGE UPLOAD
export const updateProfileImage = async (selectedImage) => {
  try {
    const token = await getToken('access');   // ✅ Only this line changed

    console.log('🔑 UPLOAD TOKEN:', token);
    console.log('🔑 TOKEN LENGTH:', token?.length);

    if (!token) {
      throw new Error('Access token nahi mila. Please login again.');
    }

    const imageUri = selectedImage?.uri;
    if (!imageUri) {
      throw new Error('Image URI nahi mili.');
    }

    const fileName = selectedImage?.fileName || `profile-${Date.now()}.jpg`;
    const mimeType = selectedImage?.mimeType || 'image/jpeg';

    const formData = new FormData();

    if (imageUri.startsWith('data:')) {
      const blobResponse = await fetch(imageUri);
      const blob = await blobResponse.blob();
      formData.append('image', blob, fileName);
    } else {
      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      });
    }

    const response = await axios.put(
      `${API_URL}/update-profile-image/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('✅ UPLOAD RESPONSE:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ updateProfileImage error:', error.response?.data || error.message);
    throw error;
  }
};

// 3️⃣ TOKEN REFRESH
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getToken('refresh');   // ✅ Only this line changed

    console.log('🔄 REFRESH TOKEN:', refreshToken);

    if (!refreshToken) {
      throw new Error('Refresh token nahi mila.');
    }

    const response = await axios.post(`${API_URL}/auth/refresh/`, {
      refresh: refreshToken,
    });

    const newAccessToken = response.data?.access;

    if (newAccessToken) {
      await AsyncStorage.setItem('access', newAccessToken);

      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('access', newAccessToken);
      }

      console.log('✅ NEW ACCESS TOKEN SAVED');
      return newAccessToken;
    }

    throw new Error('Naya access token nahi mila.');
  } catch (error) {
    console.error('❌ refreshAccessToken error:', error.response?.data || error.message);
    throw error;
  }
};
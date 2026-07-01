import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = 'http://192.168.29.78:8000';

export const signUpUser = async data => {
  try {
    console.log('SIGNUP API URL:', `${API_URL}/signup/`);
    console.log('SIGNUP API DATA:', JSON.stringify(data, null, 2));

    const response = await axios.post(`${API_URL}/signup/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('SIGNUP API RESPONSE:', response?.data);

    return response;
  } catch (error) {
    console.log('SIGNUP API ERROR:', error?.response?.data || error.message);
    throw error;
  }
};

export const signInUser = async ({ email, password }) => {
  console.log('clicked', email, password);

  try {
    const response = await axios.post(`${API_URL}/login/`, {
      email,
      password,
    });

    return response;
  } catch (error) {
    throw error;
  }
};
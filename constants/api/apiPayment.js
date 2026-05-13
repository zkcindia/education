import axios from 'axios';

const API_URL = 'YOUR_BACKEND_URL';

export const createOrder = async (amount) => {
  try {
    const response = await axios.post(
      `${API_URL}/create-order`,
      {
        amount,
      }
    );

    return response.data;
  } catch (error) {
    console.log('Create Order Error:', error);
  }
};
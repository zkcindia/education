// constants/api/apiAssociate.js
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ✅ Associate (Dealer) Sign Up — PUBLIC endpoint (no auth)
export const signUpUser = async (payload) => {
  try {
    console.log("SIGNUP PAYLOAD:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${API_URL}/dealer-create/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          // ❌ NO Authorization header — signup public hai
        },
      }
    );

    console.log("SIGNUP RESPONSE:", response?.data);
    return response;
  } catch (error) {
    console.error(
      "❌ API Error - Dealer Signup:",
      error.response?.data || error.message
    );
    throw error;
  }
};


// ✅ 2. REFERRER (Executive) Sign Up — PUBLIC, no auth
export const signUpReferrer = async (payload) => {
  try {
    console.log("REFERRER PAYLOAD:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      `${API_URL}/referrer-create/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("REFERRER RESPONSE:", response?.data);
    return response;
  } catch (error) {
    console.error(
      "❌ API Error - Referrer Signup:",
      error.response?.data || error.message
    );
    throw error;
  }
};
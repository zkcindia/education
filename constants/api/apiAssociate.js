// constants/api/apiAssociate.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ✅ Helper: Token Nikalne ke liye
const getToken = async () => {
  const access = await AsyncStorage.getItem("access");
  return access;
};

// ============================================
// 1. ASSOCIATE (DEALER) SIGN UP
// ============================================
export const signUpUser = async (payload) => {
  try {
    console.log("SIGNUP PAYLOAD:", JSON.stringify(payload, null, 2));
    const response = await axios.post(`${API_URL}/dealer-create/`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("SIGNUP RESPONSE:", response?.data);
    return response;
  } catch (error) {
    console.error("❌ API Error - Dealer Signup:", error.response?.data || error.message);
    throw error;
  }
};

// ============================================
// 2. REFERRER (EXECUTIVE) SIGN UP
// ============================================
export const signUpReferrer = async (payload) => {
  try {
    console.log("REFERRER PAYLOAD:", JSON.stringify(payload, null, 2));
    const response = await axios.post(`${API_URL}/referrer-create/`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("REFERRER RESPONSE:", response?.data);
    return response;
  } catch (error) {
    console.error("❌ API Error - Referrer Signup:", error.response?.data || error.message);
    throw error;
  }
};

// ============================================
// 3. GET DEALER REFERRERS (TABLE KE LIYE)
// Endpoint: GET /dealer/{id}/referrers/
// ============================================
export const getDealerReferrers = async (dealerId) => {
  try {
    const token = await getToken();
    console.log(`🔍 Fetching Referrers for Dealer ID: ${dealerId}`);
    
    const response = await axios.get(`${API_URL}/dealer/referrers/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    console.log("✅ REFERRERS API RESPONSE:", response?.data);
    return response.data; 
  } catch (error) {
    console.error("❌ API Error - Get Dealer Referrers:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ 4. UPDATE REFERRER (Sahi URL ke saath)
export const updateReferrer = async (referrerId, payload) => {
  try {
    const token = await getToken();
    // 🔥 URL CHANGE: /dealer/referrer/{id}/edit/
    const response = await axios.patch(
      `${API_URL}/dealer/referrer/${referrerId}/edit/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("UPDATE REFERRER RESPONSE:", response?.data);
    return response.data;
  } catch (error) {
    console.error("❌ Update Referrer Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ DELETE REFERRER
export const deleteReferrer = async (referrerId) => {
  try {
    const token = await getToken();
    // URL check karo
    const response = await axios.delete(`${API_URL}/dealer/referrer/${referrerId}/delete/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Delete Error:", error.response?.data || error.message);
    throw error;
  }
};





export const addStudentByReferrer = async (payload) => {
  try {
    const token = await AsyncStorage.getItem("access"); // 🔥 Token check
    console.log("Using Token for Add Student:", token);

    const response = await axios.post(
      `${API_URL}/referrer/add-student/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Add Student Error:", error.response?.data || error.message);
    throw error;
  }
};


// ============================================
// 5. GET REFERRER PROFILE DETAILS (SAFE WORKAROUND)
// ============================================
export const getReferrerProfile = async (referrerId) => {
  try {
    const token = await getToken();
    console.log(`🔍 Fetching Referrer Profile for ID: ${referrerId}`);

    // Try WITH token
    try {
      const response = await axios.get(`${API_URL}/referrer/${referrerId}/`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ REFERRER PROFILE (API):", response?.data);
      return response.data;
    } catch (apiErr) {
      console.log("⚠️ API FAILED, using local fallback:", apiErr?.response?.data);

      // 🔥 FALLBACK: AsyncStorage se userData return karo
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log("✅ REFERRER PROFILE (LOCAL):", parsed);
        return { status: true, data: parsed };
      }

      // Agar storage bhi khali ho to empty return
      return { status: false, data: null };
    }
  } catch (error) {
    console.error("❌ Get Referrer Profile Error:", error?.message);
    return { status: false, data: null };
  }
};
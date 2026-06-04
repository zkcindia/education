import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.29.78:8000";

const getToken = async () => {
  const access = await AsyncStorage.getItem("access");

  console.log("ACCESS TOKEN USED:", access);

  return access;
};

export const myPayments = async () => {
  const token = await getToken();

  const response = await axios.get(`${API_URL}/my-payments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllPlans = async () => {
  const response = await axios.get(`${API_URL}/get-plans/`);
  return response.data;
};

export const createPaymentOrder = async (amount) => {
  const token = await getToken();

  const response = await axios.post(
    `${API_URL}/gateway/`,
    {
      amount: amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const verifyPayment = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  plan,
}) => {

    console.log("VERIFY PAYMENT CALLED");

  console.log("PAYMENT ID:", razorpay_payment_id);

  console.log("ORDER ID:", razorpay_order_id);

  console.log("SIGNATURE:", razorpay_signature);

  console.log("PLAN:", plan);

  // const token = await getToken();
  

const token = await getToken();

const userData = await AsyncStorage.getItem("userData");

const parsedUser = userData
  ? JSON.parse(userData)
  : null;

const formData = new FormData();

formData.append("razorpay_payment_id", razorpay_payment_id);
formData.append("razorpay_order_id", razorpay_order_id);
formData.append("razorpay_signature", razorpay_signature);

formData.append("plan_name", `${plan?.duration} Plan`);
formData.append("duration", plan?.duration || "");
formData.append("plan_id", String(plan?.id || ""));

formData.append(
  "student_id",
  String(parsedUser?.id || "")
);

  const response = await axios.post(
    `${API_URL}/verify-cart-payment/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("VERIFY RESPONSE:", response.data);
  return response.data;
};


export const withdrawPayment = async (data) => {
  const token = await AsyncStorage.getItem('access');

  console.log("WITHDRAW TOKEN:", token);

  const response = await axios.post(
    `${API_URL}/withdraw-payment/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getWalletBalance = async () => {
  const token = await AsyncStorage.getItem("access");

  const response = await axios.get(`${API_URL}/cashback-summary/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
import axios from 'axios';
const API_URL = process.env.EXPO_PUBLIC_API_URL;
// const API_URL = 'http://192.168.29.78:8000';

export const submitQuiz = async({userId,subjectId,score})=>{
    try {
        const response = await axios.post(`${API_URL}/store_score/`,{userId,subjectId,score});
        return response;
    } catch (error) {
        throw error
    }
}

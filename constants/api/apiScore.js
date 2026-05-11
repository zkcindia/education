import axios from 'axios';
// const API_URL = 'https://tapas.bc-pl.com';
const API_URL = 'http://172.20.10.2:8000';

export const submitQuiz = async({userId,subjectId,score})=>{
    try {
        const response = await axios.post(`${API_URL}/store_score/`,{userId,subjectId,score});
        return response;
    } catch (error) {
        throw error
    }
}

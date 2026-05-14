import axios from 'axios';
// const API_URL = 'https://tapas.bc-pl.com';
const API_URL = 'http://192.168.29.78:8000';


export const allClassFetch = async(search)=>{
    try {
        const response = await axios.get(`${API_URL}/class/?search=${search}`);
        return response;
    } catch (error) {
        throw error
    }
}
export const fetchSubject = async({id,search})=>{
    try {
        const response = await axios.get(`${API_URL}/class/${id}/subjects/?search=${search}`);
        return response;
    } catch (error) {
        throw error
    }
}
export const fetchQuiz = async(id)=>{
    try {
        const response = await axios.get(`${API_URL}/quizzes/${id}/`);
        return response;
    } catch (error) {
        throw error
    }
}
export const fetchSloka = async()=>{
    try {
        const response = await axios.get(`${API_URL}/sloka-of-the-day/`);
        return response;
    } catch (error) {
        throw error
    }
}
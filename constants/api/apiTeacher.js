import axios from 'axios';
import { err } from 'react-native-svg';
// const API_URL = 'http://192.168.29.78:8000';
const API_URL = process.env.EXPO_PUBLIC_API_URL;


export const allQuestions = async()=>{
    try {
        const response = await axios.get(`${API_URL}/get_question/1/`);
        return response;
    } catch (error) {
        throw error
    }
}
// edit questions

export const editQuestions = async({id,data})=>{
    try {
        const response = await axios.post(`${API_URL}/edit_question/${id}/`,data);
        return response;
    } catch (error) {
        throw error
    }
}
// delete questions

export const deleteQuestions = async(id)=>{
    console.log('calles');
    
    try {
        const response = await axios.delete(`${API_URL}/delete_question/${id}/`);
        return response;
    } catch (error) {
        console.log(error);
        
        throw error
    }
}
// uploadQuestion
export const uploadQuestions = async({id,payload})=>{
    try {
        const response = await axios.post(`${API_URL}/add_question/${id}/`,payload);
        return response;
    } catch (error) {
        throw error
    }
}
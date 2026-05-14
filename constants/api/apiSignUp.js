import axios from 'axios';
// const API_URL = 'https://tapas.bc-pl.com';
const API_URL = 'http://192.168.29.78:8000';

export const signUpUser = async({name,email,password})=>{
    try {
        const response = await axios.post(`${API_URL}/signup/`,{name,email,password});
        console.log('click');
        return response;
    } catch (error) {
        throw error
    }
}
export const signInUser = async({email,password})=>{
    console.log('clicked',email,password);
    try {
        const response = await axios.post(`${API_URL}/login/`,{email,password});
        return response;
    } catch (error) {
        throw error
    }
}
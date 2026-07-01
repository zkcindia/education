// import axios from 'axios';
// import { err } from 'react-native-svg';
// // const API_URL = 'http://192.168.29.78:8000';
// const API_URL = process.env.EXPO_PUBLIC_API_URL;


// export const getQuestionsBySubject = async (subjectId) => {
//     try {
//         const response = await axios.get(`${API_URL}/get_question/${subjectId}/`);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }
// // edit questions

// export const editQuestions = async({id,data})=>{
//     try {
//         const response = await axios.post(`${API_URL}/edit_question/${id}/`,data);
//         return response;
//     } catch (error) {
//         throw error
//     }
// }
// // delete questions

// export const deleteQuestions = async(id)=>{
//     console.log('calles');
    
//     try {
//         const response = await axios.delete(`${API_URL}/delete_question/${id}/`);
//         return response;
//     } catch (error) {
//         console.log(error);
        
//         throw error
//     }
// }
// // uploadQuestion
// export const uploadQuestions = async({id,payload})=>{
//     try {
//         const response = await axios.post(`${API_URL}/add_question/${id}/`,payload);
//         return response;
//     } catch (error) {
//         throw error
//     }
// }


// // For bulk Excel file upload - renamed to uploadBulkQuestions
// export const uploadBulkQuestions = async ({ id, subject, file }) => {
//   const formData = new FormData();

//   formData.append('subject', String(subject));

//   formData.append('file', {
//     uri: file.uri,
//     name: file.name || 'questions.xlsx',
//     type: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   });

//   return await axios.post(`${API_URL}/uploadquestion/${id}/`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
// };

// export const getBoards = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/education-boards/`);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }

// export const getClassesByBoard = async (boardName) => {
//     try {
//         const response = await axios.get(`${API_URL}/classes-by-board/?board_name=${boardName}`);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }

// export const getSubjects = async (boardName, className) => {
//     try {
//         const response = await axios.get(`${API_URL}/subjects/?board_name=${boardName}&class_name=${className}`);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.29.78:8000';

// ✅ Get subjects by board and class
export const getSubjects = async (boardName, className) => {
    try {
        const response = await axios.get(`${API_URL}/subjects/`, {
            params: { board_name: boardName, class_name: className }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

// ✅ Get subjects for logged-in user
export const fetchBoardClassSubjects = async () => {
    try {
        const userData = JSON.parse(await AsyncStorage.getItem('userData'));
        return await getSubjects(userData?.Education_board, userData?.class);
    } catch (error) {
        throw error;
    }
};

// ✅ Other existing functions
export const getQuestionsBySubject = async (subjectId) => {
    try {
        const response = await axios.get(`${API_URL}/get_question/${subjectId}/`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const editQuestions = async ({ id, data }) => {
    try {
        const response = await axios.post(`${API_URL}/edit_question/${id}/`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteQuestions = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete_question/${id}/`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const uploadQuestions = async ({ id, payload }) => {
    try {
        const response = await axios.post(`${API_URL}/add_question/${id}/`, payload);
        return response;
    } catch (error) {
        throw error;
    }
};

export const uploadBulkQuestions = async ({ id, subject, file }) => {
    const formData = new FormData();
    formData.append('subject', String(subject));
    formData.append('file', {
        uri: file.uri,
        name: file.name || 'questions.xlsx',
        type: file.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    try {
        const response = await axios.post(`${API_URL}/uploadquestion/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getBoards = async () => {
    try {
        const response = await axios.get(`${API_URL}/education-boards/`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getClassesByBoard = async (boardName) => {
    try {
        const response = await axios.get(`${API_URL}/classes-by-board/?board_name=${boardName}`);
        return response;
    } catch (error) {
        throw error;
    }
};


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullName: 'Rajendra Ratha',
  fathersName: 'Debendra Ratha',
  email: 'rajendra@gmail.com',
  phoneNumber: '8144263969',
  address: '2 United Kingdom, UK',
  dob: '28/10/2024',
  gender: 'Male',
  className: 'Std. 3rd',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    saveProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateProfile, saveProfile } = profileSlice.actions;
export default profileSlice.reducer;

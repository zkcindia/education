import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { COLOR } from '../../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.29.78:8000';

export default function MyProfileScreen() {
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // DYNAMIC USER ID
  const [userId, setUserId] = useState(null);

  // PROFILE STATE
  const [profile, setProfile] = useState({
    fullName: '',
    fathersName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dob: new Date(),
    gender: '',
    className: '',
    image: '',
  });

  // GET LOGGED USER
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');

      if (user) {
        const parsedUser = JSON.parse(user);

        console.log('LOGIN USER:', parsedUser);

        setUserId(parsedUser.id);

        fetchProfile(parsedUser.id);
      }
    } catch (error) {
      console.log('USER ERROR:', error);
    }
  };

  // FETCH PROFILE
  const fetchProfile = async (id) => {
    try {
      setLoading(true);

      const response = await axios.get(
`${API_URL}/user-data/${id}/`
      );

      console.log('PROFILE DATA:', response.data);

      const data = response.data;

      // MATCH API KEYS WITH UI KEYS
      setProfile({
        fullName: data.name || '',
        fathersName: data.father_name || '',
        email: data.email || '',
        phoneNumber: data.mobile
          ? data.mobile.toString()
          : '',
        address: data.address || '',
        dob: data.DOB ? new Date(data.DOB) : new Date(),
        gender: data.gender || '',
        className: '',
        image: data.image
          ? `${API_URL}${data.image}`
          : '',
      });
    } catch (error) {
      console.log('PROFILE FETCH ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  // DATE CHANGE
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setProfile({
        ...profile,
        dob: selectedDate,
      });
    }

    setShowDatePicker(false);
  };

  // INPUT CHANGE
  const handleInputChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  // UPDATE PROFILE
  const handleSave = async () => {
    try {
const formData = {
  fullName: profile.fullName,
  fathersName: profile.fathersName,
  email: profile.email,

  mobile: profile.phoneNumber
    ? Number(profile.phoneNumber)
    : null,

  dob: profile.dob.toISOString().split('T')[0],
  address: profile.address,
  gender: profile.gender,
};

await axios.put(
  `${API_URL}/update-user/${userId}/`,
  formData
);

      setIsEditing(false);

      alert('Profile Updated Successfully');

      fetchProfile(userId);
    } catch (error) {
      console.log('UPDATE ERROR:', error);
      alert('Update Failed');
    }
  };

  // LOADING
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={COLOR.background}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLOR.background,
          padding: 20,
          paddingTop: 30,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="arrow-left"
            size={24}
            color={COLOR.white}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            color: COLOR.white,
          }}
        >
          My Profile
        </Text>

        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <MaterialCommunityIcons
            name="square-edit-outline"
            size={24}
            color={COLOR.white}
          />
        </TouchableOpacity>
      </View>

      <SafeAreaView
        style={{
          flex: 1,
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* PROFILE IMAGE */}
          <Image
            source={{
              uri:
                profile.image ||
                'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignSelf: 'center',
            }}
          />

          <View
            style={{
              flexDirection: 'column',
              marginTop: 20,
              gap: 10,
            }}
          >
            {/* FULL NAME */}
            <View style={styles.myCard}>
              <Text style={styles.label}>Full Name</Text>

              <TextInput
                style={styles.input}
                editable={isEditing}
                value={profile.fullName}
                onChangeText={(value) =>
                  handleInputChange('fullName', value)
                }
              />
            </View>

            {/* FATHER NAME */}
            <View style={styles.myCard}>
              <Text style={styles.label}>Father's Name</Text>

              <TextInput
                style={styles.input}
                editable={isEditing}
                value={profile.fathersName}
                onChangeText={(value) =>
                  handleInputChange('fathersName', value)
                }
              />
            </View>

            {/* EMAIL */}
            <View style={styles.myCard}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                style={styles.input}
                editable={isEditing}
                value={profile.email}
                onChangeText={(value) =>
                  handleInputChange('email', value)
                }
              />
            </View>

            {/* PHONE */}
            <View style={styles.myCard}>
              <Text style={styles.label}>Phone Number</Text>

              <TextInput
                style={styles.input}
                editable={isEditing}
                value={profile.phoneNumber}
                keyboardType="phone-pad"
                onChangeText={(value) =>
                  handleInputChange('phoneNumber', value)
                }
              />
            </View>

            {/* ADDRESS */}
            <View style={styles.myCard}>
              <Text style={styles.label}>Address</Text>

              <TextInput
                style={styles.input}
                editable={isEditing}
                value={profile.address}
                onChangeText={(value) =>
                  handleInputChange('address', value)
                }
              />
            </View>

            {/* DOB */}
            <TouchableOpacity
              style={styles.myCard}
              disabled={!isEditing}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.label}>DOB</Text>

              <Text
                style={{
                  fontSize: 16,
                  marginTop: 3,
                }}
              >
                {profile.dob.toDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={profile.dob}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* GENDER */}
            <View style={styles.myCard}>
              <Text style={styles.label}>Gender</Text>

              <Picker
                selectedValue={profile.gender}
                enabled={isEditing}
                onValueChange={(value) =>
                  handleInputChange('gender', value)
                }
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* CLASS */}
            <View style={styles.myCard}>
              <Text style={styles.label}>Class Name</Text>

              <TextInput
                style={styles.input}
                editable={isEditing}
                value={profile.className}
                onChangeText={(value) =>
                  handleInputChange('className', value)
                }
              />
            </View>

            {/* SAVE BUTTON */}
            {isEditing && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  myCard: {
    width: '100%',
    backgroundColor: COLOR.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  input: {
    width: '100%',
    fontSize: 16,
  },

  label: {
    fontSize: 16,
    color: COLOR.grey,
    marginBottom: 5,
  },

  saveButton: {
    backgroundColor: COLOR.background,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },

  saveButtonText: {
    color: COLOR.white,
    fontSize: 18,
  },
});
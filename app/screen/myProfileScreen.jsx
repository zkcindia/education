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
  Alert,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { COLOR } from '../../constants/Colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function MyProfileScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [userId, setUserId] = useState(null);

  const [profile, setProfile] = useState({
    fullName: '',
    fathersName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dob: '',
    gender: '',
    className: '',
    image: '',
  });

const getToken = async () => {
  const access = await AsyncStorage.getItem('access');

  console.log('ACCESS TOKEN USED:', access);

  return access;
};

  useEffect(() => {
    getUser();
  }, []);

const getAccessToken = async () => {
  const access = await AsyncStorage.getItem('access');
const accessToken = await getToken();
  const refresh = await AsyncStorage.getItem('refresh');
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  console.log('access =>', access);
  console.log('access_token =>', accessToken);
  console.log('refresh =>', refresh);
  console.log('refresh_token =>', refreshToken);

  return access || accessToken;
};

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return '';
    }

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://')
    ) {
      return imageUrl;
    }

    return `${API_URL}${imageUrl}`;
  };

  const getUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');

      if (!userData) {
        Alert.alert('Error', 'User data not found.');
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(userData);

      console.log('LOGIN USER:', parsedUser);

      const loggedUserId =
        parsedUser?.id ||
        parsedUser?.user_id ||
        parsedUser?.user?.id;

      if (!loggedUserId) {
        Alert.alert('Error', 'User ID not found.');
        setLoading(false);
        return;
      }

      setUserId(loggedUserId);

      await fetchProfile(loggedUserId);
    } catch (error) {
      console.log('USER ERROR:', error);

      Alert.alert(
        'Error',
        'Logged user information load nahi hua.'
      );

      setLoading(false);
    }
  };

  const fetchProfile = async (id) => {
    try {
      setLoading(true);

      const accessToken = await getAccessToken();

      const response = await axios.get(
        `${API_URL}/user-data/${id}/`,
        {
          headers: accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
              }
            : {},
        }
      );

      console.log('PROFILE DATA:', response.data);

      const data = response.data?.data || response.data;

      setProfile({
        fullName:
          data?.name ||
          data?.fullName ||
          data?.full_name ||
          '',
        fathersName:
          data?.father_name ||
          data?.fathersName ||
          data?.fatherName ||
          '',
        email: data?.email || '',
        phoneNumber: data?.mobile
          ? String(data.mobile)
          : data?.phoneNumber
            ? String(data.phoneNumber)
            : '',
        address: data?.address || '',
        dob: data?.DOB || data?.dob || '',
        gender: data?.gender || '',
        className:
          data?.class ||
          data?.class_name ||
          data?.className ||
          '',
        image: getImageUrl(data?.image),
      });
    } catch (error) {
      console.log(
        'PROFILE FETCH ERROR:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error.response?.data?.detail ||
          'Profile data load nahi hua.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectProfileImage = async () => {
    try {
      console.log('CAMERA BUTTON CLICKED');

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      console.log('GALLERY PERMISSION:', permissionResult);

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Profile photo select karne ke liye gallery permission allow karo.'
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      console.log('IMAGE PICKER RESULT:', result);

      if (result.canceled) {
        console.log('IMAGE SELECTION CANCELLED');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        Alert.alert('Error', 'Selected image nahi mili.');
        return;
      }

      const selectedImage = result.assets[0];

      console.log('SELECTED IMAGE:', selectedImage);

      await uploadProfileImage(selectedImage);
    } catch (error) {
      console.log('IMAGE PICKER ERROR:', error);

      Alert.alert(
        'Error',
        error.message || 'Image select nahi ho payi.'
      );
    }
  };

const uploadProfileImage = async (selectedImage) => {
  try {
    setImageUploading(true);

    const accessToken = await getToken();

    if (!accessToken) {
      Alert.alert('Error', 'Access token nahi mila.');
      return;
    }

    const imageUri = selectedImage?.uri;

    if (!imageUri) {
      Alert.alert('Error', 'Image URI nahi mili.');
      return;
    }

    const fileName =
      selectedImage?.fileName ||
      `profile-${Date.now()}.jpg`;

    const mimeType =
      selectedImage?.mimeType || 'image/jpeg';

    const formData = new FormData();

    if (imageUri.startsWith('data:')) {
      const blobResponse = await fetch(imageUri);
      const blob = await blobResponse.blob();

      formData.append('image', blob, fileName);
    } else {
      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: mimeType,
      });
    }

    const response = await axios.put(
      `${API_URL}/update-profile-image/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('UPLOAD RESPONSE:', response.data);

    const uploadedImage = response.data?.image;

    if (uploadedImage) {
      setProfile((prev) => ({
        ...prev,
        image: `${uploadedImage}?time=${Date.now()}`,
      }));
    }

    Alert.alert(
      'Success',
      response.data?.message ||
        'Profile image updated successfully.'
    );
  } catch (error) {
    console.log(
      'UPLOAD ERROR:',
      error.response?.data || error.message
    );

    Alert.alert(
      'Upload Failed',
      error.response?.data?.detail ||
        error.response?.data?.message ||
        'Image upload nahi hui.'
    );
  } finally {
    setImageUploading(false);
  }
};

  const formatDob = (dob) => {
    if (!dob) {
      return '';
    }

    const date = new Date(dob);

    if (Number.isNaN(date.getTime())) {
      return dob;
    }

    return date.toDateString();
  };

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
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather
            name="arrow-left"
            size={24}
            color={COLOR.white}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          My Profile
        </Text>

        <View style={styles.headerRightSpace} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ONLY PROFILE IMAGE EDITABLE */}
          <View style={styles.profileImageWrapper}>
            <Image
              source={{
                uri:
                  profile.image ||
                  'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
              }}
              style={styles.profileImage}
            />

            <TouchableOpacity
              style={styles.imageEditButton}
              onPress={selectProfileImage}
              disabled={imageUploading}
              activeOpacity={0.7}
            >
              {imageUploading ? (
                <ActivityIndicator
                  size="small"
                  color={COLOR.white}
                />
              ) : (
                <MaterialCommunityIcons
                  name="camera"
                  size={21}
                  color={COLOR.white}
                />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.imageHint}>
            Tap camera icon to change profile photo
          </Text>

          <View style={styles.formContainer}>
            <ProfileField
              label="Full Name"
              value={profile.fullName}
            />

            <ProfileField
              label="Father's Name"
              value={profile.fathersName}
            />

            <ProfileField
              label="Email"
              value={profile.email}
            />

            <ProfileField
              label="Phone Number"
              value={profile.phoneNumber}
            />

            <ProfileField
              label="Address"
              value={profile.address}
            />

            <ProfileField
              label="DOB"
              value={formatDob(profile.dob)}
            />

            <ProfileField
              label="Gender"
              value={profile.gender}
            />

            <ProfileField
              label="Class Name"
              value={profile.className}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const ProfileField = ({ label, value }) => {
  return (
    <View style={styles.myCard}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        value={value || ''}
        editable={false}
        selectTextOnFocus={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    color: COLOR.white,
    fontWeight: '600',
  },

  headerRightSpace: {
    width: 24,
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingTop: 25,
    paddingBottom: 100,
  },

  profileImageWrapper: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    position: 'relative',
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#dddddd',
    borderWidth: 3,
    borderColor: COLOR.white,
  },

  imageEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLOR.white,
  },

  imageHint: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 22,
    color: COLOR.grey,
    fontSize: 13,
  },

  formContainer: {
    width: '100%',
  },

  myCard: {
    width: '100%',
    backgroundColor: COLOR.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: COLOR.grey,
    marginBottom: 4,
  },

  input: {
    width: '100%',
    fontSize: 16,
    color: '#222222',
    paddingVertical: 3,
  },
});
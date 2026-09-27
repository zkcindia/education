// import {
//   View,
//   Text,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';

// import React, { useEffect, useState } from 'react';
// import { COLOR } from '../../constants/Colors';
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';

// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export default function MyProfileScreen() {
//   const navigation = useNavigation();

//   const [loading, setLoading] = useState(true);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [userId, setUserId] = useState(null);

//   const [profile, setProfile] = useState({
//     fullName: '',
//     fathersName: '',
//     email: '',
//     phoneNumber: '',
//     address: '',
//     dob: '',
//     gender: '',
//     className: '',
//     image: '',
//   });

// const getToken = async () => {
//   const access = await AsyncStorage.getItem('access');

//   console.log('ACCESS TOKEN USED:', access);

//   return access;
// };

//   useEffect(() => {
//     getUser();
//   }, []);

// const getAccessToken = async () => {
//   const access = await AsyncStorage.getItem('access');
// const accessToken = await getToken();
//   const refresh = await AsyncStorage.getItem('refresh');
//   const refreshToken = await AsyncStorage.getItem('refresh_token');

//   console.log('access =>', access);
//   console.log('access_token =>', accessToken);
//   console.log('refresh =>', refresh);
//   console.log('refresh_token =>', refreshToken);

//   return access || accessToken;
// };

//   const getImageUrl = (imageUrl) => {
//     if (!imageUrl) {
//       return '';
//     }

//     if (
//       imageUrl.startsWith('http://') ||
//       imageUrl.startsWith('https://')
//     ) {
//       return imageUrl;
//     }

//     return `${API_URL}${imageUrl}`;
//   };

//   const getUser = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');

//       if (!userData) {
//         Alert.alert('Error', 'User data not found.');
//         setLoading(false);
//         return;
//       }

//       const parsedUser = JSON.parse(userData);

//       console.log('LOGIN USER:', parsedUser);

//       const loggedUserId =
//         parsedUser?.id ||
//         parsedUser?.user_id ||
//         parsedUser?.user?.id;

//       if (!loggedUserId) {
//         Alert.alert('Error', 'User ID not found.');
//         setLoading(false);
//         return;
//       }

//       setUserId(loggedUserId);

//       await fetchProfile(loggedUserId);
//     } catch (error) {
//       console.log('USER ERROR:', error);

//       Alert.alert(
//         'Error',
//         'Logged user information load nahi hua.'
//       );

//       setLoading(false);
//     }
//   };

//   const fetchProfile = async (id) => {
//     try {
//       setLoading(true);

//       const accessToken = await getAccessToken();

//       const response = await axios.get(
//         `${API_URL}/user-data/${id}/`,
//         {
//           headers: accessToken
//             ? {
//                 Authorization: `Bearer ${accessToken}`,
//               }
//             : {},
//         }
//       );

//       console.log('PROFILE DATA:', response.data);

//       const data = response.data?.data || response.data;

//       setProfile({
//         fullName:
//           data?.name ||
//           data?.fullName ||
//           data?.full_name ||
//           '',
//         fathersName:
//           data?.father_name ||
//           data?.fathersName ||
//           data?.fatherName ||
//           '',
//         email: data?.email || '',
//         phoneNumber: data?.mobile
//           ? String(data.mobile)
//           : data?.phoneNumber
//             ? String(data.phoneNumber)
//             : '',
//         address: data?.address || '',
//         dob: data?.DOB || data?.dob || '',
//         gender: data?.gender || '',
//         className:
//           data?.class ||
//           data?.class_name ||
//           data?.className ||
//           '',
//         image: getImageUrl(data?.image),
//       });
//     } catch (error) {
//       console.log(
//         'PROFILE FETCH ERROR:',
//         error.response?.data || error.message
//       );

//       Alert.alert(
//         'Error',
//         error.response?.data?.detail ||
//           'Profile data load nahi hua.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectProfileImage = async () => {
//     try {
//       console.log('CAMERA BUTTON CLICKED');

//       const permissionResult =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();

//       console.log('GALLERY PERMISSION:', permissionResult);

//       if (!permissionResult.granted) {
//         Alert.alert(
//           'Permission Required',
//           'Profile photo select karne ke liye gallery permission allow karo.'
//         );

//         return;
//       }

//       const result =
//         await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//         });

//       console.log('IMAGE PICKER RESULT:', result);

//       if (result.canceled) {
//         console.log('IMAGE SELECTION CANCELLED');
//         return;
//       }

//       if (!result.assets || result.assets.length === 0) {
//         Alert.alert('Error', 'Selected image nahi mili.');
//         return;
//       }

//       const selectedImage = result.assets[0];

//       console.log('SELECTED IMAGE:', selectedImage);

//       await uploadProfileImage(selectedImage);
//     } catch (error) {
//       console.log('IMAGE PICKER ERROR:', error);

//       Alert.alert(
//         'Error',
//         error.message || 'Image select nahi ho payi.'
//       );
//     }
//   };

// const uploadProfileImage = async (selectedImage) => {
//   try {
//     setImageUploading(true);

//     const accessToken = await getToken();

//     if (!accessToken) {
//       Alert.alert('Error', 'Access token nahi mila.');
//       return;
//     }

//     const imageUri = selectedImage?.uri;

//     if (!imageUri) {
//       Alert.alert('Error', 'Image URI nahi mili.');
//       return;
//     }

//     const fileName =
//       selectedImage?.fileName ||
//       `profile-${Date.now()}.jpg`;

//     const mimeType =
//       selectedImage?.mimeType || 'image/jpeg';

//     const formData = new FormData();

//     if (imageUri.startsWith('data:')) {
//       const blobResponse = await fetch(imageUri);
//       const blob = await blobResponse.blob();

//       formData.append('image', blob, fileName);
//     } else {
//       formData.append('image', {
//         uri: imageUri,
//         name: fileName,
//         type: mimeType,
//       });
//     }

//     const response = await axios.put(
//       `${API_URL}/update-profile-image/`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           Accept: 'application/json',
//         },
//         timeout: 30000,
//       }
//     );

//     console.log('UPLOAD RESPONSE:', response.data);

//     const uploadedImage = response.data?.image;

//     if (uploadedImage) {
//       setProfile((prev) => ({
//         ...prev,
//         image: `${uploadedImage}?time=${Date.now()}`,
//       }));
//     }

//     Alert.alert(
//       'Success',
//       response.data?.message ||
//         'Profile image updated successfully.'
//     );
//   } catch (error) {
//     console.log(
//       'UPLOAD ERROR:',
//       error.response?.data || error.message
//     );

//     Alert.alert(
//       'Upload Failed',
//       error.response?.data?.detail ||
//         error.response?.data?.message ||
//         'Image upload nahi hui.'
//     );
//   } finally {
//     setImageUploading(false);
//   }
// };

//   const formatDob = (dob) => {
//     if (!dob) {
//       return '';
//     }

//     const date = new Date(dob);

//     if (Number.isNaN(date.getTime())) {
//       return dob;
//     }

//     return date.toDateString();
//   };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator
//           size="large"
//           color={COLOR.background}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.7}
//         >
//           <Feather
//             name="arrow-left"
//             size={24}
//             color={COLOR.white}
//           />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>
//           My Profile
//         </Text>

//         <View style={styles.headerRightSpace} />
//       </View>

//       <SafeAreaView style={styles.safeArea}>
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           {/* ONLY PROFILE IMAGE EDITABLE */}
//           <View style={styles.profileImageWrapper}>
//             <Image
//               source={{
//                 uri:
//                   profile.image ||
//                   'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
//               }}
//               style={styles.profileImage}
//             />

//             <TouchableOpacity
//               style={styles.imageEditButton}
//               onPress={selectProfileImage}
//               disabled={imageUploading}
//               activeOpacity={0.7}
//             >
//               {imageUploading ? (
//                 <ActivityIndicator
//                   size="small"
//                   color={COLOR.white}
//                 />
//               ) : (
//                 <MaterialCommunityIcons
//                   name="camera"
//                   size={21}
//                   color={COLOR.white}
//                 />
//               )}
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.imageHint}>
//             Tap camera icon to change profile photo
//           </Text>

//           <View style={styles.formContainer}>
//             <ProfileField
//               label="Full Name"
//               value={profile.fullName}
//             />

//             <ProfileField
//               label="Father's Name"
//               value={profile.fathersName}
//             />

//             <ProfileField
//               label="Email"
//               value={profile.email}
//             />

//             <ProfileField
//               label="Phone Number"
//               value={profile.phoneNumber}
//             />

//             <ProfileField
//               label="Address"
//               value={profile.address}
//             />

//             <ProfileField
//               label="DOB"
//               value={formatDob(profile.dob)}
//             />

//             <ProfileField
//               label="Gender"
//               value={profile.gender}
//             />

//             <ProfileField
//               label="Class Name"
//               value={profile.className}
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// }

// const ProfileField = ({ label, value }) => {
//   return (
//     <View style={styles.myCard}>
//       <Text style={styles.label}>
//         {label}
//       </Text>

//       <TextInput
//         style={styles.input}
//         value={value || ''}
//         editable={false}
//         selectTextOnFocus={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },

//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLOR.background,
//     paddingHorizontal: 20,
//     paddingTop: 30,
//     paddingBottom: 20,
//   },

//   headerTitle: {
//     fontSize: 18,
//     color: COLOR.white,
//     fontWeight: '600',
//   },

//   headerRightSpace: {
//     width: 24,
//   },

//   safeArea: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },

//   scrollContent: {
//     paddingTop: 25,
//     paddingBottom: 100,
//   },

//   profileImageWrapper: {
//     width: 110,
//     height: 110,
//     alignSelf: 'center',
//     position: 'relative',
//   },

//   profileImage: {
//     width: 110,
//     height: 110,
//     borderRadius: 55,
//     backgroundColor: '#dddddd',
//     borderWidth: 3,
//     borderColor: COLOR.white,
//   },

//   imageEditButton: {
//     position: 'absolute',
//     right: 0,
//     bottom: 1,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: COLOR.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: COLOR.white,
//   },

//   imageHint: {
//     textAlign: 'center',
//     marginTop: 12,
//     marginBottom: 22,
//     color: COLOR.grey,
//     fontSize: 13,
//   },

//   formContainer: {
//     width: '100%',
//   },

//   myCard: {
//     width: '100%',
//     backgroundColor: COLOR.white,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginBottom: 12,
//   },

//   label: {
//     fontSize: 14,
//     color: COLOR.grey,
//     marginBottom: 4,
//   },

//   input: {
//     width: '100%',
//     fontSize: 16,
//     color: '#222222',
//     paddingVertical: 3,
//   },
// });


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
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

import React, { useEffect, useState, useRef } from 'react';
import { COLOR } from '../../constants/Colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const { width } = Dimensions.get('window');
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

  // 🎈 Floating animation for header icon
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
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

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
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
        parsedUser?.id || parsedUser?.user_id || parsedUser?.user?.id;

      if (!loggedUserId) {
        Alert.alert('Error', 'User ID not found.');
        setLoading(false);
        return;
      }

      setUserId(loggedUserId);

      await fetchProfile(loggedUserId);
    } catch (error) {
      console.log('USER ERROR:', error);

      Alert.alert('Error', 'Logged user information load nahi hua.');

      setLoading(false);
    }
  };

  const fetchProfile = async (id) => {
    try {
      setLoading(true);

      const accessToken = await getAccessToken();

      const response = await axios.get(`${API_URL}/user-data/${id}/`, {
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
      });

      console.log('PROFILE DATA:', response.data);

      const data = response.data?.data || response.data;

      setProfile({
        fullName: data?.name || data?.fullName || data?.full_name || '',
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
          data?.class || data?.class_name || data?.className || '',
        image: getImageUrl(data?.image),
      });
    } catch (error) {
      console.log(
        'PROFILE FETCH ERROR:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Profile data load nahi hua.'
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

      const result = await ImagePicker.launchImageLibraryAsync({
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

      Alert.alert('Error', error.message || 'Image select nahi ho payi.');
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
        selectedImage?.fileName || `profile-${Date.now()}.jpg`;

      const mimeType = selectedImage?.mimeType || 'image/jpeg';

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
        response.data?.message || 'Profile image updated successfully.'
      );
    } catch (error) {
      console.log('UPLOAD ERROR:', error.response?.data || error.message);

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
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔵 GRADIENT HEADER */}
      <LinearGradient
        colors={['#4F46E5', '#6D28D9', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative Circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Profile</Text>

        {/* 👤 Animated Profile Icon (Right Side) */}
        <Animated.View
          style={[
            styles.headerProfileBox,
            { transform: [{ translateY }] },
          ]}
        >
          <View style={styles.headerGlowCircle} />
          <Text style={styles.headerProfileEmoji}>🧑‍🎓</Text>
          <Text style={styles.headerProfileEmojiSmall}>✏️</Text>
        </Animated.View>
      </LinearGradient>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 🖼️ PROFILE IMAGE */}
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileRing} />

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
              activeOpacity={0.85}
            >
              {imageUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialCommunityIcons
                  name="camera"
                  size={18}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.imageHint}>
            Tap camera icon to change profile photo
          </Text>

          {/* 📝 FORM FIELDS */}
          <View style={styles.formContainer}>
            <ProfileField
              label="Full Name"
              value={profile.fullName}
              icon="user"
            />
            <ProfileField
              label="Father's Name"
              value={profile.fathersName}
              icon="users"
            />
            <ProfileField label="Email" value={profile.email} icon="mail" />
            <ProfileField
              label="Phone Number"
              value={profile.phoneNumber}
              icon="phone"
            />
            <ProfileField
              label="Address"
              value={profile.address}
              icon="map-pin"
            />
            <ProfileField
              label="DOB"
              value={formatDob(profile.dob)}
              icon="calendar"
            />
            <ProfileField
              label="Gender"
              value={profile.gender}
              icon="user-check"
            />
            <ProfileField
              label="Class Name"
              value={profile.className}
              icon="book"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ============================================================
   📝 PROFILE FIELD COMPONENT
   ============================================================ */
const ProfileField = ({ label, value, icon }) => {
  return (
    <View style={styles.myCard}>
      <View style={styles.fieldIconBox}>
        <Feather name={icon || 'info'} size={16} color="#4F46E5" />
      </View>

      <View style={styles.fieldContent}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value || ''}
          editable={false}
          selectTextOnFocus={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  // 🔵 HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 17,
    color: '#fff',
    fontFamily: 'roboto-bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 1,
  },

  // 👤 PROFILE ICON IN HEADER
  headerProfileBox: {
    width: 55,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  headerGlowCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  headerProfileEmoji: {
    fontSize: 32,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  headerProfileEmojiSmall: {
    position: 'absolute',
    fontSize: 15,
    right: 0,
    bottom: 0,
    transform: [{ rotate: '25deg' }],
  },

  // 🧾 BODY
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingTop: 25,
    paddingBottom: 100,
  },

  // 🖼️ PROFILE IMAGE
  profileImageWrapper: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#C7D2FE',
  },
  profileImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#ddd',
    borderWidth: 3,
    borderColor: '#fff',
  },
  imageEditButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  imageHint: {
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 22,
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'roboto',
  },

  // 📝 FORM
  formContainer: {
    width: '100%',
    gap: 10,
  },
  myCard: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldContent: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'roboto',
    marginBottom: 2,
  },
  input: {
    width: '100%',
    fontSize: 14,
    color: '#1E3A8A',
    fontFamily: 'roboto-bold',
    paddingVertical: 2,
  },
});
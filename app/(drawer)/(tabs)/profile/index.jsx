import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Share,
  Platform,
  ActivityIndicator,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { COLOR } from '../../../../constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

// const API_URL = 'http://192.168.29.78:8000';
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');

      if (user) {
        const parsedUser = JSON.parse(user);
        console.log('LOGIN USER:', parsedUser);

        fetchProfile(parsedUser.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('USER ERROR:', error);
      setLoading(false);
    }
  };

  const fetchProfile = async (id) => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/user-data/${id}/`);

      console.log('PROFILE DATA:', response.data);

      const data = response.data;

      setProfile({
        fullName: data.name || '',
        fathersName: data.father_name || '',
        email: data.email || '',
        phoneNumber: data.mobile ? data.mobile.toString() : '',
        address: data.address || '',
        dob: data.DOB ? new Date(data.DOB) : new Date(),
        gender: data.gender || '',
        className: '',
        image: data.image ? `${API_URL}${data.image}` : '',
      });
    } catch (error) {
      console.log('PROFILE FETCH ERROR:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const APP_LINK =
      'https://play.google.com/store/apps/details?id=com.google.android.apps.bard';

    const message = `🚀 Try this AI app: ${APP_LINK}`;

    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'AI App',
            text: message,
            url: APP_LINK,
          });
        } else {
          await navigator.clipboard.writeText(APP_LINK);
          alert('Link copied!');
        }
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    navigation.navigate('screen1');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLOR.background} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={COLOR.white} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('screen/myProfileScreen')}
          >
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={24}
              color={COLOR.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Image
            source={{
              uri:
                profile.image ||
                'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
            }}
            style={styles.profileImage}
          />

          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>
              {profile.fullName || 'User'}
            </Text>

            <Text style={styles.profilePhone}>
              {profile.phoneNumber || 'No Phone'}
            </Text>

            <Text style={styles.profileAddress}>
              {profile.address || 'No Address'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileOptionsContainer}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('screen/myProfileScreen')}
          >
            <View style={styles.optionRow}>
              <FontAwesome5
                name="user-alt"
                size={22}
                color={COLOR.background}
              />
              <Text style={styles.optionText}>My Profile</Text>
            </View>

            <FontAwesome
              name="angle-right"
              size={24}
              color={COLOR.background}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('refer-earn')}
          >
            <View style={styles.optionRow}>
              <MaterialCommunityIcons
                name="gift-outline"
                size={22}
                color={COLOR.background}
              />

              <View>
                <Text style={styles.optionText}>Refer & Earn</Text>
                <Text style={styles.referSubText}>
                  Earn ₹50 per referral
                </Text>
              </View>
            </View>

            <FontAwesome
              name="angle-right"
              size={24}
              color={COLOR.background}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.profileCard}>
            <View style={styles.optionRow}>
              <Entypo name="wallet" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>My Wallet</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.profileCard}>
            <View style={styles.optionRow}>
              <Entypo name="heart" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>My Wishlist</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.profileCard}>
            <View style={styles.optionRow}>
              <Entypo name="lock" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>Change Password</Text>
            </View>

            <FontAwesome
              name="angle-right"
              size={24}
              color={COLOR.background}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.profileCard}>
            <View style={styles.optionRow}>
              <MaterialIcons name="assignment" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>My Complet Subject</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.profileCard} onPress={handleShare}>
            <View style={styles.optionRow}>
              <FontAwesome name="share-alt" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>Share App</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.profileCard} onPress={handleLogout}>
            <View style={styles.optionRow}>
              <MaterialIcons
                name="logout"
                size={22}
                color={COLOR.background}
              />
              <Text style={styles.optionText}>Logout</Text>
            </View>

            <FontAwesome
              name="angle-right"
              size={24}
              color={COLOR.background}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    backgroundColor: COLOR.background,
    flex: 0.4,
    padding: 20,
    paddingTop: 35,
    flexDirection: 'column',
    paddingBottom: 50,
  },

  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  profileInfo: {
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 50,
  },

  profileTextContainer: {
    marginTop: 10,
  },

  profileName: {
    color: COLOR.white,
    fontWeight: 'bold',
    fontSize: width * 0.045,
    textAlign: 'center',
  },

  profilePhone: {
    color: COLOR.white,
    textAlign: 'center',
  },

  profileAddress: {
    color: COLOR.white,
    fontWeight: '400',
    fontSize: width * 0.035,
    textAlign: 'center',
    marginTop: 3,
  },

  scrollView: {
    flex: 0.6,
  },

  profileOptionsContainer: {
    padding: 20,
    flexDirection: 'column',
    gap: 10,
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: COLOR.white,
    padding: width * 0.05,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },

  optionRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },

  optionText: {
    fontSize: width * 0.04,
    color: '#999898',
  },

  referSubText: {
    fontSize: 12,
    color: '#EA580C',
    marginTop: 2,
  },
});
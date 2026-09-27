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
import { LinearGradient } from 'expo-linear-gradient';
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
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
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

          {/* Top Icons Row */}
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('screen/myProfileScreen')}
              style={styles.iconBtn}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="square-edit-outline"
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            {/* Profile Image with Ring */}
            <View style={styles.profileRing}>
              <Image
                source={{
                  uri:
                    profile.image ||
                    'https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg',
                }}
                style={styles.profileImage}
              />
            </View>

            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>
                {profile.fullName || 'User'}
              </Text>

              <View style={styles.phoneRow}>
                <Feather name="phone" size={12} color="rgba(255,255,255,0.85)" />
                <Text style={styles.profilePhone}>
                  {profile.phoneNumber || 'No Phone'}
                </Text>
              </View>

              <View style={styles.phoneRow}>
                <Feather
                  name="map-pin"
                  size={12}
                  color="rgba(255,255,255,0.85)"
                />
                <Text style={styles.profileAddress} numberOfLines={1}>
                  {profile.address || 'No Address'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 📋 OPTIONS LIST */}
        <View style={styles.profileOptionsContainer}>
          {/* My Profile */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('screen/myProfileScreen')}
            activeOpacity={0.8}
          >
            <View style={styles.optionRow}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="user-alt" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.optionText}>My Profile</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          {/* Refer & Earn */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('refer-earn')}
            activeOpacity={0.8}
          >
            <View style={styles.optionRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons
                  name="gift-outline"
                  size={18}
                  color="#F59E0B"
                />
              </View>

              <View>
                <Text style={styles.optionText}>Refer & Earnn</Text>
                <Text style={styles.referSubText}>Earn ₹50 per referral</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.profileCard, styles.logoutCard]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.optionRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="logout" size={18} color="#DC2626" />
              </View>
              <Text style={[styles.optionText, { color: '#DC2626' }]}>
                Logout
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },

  // Decorative Circles
  decorCircle1: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -70,
    left: -60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Top Icons
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Profile Info
  profileInfo: {
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  profileRing: {
    width: width * 0.30,
    height: width * 0.30,
    borderRadius: width * 0.15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  profileImage: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: width * 0.13,
    backgroundColor: '#fff',
  },

  profileTextContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  profileName: {
    color: '#fff',
    fontFamily: 'roboto-bold',
    fontSize: width * 0.048,
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  profilePhone: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontFamily: 'roboto',
    fontSize: 12,
  },
  profileAddress: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'roboto',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: width * 0.7,
  },

  // 📋 OPTIONS
  profileOptionsContainer: {
    padding: 16,
    marginTop: 8,
    gap: 10,
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  logoutCard: {
    backgroundColor: '#FEF2F2',
  },

  optionRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    flex: 1,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionText: {
    fontSize: 14,
    color: '#1E3A8A',
    fontFamily: 'roboto-bold',
  },

  referSubText: {
    fontSize: 11,
    color: '#F59E0B',
    marginTop: 2,
    fontFamily: 'roboto',
  },
});
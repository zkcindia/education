import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions , share , Platform } from 'react-native';
import React from 'react';
import { COLOR } from '../../../../constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Index() {
  const navigation = useNavigation();

const handleShare = async () => {
  const APP_LINK = 'https://play.google.com/store/apps/details?id=com.google.android.apps.bard';
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
    navigation.navigate('screen1');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Feather name="arrow-left" size={24} color={COLOR.white} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="square-edit-outline" size={24} color={COLOR.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Image
            source={{ uri: "https://png.pngtree.com/png-vector/20191101/ourmid/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg" }}
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Alexo Deo</Text>
            <Text style={styles.profilePhone}>0907654367</Text>
            <Text style={styles.profileAddress}>Lake City, Conord Shipping Complex, Khikhol,Dhaka-752054</Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileOptionsContainer}>
          <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('screen/myProfileScreen')}>
            <View style={styles.optionRow}>
              <FontAwesome5 name="user-alt" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>My Profile</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCard}>
            <View style={styles.optionRow}>
              <Entypo name="wallet" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>My Wallet</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
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
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.profileCard}>
            <View style={styles.optionRow}>
              <MaterialIcons name="assignment" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>My Complet Subject</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.profileCard} onPress={handleShare}>
            <View style={styles.optionRow}>
              <FontAwesome name="share-alt" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>Share App</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileCard} onPress={handleLogout}>
            <View style={styles.optionRow}>
              <MaterialIcons name="logout" size={22} color={COLOR.background} />
              <Text style={styles.optionText}>Logout</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color={COLOR.background} />
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
  header: {
    backgroundColor: COLOR.background,
    flex: 0.4,
    padding: 20,
    paddingTop: 35,
    flexDirection: 'column',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileInfo: {
    marginHorizontal: "auto",
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.25, // Responsive width
    height: width * 0.25, // Responsive height
    borderRadius: 50,
  },
  profileTextContainer: {
    marginTop: 10,
  },
  profileName: {
    color: COLOR.white,
    fontWeight: 'bold',
    fontSize: width * 0.045, // Responsive font size
    textAlign: 'center',
  },
  profilePhone: {
    color: COLOR.white,
    textAlign: 'center',
  },
  profileAddress: {
    color: COLOR.white,
    fontWeight: '400',
    fontSize: width * 0.035, // Responsive font size
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
    padding: width * 0.05, // Responsive padding
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
    fontSize: width * 0.04, // Responsive font size
    color: '#999898',
  },
});

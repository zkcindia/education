// app/(associate)/dealer-dashboard.jsx
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function DealerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const raw = await AsyncStorage.getItem('userData');
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch (e) {
      console.log('Load user error:', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('access');
          await AsyncStorage.removeItem('refresh');
          await AsyncStorage.removeItem('userData');
          router.replace('/signUp');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🟣 TOP HEADER (Blue-Purple Gradient) */}
        <LinearGradient
          colors={['#003096', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topContainer}>
            {/* Profile Image */}
            <View style={styles.profileImageWrap}>
              <Text style={styles.profileInitial}>
                {(user?.name || 'D').charAt(0).toUpperCase()}
              </Text>
            </View>

            {/* Name + Role + Logout */}
            <View style={styles.middleContainer}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {user?.name || 'Dealer'}
              </Text>

              <View style={styles.roleBadge}>
                <MaterialCommunityIcons
                  name="account-star"
                  size={12}
                  color="#fff"
                />
                <Text style={styles.roleBadgeText}>District Head</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* 📊 STATS (2 Cards) */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#E8EEFB' }]}>
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color="#003096"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statText}>0</Text>
              <Text style={styles.statLabel}>Executives</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="cash" size={20} color="#2E7D32" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statText, { color: '#2E7D32' }]}>₹0</Text>
              <Text style={styles.statLabel}>Income</Text>
            </View>
          </View>
        </View>

        {/* 📦 PROFILE CARD */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Profile</Text>
          <View style={styles.profileCard}>
            <ProfileRow
              icon="mail-outline"
              label="Email"
              value={user?.email || '—'}
            />
            <ProfileRow
              icon="call-outline"
              label="Mobile"
              value={user?.mobile || '—'}
            />
            <ProfileRow
              icon="location-outline"
              label="District"
              value={user?.district || '—'}
            />
            <ProfileRow
              icon="key-outline"
              label="Referral Code"
              value={user?.referral_code || '—'}
              isLast
            />
          </View>
        </View>

        {/* 📦 REFER & EARN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Refer & Earn</Text>
          <View style={styles.referCard}>
            <View style={styles.referHeader}>
              <View style={styles.referIconBox}>
                <MaterialCommunityIcons
                  name="gift"
                  size={22}
                  color="#003096"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.referTitle}>Share your code</Text>
                <Text style={styles.referSubtitle}>
                  Executives join karenge, aapko commission milega
                </Text>
              </View>
            </View>

            <View style={styles.codeBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.codeLabel}>Your Referral Code</Text>
                <Text style={styles.codeValue}>
                  {user?.referral_code || '—'}
                </Text>
              </View>
              <TouchableOpacity style={styles.copyBtn}>
                <Ionicons name="copy-outline" size={16} color="#003096" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.shareBtn}>
              <Ionicons name="share-social-outline" size={18} color="#fff" />
              <Text style={styles.shareBtnText}>Share Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 📦 PLACEHOLDER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Executives</Text>
          <View style={styles.placeholderCard}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={48}
              color="#94A3B8"
            />
            <Text style={styles.placeholderTitle}>Coming Soon</Text>
            <Text style={styles.placeholderText}>
              Aapke under jo executives hain, unki list yahan aayegi
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Helper component */
const ProfileRow = ({ icon, label, value, isLast }) => (
  <View style={[styles.profileRow, isLast && { borderBottomWidth: 0 }]}>
    <Ionicons name={icon} size={16} color="#003096" />
    <View style={{ marginLeft: 10, flex: 1 }}>
      <Text style={styles.profileLabel}>{label}</Text>
      <Text style={styles.profileValue}>{value}</Text>
    </View>
  </View>
);

/* ─────────── Styles ─────────── */
const styles = StyleSheet.create({
  // 🟣 HEADER
  headerGradient: {
    paddingTop: height * 0.04,
    paddingBottom: 60,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageWrap: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.065,
    color: '#fff',
  },
  middleContainer: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  userNameText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.048,
    color: '#fff',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'roboto-bold',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 📊 STATS
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
    marginTop: -40,
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.045,
    color: '#1E3A8A',
  },
  statLabel: {
    fontFamily: 'roboto',
    fontSize: width * 0.028,
    color: '#6B7280',
    marginTop: 1,
  },

  // 📦 SECTIONS
  section: {
    marginTop: 20,
    paddingHorizontal: width * 0.05,
  },
  sectionTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // 📦 PROFILE CARD
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#EDF1F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  profileLabel: {
    fontFamily: 'roboto',
    fontSize: 10,
    color: '#999',
  },
  profileValue: {
    fontFamily: 'roboto-bold',
    fontSize: 13,
    color: '#1A1A1A',
    marginTop: 1,
  },

  // 📦 REFER & EARN
  referCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EDF1F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  referHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  referIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 14,
    color: '#1A1A1A',
  },
  referSubtitle: {
    fontFamily: 'roboto',
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
  },
  codeLabel: {
    fontFamily: 'roboto',
    fontSize: 10,
    color: '#999',
  },
  codeValue: {
    fontFamily: 'roboto-bold',
    fontSize: 16,
    color: '#003096',
    letterSpacing: 1,
    marginTop: 2,
  },
  copyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8EEFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#003096',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  shareBtnText: {
    fontFamily: 'roboto-bold',
    fontSize: 13,
    color: '#fff',
  },

  // 📦 PLACEHOLDER
  placeholderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  placeholderTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 15,
    color: '#003096',
    marginTop: 12,
    marginBottom: 6,
  },
  placeholderText: {
    fontFamily: 'roboto',
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
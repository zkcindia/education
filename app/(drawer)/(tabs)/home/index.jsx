// import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { AntDesign } from '@expo/vector-icons';
// import { COLOR } from './../../../../constants/Colors';
// import Banner from '../../../../components/home/Banner';
// import PopularCourse from '../../../../components/home/PopularCourse';
// import FeaturedCourse from '../../../../components/home/featuredCourse';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { fetchUserPoints, fetchUserRank } from '../../../../constants/api/apiHome'; // ✅ CHANGED: fetchUserRank import kiya

// const { width, height } = Dimensions.get('window');

// export default function Index() {
//   const [userName, setUserName] = useState('');
//   const [earningPoints, setEarningPoints] = useState(0);
//   const [userRank, setUserRank] = useState(0);       // ✅ NEW
//   const [totalUsers, setTotalUsers] = useState(0);   // ✅ NEW

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('userData');
//         if (userData) {
//           const parsedData = JSON.parse(userData);
//           setUserName(parsedData);
//         }

//         const totalPoints = await fetchUserPoints();
//         setEarningPoints(totalPoints);

//         // ✅ NEW: Fetch user rank from API
//         const rankData = await fetchUserRank();
//         setUserRank(rankData.rank);
//         setTotalUsers(rankData.totalUsers);
//       } catch (error) {
//         // Silent error
//       }
//     };
//     fetchUserData();
//   }, []);

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ScrollView
//         contentContainerStyle={{ paddingTop: 40, paddingBottom: 20 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Top Header */}
//         <View style={styles.topContainer}>
//           <Image
//             source={{
//               uri: 'https://www.icon0.com/free/static2/preview2/stock-photo-little-boy-faces-children-avatar-people-icon-character-cartoon-32990.jpg',
//             }}
//             style={styles.profileImage}
//           />

//           <View style={styles.middleContainer}>
//             <Text style={styles.userNameText} numberOfLines={1} ellipsizeMode="tail">
//               {userName?.name || 'Guest'}
//             </Text>

//             <TouchableOpacity
//               style={styles.premiumButton}
//               onPress={() => router.push('/payment/billing')}
//             >
//               <Text style={styles.premiumButtonText}>👑 Upgrade Premium</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.rightHeaderContainer} />
//         </View>

//         {/* Stats */}
//         <View style={styles.statsContainer}>
//           <View style={styles.earningContainer}>
//             <Image
//               source={{
//                 uri: 'https://img.freepik.com/premium-vector/bitcoin-investing-flat-vector-illustration-banner_128772-693.jpg',
//               }}
//               style={styles.statImage}
//             />
//             <View>
//               <Text style={styles.statText}>{earningPoints}</Text>
//               <Text style={styles.statLabel}>Earning Points</Text>
//             </View>
//           </View>

//           <View style={styles.earningContainer}>
//             <Image
//               source={{
//                 uri: 'https://img.freepik.com/premium-vector/achievement-trophy-flat-vector-illustration-banner_128772-725.jpg',
//               }}
//               style={styles.statImage}
//             />
//             <View>
//               {/* ✅ CHANGED: hardcoded 420 → dynamic userRank */}
//               <Text style={styles.statText}>{userRank}</Text>
//               <Text style={styles.statLabel}>Ranks</Text>
//             </View>
//           </View>
//         </View>

//         {/* Existing Components */}
//         <Banner />
//         <PopularCourse />
//         <FeaturedCourse />
//       </ScrollView>

//       {/* Floating Action Button */}
//       <TouchableOpacity
//         style={styles.fab}
//         onPress={() => router.push('/classes')}
//         activeOpacity={0.85}
//       >
//         <View style={styles.fabLabel}>
//           <Text style={styles.fabText}>Start Your Test</Text>
//         </View>
//         <View style={styles.fabCircle}>
//           <AntDesign name="plus" size={28} color="#FFF" />
//         </View>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   topContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: width * 0.05,
//     marginBottom: 3,
//     marginTop: 10,
//   },
//   profileImage: {
//     width: width * 0.15,
//     height: width * 0.15,
//     borderRadius: 50,
//     backgroundColor: COLOR.background,
//   },
//   middleContainer: {
//     flex: 1,
//     marginLeft: width * 0.03,
//     justifyContent: 'center',
//   },
//   userNameText: {
//     fontFamily: 'roboto-bold',
//     fontSize: width * 0.045,
//     color: '#000',
//   },
//   premiumButton: {
//     backgroundColor: '#7C3AED',
//     paddingHorizontal: 14,
//     paddingVertical: 5,
//     borderRadius: 10,
//     alignSelf: 'flex-start',
//     marginTop: 8,
//   },
//   premiumButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontFamily: 'roboto-bold',
//   },
//   rightHeaderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     marginLeft: 8,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: width * 0.05,
//     padding: 10,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginTop: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 10,
//     shadowOpacity: 0.2,
//   },
//   earningContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: width * 0.4,
//   },
//   statImage: {
//     width: width * 0.15,
//     height: height * 0.1,
//     resizeMode: 'contain',
//   },
//   statText: {
//     fontFamily: 'roboto-bold',
//     fontSize: width * 0.04,
//   },
//   statLabel: {
//     fontFamily: 'roboto',
//     fontSize: width * 0.035,
//     color: 'grey',
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 5,
//     right: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   fabLabel: {
//     backgroundColor: '#7C3AED',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 18,
//     marginRight: 4,
//   },
//   fabCircle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#7C3AED',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   fabText: {
//     fontSize: 13,
//     color: "#FFFFFF",
//     fontFamily: 'roboto-bold',
//   },
// });


import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLOR } from './../../../../constants/Colors';
import Banner from '../../../../components/home/Banner';
import PopularCourse from '../../../../components/home/PopularCourse';
import FeaturedCourse from '../../../../components/home/featuredCourse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import {
  fetchUserPoints,
  fetchUserRank,
} from '../../../../constants/api/apiHome';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const [userName, setUserName] = useState('');
  const [earningPoints, setEarningPoints] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserName(parsedData);
        }

        const totalPoints = await fetchUserPoints();
        setEarningPoints(totalPoints);

        const rankData = await fetchUserRank();
        setUserRank(rankData.rank);
        setTotalUsers(rankData.totalUsers);
      } catch (error) {
        // Silent error
      }
    };
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔵 TOP HEADER (Simple Gradient) */}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topContainer}>
            {/* Profile Image */}
            <Image
              source={{
                uri: 'https://www.icon0.com/free/static2/preview2/stock-photo-little-boy-faces-children-avatar-people-icon-character-cartoon-32990.jpg',
              }}
              style={styles.profileImage}
            />

            {/* Greeting + Name + Premium */}
            <View style={styles.middleContainer}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {userName?.name || 'Guest'}
              </Text>

              <TouchableOpacity
                style={styles.premiumButton}
                onPress={() => router.push('/payment/billing')}
                activeOpacity={0.85}
              >
                <Text style={styles.premiumButtonText}>👑 Upgrade Premium</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* 📊 STATS (Simple White Cards) */}
        <View style={styles.statsContainer}>
          {/* Points */}
          <View style={styles.statCard}>
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-vector/bitcoin-investing-flat-vector-illustration-banner_128772-693.jpg',
              }}
              style={styles.statImage}
            />
            <View>
              <Text style={styles.statText}>{earningPoints}</Text>
              <Text style={styles.statLabel}>Earning Points</Text>
            </View>
          </View>

          {/* Rank */}
          <View style={styles.statCard}>
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-vector/achievement-trophy-flat-vector-illustration-banner_128772-725.jpg',
              }}
              style={styles.statImage}
            />
            <View>
              <Text style={styles.statText}>{userRank}</Text>
              <Text style={styles.statLabel}>Ranks</Text>
            </View>
          </View>
        </View>

        {/* 📦 COMPONENTS */}
        <Banner />
        <PopularCourse />
        <FeaturedCourse />
      </ScrollView>

      {/* 🔘 FAB (Simple) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/classes')}
        activeOpacity={0.85}
      >
        <View style={styles.fabLabel}>
          <Text style={styles.fabText}>Start Your Test</Text>
        </View>
        <View style={styles.fabCircle}>
          <AntDesign name="plus" size={26} color="#7C3AED" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 🔵 HEADER
  headerGradient: {
    paddingTop: height * 0.05,
    paddingBottom: 60,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  middleContainer: {
    flex: 1,
    marginLeft: width * 0.04,
    justifyContent: 'center',
  },
  userNameText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.048,
    color: '#fff',
  },
  premiumButton: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'roboto-bold',
  },

  // 📊 STATS (Simple)
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
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 8,
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

  // 🔘 FAB (Simple)
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabLabel: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 6,
  },
  fabText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'roboto-bold',
  },
  fabCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
});
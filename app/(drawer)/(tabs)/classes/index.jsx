// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Image,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';

// import React, { useCallback, useState } from 'react';
// import { useNavigation, router } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { fetchBoardClassSubjects } from '../../../../constants/api/apiTeacher';
// import { getTopStudents } from '../../../../constants/api/apiClass';
// import { COLOR } from '../../../../constants/Colors';

// const { width, height } = Dimensions.get('window');

// console.log('🟢🟢🟢 INDEX FILE LOADED 🟢🟢🟢');

// export default function Index() {
//   const navigation = useNavigation();

//   const [userData, setUserData] = useState(null);
//   const [subjects, setSubjects] = useState([]);
//   const [topStudents, setTopStudents] = useState([]);
//   const [loader, setLoader] = useState(false);

//   console.log('🟣 COMPONENT RENDER — topStudents.length:', topStudents.length);

//   useFocusEffect(
//     useCallback(() => {
//       console.log('🟤 useFocusEffect TRIGGERED');
//       loadUserData();
//     }, [])
//   );

//   const loadUserData = async () => {
//     console.log('⚪ loadUserData CALLED');
//     try {
//       const data = await AsyncStorage.getItem('userData');
//       console.log('⚪ userData from storage:', data ? 'EXISTS' : 'NULL');

//       if (data) {
//         const parsedData = JSON.parse(data);
//         setUserData(parsedData);
//         fetchSubjects(parsedData);
//         fetchTopStudents();
//       }
//     } catch (error) {
//       console.log('🔴 USER DATA ERROR:', error);
//     }
//   };

//   const fetchSubjects = async () => {
//     setLoader(true);
//     try {
//       const response = await fetchBoardClassSubjects();
//       if (response.status === 200) {
//         setSubjects(response.data?.data || []);
//       }
//     } catch (error) {
//       console.log('🔴 SUBJECT ERROR:', error?.response?.data || error.message);
//     }
//     setLoader(false);
//   };

//   const fetchTopStudents = async () => {
//     console.log('🔵 fetchTopStudents CALLED');
//     try {
//       const data = await getTopStudents();
//       console.log('🟡 API DATA:', JSON.stringify(data));

//       const list = data?.students || data?.data || [];

//       const fakeData = [
//         { id: 1, name: 'Biswajit', score: 95, class: 'STD 6' },
//         { id: 2, name: 'Ananya', score: 88, class: 'STD 6' },
//         { id: 3, name: 'Arjun', score: 82, class: 'STD 6' },
//       ];

//       const finalData = list.length > 0 ? list.slice(0, 3) : fakeData;
//       console.log('🟠 SETTING TOP STUDENTS:', finalData.length);
//       setTopStudents(finalData);
//     } catch (error) {
//       console.log('🔴 TOP STUDENTS ERROR:', error?.response?.data || error.message);
//       // Fallback to fake data on error
//       const fakeData = [
//         { id: 1, name: 'Biswajit', score: 95, class: 'STD 6' },
//         { id: 2, name: 'Ananya', score: 88, class: 'STD 6' },
//         { id: 3, name: 'Arjun', score: 82, class: 'STD 6' },
//       ];
//       setTopStudents(fakeData);
//     }
//   };

//   const handleSubjectPress = (item) => {
//     navigation.navigate('screen/instructionsScreen', {
//       id: item.id,
//     });
//   };

//   const getRankStyle = (index) => {
//     if (index === 0)
//       return { colors: ['#fbbf24', '#fb923c'], textColor: '#c2410c' };
//     if (index === 1)
//       return { colors: ['#e2e8f0', '#cbd5e1'], textColor: '#475569' };
//     return { colors: ['#fb923c', '#f59e0b'], textColor: '#9a3412' };
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => router.push('/')}
//           style={styles.backButton}
//           activeOpacity={0.7}
//         >
//           <Feather name="arrow-left" size={24} color={COLOR.white} />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>My Subjects</Text>

//         <View style={{ width: 24 }} />
//       </View>

//       <View style={styles.body}>
//         {loader ? (
//           <View style={styles.loaderBox}>
//             <ActivityIndicator size="large" color={COLOR.background} />
//             <Text style={styles.loadingText}>Loading subjects...</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={subjects}
//             keyExtractor={(item) => item.id.toString()}
//             showsVerticalScrollIndicator={false}
//             ListHeaderComponent={
//               <>
//                 {/* 🧪 RED TEST BOX */}
//                 {/* <View style={{ backgroundColor: 'red', padding: 20, marginBottom: 10 }}>
//                   <Text style={{ color: 'white', fontSize: 16 }}>
//                     🧪 Top Students Count: {topStudents.length}
//                   </Text>
//                 </View> */}

//                 {/* TOP 3 STUDENTS */}
//                 {topStudents.length > 0 && (
//                   <View style={styles.topStudentsCard}>
//                     <View style={styles.topStudentsHeader}>
//                       <View style={styles.topStudentsHeaderLeft}>
//                         <Text style={styles.trophyEmoji}>🏆</Text>
//                         <View>
//                           <Text style={styles.topStudentsTitle}>Top Scorers</Text>
//                           <Text style={styles.topStudentsSubtitle}>
//                             Leading this month
//                           </Text>
//                         </View>
//                       </View>

//                       {/* <TouchableOpacity
//                         onPress={() => router.push('/top-scorers')}
//                         style={styles.viewAllBtn}
//                         activeOpacity={0.7}
//                       >
//                         <Text style={styles.viewAllText}>View All</Text>
//                         <Feather name="chevron-right" size={14} color="#2563eb" />
//                       </TouchableOpacity> */}
//                     </View>

//                     {topStudents.map((student, index) => {
//                       const rank = getRankStyle(index);
//                       return (
//                         <View
//                           key={student.id || student._id || index}
//                           style={[
//                             styles.studentRow,
//                             index === 0 && styles.topStudentRow,
//                           ]}
//                         >
//                           <LinearGradient colors={rank.colors} style={styles.rankBadge}>
//                             <Text
//                               style={[
//                                 styles.rankText,
//                                 { color: rank.textColor },
//                               ]}
//                             >
//                               {index + 1}
//                             </Text>
//                           </LinearGradient>

//                           <View style={styles.avatarContainer}>
//                             {student.avatar || student.image ? (
//                               <Image
//                                 source={{ uri: student.avatar || student.image }}
//                                 style={styles.avatar}
//                               />
//                             ) : (
//                               <View
//                                 style={[styles.avatar, styles.avatarPlaceholder]}
//                               >
//                                 <Text style={styles.avatarText}>
//                                   {student.name?.charAt(0)?.toUpperCase() || 'S'}
//                                 </Text>
//                               </View>
//                             )}
//                             {index === 0 && (
//                               <View style={styles.crownBadge}>
//                                 <Text style={styles.crownText}>👑</Text>
//                               </View>
//                             )}
//                           </View>

//                           <View style={styles.studentInfo}>
//                             <Text style={styles.studentName} numberOfLines={1}>
//                               {student.name}
//                             </Text>
//                             <Text style={styles.studentClass}>
//                               {student.class || student.grade || '—'}
//                             </Text>
//                           </View>

//                           <View style={styles.scoreContainer}>
//                             <Text style={styles.scoreIcon}>✹</Text>
//                             <Text style={styles.scoreText}>{student.score}</Text>
//                           </View>
//                         </View>
//                       );
//                     })}
//                   </View>
//                 )}

//                 {userData && (
//                   <Text style={styles.title}>{userData?.class}</Text>
//                 )}
//               </>
//             }
//             ListEmptyComponent={
//               <Text style={styles.emptyText}>No subjects found</Text>
//             }
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.subjectCard}
//                 onPress={() => handleSubjectPress(item)}
//               >
//                 <Image
//                   source={{ uri: item.image || item.image_url }}
//                   style={styles.subjectImage}
//                 />

//                 <View style={styles.cardInfo}>
//                   <Text style={styles.cardTitle}>{item.name}</Text>
//                   <Text style={styles.cardSub}>
//                     {item?.quiz_count
//                       ? `${item.quiz_count} Questions`
//                       : 'Start Test'}
//                   </Text>
//                 </View>

//                 <Feather
//                   name="chevron-right"
//                   size={24}
//                   color={COLOR.background}
//                 />
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f7f8fa' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLOR.background,
//     padding: 20,
//     paddingTop: height * 0.05,
//   },
//   headerTitle: {
//     fontSize: width * 0.05,
//     color: COLOR.white,
//     fontFamily: 'roboto-bold',
//   },
//   body: { flex: 1, padding: 18 },
//   title: {
//     fontSize: width * 0.05,
//     fontFamily: 'roboto-bold',
//     color: COLOR.background,
//     marginBottom: 15,
//     marginTop: 4,
//   },
//   subjectCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLOR.white,
//     padding: 14,
//     borderRadius: 15,
//     elevation: 2,
//     marginBottom: 12,
//   },
//   subjectImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 12,
//     marginRight: 15,
//     resizeMode: 'cover',
//   },
//   cardInfo: { flex: 1 },
//   cardTitle: {
//     fontSize: width * 0.045,
//     fontFamily: 'roboto-bold',
//     color: COLOR.background,
//   },
//   cardSub: {
//     fontSize: width * 0.035,
//     fontFamily: 'roboto',
//     color: '#666',
//     marginTop: 4,
//   },
//   loaderBox: { marginTop: 50, alignItems: 'center' },
//   loadingText: { marginTop: 10, fontFamily: 'roboto' },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//     fontFamily: 'roboto-medium',
//     color: '#777',
//   },
//   backButton: { padding: 4, width: 40 },

//   topStudentsCard: {
//     backgroundColor: '#eff6ff',
//     borderRadius: 16,
//     padding: 12,
//     borderWidth: 2,
//     borderColor: '#93c5fd',
//     marginBottom: 18,
//     elevation: 3,
//   },
//   topStudentsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   topStudentsHeaderLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   trophyEmoji: { fontSize: 22 },
//   topStudentsTitle: {
//     fontSize: 14,
//     fontFamily: 'roboto-bold',
//     color: '#1e40af',
//   },
//   topStudentsSubtitle: {
//     fontSize: 10,
//     fontFamily: 'roboto',
//     color: '#6b7280',
//     marginTop: 1,
//   },
//   viewAllBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 2,
//     backgroundColor: 'rgba(255,255,255,0.8)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 10,
//   },
//   viewAllText: {
//     fontSize: 11,
//     fontFamily: 'roboto-bold',
//     color: '#2563eb',
//   },
//   studentRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: '#bfdbfe',
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     marginBottom: 6,
//   },
//   topStudentRow: {
//     backgroundColor: '#fefce8',
//     borderColor: '#fde68a',
//   },
//   rankBadge: {
//     width: 28,
//     height: 28,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   rankText: { fontSize: 13, fontFamily: 'roboto-bold' },
//   avatarContainer: { position: 'relative', marginRight: 8 },
//   avatar: {
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#60a5fa',
//   },
//   avatarPlaceholder: {
//     backgroundColor: '#93c5fd',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarText: {
//     fontSize: 13,
//     fontFamily: 'roboto-bold',
//     color: '#1e3a8a',
//   },
//   crownBadge: {
//     position: 'absolute',
//     top: -8,
//     right: -6,
//   },
//   crownText: { fontSize: 14 },
//   studentInfo: { flex: 1, minWidth: 0 },
//   studentName: {
//     fontSize: 12,
//     fontFamily: 'roboto-bold',
//     color: '#1f2937',
//   },
//   studentClass: {
//     fontSize: 10,
//     fontFamily: 'roboto',
//     color: '#9ca3af',
//     marginTop: 1,
//   },
//   scoreContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     minWidth: 55,
//     justifyContent: 'flex-end',
//   },
//   scoreIcon: { fontSize: 14, marginRight: 2, color: '#f59e0b' },
//   scoreText: {
//     fontSize: 14,
//     fontFamily: 'roboto-bold',
//     color: '#1e3a8a',
//   },
// });


import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useNavigation, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBoardClassSubjects } from '../../../../constants/api/apiTeacher';
import { getTopStudents } from '../../../../constants/api/apiClass';
import { COLOR } from '../../../../constants/Colors';

const { width, height } = Dimensions.get('window');

console.log('🟢🟢🟢 INDEX FILE LOADED 🟢🟢🟢');

/* ============================================================
   📚 ANIMATED BOOKS COMPONENT (Bada + Attractive)
   ============================================================ */
const AnimatedBooks = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🎈 Float Animation (upar-neeche)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ✨ Glow Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  return (
    <View style={styles.booksContainer}>
      {/* Glow Circle */}
      <Animated.View
        style={[
          styles.glowCircle,
          { opacity: glowOpacity, transform: [{ scale: glowScale }] },
        ]}
      />
      {/* Books Emoji (Animated) */}
      <Animated.Text
        style={[styles.booksEmoji, { transform: [{ translateY }] }]}
      >
        📚
      </Animated.Text>
      {/* Pencil Emoji */}
      <Text style={styles.pencilEmoji}>✏️</Text>
    </View>
  );
};

/* ============================================================
   🏠 MAIN COMPONENT
   ============================================================ */
export default function Index() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loader, setLoader] = useState(false);

  console.log('🟣 COMPONENT RENDER — topStudents.length:', topStudents.length);

  useFocusEffect(
    useCallback(() => {
      console.log('🟤 useFocusEffect TRIGGERED');
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    console.log('⚪ loadUserData CALLED');
    try {
      const data = await AsyncStorage.getItem('userData');
      console.log('⚪ userData from storage:', data ? 'EXISTS' : 'NULL');

      if (data) {
        const parsedData = JSON.parse(data);
        setUserData(parsedData);
        fetchSubjects(parsedData);
        fetchTopStudents();
      }
    } catch (error) {
      console.log('🔴 USER DATA ERROR:', error);
    }
  };

  const fetchSubjects = async () => {
    setLoader(true);
    try {
      const response = await fetchBoardClassSubjects();
      if (response.status === 200) {
        setSubjects(response.data?.data || []);
      }
    } catch (error) {
      console.log('🔴 SUBJECT ERROR:', error?.response?.data || error.message);
    }
    setLoader(false);
  };

  const fetchTopStudents = async () => {
    console.log('🔵 fetchTopStudents CALLED');
    try {
      const data = await getTopStudents();
      console.log('🟡 API DATA:', JSON.stringify(data));

      const list = data?.students || data?.data || [];

      const fakeData = [
        { id: 1, name: 'Biswajit', score: 95, class: 'STD 6' },
        { id: 2, name: 'Ananya', score: 88, class: 'STD 6' },
        { id: 3, name: 'Arjun', score: 82, class: 'STD 6' },
      ];

      const finalData = list.length > 0 ? list.slice(0, 3) : fakeData;
      console.log('🟠 SETTING TOP STUDENTS:', finalData.length);
      setTopStudents(finalData);
    } catch (error) {
      console.log('🔴 TOP STUDENTS ERROR:', error?.response?.data || error.message);
      const fakeData = [
        { id: 1, name: 'Biswajit', score: 95, class: 'STD 6' },
        { id: 2, name: 'Ananya', score: 88, class: 'STD 6' },
        { id: 3, name: 'Arjun', score: 82, class: 'STD 6' },
      ];
      setTopStudents(fakeData);
    }
  };

  const handleSubjectPress = (item) => {
    navigation.navigate('screen/instructionsScreen', {
      id: item.id,
    });
  };

  const getRankStyle = (index) => {
    if (index === 0) return { bg: '#FDE68A', text: '#B45309' };
    if (index === 1) return { bg: '#E2E8F0', text: '#475569' };
    return { bg: '#FED7AA', text: '#9A3412' };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔵 GRADIENT HEADER */}
      <LinearGradient
        colors={['#4F46E5', '#6D28D9', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Decorative Circles (Bade) */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.push('/')}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Subjects</Text>

          {/* 📚 Animated Books */}
          <AnimatedBooks />
        </View>
      </LinearGradient>

      {/* 📦 BODY */}
      <View style={styles.body}>
        {loader ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading subjects...</Text>
          </View>
        ) : (
          <FlatList
            data={subjects}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30, paddingTop: 12 }}
            ListHeaderComponent={
              <>
                {/* 🏆 TOP SCORERS CARD */}
                {topStudents.length > 0 && (
                  <View style={styles.topStudentsCard}>
                    <View style={styles.topStudentsHeader}>
                      <View style={styles.topStudentsHeaderLeft}>
                        <View style={styles.trophyCircle}>
                          <Text style={styles.trophyEmoji}>🏆</Text>
                        </View>
                        <View>
                          <Text style={styles.topStudentsTitle}>Top Scorers</Text>
                          <Text style={styles.topStudentsSubtitle}>
                            Leading this month
                          </Text>
                        </View>
                      </View>

   
                    </View>

                    {topStudents.map((student, index) => {
                      const rank = getRankStyle(index);
                      return (
                        <View
                          key={student.id || student._id || index}
                          style={[
                            styles.studentRow,
                            index === 0 && styles.topStudentRow,
                          ]}
                        >
                          <View style={[styles.rankBadge, { backgroundColor: rank.bg }]}>
                            <Text style={[styles.rankText, { color: rank.text }]}>
                              {index + 1}
                            </Text>
                          </View>

                          <View style={styles.avatarContainer}>
                            {student.avatar || student.image ? (
                              <Image
                                source={{ uri: student.avatar || student.image }}
                                style={styles.avatar}
                              />
                            ) : (
                              <LinearGradient
                                colors={['#60A5FA', '#3B82F6']}
                                style={styles.avatar}
                              >
                                <Text style={styles.avatarText}>
                                  {student.name?.charAt(0)?.toUpperCase() || 'S'}
                                </Text>
                              </LinearGradient>
                            )}
                            {index === 0 && (
                              <View style={styles.crownBadge}>
                                <Text style={styles.crownText}>👑</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.studentInfo}>
                            <Text style={styles.studentName} numberOfLines={1}>
                              {student.name}
                            </Text>
                            <Text style={styles.studentClass}>
                              {student.class || student.grade || '—'}
                            </Text>
                          </View>

                          <View style={styles.scoreContainer}>
                            <Text style={styles.scoreIcon}>★</Text>
                            <Text style={styles.scoreText}>{student.score}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                {userData && (
                  <View>
                    <Text style={styles.title}>{userData?.class}</Text>
                    <View style={styles.titleUnderline} />
                  </View>
                )}
              </>
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No subjects found</Text>
            }
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.subjectCardWrapper}
                  onPress={() => handleSubjectPress(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.subjectCard}>
                    <LinearGradient
                      colors={['#F3E8FF', '#E9D5FF']}
                      style={styles.subjectImageContainer}
                    >
                      <Image
                        source={{ uri: item.image || item.image_url }}
                        style={styles.subjectImage}
                        resizeMode="contain"
                      />
                    </LinearGradient>

                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSub}>
                        {item?.quiz_count
                          ? `${item.quiz_count} Questions`
                          : 'Start Test'}
                      </Text>
                    </View>

                    <View style={styles.arrowCircle}>
                      <Feather name="chevron-right" size={22} color="#4F46E5" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ============================================================
   🎨 STYLES
   ============================================================ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // 🔵 HEADER (Medium Size)
  header: {
    paddingTop: height * 0.03,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    height: 58,
    position: 'relative',
  },
  headerTitle: {
    fontSize: width * 0.055,
    color: '#fff',
    fontFamily: 'roboto-bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  backButton: {
    padding: 4,
    zIndex: 3,
  },

  // 📚 ANIMATED BOOKS (Bada + Attractive)
  booksContainer: {
    width: 75,
    height: 65,
    marginLeft: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 85,                     // ✅ 62 → 85 (bada)
    height: 85,                    // ✅ 62 → 85
    borderRadius: 43,              // ✅ 31 → 43
    backgroundColor: 'rgba(255,255,255,0.22)',  // ✅ Thoda bright
  },
  booksEmoji: {
    fontSize: 44,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  pencilEmoji: {
    position: 'absolute',
    fontSize: 22,
    right: -4,
    bottom: 4,
    transform: [{ rotate: '25deg' }],
  },

  // Decorative Circles (Bade - Header ke peeche)
  decorCircle1: {
    position: 'absolute',
    top: -70,                      // ✅ -50 → -80
    right: -70,                    // ✅ -40 → -60
    width: 200,                    // ✅ 130 → 200 (bada)
    height: 200,                   // ✅ 130 → 200
    borderRadius: 100,             // ✅ 65 → 100
    backgroundColor: 'rgba(255,255,255,0.10)',  // ✅ 0.08 → 0.10
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -90,                   // ✅ -60 → -90
    left: -70,                     // ✅ -50 → -70
    width: 180,                    // ✅ 110 → 180 (bada)
    height: 180,                   // ✅ 110 → 180
    borderRadius: 90,              // ✅ 55 → 90
    backgroundColor: 'rgba(255,255,255,0.08)',  // ✅ 0.06 → 0.08
  },

  // 📦 BODY
  body: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
  },

  // 📝 SECTION TITLE
  title: {
    fontSize: width * 0.05,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
    marginBottom: 6,
    marginTop: 4,
    marginLeft: 4,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    marginLeft: 4,
    marginBottom: 14,
  },

  // 📚 SUBJECT CARD
  subjectCardWrapper: {
    marginBottom: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 18,
    minHeight: 72,
  },
  subjectImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  subjectImage: {
    width: 34,
    height: 34,
  },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: width * 0.046,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },
  cardSub: {
    fontSize: width * 0.032,
    fontFamily: 'roboto',
    color: '#64748B',
    marginTop: 3,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 🏆 TOP SCORERS CARD
  topStudentsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topStudentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topStudentsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trophyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyEmoji: { fontSize: 20 },
  topStudentsTitle: {
    fontSize: 15,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },
  topStudentsSubtitle: {
    fontSize: 10,
    fontFamily: 'roboto',
    color: '#6B7280',
    marginTop: 2,
  },


  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  topStudentRow: {
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 13,
    fontFamily: 'roboto-bold',
  },
  avatarContainer: { position: 'relative', marginRight: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'roboto-bold',
    color: '#fff',
  },
  crownBadge: {
    position: 'absolute',
    top: -9,
    right: -5,
  },
  crownText: { fontSize: 14 },
  studentInfo: { flex: 1, minWidth: 0 },
  studentName: {
    fontSize: 14,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },
  studentClass: {
    fontSize: 10,
    fontFamily: 'roboto',
    color: '#9CA3AF',
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 50,
    justifyContent: 'flex-end',
  },
  scoreIcon: { fontSize: 14, marginRight: 4, color: '#F59E0B' },
  scoreText: {
    fontSize: 15,
    fontFamily: 'roboto-bold',
    color: '#1E3A8A',
  },

  // ⏳ LOADER & EMPTY
  loaderBox: { marginTop: 50, alignItems: 'center' },
  loadingText: { marginTop: 10, fontFamily: 'roboto', color: '#4F46E5' },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 15,
    fontFamily: 'roboto-medium',
    color: '#777',
  },
});
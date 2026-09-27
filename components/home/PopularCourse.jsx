// PopularCourse.jsx
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLOR } from '../../constants/Colors'
import { getTopStudents } from '../../constants/api/apiClass'
import { router } from 'expo-router'

export default function PopularCourse() {
  const [popularCourse, setPopularCourse] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch top students
  const fetchTopStudents = async () => {
    try {
      setLoading(true)
      const response = await getTopStudents()
      console.log('Popular Course Data:', response)
      
      if (response && response.students && response.students.length > 0) {
        // Map API data to match the component's format
        const formattedData = response.students.map((student, index) => ({
          id: student.id || index,
          name: student.name || 'Unknown',
          img: student.avatar || student.image || 'https://img.freepik.com/free-photo/young-student-woman-wearing-denim-jacket-eyeglasses-holding-colorful-folders-showing-thumb-up-pink_176532-13861.jpg',
          class: student.class || student.grade || 'N/A',
          rank: student.rank || student.score || index + 1,
        }))
        setPopularCourse(formattedData)
      } else {
        // No data received
        setPopularCourse([])
      }
    } catch (error) {
      console.error('Error:', error)
      setPopularCourse([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopStudents()
  }, [])

  // Loading State
  if (loading) {
    return (
      <View style={{ marginHorizontal: 20, marginTop: 20 }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, color: '#333', fontFamily: 'roboto-medium' }}>Top Students</Text>
          <TouchableOpacity onPress={() => router.push('/TopScorersPage')}>
            {/* <Text style={{ fontFamily: 'roboto', color: COLOR.background }}>See more</Text> */}
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20, alignItems: 'center', paddingVertical: 30 }}>
          <ActivityIndicator size="small" color={COLOR.background} />
        </View>
      </View>
    )
  }

  return (
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 18, color: '#333', fontFamily: 'roboto-medium' }}>Top Students</Text>
        <TouchableOpacity onPress={() => router.push('/TopScorersPage')}>
          {/* <Text style={{ fontFamily: 'roboto', color: COLOR.background }}>See more</Text> */}
        </TouchableOpacity>
      </View>
      
      <View style={{ marginTop: 20 }}>
        {popularCourse.length === 0 ? (
          // No Data State
          <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            paddingVertical: 20,
            width: '100%',
          }}>
            <Text style={{ 
              fontSize: 14, 
              color: '#999', 
              fontFamily: 'roboto' 
            }}>
              No students found
            </Text>
          </View>
        ) : (
          <FlatList 
            data={popularCourse} 
            horizontal 
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                key={item.id || index} 
                style={{
                  width: 145, 
                  borderTopLeftRadius: 10, 
                  borderTopRightRadius: 10, 
                  overflow: 'hidden', 
                  marginLeft: index === 0 ? 0 : 10,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View style={{ width: 145, height: 80 }}>
                  <Image 
                    source={{ uri: item.img }} 
                    style={{ width: 145, height: 80 }}
                  />
                </View>
                <View style={{ padding: 5, backgroundColor: '#fff' }}>
                  <Text 
                    style={{ 
                      fontSize: 13, 
                      color: COLOR.background, 
                      fontFamily: 'roboto-medium', 
                      textAlign: 'center' 
                    }} 
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'roboto' }}>class : {item?.class}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'roboto' }}>Rank : {item?.rank}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  )
}



// // PopularCourse.jsx
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { Feather } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { COLOR } from '../../constants/Colors';
// import { getTopStudents } from '../../constants/api/apiClass';
// import { router } from 'expo-router';

// const { width } = Dimensions.get('window');
// const CARD_WIDTH = 150;

// export default function PopularCourse() {
//   const [popularCourse, setPopularCourse] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch top students
//   const fetchTopStudents = async () => {
//     try {
//       setLoading(true);
//       const response = await getTopStudents();
//       console.log('Popular Course Data:', response);

//       if (response && response.students && response.students.length > 0) {
//         // Map API data to match the component's format
//         const formattedData = response.students.map((student, index) => ({
//           id: student.id || index,
//           name: student.name || 'Unknown',
//           img:
//             student.avatar ||
//             student.image ||
//             'https://img.freepik.com/free-photo/young-student-woman-wearing-denim-jacket-eyeglasses-holding-colorful-folders-showing-thumb-up-pink_176532-13861.jpg',
//           class: student.class || student.grade || 'N/A',
//           rank: student.rank || student.score || index + 1,
//         }));
//         setPopularCourse(formattedData);
//       } else {
//         setPopularCourse([]);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setPopularCourse([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTopStudents();
//   }, []);

//   // Rank ke hisaab se badge color
//   const getRankStyle = (index) => {
//     if (index === 0) return { bg: '#FDE68A', text: '#B45309' }; // Gold
//     if (index === 1) return { bg: '#E2E8F0', text: '#475569' }; // Silver
//     return { bg: '#FED7AA', text: '#9A3412' }; // Bronze
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.headerRow}>
//           <View style={styles.headerLeft}>
//             <View style={styles.trophyCircle}>
//               <Text style={styles.trophyEmoji}>🏆</Text>
//             </View>
//             <View>
//               <Text style={styles.sectionTitle}>Top Scorers</Text>
//               <Text style={styles.sectionSubtitle}>Leading this month</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.loaderBox}>
//           <ActivityIndicator size="small" color="#4F46E5" />
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* 🏆 Section Header */}
//       <View style={styles.headerRow}>
//         <View style={styles.headerLeft}>
//           <View style={styles.trophyCircle}>
//             <Text style={styles.trophyEmoji}>🏆</Text>
//           </View>
//           <View>
//             <Text style={styles.sectionTitle}>Top Scorers</Text>
//             <Text style={styles.sectionSubtitle}>Leading this month</Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.seeAllBtn}
//           onPress={() => router.push('/TopScorersPage')}
//           activeOpacity={0.7}
//         >
//           <Feather name="crown" size={12} color="#4F46E5" />
//           <Text style={styles.seeAllText}>See All</Text>
//           <Feather name="chevron-right" size={14} color="#4F46E5" />
//         </TouchableOpacity>
//       </View>

//       {/* 📋 Card List */}
//       <View style={{ marginTop: 14 }}>
//         {popularCourse.length === 0 ? (
//           // No Data State
//           <View style={styles.emptyBox}>
//             <Text style={styles.emptyText}>No students found</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={popularCourse}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//             contentContainerStyle={{ paddingRight: 10 }}
//             renderItem={({ item, index }) => {
//               const rank = getRankStyle(index);

//               return (
//                 <TouchableOpacity
//                   key={item.id || index}
//                   style={[
//                     styles.card,
//                     { marginLeft: index === 0 ? 0 : 12 },
//                   ]}
//                   activeOpacity={0.85}
//                   onPress={() => {
//                     // (agar future mein card click ka logic ho toh yahan aayega)
//                   }}
//                 >
//                   {/* 🖼️ Image with Rank Badge */}
//                   <View style={styles.imageWrapper}>
//                     <Image source={{ uri: item.img }} style={styles.image} />

//                     {/* Rank Badge */}
//                     <View
//                       style={[
//                         styles.rankBadge,
//                         { backgroundColor: rank.bg },
//                       ]}
//                     >
//                       <Text
//                         style={[
//                           styles.rankBadgeText,
//                           { color: rank.text },
//                         ]}
//                       >
//                         #{index + 1}
//                       </Text>
//                     </View>

//                     {/* Crown for #1 */}
//                     {index === 0 && (
//                       <View style={styles.crownBadge}>
//                         <Text style={styles.crownText}>👑</Text>
//                       </View>
//                     )}
//                   </View>

//                   {/* 📝 Info */}
//                   <View style={styles.cardInfo}>
//                     <Text style={styles.studentName} numberOfLines={1}>
//                       {item.name}
//                     </Text>

//                     <View style={styles.metaRow}>
//                       <View style={styles.metaPill}>
//                         <Text style={styles.metaPillText}>
//                           {item?.class}
//                         </Text>
//                       </View>
//                       <View style={styles.metaPill}>
//                         <Text style={styles.metaPillText}>
//                           Rank {item?.rank}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               );
//             }}
//           />
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 16,
//     marginTop: 20,
//   },

//   // 🏆 Header Row
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   trophyCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#FEF3C7',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   trophyEmoji: { fontSize: 20 },
//   sectionTitle: {
//     fontSize: 16,
//     fontFamily: 'roboto-bold',
//     color: '#1E3A8A',
//   },
//   sectionSubtitle: {
//     fontSize: 10,
//     fontFamily: 'roboto',
//     color: '#6B7280',
//     marginTop: 2,
//   },

//   // See All Button
//   seeAllBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EEF2FF',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//     gap: 4,
//   },
//   seeAllText: {
//     fontSize: 11,
//     fontFamily: 'roboto-bold',
//     color: '#4F46E5',
//   },

//   // 📋 Card
//   card: {
//     width: CARD_WIDTH,
//     borderRadius: 16,
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   // 🖼️ Image Wrapper
//   imageWrapper: {
//     width: CARD_WIDTH,
//     height: 95,
//     position: 'relative',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },

//   // Rank Badge (top-left)
//   rankBadge: {
//     position: 'absolute',
//     top: 6,
//     left: 6,
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.15,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   rankBadgeText: {
//     fontSize: 10,
//     fontFamily: 'roboto-bold',
//   },

//   // Crown (top-right)
//   crownBadge: {
//     position: 'absolute',
//     top: 4,
//     right: 6,
//   },
//   crownText: { fontSize: 16 },

//   // 📝 Card Info
//   cardInfo: {
//     padding: 10,
//   },
//   studentName: {
//     fontSize: 13,
//     fontFamily: 'roboto-bold',
//     color: '#1E3A8A',
//     textAlign: 'center',
//   },
//   metaRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//     gap: 4,
//   },
//   metaPill: {
//     flex: 1,
//     backgroundColor: '#F1F5F9',
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   metaPillText: {
//     fontSize: 10,
//     fontFamily: 'roboto-bold',
//     color: '#475569',
//   },

//   // ⏳ Loader & Empty
//   loaderBox: {
//     marginTop: 20,
//     alignItems: 'center',
//     paddingVertical: 30,
//   },
//   emptyBox: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 20,
//     width: '100%',
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#999',
//     fontFamily: 'roboto',
//   },
// });
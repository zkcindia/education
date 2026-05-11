import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Feather, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLOR } from '../../constants/Colors';
import { Rating } from 'react-native-ratings';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AboutMentor from './aboutMentor';
import Lesson from './lesson';
import Reviews from './reviews';

const screenWidth = Dimensions.get('window').width;

// // Dummy components for the tabs
// function OverviewScreen() {
//   return (
//     <View style={styles.tabContent}>
//       <Text>Overview Content</Text>
//     </View>
//   );
// }

// function LessonsScreen() {
//   return (
//     <View style={styles.tabContent}>
//       <Text>Lessons Content</Text>
//     </View>
//   );
// }

// function ReviewsScreen() {
//   return (
//     <View style={styles.tabContent}>
//       <Text>Reviews Content</Text>
//     </View>
//   );
// }

const Tab = createMaterialTopTabNavigator();

export default function CourseDetails() {
  const navigation = useNavigation()
  const [rating, setRating] = useState(4);
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <FontAwesome6 name="angle-left" size={24} color="gray" />
        </TouchableOpacity>
        <Text style={{fontFamily: 'roboto-bold', fontSize: 18}}>Course Details</Text>
        <View style={styles.headerIcon}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="share-variant-outline" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="heart" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Image source={{ uri: 'https://tse1.mm.bing.net/th?q=computer%20science%20math%20courses' }} style={styles.topImage} />
        <View style={{ padding: 15, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 20, alignItems: 'flex-start' }}>
            <Text style={styles.title}>Computer Science Math class 3 student</Text>
            <Text style={styles.price}>₹ Free</Text>
          </View>
          <View style={styles.rating}>
            <Rating imageSize={15} showRating={false} onFinishRating={(rating) => setRating(rating)} />
            <Text style={{ fontFamily: 'roboto', color: COLOR.background }}>4.8 (500 Reviews)</Text>
          </View>
          {/* Top Tabs Section */}
          <NavigationContainer independent={true}>
            <Tab.Navigator
              screenOptions={{
                tabBarLabelStyle: { fontSize: 12, fontFamily: 'roboto' },
                tabBarIndicatorStyle: { backgroundColor: COLOR.background },
                tabBarActiveTintColor: COLOR.background,
                tabBarInactiveTintColor: 'black',
              }}
            >
              <Tab.Screen name="About Mentor" component={AboutMentor} />
              <Tab.Screen name="Lessons" component={Lesson} />
              <Tab.Screen name="Reviews" component={Reviews} />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLOR.white,
    padding: 20,
    paddingTop: 40
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  headerIcon: {
    flexDirection: 'row',
    gap: 20
  },
  topImage: {
    width: screenWidth,
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontFamily: 'roboto-bold',
    flexWrap: 'wrap',
    width: '80%'
  },
  price: {
    fontSize: 20,
    color: COLOR.background,
    fontFamily: 'roboto-bold'
  },
  rating: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom:10
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor:'#fff'
  }
});

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
} from 'react-native';

import React, { useCallback, useState } from 'react';
import { useNavigation, router } from 'expo-router';
import { COLOR } from './../../../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchBoardClassSubjects } from '../../../../constants/api/apiTeacher';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loader, setLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');

      if (data) {
        const parsedData = JSON.parse(data);
        setUserData(parsedData);
        // Automatically fetch subjects when user data is loaded
        fetchSubjects(parsedData);
      }
    } catch (error) {
      console.log('USER DATA ERROR:', error);
    }
  };

  const fetchSubjects = async (userData) => {
    setLoader(true);

    try {
      const response = await fetchBoardClassSubjects();

      if (response.status === 200) {
        setSubjects(response.data?.data || []);
      }
    } catch (error) {
      console.log('SUBJECT ERROR:', error?.response?.data || error.message);
    }

    setLoader(false);
  };

  const handleSubjectPress = (item) => {
    navigation.navigate('screen/instructionsScreen', {
      id: item.id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
<View style={styles.header}>
  <TouchableOpacity 
    onPress={() => router.push('/top-scorers')}
    style={styles.backButton}
    activeOpacity={0.7}
  >
    <Feather name="arrow-left" size={24} color={COLOR.white} />
  </TouchableOpacity>
  
  <Text style={styles.headerTitle}>My Subjects</Text>
  
  <View style={{ width: 24 }} />
</View>

      <View style={styles.body}>
        {loader ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={COLOR.background} />
            <Text style={styles.loadingText}>Loading subjects...</Text>
          </View>
        ) : (
          <>
            {userData && (
              <Text style={styles.title}>
    {userData?.class}
              </Text>
            )}

            <FlatList
              data={subjects}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No subjects found</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.subjectCard}
                  onPress={() => handleSubjectPress(item)}
                >
                  <Image
                    source={{ uri: item.image || item.image_url }}
                    style={styles.subjectImage}
                  />

                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.name}</Text>

                    <Text style={styles.cardSub}>
                      {item?.quiz_count
                        ? `${item.quiz_count} Questions`
                        : 'Start Test'}
                    </Text>
                  </View>

                  <Feather
                    name="chevron-right"
                    size={24}
                    color={COLOR.background}
                  />
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLOR.background,
    padding: 20,
    paddingTop: height * 0.05,
  },

  headerTitle: {
    fontSize: width * 0.05,
    color: COLOR.white,
    fontFamily: 'roboto-bold',
  },

  body: {
    flex: 1,
    padding: 18,
  },

  title: {
    fontSize: width * 0.05,
    fontFamily: 'roboto-bold',
    color: COLOR.background,
    marginBottom: 15,
  },

  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
    padding: 14,
    borderRadius: 15,
    elevation: 2,
    marginBottom: 12,
  },

  subjectImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
    resizeMode: 'cover',
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: width * 0.045,
    fontFamily: 'roboto-bold',
    color: COLOR.background,
  },

  cardSub: {
    fontSize: width * 0.035,
    fontFamily: 'roboto',
    color: '#666',
    marginTop: 4,
  },

  loaderBox: {
    marginTop: 50,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontFamily: 'roboto',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    fontFamily: 'roboto-medium',
    color: '#777',
  },
  backButton: {
  padding: 4,
  width: 40,
},
});
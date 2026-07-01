import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { fetchBoardClassSubjects } from '../../constants/api/apiTeacher';
import { useToast } from 'react-native-toast-notifications';
import { COLOR } from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function SubjectScreen() {
  const navigation = useNavigation();
  const toast = useToast();

  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserAndSubjects();
  }, []);

  const loadUserAndSubjects = async () => {
    setLoader(true);

    try {
      // Get user data from AsyncStorage
      const data = await AsyncStorage.getItem('userData');
      
      // Debug: Check if data exists
      console.log('========== DEBUG ==========');
      console.log('Raw userData from AsyncStorage:', data);
      
      if (!data) {
        console.log('❌ No userData found in AsyncStorage');
        toast.show('User data not found. Please login again.', {
          type: 'warning',
          duration: 2000,
          animationType: 'zoom-in',
          placement: 'top',
        });
        setLoader(false);
        return;
      }

      const parsedData = JSON.parse(data);
      setUserData(parsedData);
      
      console.log('✅ Parsed userData:', parsedData);
      console.log('📚 Board:', parsedData?.Education_board);
      console.log('📚 Class:', parsedData?.class);
      
      // Fetch subjects using user's board and class
      await fetchSubjects(parsedData);
      
    } catch (error) {
      console.log('❌ ERROR in loadUserAndSubjects:', error);
      toast.show('Error loading data', {
        type: 'warning',
        duration: 2000,
        animationType: 'zoom-in',
        placement: 'top',
      });
    } finally {
      setLoader(false);
    }
  };

  const fetchSubjects = async (userData) => {
    try {
      console.log('🔄 Calling fetchBoardClassSubjects API...');
      console.log('📤 Request params:', {
        board_name: userData?.Education_board,
        class_name: userData?.class,
      });
      
      const response = await fetchBoardClassSubjects();
      
      console.log('📥 API Response Status:', response.status);
      console.log('📦 API Response Data:', JSON.stringify(response.data, null, 2));

      if (response.status === 200) {
        const subjectData = response.data?.data || [];
        console.log('✅ Subjects found:', subjectData.length);
        setSubjects(subjectData);
        
        if (subjectData.length === 0) {
          toast.show('No subjects found for your board and class', {
            type: 'warning',
            duration: 2000,
            animationType: 'zoom-in',
            placement: 'top',
          });
        }
      } else {
        console.log('❌ API returned non-200 status:', response.status);
        toast.show('Failed to load subjects', {
          type: 'warning',
          duration: 2000,
          animationType: 'zoom-in',
          placement: 'top',
        });
      }
    } catch (error) {
      console.log('❌ SUBJECT FETCH ERROR:', error);
      console.log('❌ Error response:', error?.response?.data);
      console.log('❌ Error message:', error.message);
      
      toast.show('Error loading subjects: ' + (error.message || 'Unknown error'), {
        type: 'warning',
        duration: 3000,
        animationType: 'zoom-in',
        placement: 'top',
      });
    }
  };

  const handleSubjectPress = (item) => {
    navigation.navigate('screen/instructionsScreen', {
      id: item.id,
      subjectName: item.name,
    });
  };

  const filteredSubjects = subjects.filter(item =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <FontAwesome6 name="angle-left" size={24} color="gray" />
        </TouchableOpacity>

        <Text style={styles.headerText}>My Subjects</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#969191" />
        <TextInput
          placeholder="Search Subject..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Board & Class Title */}
      {userData && (
        <Text style={styles.courseTitle}>
          {userData?.Education_board} - {userData?.class}
        </Text>
      )}

      {/* Subjects List */}
      {loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLOR.background} />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSubjects}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {search ? 'No matching subjects found' : 'No subjects available'}
              </Text>
              <Text style={styles.emptySubText}>
                Board: {userData?.Education_board || 'N/A'} | Class: {userData?.class || 'N/A'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.subjectCard}
              onPress={() => handleSubjectPress(item)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.image || item.image_url || 'https://via.placeholder.com/70' }}
                style={styles.subjectImage}
              />

              <View style={styles.subjectDetails}>
                <Text style={styles.subjectName}>{item?.name}</Text>
                <Text style={styles.quizCount}>
                  {item?.quiz_count ? `${item.quiz_count} Questions` : 'Start Test'}
                </Text>
              </View>

              <Feather name="chevron-right" size={24} color={COLOR.background} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
    paddingTop: height * 0.05,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  backButton: {
    position: 'absolute',
    left: width * 0.05,
    padding: 5,
  },

  headerText: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.05,
    color: COLOR.background,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: width * 0.05,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 45,
  },

  searchInput: {
    flex: 1,
    fontFamily: 'roboto',
    fontSize: width * 0.04,
    marginLeft: 10,
    paddingVertical: 5,
    color: '#333',
  },

  courseTitle: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.045,
    marginHorizontal: width * 0.05,
    marginBottom: 15,
    color: COLOR.background,
  },

  listContent: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.1,
  },

  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  subjectImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    resizeMode: 'cover',
  },

  subjectDetails: {
    flex: 1,
    marginLeft: 15,
  },

  subjectName: {
    fontFamily: 'roboto-bold',
    fontSize: width * 0.045,
    color: COLOR.background,
    marginBottom: 4,
  },

  quizCount: {
    fontFamily: 'roboto',
    fontSize: width * 0.035,
    color: '#666',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontFamily: 'roboto',
    color: '#666',
    fontSize: width * 0.04,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.2,
  },

  emptyText: {
    fontFamily: 'roboto-medium',
    fontSize: width * 0.04,
    color: '#999',
    textAlign: 'center',
  },

  emptySubText: {
    fontFamily: 'roboto',
    fontSize: width * 0.035,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});
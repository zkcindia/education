import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLOR } from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitQuiz } from '../../constants/api/apiScore';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function ResultScreen() {
  const navigation = useNavigation();
  const router = useRoute();
  
  // ✅ Debug: Check all params
  console.log('========== RESULT SCREEN PARAMS ==========');
  console.log('All params:', router.params);
  console.log('===========================================');
  
  const { score, subject, teacherId, teacherName } = router.params || {};
  
  // ✅ Emergency fix: If subject is undefined, try to get from route
  const finalSubjectId = subject || router.params?.subjectId || 1;
  
  console.log('📤 Final Subject ID:', finalSubjectId);
  
  const [user, setUser] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const viewRef = useRef();

  useEffect(() => {
    if (!finalSubjectId) {
      Alert.alert('Error', 'Subject ID is missing. Please try again.');
      return;
    }
    loadUserAndSubmit();
  }, []);

  const loadUserAndSubmit = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log('📦 UserData:', userData);
      
      if (!userData) {
        Alert.alert('Error', 'Please login to save your score.');
        return;
      }

      const parsedUser = JSON.parse(userData);
      console.log('👤 User ID:', parsedUser.id);
      
      setUser(parsedUser);
      
      if (parsedUser.id && finalSubjectId) {
        await submitUserScore(parsedUser.id, finalSubjectId);
      }
      
    } catch (error) {
      console.log('❌ Error:', error);
    }
  };

  const submitUserScore = async (userId, subId) => {
    if (submitted) return;
    
    console.log('========== SUBMITTING SCORE ==========');
    console.log('📤 User ID:', userId);
    console.log('📤 Subject ID:', subId);
    console.log('📤 Score:', score);
    console.log('=======================================');
    
    try {
      const response = await submitQuiz({
        userId: userId,
        subjectId: subId,
        score: Number(score) || 0,
      });

      console.log('✅ Success:', response.data);
      setSubmitted(true);
      
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
      
      let errorMsg = 'Failed to submit score.';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      Alert.alert('Error', errorMsg, [{ text: 'OK' }]);
    }
  };

  const shareResults = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} ref={viewRef}>
      <Text style={styles.title}>Quiz Result!</Text>
      <Image 
        source={{ uri: 'https://w7.pngwing.com/pngs/10/33/png-transparent-winner-medal-illustration-gold-medal-trophy-christmas-trophy-s-emblem-medal-logo.png' }} 
        style={styles.image} 
      />
      
      <View style={styles.resultContainer}>
        <Text style={styles.congratulationsText}>Congratulations!</Text>
        <Text style={styles.congratulationsMessage}>
          You have completed your quiz and earned {score || 0} coins!
        </Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.label}>YOUR SCORE</Text>
          <Text style={styles.score}>{score || 0}</Text>
        </View>
        
        <View style={styles.coinsContainer}>
          <Text style={styles.label}>EARNED COINS</Text>
          <View style={styles.coinRow}>
            <Image 
              source={{ uri: 'https://www.vhv.rs/dpng/d/141-1411128_coin-vector-png-transparent-coin-vector-png-png.png' }} 
              style={styles.coinImage} 
            />
            <Text style={styles.score}>{score || 0}</Text>
          </View>
        </View>
        
        {teacherName && (
          <View style={styles.teacherContainer}>
            <Text style={styles.teacherName}>{teacherName}</Text>
            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.chatButtonText}>Chat with teacher</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={shareResults} style={[styles.button, styles.shareButton]}>
          <FontAwesome5 name="share-alt" size={15} color="black" />
          <Text style={styles.buttonText}>Share Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.homeButton]} 
          onPress={() => navigation.navigate('(drawer)')}
        >
          <Text style={[styles.buttonText, styles.homeButtonText]}>Go To Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 30,
    backgroundColor: '#f5f5f5',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: COLOR.background,
  },
  image: {
    height: 150,
    width: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  resultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: COLOR.white,
    gap: 20,
    marginTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
    width: '100%',
  },
  congratulationsText: {
    fontFamily: 'roboto-bold',
    fontSize: 24,
    color: COLOR.background,
    marginTop: 15,
    textAlign: 'center',
  },
  congratulationsMessage: {
    fontFamily: 'roboto-medium',
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
  },
  scoreContainer: {
    gap: 10,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'roboto-medium',
    fontSize: 18,
    color: COLOR.background,
  },
  score: {
    fontFamily: 'roboto-bold',
    fontSize: 30,
    color: COLOR.background,
    textAlign: 'center',
  },
  coinsContainer: {
    gap: 10,
    alignItems: 'center',
  },
  coinRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  coinImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  teacherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.background,
  },
  chatButton: {
    backgroundColor: COLOR.background,
    padding: 8,
    borderRadius: 5,
  },
  chatButtonText: {
    color: COLOR.white,
    fontFamily: 'roboto-medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 30,
    width: '100%',
  },
  button: {
    padding: 12,
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  shareButton: {
    backgroundColor: COLOR.white,
    borderColor: '#CCC',
    borderWidth: 1,
  },
  homeButton: {
    backgroundColor: COLOR.background,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'roboto-medium',
    marginLeft: 8,
  },
  homeButtonText: {
    color: COLOR.white,
  },
});
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLOR } from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { submitQuiz } from '../../constants/api/apiScore';
import { captureRef } from 'react-native-view-shot'; // To capture the screen
import * as Sharing from 'expo-sharing'; 

export default function ResultScreen() {
  const navigation = useNavigation();
  const router = useRoute();
  const { score, subject, teacherId, teacherName } = router.params;
  const [user, setUser] = useState({});
  const viewRef = useRef(); 

  useEffect(() => {
    getUserData();
    if (user) {
      submitScore();
    }
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData !== null) {
        console.log(userData);
        setUser(JSON.parse(userData)); // Convert string back to JSON
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const submitScore = async () => {
    try {
      const response = await submitQuiz({ userId: user.id, subjectId: subject, score: score });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to capture the screenshot and share it
  const shareResults = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });
      console.log('Image saved to', uri);

      // Share the image
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} ref={viewRef}>
      <Text style={styles.title}>Quiz Result!</Text>
      <Image source={{ uri: 'https://w7.pngwing.com/pngs/10/33/png-transparent-winner-medal-illustration-gold-medal-trophy-christmas-trophy-s-emblem-medal-logo.png' }} style={styles.image} />
      <View style={styles.resultContainer}>
        <Text style={styles.congratulationsText}>Congratulations!</Text>
        <Text style={styles.congratulationsMessage}>Dear user, you have completed your quiz and you have earned some coins. You can convert it to real money.</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.label}>YOUR SCORE</Text>
          <Text style={styles.score}>{score || '0'}</Text>
        </View>
        
        <View style={styles.coinsContainer}>
          <Text style={styles.label}>EARNED COINS</Text>
          <View style={styles.coinRow}>
            <Image source={{ uri: 'https://www.vhv.rs/dpng/d/141-1411128_coin-vector-png-transparent-coin-vector-png-png.png' }} style={styles.coinImage} />
            <Text style={styles.score}>{score}</Text>
          </View>
        </View>
        
        <View style={styles.teacherContainer}>
          <Text style={styles.teacherName}>{teacherName}</Text>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Chat with teacher</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={shareResults} style={[styles.button, styles.shareButton]}>
          <FontAwesome5 name="share-alt" size={15} color="black" />
          <Text style={styles.buttonText}>Share Results</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={() => navigation.navigate('(drawer)')}>
          <Text style={[styles.buttonText, styles.homeButtonText]}>Go To Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, paddingTop: 30 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  image: {
    height: 150,
    width: 100,
    marginBottom: 20,
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
  },
  scoreContainer: {
    gap: 10,
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
  },
  coinRow: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginHorizontal: 'auto',
  },
  coinImage: {
    width: 40,
    height: 40,
  },
  teacherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '700',
  },
  chatButton: {
    backgroundColor: COLOR.background,
    padding: 5,
    borderRadius: 5,
  },
  chatButtonText: {
    color: COLOR.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 30,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  homeButtonText: {
    color: COLOR.white,
  },
});

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLOR } from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export default function ResultScreen() {
  const navigation = useNavigation();
  const router = useRoute();
  const viewRef = useRef();

  const {
    score = 0,
    totalMarks = 20,
    passed = false,
    message = '',
    remainingAttempts = 0,
    attemptNo = 1,
    teacherName,
  } = router.params || {};

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
        source={{
          uri: passed
            ? 'https://w7.pngwing.com/pngs/10/33/png-transparent-winner-medal-illustration-gold-medal-trophy-christmas-trophy-s-emblem-medal-logo.png'
            : 'https://cdn-icons-png.flaticon.com/512/463/463612.png',
        }}
        style={styles.image}
      />

      <View style={styles.resultContainer}>
        <Text style={styles.congratulationsText}>
          {passed ? 'Congratulations!' : 'Better Luck Next Time'}
        </Text>

        <Text style={styles.congratulationsMessage}>
          {message || (passed ? 'You passed the quiz.' : 'Better luck next attempt.')}
        </Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.label}>YOUR SCORE</Text>
          <Text style={styles.score}>
            {score}/{totalMarks}
          </Text>
        </View>

        <View style={styles.coinsContainer}>
          <Text style={styles.label}>EARNED COINS</Text>
          <View style={styles.coinRow}>
            <Image
              source={{
                uri: 'https://www.vhv.rs/dpng/d/141-1411128_coin-vector-png-transparent-coin-vector-png-png.png',
              }}
              style={styles.coinImage}
            />
            <Text style={styles.score}>{score}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Attempt No: {attemptNo}</Text>

          {!passed && (
            <Text style={styles.failedText}>
              Remaining Attempts: {remainingAttempts}
            </Text>
          )}

          <Text style={passed ? styles.successText : styles.failedText}>
            {passed
              ? '✅ Next round will unlock tomorrow.'
              : '❌ Pass mark is 18/20.'}
          </Text>
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
  infoBox: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  infoText: {
    fontSize: 15,
    fontFamily: 'roboto-medium',
    color: COLOR.background,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: 'green',
    textAlign: 'center',
  },
  failedText: {
    fontSize: 14,
    fontFamily: 'roboto-medium',
    color: '#ff6b6b',
    textAlign: 'center',
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
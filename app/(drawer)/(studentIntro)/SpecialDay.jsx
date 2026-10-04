import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { router } from 'expo-router';
import { getSpecialDayMessage } from '../../../constants/api/apiHome';

const { width, height } = Dimensions.get('window');

export default function SpecialDay() {
  const [specialDayData, setSpecialDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpecialDay();
  }, []);

  const fetchSpecialDay = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSpecialDayMessage();
      setSpecialDayData(response.data.message || response.data);
    } catch (error) {
      console.error('Error fetching special day:', error);
      setError('Failed to load special day');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.container}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#003096" />
          <Text style={styles.loadingText}>Loading today's special day...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.container}>
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSpecialDay}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // ✅ Dynamic data — SAME
  const dayName = specialDayData?.title;
  const description =
    specialDayData?.description ||
    'Every day is special when you learn something new and make it count!';
  const imageUrl =
    specialDayData?.image_url ||
    specialDayData?.image ||
    specialDayData?.icon;

  return (
    <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.container}>
      {/* 1️⃣ STATIC HEADING — "Special Day" UPAR */}
      <Animatable.View
        animation="fadeInDown"
        delay={200}
        style={styles.headingContainer}
      >
        <Text style={styles.headingText}>Special Day</Text>
      </Animatable.View>

      {/* 2️⃣ IMAGE */}
      <Animatable.View
        animation="bounceIn"
        delay={500}
        style={styles.imageContainer}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            defaultSource={require('../../../assets/images/Layer_1.png')}
          />
        ) : (
          <Image
            source={require('../../../assets/images/Layer_1.png')}
            style={styles.image}
          />
        )}
      </Animatable.View>

      {/* 3️⃣ GLASS CARD — Festival name (dynamic) + WISH */}
      <Animatable.View
        animation="fadeInUp"
        delay={1000}
        style={styles.glassCard}
      >
        {/* FESTIVAL NAME — Dynamic (Durga Puja) */}
{/* FESTIVAL NAME — Dynamic with Static Fallback */}
<Text style={styles.festivalName}>
  {dayName || 'Special Day'}
</Text>

        <View style={styles.divider} />

        {/* WISH */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionLabel}>WISH</Text> */}
          <Text style={styles.sectionText}>{description}</Text>
        </View>
      </Animatable.View>

      {/* 4️⃣ CONTINUE BUTTON */}
      <Animatable.View
        animation="fadeInUp"
        delay={1200}
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/(drawer)/(studentIntro)/StudentDob')}
        >
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.04,
  },

  // 1️⃣ STATIC HEADING — UPAR
  headingContainer: {
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  headingText: {
    fontSize: width * 0.068,
    fontWeight: '900',
    color: '#003096',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 48, 150, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // 2️⃣ IMAGE
  imageContainer: {
    marginTop: height * 0.03,
    alignItems: 'center',
  },
  image: {
    width: width * 0.6,
    height: height * 0.2,
    resizeMode: 'contain',
    borderRadius: 10,
  },

  // 3️⃣ GLASS CARD
  glassCard: {
    marginTop: height * 0.04,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.028,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#003096',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 6,
  },

  // FESTIVAL NAME — Dynamic (card ke andar)
  festivalName: {
    fontSize: width * 0.065,
    fontWeight: '900',
    color: '#003096',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  divider: {
    height: 1.2,
    backgroundColor: 'rgba(0, 48, 150, 0.25)',
    marginVertical: height * 0.015,
    borderRadius: 2,
  },

  section: {
    marginTop: height * 0.01,
  },
  sectionLabel: {
    fontSize: width * 0.032,
    fontWeight: '800',
    color: '#003096',
    marginBottom: height * 0.006,
    letterSpacing: 1.5,
  },
  sectionText: {
    fontSize: width * 0.04,
    color: '#1F2937',
    lineHeight: height * 0.027,
  },

  // 4️⃣ BUTTON
  buttonContainer: {
    marginTop: height * 0.25,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#003096',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.18,
    borderRadius: 10,
    shadowColor: '#003096',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },

  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.35,
  },
  loadingText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#003096',
  },
  errorText: {
    fontSize: width * 0.04,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  retryButton: {
    backgroundColor: '#003096',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});
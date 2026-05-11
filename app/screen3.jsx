import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Screen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/Isolation_Mode (1).png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Dive into a seamless learning experience with Candel Light</Text>
        <Text style={styles.subtitleText}>Experience interactive learning with expert-led courses and progress tracking</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('screen4')} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipButton: {
    backgroundColor: '#D9D9D9',
    paddingVertical: height * 0.007,
    paddingHorizontal: width * 0.03,
    borderRadius: 20,
  },
  skipText: {
    fontSize: width * 0.03,
  },
  imageContainer: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: height * 0.25,
  },
  textContainer: {
    marginTop: height * 0.03,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  titleText: {
    textAlign: 'center',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  subtitleText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    marginTop: height * 0.02,
  },
  continueButton: {
    marginTop: height * 0.1,
    backgroundColor: '#003096',
    paddingVertical: height * 0.02,
    alignSelf: 'center',
    width: width * 0.7,
    borderRadius: 10,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: width * 0.05,
    textAlign: 'center',
  },
});

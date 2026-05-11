import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Screen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('screen5')}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/Frame (1).png')} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Join Candel Light Group to Kick Start Your Lesson</Text>
        <Text style={styles.subtitleText}>Join and Learn from our Top Instructors!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('signIn')} style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('signUp')} style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: height * 0.1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.08,
    paddingHorizontal: width * 0.05,
  },
  signInButton: {
    backgroundColor: '#003096',
    paddingVertical: height * 0.02,
    width: width * 0.35,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
  },
  signUpButton: {
    backgroundColor: '#fff',
    paddingVertical: height * 0.02,
    width: width * 0.35,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#003096',
  },
  signUpButtonText: {
    color: '#003096',
    fontSize: width * 0.045,
  },
});

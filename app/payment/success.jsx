import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';

export default function SuccessScreen() {

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✅</Text>
      </View>

      <Text style={styles.title}>
        Payment Successful
      </Text>

      <Text style={styles.subtitle}>
        Your course has been purchased successfully.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/')}
      >
        <Text style={styles.buttonText}>
          Go Home
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  iconContainer: {
    backgroundColor: '#DCFCE7',
    padding: 30,
    borderRadius: 100,
  },

  icon: {
    fontSize: 70,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
  },

  subtitle: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#7C3AED',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 40,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});
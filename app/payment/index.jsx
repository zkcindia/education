import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';

export default function PaymentScreen() {

  const handleSuccessPayment = () => {
    router.push('/payment/success');
  };

  const handleFailedPayment = () => {
    router.push('/payment/failed');
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Course Payment
          </Text>
        </View>

        {/* Banner Card */}
        <View style={styles.bannerCard}>

          <Text style={styles.courseTitle}>
            React Native Course
          </Text>

          <Text style={styles.courseSubtitle}>
            Complete React Native Masterclass
          </Text>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
            }}
            style={styles.bannerImage}
          />

        </View>

        {/* Price Card */}
        <View style={styles.priceCard}>

          <Text style={styles.priceLabel}>
            Course Price
          </Text>

          <Text style={styles.priceText}>
            ₹999
          </Text>

          <Text style={styles.offerText}>
            50% OFF Limited Time
          </Text>

        </View>

        {/* Features */}
        <View style={styles.featureCard}>

          <Text style={styles.featureTitle}>
            Features
          </Text>

          <Text style={styles.featureItem}>
            ✅ Lifetime Access
          </Text>

          <Text style={styles.featureItem}>
            ✅ Notes Included
          </Text>

          <Text style={styles.featureItem}>
            ✅ Recorded Classes
          </Text>

          <Text style={styles.featureItem}>
            ✅ Certificate Included
          </Text>

        </View>

      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>

        {/* Success Button */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleSuccessPayment}
        >
          <Text style={styles.payButtonText}>
            Pay Success
          </Text>
        </TouchableOpacity>

        {/* Failed Button */}
        <TouchableOpacity
          style={styles.failedButton}
          onPress={handleFailedPayment}
        >
          <Text style={styles.payButtonText}>
            Pay Failed
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
  },

  bannerCard: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#7C3AED',
    borderRadius: 25,
    padding: 20,
  },

  courseTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  courseSubtitle: {
    color: '#E9D5FF',
    marginTop: 8,
    fontSize: 15,
  },

  bannerImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginTop: 20,
  },

  priceCard: {
    marginHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    elevation: 3,
  },

  priceLabel: {
    color: 'gray',
    fontSize: 15,
  },

  priceText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginTop: 10,
  },

  offerText: {
    color: 'green',
    marginTop: 8,
    fontSize: 15,
  },

  featureCard: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    elevation: 3,
  },

  featureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  featureItem: {
    fontSize: 16,
    color: '#444',
    marginBottom: 15,
  },

  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },

  payButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 15,
  },

  failedButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
  },

  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});
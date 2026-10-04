// app/(associate)/index.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function AssociateTypeSelection() {
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Choose Associate Type</Text>
      <Text style={styles.subtitle}>
        Select how you want to join
      </Text>

      {/* ─────────── Associate Card (was State Associate) ─────────── */}
      <TouchableOpacity
        style={[styles.typeCard, styles.stateAssociateCard]}
        onPress={() => router.push('/(associate)/state-associate-signup')}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="account-star"
            size={50}
            color="#9C27B0"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.typeTitle}>Associate</Text>
          <Text style={styles.typeDescription}>
            District Head — manage executives across your district and earn
            higher commissions
          </Text>

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.purpleBadge]}>
              <Text style={styles.badgeText}>District Level</Text>
            </View>
            <View style={[styles.badge, styles.greenBadge]}>
              <Text style={styles.badgeText}>Higher Commission</Text>
            </View>
          </View>
        </View>

        <Ionicons name="arrow-forward" size={22} color="#9C27B0" />
      </TouchableOpacity>

      {/* ─────────── Executive Card (was Associate) ─────────── */}
      <TouchableOpacity
        style={[styles.typeCard, styles.associateCard]}
        onPress={() => router.push('/(associate)/associate-signup')}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="account-tie"
            size={50}
            color="#FF9800"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.typeTitle}>Executive</Text>
          <Text style={styles.typeDescription}>
            Refer students to courses and earn commission on each successful
            referral
          </Text>

          <View style={styles.badgeContainer}>
            <View style={[styles.badge, styles.orangeBadge]}>
              <Text style={styles.badgeText}>Field Level</Text>
            </View>
            <View style={[styles.badge, styles.blueBadge]}>
              <Text style={styles.badgeText}>Commission Based</Text>
            </View>
          </View>
        </View>

        <Ionicons name="arrow-forward" size={22} color="#FF9800" />
      </TouchableOpacity>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'roboto-bold',
    fontSize: 26,
    textAlign: 'center',
    color: '#003096',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'roboto',
    color: '#666',
    marginBottom: 30,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1.5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  stateAssociateCard: {
    borderColor: '#9C27B0',
    backgroundColor: '#faf5fc',
  },
  associateCard: {
    borderColor: '#FF9800',
    backgroundColor: '#fff8f0',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  typeTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 18,
    color: '#003096',
    marginBottom: 4,
  },
  typeDescription: {
    fontFamily: 'roboto',
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  purpleBadge: { backgroundColor: '#F3E5F5' },
  greenBadge: { backgroundColor: '#E8F5E9' },
  orangeBadge: { backgroundColor: '#FFF3E0' },
  blueBadge: { backgroundColor: '#E3F2FD' },
  badgeText: {
    fontFamily: 'roboto',
    fontSize: 10,
    color: '#444',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8EEFB',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontFamily: 'roboto',
    fontSize: 12,
    color: '#003096',
    marginLeft: 8,
    lineHeight: 18,
  },
});
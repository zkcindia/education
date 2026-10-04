// RoleSelection.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView, // ✅ Added — kyunki 3 cards ke baad scroll ki zaroorat pad sakti hai
  // Image, // Uncomment when you add images
} from 'react-native';
import { useRouter } from 'expo-router'; // ✅ CHANGED: useNavigation → useRouter
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function RoleSelection() {
  const router = useRouter(); // ✅ CHANGED

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()} // ✅ CHANGED
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>Select how you want to sign up</Text>

      {/* ───────────────── Student Card ───────────────── */}
      <TouchableOpacity
        style={[styles.roleCard, styles.studentCard]}
        onPress={() => router.push('/StudentSignUp')} // ✅ CHANGED
      >
        {/* IMAGE COMMENT: Uncomment below when you add student-icon.png */}
        {/* <Image
          source={require('../assets/images/student-icon.png')}
          style={styles.roleIcon}
        /> */}

        <MaterialCommunityIcons name="school" size={50} color="#4CAF50" />

        <Text style={styles.roleTitle}>Student</Text>
        <Text style={styles.roleDescription}>
          Join as a student to access courses and learning materials
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color="#003096" />
        </View>
      </TouchableOpacity>

      {/* ───────────────── Teacher Card ───────────────── */}
      <TouchableOpacity
        style={[styles.roleCard, styles.teacherCard]}
        onPress={() => router.push('/TeacherSignUp')} // ✅ CHANGED
      >
        {/* IMAGE COMMENT: Uncomment below when you add teacher-icon.png */}
        {/* <Image
          source={require('../assets/images/teacher-icon.png')}
          style={styles.roleIcon}
        /> */}

        <MaterialCommunityIcons name="teacher" size={50} color="#2196F3" />

        <Text style={styles.roleTitle}>Teacher</Text>
        <Text style={styles.roleDescription}>
          Join as a teacher to create courses and manage students
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color="#003096" />
        </View>
      </TouchableOpacity>

      {/* ───────────────── ✅ NEW: Associate Card ───────────────── */}
      <TouchableOpacity
        style={[styles.roleCard, styles.associateCard]}
        // onPress={() => router.push('/(drawer)/(associate)')} // ✅ CHANGED → index.jsx khulega
        onPress={() => router.push('/(associate)')
          
        }
      > 
        {/* IMAGE COMMENT: Uncomment below when you add associate-icon.png */}
        {/* <Image
          source={require('../assets/images/associate-icon.png')}
          style={styles.roleIcon}
        /> */}

        <MaterialCommunityIcons name="account-tie" size={50} color="#FF9800" />

        <Text style={styles.roleTitle}>Associate</Text>
        <Text style={styles.roleDescription}>
          Join as an associate to refer students and earn commissions
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color="#003096" />
        </View>
      </TouchableOpacity>

      {/* ───────────────── Footer ───────────────── */}
      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/signIn')}> {/* ✅ CHANGED */}
          <Text style={styles.signInText}>Sign in Here</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // ✅ flex: 1 se flexGrow: 1 kiya (ScrollView ke liye)
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingTop: 50,
    paddingBottom: 30, // ✅ bottom padding add ki
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'roboto-bold',
    fontSize: 28,
    textAlign: 'center',
    color: '#003096',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'roboto',
    color: '#666',
    marginBottom: 30,
  },
  roleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
    alignItems: 'center',
  },
  studentCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f7f0',
  },
  teacherCard: {
    borderColor: '#2196F3',
    backgroundColor: '#f0f4f8',
  },
  // ✅ NEW: Associate card style
  associateCard: {
    borderColor: '#FF9800',
    backgroundColor: '#fff8f0',
  },
  roleIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  roleTitle: {
    fontFamily: 'roboto-bold',
    fontSize: 20,
    color: '#003096',
    marginBottom: 5,
    marginTop: 10,
  },
  roleDescription: {
    fontFamily: 'roboto',
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontFamily: 'roboto',
    color: '#666',
  },
  signInText: {
    color: '#003096',
    fontFamily: 'roboto-bold',
    marginLeft: 5,
  },
});
// RoleSelection.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  // Image, // Uncomment when you add images
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

export default function RoleSelection() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>Select how you want to sign up</Text>

      {/* Student Card */}
      <TouchableOpacity
        style={[styles.roleCard, styles.studentCard]}
        onPress={() => navigation.navigate('StudentSignUp')}
      >
        {/* IMAGE COMMENT: Uncomment below when you add student-icon.png */}
        {/* <Image
          source={require('../assets/images/student-icon.png')}
          style={styles.roleIcon}
        /> */}
        
        {/* Using icon for now - Remove this when using Image */}
        <MaterialCommunityIcons name="school" size={50} color="#4CAF50" />
        
        <Text style={styles.roleTitle}>Student</Text>
        <Text style={styles.roleDescription}>
          Join as a student to access courses and learning materials
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color="#003096" />
        </View>
      </TouchableOpacity>

      {/* Teacher Card */}
      <TouchableOpacity
        style={[styles.roleCard, styles.teacherCard]}
        onPress={() => navigation.navigate('TeacherSignUp')}
      >
        {/* IMAGE COMMENT: Uncomment below when you add teacher-icon.png */}
        {/* <Image
          source={require('../assets/images/teacher-icon.png')}
          style={styles.roleIcon}
        /> */}
        
        {/* Using icon for now - Remove this when using Image */}
        <MaterialCommunityIcons name="teacher" size={50} color="#2196F3" />
        
        <Text style={styles.roleTitle}>Teacher</Text>
        <Text style={styles.roleDescription}>
          Join as a teacher to create courses and manage students
        </Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="arrow-forward" size={24} color="#003096" />
        </View>
      </TouchableOpacity>

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
          <Text style={styles.signInText}>Sign in Here</Text>
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
    paddingTop: 50,
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
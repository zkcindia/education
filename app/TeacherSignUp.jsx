// app/TeacherSignUp.jsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';

import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { signUpUser } from '../constants/api/apiSignUp';

const { width } = Dimensions.get('window');

export default function TeacherSignUp() {
  const navigation = useNavigation();
  const toast = useToast();

  // Teacher Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [role] = useState('Teacher'); // Fixed for teacher
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // Teacher-specific fields
  const [currentOrganization, setCurrentOrganization] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  // Dropdown states
  const [showQualificationDropdown, setShowQualificationDropdown] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpasswordVisible, setCpasswordVisible] = useState(false);

  const qualifications = [
    'B.Ed',
    'M.Ed',
    'B.Sc',
    'M.Sc',
    'BA',
    'MA',
    'PhD',
    'Diploma in Education',
    'Other',
  ];

  const handleSignup = async () => {
    // Validation
    if (!name.trim()) {
      toast.show('Please enter your name', { type: 'danger' });
      return;
    }
    if (!email.trim()) {
      toast.show('Please enter your email', { type: 'danger' });
      return;
    }
    if (!password) {
      toast.show('Please enter a password', { type: 'danger' });
      return;
    }
    if (password !== cpassword) {
      toast.show('Passwords do not match', { type: 'danger' });
      return;
    }
    if (!qualification) {
      toast.show('Please select your qualification', { type: 'danger' });
      return;
    }
    if (!specialization.trim()) {
      toast.show('Please enter your specialization', { type: 'danger' });
      return;
    }
    if (!currentOrganization.trim()) {
      toast.show('Please enter your organization', { type: 'danger' });
      return;
    }
    if (!yearsOfExperience) {
      toast.show('Please enter years of experience', { type: 'danger' });
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: role, // 'Teacher'
        address: address.trim(),
        referral_code: referralCode.trim() || undefined,

        // Teacher-specific fields
        current_organization: currentOrganization.trim(),
        specialization: specialization.trim(),
        qualification: qualification,
        years_of_experience: parseInt(yearsOfExperience),
        mobile_no: mobileNo.trim(),
      };

      console.log('TEACHER PAYLOAD:', JSON.stringify(payload, null, 2));

      const response = await signUpUser(payload);

      if (response.status === 201 && response.data.status === true) {
        toast.show('Teacher account created successfully!', {
          type: 'success',
          duration: 2000,
        });

        navigation.navigate('signIn');
      }
    } catch (error) {
      console.log('TEACHER SIGNUP ERROR:', error?.response?.data);

      toast.show(
        error?.response?.data?.error || 'An error occurred during signup',
        { type: 'danger', duration: 2500 }
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Teacher Sign Up</Text>
      <Text style={styles.subtitle}>Create your teacher account</Text>

      <View style={styles.formContainer}>
        <InputField
          label="Full Name *"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Email *"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <PasswordField
          label="Password *"
          value={password}
          onChangeText={setPassword}
          visible={passwordVisible}
          onToggleVisibility={() => setPasswordVisible(!passwordVisible)}
        />

        <PasswordField
          label="Confirm Password *"
          value={cpassword}
          onChangeText={setCpassword}
          visible={cpasswordVisible}
          onToggleVisibility={() => setCpasswordVisible(!cpasswordVisible)}
        />

        <InputField
          label="Mobile Number"
          placeholder="Enter mobile number"
          value={mobileNo}
          onChangeText={setMobileNo}
          keyboardType="phone-pad"
        />

        <InputField
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />

        <DropdownField
          label="Qualification *"
          value={qualification}
          placeholder="Select your qualification"
          onPress={() => setShowQualificationDropdown(true)}
        />

        <InputField
          label="Specialization *"
          placeholder="e.g., Mathematics, Science, English"
          value={specialization}
          onChangeText={setSpecialization}
        />

        <InputField
          label="Years of Experience *"
          placeholder="Enter years of teaching experience"
          value={yearsOfExperience}
          onChangeText={setYearsOfExperience}
          keyboardType="numeric"
        />

        <InputField
          label="Current Organization *"
          placeholder="Enter your current school/institution"
          value={currentOrganization}
          onChangeText={setCurrentOrganization}
        />

        <InputField
          label="Referral Code"
          placeholder="Enter referral code (Optional)"
          value={referralCode}
          onChangeText={setReferralCode}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.signUpButtonText}>TEACHER SIGN UP</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <DropdownModal
        visible={showQualificationDropdown}
        onClose={() => setShowQualificationDropdown(false)}
        data={qualifications.map((q, index) => ({ id: index + 1, name: q }))}
        onSelect={(item) => {
          setQualification(item.name);
          setShowQualificationDropdown(false);
        }}
      />
    </ScrollView>
  );
}

// Reusable Components
const InputField = ({ label, placeholder, value, onChangeText, keyboardType = 'default' }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </View>
);

const DropdownField = ({ label, value, placeholder, onPress }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TouchableOpacity style={styles.textInput} onPress={onPress}>
      <Text style={value ? styles.inputText : styles.placeholderText}>
        {value || placeholder}
      </Text>
    </TouchableOpacity>
  </View>
);

const PasswordField = ({ label, value, onChangeText, visible, onToggleVisibility }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Enter password"
        secureTextEntry={!visible}
        onChangeText={onChangeText}
        value={value}
      />
      <TouchableOpacity onPress={onToggleVisibility}>
        <Feather name={visible ? 'eye-off' : 'eye'} size={24} color="black" />
      </TouchableOpacity>
    </View>
  </View>
);

const DropdownModal = ({ visible, onClose, data, onSelect, emptyText = 'No data found', labelKey = 'name' }) => (
  <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.dropdownBox}>
        {data && data.length > 0 ? (
          data.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.dropdownItem}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.dropdownText}>{item[labelKey]}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>{emptyText}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  scrollContent: {
    paddingBottom: 35,
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 23,
    width: '100%',
  },
  title: {
    fontFamily: 'roboto-bold',
    textAlign: 'center',
    fontSize: 25,
    color: '#003096',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'roboto',
    color: '#666',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'roboto-medium',
    marginBottom: 5,
  },
  textInput: {
    width: '100%',
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: 'roboto',
    fontSize: 15,
    borderColor: '#ddd',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  inputText: {
    fontFamily: 'roboto',
    fontSize: 15,
    color: '#000',
  },
  placeholderText: {
    fontFamily: 'roboto',
    fontSize: 15,
    color: '#999',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  passwordInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 10,
    fontFamily: 'roboto',
    fontSize: 15,
  },
  signUpButton: {
    backgroundColor: '#003096',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  signUpButtonText: {
    fontSize: 18,
    fontFamily: 'roboto-bold',
    color: '#fff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  dropdownBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'roboto',
  },
});
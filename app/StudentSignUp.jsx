// app/StudentSignUp.jsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { getBoards, getClassesByBoard } from '../constants/api/apiTeacher';
import { signUpUser } from '../constants/api/apiSignUp';

const { width } = Dimensions.get('window');

export default function StudentSignUp() {
  const navigation = useNavigation();
  const toast = useToast();

  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Student Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [role] = useState('Student'); // Fixed for student
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  
  // Student-specific fields
  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('');
  const [boardId, setBoardId] = useState(null);
  const [className, setClassName] = useState('');
  const [classId, setClassId] = useState(null);
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNo, setMobileNo] = useState('');

  // Dropdown states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpasswordVisible, setCpasswordVisible] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoadingBoards(true);
      const response = await getBoards();
      if (response.data?.status === true) {
        setBoards(response.data.data || []);
      }
    } catch (error) {
      toast.show('Unable to load boards', { type: 'danger', duration: 2000 });
    } finally {
      setLoadingBoards(false);
    }
  };

  const loadClassesByBoard = async (boardName) => {
    try {
      setLoadingClasses(true);
      const response = await getClassesByBoard(boardName);
      if (response.data?.status === true) {
        setClasses(response.data.data || []);
      }
    } catch (error) {
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDob(formatDate(selectedDate));
    }
  };

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
    if (!schoolName.trim()) {
      toast.show('Please enter school name', { type: 'danger' });
      return;
    }
    if (!boardId) {
      toast.show('Please select board', { type: 'danger' });
      return;
    }
    if (!classId) {
      toast.show('Please select class', { type: 'danger' });
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: role, // 'Student'
        address: address.trim(),
        referral_code: referralCode.trim() || undefined,
        
        // Student-specific fields
        school_name: schoolName.trim(),
        board_id: boardId,
        class_id: classId,
        mobile_no: mobileNo.trim(),
        dob: dob,
        gender: gender,
      };

      console.log('STUDENT PAYLOAD:', JSON.stringify(payload, null, 2));

      const response = await signUpUser(payload);

      if (response.status === 201 && response.data.status === true) {
        toast.show('Student account created successfully!', {
          type: 'success',
          duration: 2000,
        });
        
        // Navigate to Sign In
        navigation.navigate('signIn');
      }
    } catch (error) {
      console.log('STUDENT SIGNUP ERROR:', error?.response?.data);
      
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

      <Text style={styles.title}>Student Sign Up</Text>
      <Text style={styles.subtitle}>Create your student account</Text>

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
          label="School Name *"
          placeholder="Enter school name"
          value={schoolName}
          onChangeText={setSchoolName}
        />

        <DropdownField
          label="Board *"
          value={board}
          placeholder={loadingBoards ? 'Loading Boards...' : 'Select Board'}
          onPress={() => {
            if (!loadingBoards) setShowBoardDropdown(true);
          }}
        />

        <DropdownField
          label="Class *"
          value={className}
          placeholder={
            !boardId
              ? 'Select Board First'
              : loadingClasses
              ? 'Loading Classes...'
              : 'Select Class'
          }
          onPress={() => {
            if (!boardId) {
              toast.show('Please select board first', { type: 'danger' });
              return;
            }
            setShowClassDropdown(true);
          }}
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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date of Birth *</Text>
          <TouchableOpacity
            style={styles.textInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={dob ? styles.inputText : styles.placeholderText}>
              {dob || 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <DropdownField
          label="Gender *"
          value={gender}
          placeholder="Select Gender"
          onPress={() => setShowGenderDropdown(true)}
        />

        <InputField
          label="Referral Code"
          placeholder="Enter referral code (Optional)"
          value={referralCode}
          onChangeText={setReferralCode}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.signUpButtonText}>STUDENT SIGN UP</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <DropdownModal
        visible={showGenderDropdown}
        onClose={() => setShowGenderDropdown(false)}
        data={[
          { id: 1, name: 'Male' },
          { id: 2, name: 'Female' },
          { id: 3, name: 'Other' },
        ]}
        onSelect={(item) => {
          setGender(item.name);
          setShowGenderDropdown(false);
        }}
      />

      <DropdownModal
        visible={showBoardDropdown}
        onClose={() => setShowBoardDropdown(false)}
        data={boards}
        emptyText="No boards found"
        labelKey="board_name"
        onSelect={(item) => {
          setBoard(item.board_name);
          setBoardId(item.id);
          setClassName('');
          setClassId(null);
          setClasses([]);
          loadClassesByBoard(item.board_name);
          setShowBoardDropdown(false);
        }}
      />

      <DropdownModal
        visible={showClassDropdown}
        onClose={() => setShowClassDropdown(false)}
        data={classes}
        emptyText="No classes found"
        labelKey="name"
        onSelect={(item) => {
          setClassName(item.name);
          setClassId(item.id);
          setShowClassDropdown(false);
        }}
      />
    </ScrollView>
  );
}

// Reusable Components (same as before)
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
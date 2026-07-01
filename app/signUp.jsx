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
import { getBoards , getClassesByBoard} from '../constants/api/apiTeacher';
import { signUpUser } from '../constants/api/apiSignUp';

const { width } = Dimensions.get('window');

const CLASSES = [
  { id: 1, name: 'Std 6' },
  { id: 2, name: 'Std 7' },
  { id: 3, name: 'Std 8' },
  { id: 4, name: 'Std 9' },
  { id: 5, name: 'Std 10' },
];

export default function SignUp() {
  const navigation = useNavigation();
  const toast = useToast();

  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);

  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [board, setBoard] = useState('');
  const [boardId, setBoardId] = useState(null);
  const [className, setClassName] = useState('');
  const [classId, setClassId] = useState(null);
  const [address, setAddress] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpasswordVisible, setCpasswordVisible] = useState(false);

  const [classes, setClasses] = useState([]);
const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

const loadBoards = async () => {
  try {
    setLoadingBoards(true);

    const response = await getBoards();

    console.log('BOARDS FULL RESPONSE:', response.data);

    if (response.data?.status === true) {
      setBoards(response.data.data || []);
    } else {
      setBoards([]);
    }
  } catch (error) {
    console.log('LOAD BOARDS ERROR:', error?.response?.data || error.message);

    toast.show('Unable to load boards', {
      type: 'danger',
      duration: 2000,
    });
  } finally {
    setLoadingBoards(false);
  }
};

const loadClassesByBoard = async boardName => {
  try {
    setLoadingClasses(true);

    const response = await getClassesByBoard(boardName);

    console.log('CLASSES FULL RESPONSE:', response.data);

    if (response.data?.status === true) {
      setClasses(response.data.data || []);
      console.log('CLASSES SET:', response.data.data);
    } else {
      setClasses([]);
    }
  } catch (error) {
    console.log('LOAD CLASSES ERROR:', error?.response?.data || error.message);
    setClasses([]);
  } finally {
    setLoadingClasses(false);
  }
};

  const formatDate = date => {
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
    if (!name.trim()) {
      toast.show('Please enter your name', { type: 'danger', duration: 2000 });
      return;
    }

    if (!email.trim()) {
      toast.show('Please enter your email', { type: 'danger', duration: 2000 });
      return;
    }

    if (!password) {
      toast.show('Please enter a password', { type: 'danger', duration: 2000 });
      return;
    }

    if (password !== cpassword) {
      toast.show('Passwords do not match', { type: 'danger', duration: 2000 });
      return;
    }

    if (!boardId) {
      toast.show('Please select board', { type: 'danger', duration: 2000 });
      return;
    }

    if (!classId) {
      toast.show('Please select class', { type: 'danger', duration: 2000 });
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        school_name: school.trim(),
        address: address.trim(),
        mobile_no: mobileNo.trim(),
        dob,
        gender,
        password,
        board_id: boardId,
        class_id: classId,
      };

      if (referralCode.trim()) {
        payload.referral_code = referralCode.trim();
      }

      console.log('==============================');
      console.log('SIGNUP SELECTED BOARD:', board);
      console.log('SIGNUP SELECTED BOARD ID:', boardId);
      console.log('SIGNUP SELECTED CLASS:', className);
      console.log('SIGNUP SELECTED CLASS ID:', classId);
      console.log('SIGNUP FINAL PAYLOAD:', JSON.stringify(payload, null, 2));
      console.log('==============================');

      const response = await signUpUser(payload);

      if (response.status === 201) {
        toast.show('User created successfully', {
          type: 'success',
          duration: 2000,
        });

        navigation.navigate('signIn');
      }
    } catch (error) {
      console.log('SIGNUP ERROR STATUS:', error?.response?.status);
      console.log('SIGNUP ERROR DATA:', error?.response?.data);
      console.log('SIGNUP ERROR MESSAGE:', error.message);

      toast.show(error?.response?.data?.error || 'An error occurred', {
        type: 'danger',
        duration: 2500,
      });
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

      <Text style={styles.title}>Sign Up</Text>

      <Text style={styles.subtitle}>
        Create an account to begin your Learning Journey
      </Text>

      <View style={styles.formContainer}>
        <InputField
          label="Full Name"
          placeholder="Your Name Here"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="School Name"
          placeholder="Your School Name Here"
          value={school}
          onChangeText={setSchool}
        />

        <DropdownField
          label="Board"
          value={board}
          placeholder={loadingBoards ? 'Loading Boards...' : 'Select Board'}
          onPress={() => {
            if (!loadingBoards) {
              setShowBoardDropdown(true);
            }
          }}
        />

<DropdownField
  label="Class"
  value={className}
  placeholder={
    !boardId
      ? 'Select Board First'
      : loadingClasses
      ? 'Loading Classes...'
      : 'Select Class'
  }
  onPress={() => {
    console.log('CLASS DROPDOWN DATA:', classes);

    if (!boardId) {
      toast.show('Please select board first', {
        type: 'danger',
        duration: 2000,
      });
      return;
    }

    setShowClassDropdown(true);
  }}
/>

        <InputField
          label="Address"
          placeholder="Your Address Here"
          value={address}
          onChangeText={setAddress}
        />

        <InputField
          label="Mobile No"
          placeholder="Your Mobile Number Here"
          value={mobileNo}
          onChangeText={setMobileNo}
          keyboardType="phone-pad"
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>DOB</Text>

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
          label="Gender"
          value={gender}
          placeholder="Select Gender"
          onPress={() => setShowGenderDropdown(true)}
        />

        <InputField
          label="Email"
          placeholder="Your Email Here"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          visible={passwordVisible}
          onToggleVisibility={() => setPasswordVisible(!passwordVisible)}
        />

        <PasswordField
          label="Confirm Password"
          value={cpassword}
          onChangeText={setCpassword}
          visible={cpasswordVisible}
          onToggleVisibility={() => setCpasswordVisible(!cpasswordVisible)}
        />

        <InputField
          label="Referral Code"
          placeholder="Enter Referral Code (Optional)"
          value={referralCode}
          onChangeText={setReferralCode}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or Sign Up with</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require('../assets/images/facebook.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Sign Up with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
        <Image
          source={require('../assets/images/search.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.googleText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>Already have an account?</Text>

        <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
          <Text style={styles.signInText}>Sign in Here</Text>
        </TouchableOpacity>
      </View>

<DropdownModal
  visible={showBoardDropdown}
  onClose={() => setShowBoardDropdown(false)}
  data={boards}
  emptyText="No boards found"
  labelKey="board_name"
  onSelect={item => {
    setBoard(item.board_name);
    setBoardId(item.id);

    setClassName('');
    setClassId(null);
    setClasses([]);

    console.log('BOARD SELECTED:', item);

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
  onSelect={item => {
    setClassName(item.name);
    setClassId(item.id);

    console.log('CLASS SELECTED:', item);

    setShowClassDropdown(false);
  }}
/>

  visible={showClassDropdown}

      <DropdownModal
        visible={showGenderDropdown}
        onClose={() => setShowGenderDropdown(false)}
        data={[
          { id: 1, name: 'Male' },
          { id: 2, name: 'Female' },
        ]}
        emptyText="No gender found"
        onSelect={item => {
          setGender(item.name);
          setShowGenderDropdown(false);
        }}
      />
    </ScrollView>
  );
}

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}) => (
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

const PasswordField = ({
  label,
  value,
  onChangeText,
  visible,
  onToggleVisibility,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>

    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="*****************"
        secureTextEntry={!visible}
        onChangeText={onChangeText}
        value={value}
      />

      <TouchableOpacity onPress={onToggleVisibility}>
        <Feather
          name={visible ? 'eye-off' : 'eye'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  </View>
);

const DropdownModal = ({
  visible,
  onClose,
  data,
  onSelect,
  emptyText = 'No data found',
  labelKey = 'name',
}) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.dropdownBox}>
        {data && data.length > 0 ? (
          data.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.dropdownItem}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.dropdownText}>
                {item[labelKey]}
              </Text>
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
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'roboto',
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
  },

  textInput: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: 'roboto',
    fontSize: 15,
    borderColor: '#ccc',
    justifyContent: 'center',
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
    borderColor: '#ccc',
    borderRadius: 5,
  },

  passwordInput: {
    flex: 1,
    height: 40,
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

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },

  dividerText: {
    textAlign: 'center',
    marginHorizontal: 10,
  },

  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#1869f5',
  },

  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },

  socialIcon: {
    width: 25,
    height: 25,
  },

  socialText: {
    fontFamily: 'roboto',
    color: '#fff',
    marginLeft: 10,
  },

  googleText: {
    color: '#000',
  },

  footerTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  footerText: {
    fontFamily: 'roboto',
  },

  signInText: {
    color: '#003096',
    fontFamily: 'roboto-bold',
    marginLeft: 5,
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
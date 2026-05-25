import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

import React, { useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';

import { useToast } from 'react-native-toast-notifications';

import { signUpUser } from '../constants/api/apiSignUp';

const { width } = Dimensions.get('window');

export default function SignUp() {

  const navigation = useNavigation();

  const toast = useToast();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [cpassword, setCpassword] = useState('');

  // NEW REFERRAL STATE
  const [referralCode, setReferralCode] = useState('');

  const [passwordVisible, setPasswordVisible] =
    useState(false);

  const [cpasswordVisible, setCpasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () =>
    setPasswordVisible(!passwordVisible);

  const toggleCPasswordVisibility = () =>
    setCpasswordVisible(!cpasswordVisible);

  const handleSignup = async () => {

    if (!name) {
      toast.show('Please enter your name', {
        type: 'danger',
        duration: 2000,
      });
      return;
    }

    if (!email) {
      toast.show('Please enter your email', {
        type: 'danger',
        duration: 2000,
      });
      return;
    }

    if (!password) {
      toast.show('Please enter a password', {
        type: 'danger',
        duration: 2000,
      });
      return;
    }

    if (password !== cpassword) {
      toast.show('Passwords do not match', {
        type: 'danger',
        duration: 2000,
      });
      return;
    }

    try {

      const response = await signUpUser({
        name,
        email,
        password,

        // NEW REFERRAL CODE
        referral_code: referralCode,
      });

      if (response.status === 201) {

        toast.show(
          'User created successfully',
          {
            type: 'success',
            duration: 2000,
          }
        );

        navigation.navigate('signIn');
      }

    } catch (error) {

      console.log(
        'SIGNUP ERROR:',
        error?.response?.data || error.message
      );

      toast.show('An error occurred', {
        type: 'danger',
        duration: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
          />
        </TouchableOpacity>

      </View>

      <Text style={styles.title}>
        Sign Up
      </Text>

      <Text style={styles.subtitle}>
        Create an account to begin your
        Learning Journey
      </Text>

      <View style={styles.formContainer}>

        <InputField
          label="Full Name"
          placeholder="Your Name Here"
          onChangeText={setName}
        />

        <InputField
          label="Email"
          placeholder="Your Email Here"
          onChangeText={setEmail}
        />

        <PasswordField
          label="Password"
          value={password}
          onChangeText={setPassword}
          visible={passwordVisible}
          onToggleVisibility={
            togglePasswordVisibility
          }
        />

        <PasswordField
          label="Confirm Password"
          value={cpassword}
          onChangeText={setCpassword}
          visible={cpasswordVisible}
          onToggleVisibility={
            toggleCPasswordVisibility
          }
        />

        {/* REFERRAL INPUT */}
        <InputField
          label="Referral Code"
          placeholder="Enter Referral Code (Optional)"
          onChangeText={setReferralCode}
        />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignup}
        >
          <Text style={styles.signUpButtonText}>
            SIGN UP
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.divider}>

        <View style={styles.line} />

        <Text style={styles.dividerText}>
          Or Sign Up with
        </Text>

        <View style={styles.line} />

      </View>

      <TouchableOpacity style={styles.socialButton}>

        <Image
          source={require('../assets/images/facebook.png')}
          style={styles.socialIcon}
        />

        <Text style={styles.socialText}>
          Sign Up with Facebook
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.socialButton,
          styles.googleButton,
        ]}
      >

        <Image
          source={require('../assets/images/search.png')}
          style={styles.socialIcon}
        />

        <Text style={styles.googleText}>
          Sign Up with Google
        </Text>

      </TouchableOpacity>

      <View style={styles.footerTextContainer}>

        <Text style={styles.footerText}>
          Already have an account?
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('signIn')
          }
        >
          <Text style={styles.signInText}>
            Sign in Here
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const InputField = ({
  label,
  placeholder,
  onChangeText,
}) => (
  <View style={styles.inputContainer}>

    <Text style={styles.inputLabel}>
      {label}
    </Text>

    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      onChangeText={onChangeText}
    />

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

    <Text style={styles.inputLabel}>
      {label}
    </Text>

    <View style={styles.passwordContainer}>

      <TextInput
        style={styles.passwordInput}
        placeholder="*****************"
        secureTextEntry={!visible}
        onChangeText={onChangeText}
        value={value}
      />

      <TouchableOpacity
        onPress={onToggleVisibility}
      >
        <Feather
          name={visible ? 'eye-off' : 'eye'}
          size={24}
          color="black"
        />
      </TouchableOpacity>

    </View>

  </View>
);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
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

});
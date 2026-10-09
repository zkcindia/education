// app/(associate)/state-associate-signup.jsx
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

import { useRouter } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import { signUpUser } from '../../constants/api/apiAssociate';

const { width } = Dimensions.get('window');

export default function AssociateSignUp() {
  const router = useRouter();
  const toast = useToast();

  // Basic fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');           // ✅ API field name: mobile
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  // Associate specific (District Head)
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Dropdown states
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpasswordVisible, setCpasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ─────────── Odisha districts (30) ───────────
  const districts = [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak',
    'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati',
    'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput',
    'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada',
    'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh',
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
    if (!mobile.trim()) {
      toast.show('Please enter your mobile number', { type: 'danger' });
      return;
    }
    if (!district) {
      toast.show('Please select your district', { type: 'danger' });
      return;
    }
    if (!city.trim()) {
      toast.show('Please enter your city', { type: 'danger' });
      return;
    }

    try {
      setLoading(true);

      // ✅ API payload — exactly backend ke hisaab se
      const payload = {
        name: name.trim(),
        address: address.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password: password,
        district: district,
        city: city.trim(),
        pincode: pincode.trim(),
      };

      console.log('ASSOCIATE PAYLOAD:', JSON.stringify(payload, null, 2));

      const response = await signUpUser(payload);

      console.log('ASSOCIATE RESPONSE:', response?.data);

      if (response.status === 201 && response.data.status === true) {
        toast.show(
          response.data.message || 'Associate account created successfully!',
          { type: 'success', duration: 2500 }
        );

        router.replace('/signIn');
      } else {
        toast.show('Unexpected response from server', { type: 'danger' });
      }
    } catch (error) {
      console.log('ASSOCIATE SIGNUP ERROR:', error?.response?.data || error);

      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        'An error occurred during signup';

      toast.show(errorMsg, { type: 'danger', duration: 2500 });
    } finally {
      setLoading(false);
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Associate Sign Up</Text>
      <Text style={styles.subtitle}>
        Manage executives across your district and earn higher commissions
      </Text>

      <View style={styles.formContainer}>
        <InputField
          label="Full Name *"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Address"
          placeholder="Enter your full address"
          value={address}
          onChangeText={setAddress}
        />

        <InputField
          label="Email *"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <InputField
          label="Mobile Number *"
          placeholder="Enter mobile number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        <DropdownField
          label="District *"
          value={district}
          placeholder="Select your district"
          onPress={() => setShowDistrictDropdown(true)}
        />

        <InputField
          label="City *"
          placeholder="Enter your city"
          value={city}
          onChangeText={setCity}
        />

        <InputField
          label="Pincode"
          placeholder="Enter pincode"
          value={pincode}
          onChangeText={setPincode}
          keyboardType="numeric"
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

        <TouchableOpacity
          style={[styles.signUpButton, loading && { opacity: 0.6 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'CREATING ACCOUNT...' : 'ASSOCIATE SIGN UP'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* District Dropdown Modal */}
      <DropdownModal
        visible={showDistrictDropdown}
        onClose={() => setShowDistrictDropdown(false)}
        data={districts.map((d, index) => ({ id: index + 1, name: d }))}
        onSelect={(item) => {
          setDistrict(item.name);
          setShowDistrictDropdown(false);
        }}
      />
    </ScrollView>
  );
}

/* ─────────── Reusable Components ─────────── */

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
        <ScrollView style={{ maxHeight: 350 }}>
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
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);

/* ─────────── Styles ─────────── */

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
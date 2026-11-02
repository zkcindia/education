// app/(associate)/(tabs2)/home/index.jsx
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

// ✅ APIs
import {
  getDealerReferrers,
  addStudentByReferrer, 
} from "../../../../constants/api/apiAssociate";
import { getBoards, getClassesByBoard } from "../../../../constants/api/apiTeacher";

const { width, height } = Dimensions.get("window");

export default function AssociateHome() {
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // 🔥 ADD STUDENT STATES & FORM (Exact fields order)
  // ==========================================
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fields (Exactly as SignUp)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [board, setBoard] = useState('');
  const [boardId, setBoardId] = useState(null);
  const [className, setClassName] = useState('');
  const [classId, setClassId] = useState(null);
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  
  // Dropdown & Picker UI States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpasswordVisible, setCpasswordVisible] = useState(false);

  // ==========================================
  // HOME DATA LOAD
  // ==========================================
  const loadData = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) return;

      const parsedUser = JSON.parse(userDataString);
      setUser(parsedUser);

      const role = (parsedUser?.role || "").toLowerCase();
      const isDealer = role === "dealer" || role === "district";

      if (isDealer) {
        const targetId = parsedUser?.id || parsedUser?.dealer_id;
        if (targetId) {
          try {
            const res = await getDealerReferrers(targetId);
            if (res?.status === true && res?.data) {
              setTeamMembers(res.data);
            }
          } catch (err) {
            console.log("Referrers API failed (safe to ignore)");
          }
        }
      }
    } catch (error) {
      console.log("loadData error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(false);
  }, []);

  const isDealer = user?.role?.toLowerCase() === "dealer" || user?.role?.toLowerCase() === "district";
  const activeMembers = teamMembers.filter((m) => (m.status || "").toLowerCase() === "active").length;
  const myReferralCode = user?.referral_code || user?.dealer_code || "N/A";
  const roleLabel = isDealer ? "👑 District Head" : "🏆 Executive";

  // ==========================================
  // 🔥 ADD STUDENT API LOGIC
  // ==========================================
  const loadBoards = async () => {
    try {
      setLoadingBoards(true);
      const response = await getBoards();
      if (response.data?.status === true) setBoards(response.data.data || []);
      else setBoards([]);
    } catch (error) {
      console.log('Board load error', error.message);
      Alert.alert('Connection Error', 'Unable to fetch boards. Backend down?');
      setBoards([]);
    } finally {
      setLoadingBoards(false);
    }
  };

  const loadClassesByBoard = async (boardName) => {
    try {
      setLoadingClasses(true);
      const response = await getClassesByBoard(boardName);
      if (response.data?.status === true) setClasses(response.data.data || []);
      else setClasses([]);
    } catch (error) {
      console.log('Class load error', error.message);
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
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDob(formatDate(selectedDate));
  };

  const handleAddStudent = async () => {
    if (!name.trim()) return Alert.alert("Error", "Please enter name");
    if (!email.trim()) return Alert.alert("Error", "Please enter email");
    if (!password) return Alert.alert("Error", "Please enter password");
    if (password !== cpassword) return Alert.alert("Error", "Passwords do not match");
    if (!schoolName.trim()) return Alert.alert("Error", "Please enter school name");
    if (!boardId) return Alert.alert("Error", "Please select board");
    if (!classId) return Alert.alert("Error", "Please select class");

    try {
      setIsSubmitting(true);
      
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: "Student",
        address: address.trim(),
        referral_code: myReferralCode,
        school_name: schoolName.trim(),
        board_id: boardId,
        class_id: classId,
        mobile_no: mobileNo.trim(),
        dob: dob,
        gender: gender,
      };

      console.log("ADD STUDENT PAYLOAD:", payload);
      const res = await addStudentByReferrer(payload);

      if (res?.status === true || res?.status === 201 || res?.id) {
        Alert.alert("Success", "Student added successfully!");
        setShowAddModal(false);
        resetForm();
        loadData(false); 
      } else {
        Alert.alert("Error", res?.message || res?.error || "Failed to add student");
      }
    } catch (error) {
      console.log("Add Student Error:", error?.response?.data || error.message);
      Alert.alert("Error", error?.response?.data?.error || error?.response?.data?.detail || "Network Error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setCpassword('');
    setAddress(''); setSchoolName(''); setBoard(''); setBoardId(null);
    setClassName(''); setClassId(null); setDob(''); setGender(''); setMobileNo('');
    setPasswordVisible(false); setCpasswordVisible(false);
  };

  const openAddModal = () => {
    resetForm();
    if (boards.length === 0) loadBoards();
    setShowAddModal(true);
  };

  // ==========================================
  // UI RENDER
  // ==========================================
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loaderText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4F46E5"]} tintColor="#4F46E5" />
        }
      >
        {/* HEADER */}
        <LinearGradient colors={["#4F46E5", "#7C3AED"]} style={styles.headerGradient}>
          <View style={styles.topContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>{(user?.name || "A").charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.middleContainer}>
              <Text style={styles.userNameText} numberOfLines={1}>{user?.name || "Associate"}</Text>
              <TouchableOpacity style={styles.premiumButton} onPress={() => router.push("/(associate)/(tabs2)/profile")}>
                <Text style={styles.premiumButtonText}>{roleLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* MY DETAILS */}
        <View style={styles.myDetailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.myDetailsTitle}>My Details</Text>
            <View style={[styles.statusPill, { backgroundColor: (user?.status || "").toLowerCase() === "active" ? "#DCFCE7" : "#FEE2E2" }]}>
              <Text style={[styles.statusPillText, { color: (user?.status || "").toLowerCase() === "active" ? "#166534" : "#991B1B" }]}>{user?.status || "—"}</Text>
            </View>
          </View>
          <DetailRow icon="person-outline" label="Name" value={user?.name} />
          <DetailRow icon="mail-outline" label="Email" value={user?.email} />
          <DetailRow icon="call-outline" label="Mobile" value={user?.mobile} />
          <DetailRow icon="location-outline" label="District" value={user?.district} />
          <DetailRow icon="business-outline" label="City" value={user?.city} />
          <DetailRow icon="navigate-outline" label="Pincode" value={user?.pincode} />
          <DetailRow icon="key-outline" label="Referral Code" value={myReferralCode} highlight="#10B981" />
        </View>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: "#EEF2FF" }]}><MaterialCommunityIcons name="account-group" size={24} color="#4F46E5" /></View>
            <View><Text style={styles.statText}>{teamMembers.length}</Text><Text style={styles.statLabel}>Total Referrals</Text></View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, { backgroundColor: "#DCFCE7" }]}><MaterialCommunityIcons name="account-check" size={24} color="#10B981" /></View>
            <View><Text style={styles.statText}>{activeMembers}</Text><Text style={styles.statLabel}>Active Now</Text></View>
          </View>
        </View>

        {/* ADD STUDENT BUTTON */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableHeaderRow}><Text style={styles.tableHeading}>Quick Actions</Text></View>
          <TouchableOpacity style={styles.addStudentBtn} onPress={openAddModal} activeOpacity={0.8}>
            <View style={styles.addStudentIconBg}><Feather name="user-plus" size={24} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addStudentBtnText}>Add New Student</Text>
              <Text style={styles.addStudentSubText}>Register a student using your referral</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ==========================================
          🔥 ADD STUDENT MODAL (EXACT ORDER & THEME)
      ========================================== */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Student Sign Up</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
              
              {/* 🔥 EXACT ORDER FROM SIGNUP FORM */}
              
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
                onPress={() => !loadingBoards && setShowBoardDropdown(true)}
              />

              <DropdownField
                label="Class *"
                value={className}
                placeholder={!boardId ? 'Select Board First' : loadingClasses ? 'Loading...' : 'Select Class'}
                onPress={() => {
                  if (!boardId) return Alert.alert("Error", "Please select board first");
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
                <TouchableOpacity style={styles.textInput} onPress={() => setShowDatePicker(true)}>
                  <Text style={dob ? styles.inputText : styles.placeholderText}>{dob || 'Select Date of Birth'}</Text>
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()} />
              )}

              <DropdownField
                label="Gender *"
                value={gender}
                placeholder="Select Gender"
                onPress={() => setShowGenderDropdown(true)}
              />

              <InputField 
                label="Referral Code" 
                placeholder="Auto-filled" 
                value={myReferralCode} 
                editable={false} 
                style={{ backgroundColor: '#f0f0f0' }} 
              />

            </ScrollView>

            <TouchableOpacity 
              style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
              onPress={handleAddStudent}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>STUDENT SIGN UP</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔥 DROPDOWNS */}
      <DropdownModal
        visible={showGenderDropdown}
        onClose={() => setShowGenderDropdown(false)}
        data={[{ id: 1, name: 'Male' }, { id: 2, name: 'Female' }, { id: 3, name: 'Other' }]}
        onSelect={(item) => { setGender(item.name); setShowGenderDropdown(false); }}
      />
      <DropdownModal
        visible={showBoardDropdown}
        onClose={() => setShowBoardDropdown(false)}
        data={boards}
        emptyText="No boards found"
        labelKey="board_name"
        onSelect={(item) => {
          setBoard(item.board_name); setBoardId(item.id);
          setClassName(''); setClassId(null); setClasses([]);
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
        onSelect={(item) => { setClassName(item.name); setClassId(item.id); setShowClassDropdown(false); }}
      />
    </SafeAreaView>
  );
}

/* ==========================================
   REUSABLE COMPONENTS (EXACT SIGNUP THEME)
========================================== */

const DetailRow = ({ icon, label, value, highlight }) => (
  <View style={styles.myDetailsRow}>
    <Ionicons name={icon} size={16} color="#4F46E5" />
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={[styles.myDetailsText, highlight ? { fontWeight: "bold", color: highlight } : null]} numberOfLines={1}>
      {value || "—"}
    </Text>
  </View>
);

const InputField = ({ label, placeholder, value, onChangeText, keyboardType = "default", editable = true, style }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.textInput, style]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
    />
  </View>
);

const PasswordField = ({ label, value, onChangeText, visible, onToggleVisibility }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordInput}
        placeholder="Enter password"
        placeholderTextColor="#999"
        secureTextEntry={!visible}
        onChangeText={onChangeText}
        value={value}
      />
      <TouchableOpacity onPress={onToggleVisibility} style={{ paddingRight: 10 }}>
        <Feather name={visible ? 'eye-off' : 'eye'} size={22} color="black" />
      </TouchableOpacity>
    </View>
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

const DropdownModal = ({ visible, onClose, data, onSelect, emptyText = 'No data found', labelKey = 'name' }) => (
  <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.dropdownBox}>
        {data && data.length > 0 ? (
          data.map((item) => (
            <TouchableOpacity key={item.id} style={styles.dropdownItem} onPress={() => onSelect(item)}>
              <Text style={styles.dropdownItemText}>{item[labelKey]}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.dropdownItem}><Text style={styles.dropdownItemText}>{emptyText}</Text></View>
        )}
      </View>
    </TouchableOpacity>
  </Modal>
);

/* ==========================================
   STYLES (Matching SignUp exact colors)
========================================== */
const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" },
  loaderText: { marginTop: 10, fontFamily: "roboto", fontSize: 13, color: "#64748B" },
  
  headerGradient: { paddingTop: height * 0.05, paddingBottom: 60, paddingHorizontal: width * 0.05, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  topContainer: { flexDirection: "row", alignItems: "center" },
  profileImage: { width: width * 0.15, height: width * 0.15, borderRadius: width * 0.075, borderWidth: 2, borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  profileImageText: { fontFamily: "roboto-bold", fontSize: width * 0.06, color: "#fff" },
  middleContainer: { flex: 1, marginLeft: width * 0.04, justifyContent: "center" },
  userNameText: { fontFamily: "roboto-bold", fontSize: width * 0.048, color: "#fff" },
  premiumButton: { backgroundColor: "rgba(255,255,255,0.22)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: "flex-start", marginTop: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.35)" },
  premiumButtonText: { color: "#fff", fontSize: 11, fontFamily: "roboto-bold" },

  myDetailsCard: { backgroundColor: "#fff", marginHorizontal: width * 0.05, marginTop: -30, padding: 16, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: "#F1F5F9" },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  myDetailsTitle: { fontFamily: "roboto-bold", fontSize: 15, color: "#1E293B" },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusPillText: { fontFamily: "roboto-bold", fontSize: 10, textTransform: "capitalize" },
  myDetailsRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 7 },
  detailLabel: { fontFamily: "roboto-medium", fontSize: 12, color: "#94A3B8", width: 90 },
  myDetailsText: { flex: 1, fontFamily: "roboto", fontSize: 13, color: "#334155" },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: width * 0.05, marginTop: 16, gap: 12 },
  statCard: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 14, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  statIconWrapper: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 10 },
  statText: { fontFamily: "roboto-bold", fontSize: width * 0.05, color: "#1E3A8A" },
  statLabel: { fontFamily: "roboto", fontSize: 11, color: "#6B7280", marginTop: 1 },

  tableWrapper: { marginTop: 24 },
  tableHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: width * 0.05, marginBottom: 10 },
  tableHeading: { fontFamily: "roboto-bold", fontSize: 16, color: "#1E293B" },

  addStudentBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5', marginHorizontal: width * 0.05, padding: 16, borderRadius: 16, shadowColor: '#4F46E5', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  addStudentIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  addStudentBtnText: { color: '#fff', fontFamily: 'roboto-bold', fontSize: 16 },
  addStudentSubText: { color: 'rgba(255,255,255,0.8)', fontFamily: 'roboto', fontSize: 12, marginTop: 2 },

  // 🔥 MODAL & FORM STYLES (EXACT SIGNUP THEME)
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: width * 0.05, paddingTop: 20, paddingBottom: 30, height: '92%' },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 22, fontFamily: "roboto-bold", color: "#003096", textAlign: 'center', flex: 1, marginLeft: 20 },
  
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontFamily: "roboto-medium", marginBottom: 5, color: '#333' },
  textInput: { width: "100%", height: 45, borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, fontFamily: "roboto", fontSize: 15, borderColor: '#ddd', backgroundColor: '#f9f9f9', justifyContent: 'center' },
  inputText: { fontFamily: "roboto", fontSize: 15, color: "#000" },
  placeholderText: { fontFamily: "roboto", fontSize: 15, color: "#999" },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#f9f9f9" },
  passwordInput: { flex: 1, height: 45, paddingHorizontal: 10, fontFamily: "roboto", fontSize: 15 },
  
  submitBtn: { backgroundColor: "#003096", paddingVertical: 15, borderRadius: 10, marginTop: 10 },
  submitBtnText: { fontSize: 18, fontFamily: "roboto-bold", color: "#fff", textAlign: "center" },

  dropdownOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', paddingHorizontal: 30 },
  dropdownBox: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 10, maxHeight: 300 },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  dropdownItemText: { fontSize: 16, fontFamily: 'roboto', color: '#333' },
});
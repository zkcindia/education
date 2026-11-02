// app/(associate)/(tabs)/home/index.jsx
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
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// ✅ Table aur Edit/Delete APIs
import {
  getDealerReferrers,
  updateReferrer,
  deleteReferrer,
} from "../../../../constants/api/apiAssociate";

const { width, height } = Dimensions.get("window");

export default function AssociateHome() {
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    mobile: "",
    district: "",
    city: "",
    pincode: "",
  });

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const targetId = parsedUser?.dealer_id || parsedUser?.id;
        if (targetId) {
          const res = await getDealerReferrers(targetId);
          if (res && res.status === true && res.data) {
            setTeamMembers(res.data);
          }
        }
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const isDealer =
    user?.role?.toLowerCase() === "dealer" ||
    user?.role?.toLowerCase() === "district";
  const activeMembers = teamMembers.filter((m) => m.status === "Active").length;
  const myReferralCode = user?.dealer_code || "N/A";

  // Edit Handlers
  const handleEditPress = (member) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name || "",
      email: member.email || "",
      mobile: member.mobile || "",
      district: member.district || "",
      city: member.city || "",
      pincode: member.pincode || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedMember?.id) return;
      const res = await updateReferrer(selectedMember.id, editForm);
      if (res && res.status === true) {
        Alert.alert("Success", "Details updated!");
        setShowEditModal(false);
        loadData();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update");
    }
  };

  // Delete Handler
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Member",
      "Are you sure you want to delete this member?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await deleteReferrer(id);
              if (res && res.status === true) {
                Alert.alert("Success", "Member deleted successfully");
                loadData();
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete member");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          style={styles.headerGradient}
        >
          <View style={styles.topContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>
                {(user?.name || "A").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.middleContainer}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {user?.name || "Associate"}
              </Text>
              <TouchableOpacity
                style={styles.premiumButton}
                onPress={() => router.push("/(associate)/(tabs)/profile")}
              >
                <Text style={styles.premiumButtonText}>
                  {isDealer ? "👑 District Head" : "🏆 Executive"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* KHUD KA DETAILS CARD */}
        <View style={styles.myDetailsCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={styles.myDetailsTitle}>My Details</Text>
          </View>
          <View style={styles.myDetailsRow}>
            <Ionicons name="person-outline" size={16} color="#4F46E5" />
            <Text style={styles.myDetailsText}>{user?.name || "—"}</Text>
          </View>
          <View style={styles.myDetailsRow}>
            <Ionicons name="mail-outline" size={16} color="#4F46E5" />
            <Text style={styles.myDetailsText}>{user?.email || "—"}</Text>
          </View>
          <View style={styles.myDetailsRow}>
            <Ionicons name="key-outline" size={16} color="#10B981" />
            <Text style={styles.myDetailsText}>
              Referral Code:{" "}
              <Text style={{ fontWeight: "bold", color: "#10B981" }}>
                {myReferralCode}
              </Text>
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View
              style={[styles.statIconWrapper, { backgroundColor: "#EEF2FF" }]}
            >
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#4F46E5"
              />
            </View>
            <View>
              <Text style={styles.statText}>{teamMembers.length}</Text>
              <Text style={styles.statLabel}>Total Members</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View
              style={[styles.statIconWrapper, { backgroundColor: "#DCFCE7" }]}
            >
              <MaterialCommunityIcons
                name="account-check"
                size={24}
                color="#10B981"
              />
            </View>
            <View>
              <Text style={styles.statText}>{activeMembers}</Text>
              <Text style={styles.statLabel}>Active Now</Text>
            </View>
          </View>
        </View>

        {/* TABLE SECTION */}
        <View style={styles.tableWrapper}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: width * 0.05,
              marginBottom: 10,
            }}
          >
            <Text style={styles.tableHeading}>
              {isDealer ? "My Executives List" : "My Referrals List"}
            </Text>
            <Text
              style={{ fontFamily: "roboto", fontSize: 12, color: "#4F46E5" }}
            >
              Swipe →
            </Text>
          </View>

          <View style={styles.tableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ width: 950 }}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, { width: 140 }]}>NAME</Text>
                  <Text style={[styles.th, { width: 150 }]}>EMAIL</Text>
                  <Text style={[styles.th, { width: 110 }]}>MOBILE</Text>
                  <Text style={[styles.th, { width: 100 }]}>DISTRICT</Text>
                  <Text style={[styles.th, { width: 110 }]}>CITY</Text>
                  <Text style={[styles.th, { width: 80 }]}>PINCODE</Text>
                  <Text style={[styles.th, { width: 90 }]}>STATUS</Text>
                  <Text
                    style={[styles.th, { width: 100, textAlign: "center" }]}
                  >
                    ACTIONS
                  </Text>
                </View>

                {teamMembers.length > 0 ? (
                  teamMembers.map((member, index) => (
                    <View style={styles.tableRow} key={member.id || index}>
                      <Text
                        style={[styles.td, { width: 140 }]}
                        numberOfLines={1}
                      >
                        {member.name || "—"}
                      </Text>
                      <Text
                        style={[styles.td, { width: 150 }]}
                        numberOfLines={1}
                      >
                        {member.email || "—"}
                      </Text>
                      <Text
                        style={[styles.td, { width: 110 }]}
                        numberOfLines={1}
                      >
                        {member.mobile || "—"}
                      </Text>
                      <Text
                        style={[styles.td, { width: 100 }]}
                        numberOfLines={1}
                      >
                        {member.district || "—"}
                      </Text>
                      <Text
                        style={[styles.td, { width: 110 }]}
                        numberOfLines={1}
                      >
                        {member.city || "—"}
                      </Text>
                      <Text
                        style={[styles.td, { width: 80 }]}
                        numberOfLines={1}
                      >
                        {member.pincode || "—"}
                      </Text>

                      <View style={{ width: 90 }}>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                member.status === "Active"
                                  ? "#E8F5E9"
                                  : "#FFEBEE",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  member.status === "Active"
                                    ? "#2E7D32"
                                    : "#C62828",
                              },
                            ]}
                          >
                            {member.status || "—"}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: 100,
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 12,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleEditPress(member)}
                        >
                          <Feather name="edit-2" size={16} color="#4F46E5" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(member.id)}
                        >
                          <Feather name="trash-2" size={16} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <MaterialCommunityIcons
                      name="account-search-outline"
                      size={50}
                      color="#94A3B8"
                    />
                    <Text style={styles.emptyText}>No members found</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>


      {/* ✅ EDIT MODAL */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Referrer Details</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ maxHeight: 400 }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(t) => setEditForm({ ...editForm, name: t })}
              />
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                value={editForm.email}
                onChangeText={(t) => setEditForm({ ...editForm, email: t })}
              />
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                keyboardType="phone-pad"
                value={editForm.mobile}
                onChangeText={(t) => setEditForm({ ...editForm, mobile: t })}
              />
              <Text style={styles.inputLabel}>District</Text>
              <TextInput
                style={styles.input}
                value={editForm.district}
                onChangeText={(t) => setEditForm({ ...editForm, district: t })}
              />
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={editForm.city}
                onChangeText={(t) => setEditForm({ ...editForm, city: t })}
              />
              <Text style={styles.inputLabel}>Pincode</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={editForm.pincode}
                onChangeText={(t) => setEditForm({ ...editForm, pincode: t })}
              />
            </ScrollView>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: height * 0.05,
    paddingBottom: 60,
    paddingHorizontal: width * 0.05,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topContainer: { flexDirection: "row", alignItems: "center" },
  profileImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageText: {
    fontFamily: "roboto-bold",
    fontSize: width * 0.06,
    color: "#fff",
  },
  middleContainer: {
    flex: 1,
    marginLeft: width * 0.04,
    justifyContent: "center",
  },
  userNameText: {
    fontFamily: "roboto-bold",
    fontSize: width * 0.048,
    color: "#fff",
  },
  premiumButton: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  premiumButtonText: { color: "#fff", fontSize: 11, fontFamily: "roboto-bold" },
  myDetailsCard: {
    backgroundColor: "#fff",
    marginHorizontal: width * 0.05,
    marginTop: -30,
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  myDetailsTitle: { fontFamily: "roboto-bold", fontSize: 14, color: "#1E293B" },
  myDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  myDetailsText: { fontFamily: "roboto", fontSize: 13, color: "#475569" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: width * 0.05,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statText: {
    fontFamily: "roboto-bold",
    fontSize: width * 0.05,
    color: "#1E3A8A",
  },
  statLabel: {
    fontFamily: "roboto",
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  tableWrapper: { marginTop: 24 },
  tableHeading: { fontFamily: "roboto-bold", fontSize: 16, color: "#1E293B" },
  tableContainer: {
    backgroundColor: "#fff",
    marginHorizontal: width * 0.05,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  th: {
    fontFamily: "roboto-bold",
    fontSize: 10,
    color: "#64748B",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
  },
  td: { fontFamily: "roboto", fontSize: 12, color: "#334155" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: { fontFamily: "roboto-bold", fontSize: 10 },
  emptyState: { padding: 30, alignItems: "center" },
  emptyText: {
    fontFamily: "roboto-bold",
    fontSize: 14,
    color: "#1E293B",
    marginTop: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: { fontSize: 18, fontFamily: "roboto-bold", color: "#1E293B" },
  inputLabel: {
    fontFamily: "roboto-medium",
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#F8FAFC",
    marginBottom: 12,
    color: "#1E293B",
    fontFamily: "roboto",
  },
  saveBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: { color: "#fff", fontSize: 15, fontFamily: "roboto-bold" },
});

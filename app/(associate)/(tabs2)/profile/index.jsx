// app/(associate)/(tabs2)/profile.jsx
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Share,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  Platform, // 🔥 Added Platform
} from "react-native";

import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard"; // 🔥 Added Clipboard

import { getWalletBalance } from "../../../../constants/api/apiPayment";
import {
  getReferrerProfile,
  updateReferrerProfile,
} from "../../../../constants/api/apiAssociate";

const { width } = Dimensions.get("window");
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ExecutiveProfile() {
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    mobile: "",
    district: "",
    city: "",
    pincode: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLocalDataFirst();
  }, []);

  // 🔥 STEP 1: Local data turant load karo
  const loadLocalDataFirst = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const parsed = JSON.parse(userDataString);
        setUser(parsed);
        setWalletBalance(Number(parsed?.wallet_balance || 0));
      }
    } catch (e) {
      console.log("Local load error:", e);
    } finally {
      setLoading(false);
    }

    // 🔥 STEP 2: Background me API try karo
    fetchFreshData();
    fetchWalletBalance();
  };

  // Background: API se fresh profile
  const fetchFreshData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) return;

      const parsed = JSON.parse(userDataString);
      const role = (parsed?.role || "").toLowerCase();

      if (role === "referrer" || role === "executive") {
        try {
          const res = await getReferrerProfile(parsed.id);
          if (res?.status === true && res?.data) {
            const merged = { ...parsed, ...res.data };
            setUser(merged);
            await AsyncStorage.setItem("userData", JSON.stringify(merged));
          }
        } catch (e) {
          console.log("⚠️ API profile refresh skipped (using local)");
        }
      }
    } catch (e) {
      console.log("Background fetch error:", e);
    }
  };

  // Background: Wallet balance
  const fetchWalletBalance = async () => {
    try {
      const data = await getWalletBalance();
      setWalletBalance(Number(data?.current_balance || 0));
    } catch (e) {
      console.log("⚠️ Wallet API skipped (using local)");
    }
  };

  // ===== EDIT MODAL =====
  const openEdit = () => {
    setEditForm({
      name: user?.name || "",
      mobile: user?.mobile || "",
      district: user?.district || "",
      city: user?.city || "",
      pincode: user?.pincode || "",
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const role = (user?.role || "").toLowerCase();

      if (role === "referrer" || role === "executive") {
        try {
          await updateReferrerProfile(user.id, {
            name: editForm.name,
            mobile: editForm.mobile,
            district: editForm.district,
            city: editForm.city,
            pincode: editForm.pincode,
          });
        } catch (e) {
          console.log("⚠️ Backend update skipped, saving locally");
        }
      }

      const updated = { ...user, ...editForm };
      await AsyncStorage.setItem("userData", JSON.stringify(updated));
      setUser(updated);

      Alert.alert("Success", "Profile updated!");
      setShowEditModal(false);
    } catch (e) {
      Alert.alert("Error", "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ===== SHARE =====
  const handleShare = async () => {
    try {
      const code = user?.referral_code || user?.dealer_code || "";
      const message = code
        ? `Join Candlelights! Use my code: ${code}\nhttps://backend.candlelights.in/`
        : "Download Candlelights App: https://backend.candlelights.in/";

      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({ title: "Candlelights", text: message });
        } else {
          await Clipboard.setStringAsync(message);
          Alert.alert("Copied!", "Link copied to clipboard.");
        }
      } else {
        await Share.share({ message });
      }
    } catch (e) {
      console.log("Share error:", e);
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["userData", "access", "refresh"]);
            if (router.canDismiss && router.canDismiss()) {
              router.dismissAll();
            }
            router.replace("/screen1");
          } catch (e) {
            console.log("Logout error:", e);
            router.replace("/screen1");
          }
        },
      },
    ]);
  };

  // Avatar
  const profileImage = user?.image
    ? user.image.startsWith("http")
      ? user.image
      : `${API_URL}${user.image}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* 🔵 HEADER — purple theme */}
        <LinearGradient
          colors={["#4F46E5", "#6D28D9", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <View style={styles.headerTop}>
            <View style={{ width: 38 }} />
            <TouchableOpacity onPress={openEdit} style={styles.iconBtn}>
              <MaterialCommunityIcons
                name="square-edit-outline"
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileBox}>
            <View style={styles.profileRing}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            </View>

            <Text style={styles.name}>{user?.name || "Executive"}</Text>

            <View style={styles.infoRow}>
              <Feather name="phone" size={12} color="rgba(255,255,255,0.85)" />
              <Text style={styles.phone}>{user?.mobile || "No Phone"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Feather
                name="map-pin"
                size={12}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.address} numberOfLines={1}>
                {user?.city
                  ? `${user.city}${user.district ? ", " + user.district : ""}`
                  : user?.district || "No Address"}
              </Text>
            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>🏆 Executive</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 📋 CARDS */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={openEdit}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name="user-alt" size={18} color="#4F46E5" />
              </View>
              <Text style={styles.cardText}>My Profile</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push("/(associate)/referEarn")}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}>
                <MaterialCommunityIcons
                  name="gift-outline"
                  size={18}
                  color="#F59E0B"
                />
              </View>
              <View>
                <Text style={styles.cardText}>Refer & Earn</Text>
                <Text style={styles.subText}>Earn ₹50 per referral</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => router.push("/(associate)/referEarn")}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: "#DCFCE7" }]}>
                <Entypo name="wallet" size={18} color="#10B981" />
              </View>
              <View>
                <Text style={styles.cardText}>My Wallet</Text>
                <Text style={styles.walletText}>Balance: ₹{walletBalance}</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileCard}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: "#DBEAFE" }]}>
                <FontAwesome name="share-alt" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.cardText}>Share App</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#4F46E5" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.profileCard, styles.logoutCard]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: "#FEE2E2" }]}>
                <MaterialIcons name="logout" size={18} color="#DC2626" />
              </View>
              <Text style={[styles.cardText, { color: "#DC2626" }]}>
                Logout
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ===== EDIT MODAL ===== */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name}
                onChangeText={(t) => setEditForm({ ...editForm, name: t })}
                placeholder="Enter name"
              />

              <Text style={styles.inputLabel}>Mobile</Text>
              <TextInput
                style={styles.input}
                value={editForm.mobile}
                onChangeText={(t) => setEditForm({ ...editForm, mobile: t })}
                keyboardType="phone-pad"
                placeholder="Enter mobile"
              />

              <Text style={styles.inputLabel}>District</Text>
              <TextInput
                style={styles.input}
                value={editForm.district}
                onChangeText={(t) => setEditForm({ ...editForm, district: t })}
                placeholder="Enter district"
              />

              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.input}
                value={editForm.city}
                onChangeText={(t) => setEditForm({ ...editForm, city: t })}
                placeholder="Enter city"
              />

              <Text style={styles.inputLabel}>Pincode</Text>
              <TextInput
                style={styles.input}
                value={editForm.pincode}
                onChangeText={(t) => setEditForm({ ...editForm, pincode: t })}
                keyboardType="numeric"
                placeholder="Enter pincode"
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingTop: 45,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    position: "relative",
  },
  decorCircle1: {
    position: "absolute",
    top: -70,
    right: -50,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileBox: { alignItems: "center", marginTop: 18, zIndex: 2 },
  profileRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  profileImage: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#fff",
  },
  name: {
    color: "#fff",
    fontFamily: "roboto-bold",
    fontSize: 19,
    textAlign: "center",
    marginTop: 12,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 },
  phone: {
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontFamily: "roboto",
    fontSize: 12,
  },
  address: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontFamily: "roboto",
    fontSize: 12,
    maxWidth: width * 0.7,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  badgeText: { color: "#fff", fontSize: 11, fontFamily: "roboto-bold" },
  cardContainer: { padding: 16, gap: 10, marginTop: 8 },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutCard: { backgroundColor: "#FEF2F2" },
  row: { flexDirection: "row", gap: 14, alignItems: "center", flex: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: { fontSize: 14, color: "#1E3A8A", fontFamily: "roboto-bold" },
  subText: {
    fontSize: 11,
    color: "#F59E0B",
    marginTop: 2,
    fontFamily: "roboto",
  },
  walletText: {
    fontSize: 11,
    color: "#10B981",
    marginTop: 2,
    fontFamily: "roboto-bold",
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
    maxHeight: "85%",
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Share,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";

import {
  getWalletBalance,
  getBankDetails,
  updateBankDetails,
  withdrawPayment,
  getReferralStats,
} from "../../../constants/api/apiPayment";

export default function TeacherReferEarnScreen() {
  const navigation = useNavigation();
  const [teacher, setTeacher] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(true);

  const [showBankModal, setShowBankModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBankSuccessModal, setShowBankSuccessModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [savedBankData, setSavedBankData] = useState(null);

  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });

  // Teacher earns ₹500 per referral
  const REFERRAL_AMOUNT = 500;

  useEffect(() => {
    loadTeacherData();
    loadWallet();
    loadBankDetails();
    loadReferralStats();
  }, []);

  const loadTeacherData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setTeacher(JSON.parse(userData));
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const loadWallet = async () => {
    try {
      const data = await getWalletBalance();
      setWalletBalance(Number(data.current_balance || 0));
      setTotalEarned(Number(data.total_earned || 0));
    } catch (error) {
      console.log("Wallet error:", error);
    }
  };

  const loadReferralStats = async () => {
    try {
      const data = await getReferralStats();
      setTotalReferrals(Number(data.total_referrals || 0));
    } catch (error) {
      console.log("Referral stats error:", error);
    }
  };

  const loadBankDetails = async () => {
    setFetchingBank(true);
    try {
      const data = await getBankDetails();
      if (data && data.bank_name) {
        setBankAccount({
          bankName: data.bank_name,
          accountNumber: data.account_number,
          ifscCode: data.ifsc,
          accountHolderName: data.account_holder_name,
        });
        setBankForm({
          bankName: data.bank_name,
          accountNumber: data.account_number,
          ifscCode: data.ifsc,
          accountHolderName: data.account_holder_name,
        });
      }
    } catch (error) {
      console.log("No bank details");
    } finally {
      setFetchingBank(false);
    }
  };

  const referralCode = teacher?.referral_code || "TEACHER" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const hasBankDetails = bankAccount !== null;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("Success", "Referral code copied!");
  };

  const handleShare = async () => {
    await Share.share({
      message: `Join as a Teacher on our platform!\nUse my referral code: ${referralCode}\nEarn ₹${REFERRAL_AMOUNT} for every teacher you refer!`,
    });
  };

  const maskAccount = (num) => {
    if (!num || num.length < 4) return "****";
    return "XXXX XXXX XXXX " + num.slice(-4);
  };

  const saveBankAccount = async () => {
    const { bankName, accountHolderName, accountNumber, ifscCode } = bankForm;
    
    if (!bankName || !accountHolderName || !accountNumber || !ifscCode) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const bankData = {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim().toUpperCase(),
        accountHolderName: accountHolderName.trim(),
      };
      
      await updateBankDetails(bankData);
      
      setSavedBankData(bankData);
      setBankAccount(bankData);
      await AsyncStorage.setItem("teacherBankAccount", JSON.stringify(bankData));
      setShowBankModal(false);
      setShowBankSuccessModal(true);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    
    if (!amount || amount < 100) {
      Alert.alert("Error", "Minimum withdrawal is ₹100");
      return;
    }
    
    if (amount > walletBalance) {
      Alert.alert("Error", "Insufficient balance");
      return;
    }

    setWithdrawing(true);
    try {
      await withdrawPayment({
        amount,
        bank_name: bankAccount.bankName,
        account_number: bankAccount.accountNumber,
        ifsc: bankAccount.ifscCode,
        account_holder_name: bankAccount.accountHolderName,
      });
      
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      setShowSuccessModal(true);
      await loadWallet();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teacher Refer & Earn</Text>
        <TouchableOpacity onPress={() => loadWallet()}>
          <Feather name="refresh-cw" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Teacher Badge */}
        <View style={styles.teacherBadge}>
          <MaterialCommunityIcons name="school" size={20} color="#fff" />
          <Text style={styles.teacherBadgeText}>Teacher Account</Text>
        </View>

        {/* Wallet Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="#EA580C" />
            <Text style={styles.cardTitle}>My Wallet</Text>
          </View>
          <Text style={styles.balance}>₹{walletBalance}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{totalEarned}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalReferrals}</Text>
              <Text style={styles.statLabel}>Teachers Referred</Text>
            </View>
          </View>

          {fetchingBank ? (
            <ActivityIndicator color="#EA580C" style={{ marginVertical: 20 }} />
          ) : hasBankDetails ? (
            <View style={styles.bankBox}>
              <View style={styles.bankRow}>
                <MaterialCommunityIcons name="bank" size={20} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bankName}>{bankAccount.accountHolderName}</Text>
                  <Text style={styles.bankDetails}>
                    {bankAccount.bankName} • {maskAccount(bankAccount.accountNumber)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBankModal(true)}>
                  <Feather name="edit-2" size={18} color="#EA580C" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addBankBtn} onPress={() => setShowBankModal(true)}>
              <MaterialCommunityIcons name="bank-plus" size={20} color="#EA580C" />
              <Text style={styles.addBankText}>Add Bank Details</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.withdrawBtn, (!hasBankDetails || walletBalance < 100) && styles.disabledBtn]}
            onPress={() => setShowWithdrawModal(true)}
            disabled={!hasBankDetails || walletBalance < 100}
          >
            <MaterialCommunityIcons name="bank-transfer" size={20} color="#fff" />
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
          
          {!hasBankDetails && !fetchingBank && <Text style={styles.hint}>Add bank details to withdraw</Text>}
          {hasBankDetails && walletBalance < 100 && <Text style={styles.hint}>Minimum withdrawal: ₹100</Text>}
        </View>

        {/* Referral Card */}
        <View style={styles.card}>
          <MaterialCommunityIcons name="gift-outline" size={50} color="#EA580C" />
          <Text style={styles.referTitle}>Refer a Teacher</Text>
          <Text style={styles.referSubtitle}>Earn ₹{REFERRAL_AMOUNT} per referral</Text>
          
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.btnText}>Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.btnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Referral Stats Card */}
        <View style={styles.statsCardLarge}>
          <Text style={styles.statsTitle}>Referral Earnings</Text>
          <View style={styles.statsRowLarge}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalReferrals}</Text>
              <Text style={styles.statSmallLabel}>Teachers Referred</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹{totalReferrals * REFERRAL_AMOUNT}</Text>
              <Text style={styles.statSmallLabel}>Total Earned</Text>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How Teacher Referral Works</Text>
          <Text style={styles.infoText}>1️⃣ Share your referral code with other teachers</Text>
          <Text style={styles.infoText}>2️⃣ Teacher signs up using your code</Text>
          <Text style={styles.infoText}>3️⃣ You earn ₹{REFERRAL_AMOUNT} after verification</Text>
          <Text style={styles.infoText}>4️⃣ Withdraw earnings to your bank account</Text>
        </View>
      </ScrollView>

      {/* Bank Details Modal */}
      <Modal visible={showBankModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bank Details</Text>
              <TouchableOpacity onPress={() => setShowBankModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              value={bankForm.bankName}
              onChangeText={(text) => setBankForm({ ...bankForm, bankName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              value={bankForm.accountHolderName}
              onChangeText={(text) => setBankForm({ ...bankForm, accountHolderName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              keyboardType="numeric"
              value={bankForm.accountNumber}
              onChangeText={(text) => setBankForm({ ...bankForm, accountNumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="IFSC Code"
              autoCapitalize="characters"
              value={bankForm.ifscCode}
              onChangeText={(text) => setBankForm({ ...bankForm, ifscCode: text.toUpperCase() })}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveBankAccount} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bank Success Modal */}
      <Modal visible={showBankSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <MaterialCommunityIcons name="check-circle" size={60} color="#10B981" />
            <Text style={styles.successTitle}>Bank Details Saved!</Text>
            
            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Holder:</Text>
                <Text style={styles.successDetailValue}>{savedBankData?.accountHolderName}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Bank Name:</Text>
                <Text style={styles.successDetailValue}>{savedBankData?.bankName}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Number:</Text>
                <Text style={styles.successDetailValue}>{maskAccount(savedBankData?.accountNumber)}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>IFSC Code:</Text>
                <Text style={styles.successDetailValue}>{savedBankData?.ifscCode}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.successButton} onPress={() => setShowBankSuccessModal(false)}>
              <Text style={styles.successButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={showWithdrawModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Withdraw Funds</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {bankAccount && (
              <View style={styles.bankPreview}>
                <MaterialCommunityIcons name="bank" size={20} color="#EA580C" />
                <View>
                  <Text style={styles.bankPreviewName}>{bankAccount.accountHolderName}</Text>
                  <Text style={styles.bankPreviewDetail}>
                    {bankAccount.bankName} • {maskAccount(bankAccount.accountNumber)}
                  </Text>
                </View>
              </View>
            )}

            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="Enter amount (Min ₹100)"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <View style={styles.quickAmounts}>
              {[100, 500, 1000, 5000].map((amt) => (
                <TouchableOpacity key={amt} style={styles.quickAmount} onPress={() => setWithdrawAmount(amt.toString())}>
                  <Text style={styles.quickAmountText}>₹{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.balanceInfo}>Available: ₹{walletBalance}</Text>

            <TouchableOpacity style={styles.withdrawBtn} onPress={handleWithdraw} disabled={withdrawing}>
              <Text style={styles.withdrawText}>{withdrawing ? "Processing..." : "Request Withdrawal"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdrawal Success Modal */}
      <Modal visible={showSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <MaterialCommunityIcons name="check-circle" size={60} color="#10B981" />
            <Text style={styles.successTitle}>Withdrawal Requested!</Text>
            <Text style={styles.successMessage}>Amount: ₹{withdrawAmount}</Text>
            <Text style={styles.successNote}>Will be credited within 3-5 business days</Text>
            <TouchableOpacity style={styles.successButton} onPress={() => setShowSuccessModal(false)}>
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#EA580C",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  content: { padding: 20 },
  teacherBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EA580C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 16,
    gap: 8,
  },
  teacherBadgeText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, alignSelf: "flex-start" },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#374151" },
  balance: { fontSize: 40, fontWeight: "bold", color: "#EA580C", marginTop: 8 },
  balanceLabel: { color: "#6B7280", fontSize: 14, marginBottom: 20 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20, width: "100%" },
  statCard: { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 12, padding: 12, alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  bankBox: { backgroundColor: "#F0FDF4", padding: 12, borderRadius: 12, marginBottom: 16, width: "100%" },
  bankRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bankName: { fontSize: 14, fontWeight: "500", color: "#065F46" },
  bankDetails: { fontSize: 12, color: "#047857", marginTop: 2 },
  addBankBtn: {
    backgroundColor: "#FFF7ED",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderStyle: "dashed",
  },
  addBankText: { color: "#EA580C", fontWeight: "500" },
  withdrawBtn: { backgroundColor: "#EA580C", paddingVertical: 14, borderRadius: 12, width: "100%", alignItems: "center" },
  disabledBtn: { backgroundColor: "#D1D5DB" },
  withdrawText: { color: "#fff", fontWeight: "600" },
  hint: { color: "#6B7280", fontSize: 12, marginTop: 8, textAlign: "center" },
  referTitle: { fontSize: 24, fontWeight: "bold", color: "#EA580C", marginTop: 12 },
  referSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  codeBox: {
    backgroundColor: "#FFF7ED",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#FB923C",
    marginVertical: 20,
  },
  codeLabel: { color: "#78716C", fontSize: 13 },
  codeText: { fontSize: 24, fontWeight: "bold", color: "#EA580C", letterSpacing: 2, marginTop: 6 },
  buttonRow: { flexDirection: "row", gap: 12, width: "100%" },
  copyBtn: { flex: 1, backgroundColor: "#EA580C", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  shareBtn: { flex: 1, backgroundColor: "#F59E0B", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
  statsCardLarge: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20, alignItems: "center" },
  statsTitle: { fontSize: 16, fontWeight: "bold", color: "#374151", marginBottom: 16 },
  statsRowLarge: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#EA580C" },
  statSmallLabel: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: "#E5E7EB", marginHorizontal: 20 },
  infoCard: { backgroundColor: "#FEF3C7", padding: 16, borderRadius: 16, width: "100%" },
  infoTitle: { fontSize: 16, fontWeight: "bold", color: "#92400E", marginBottom: 12 },
  infoText: { color: "#92400E", marginBottom: 8, fontSize: 13, opacity: 0.9 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
  },
  saveBtn: { backgroundColor: "#EA580C", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 8 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  bankPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  bankPreviewName: { fontSize: 14, fontWeight: "500", color: "#374151" },
  bankPreviewDetail: { fontSize: 12, color: "#6B7280" },
  amountInput: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  quickAmounts: { flexDirection: "row", gap: 12, marginTop: 16, flexWrap: "wrap" },
  quickAmount: { flex: 1, paddingVertical: 10, backgroundColor: "#FFF7ED", borderRadius: 10, alignItems: "center" },
  quickAmountText: { color: "#EA580C", fontWeight: "600" },
  balanceInfo: { textAlign: "center", marginTop: 16, color: "#6B7280" },
  successOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  successModal: { backgroundColor: "#fff", borderRadius: 24, padding: 24, width: "85%", alignItems: "center" },
  successTitle: { fontSize: 20, fontWeight: "bold", color: "#111827", marginBottom: 16 },
  successMessage: { fontSize: 16, fontWeight: "600", color: "#EA580C", marginBottom: 8 },
  successNote: { fontSize: 12, color: "#6B7280", textAlign: "center", marginBottom: 20 },
  successDetails: { backgroundColor: "#F9FAFB", borderRadius: 12, padding: 16, width: "100%", marginBottom: 20 },
  successDetailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  successDetailLabel: { fontSize: 13, color: "#6B7280" },
  successDetailValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  successButton: { backgroundColor: "#EA580C", paddingVertical: 12, borderRadius: 12, width: "100%" },
  successButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
});
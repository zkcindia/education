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
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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

  const REFERRAL_AMOUNT = 50;

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
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer & Earn</Text>
          <TouchableOpacity onPress={() => loadWallet()} style={styles.headerRefreshBtn}>
            <Ionicons name="refresh-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Invite students and earn rewards</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ===== TEACHER BADGE ===== */}
        <View style={styles.teacherBadge}>
          <Ionicons name="school-outline" size={18} color="rgba(0, 48, 150, 1.00)" />
          <Text style={styles.teacherBadgeText}>Teacher Account</Text>
        </View>

        {/* ===== WALLET CARD ===== */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="wallet-outline" size={22} color="rgba(0, 48, 150, 1.00)" />
            </View>
            <Text style={styles.cardTitle}>My Wallet</Text>
          </View>

          <Text style={styles.balance}>₹{walletBalance}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>₹{totalEarned}</Text>
              <Text style={styles.statLabel}>Total Earned</Text>
            </View>
            <View style={styles.statDividerSmall} />
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalReferrals}</Text>
              <Text style={styles.statLabel}>Referred</Text>
            </View>
          </View>

          {fetchingBank ? (
            <ActivityIndicator color="rgba(0, 48, 150, 1.00)" style={{ marginVertical: 16 }} />
          ) : hasBankDetails ? (
            <View style={styles.bankBox}>
              <View style={styles.bankRow}>
                <View style={styles.bankIcon}>
                  <Ionicons name="business-outline" size={18} color="#10B981" />
                </View>
                <View style={styles.bankInfo}>
                  <Text style={styles.bankName}>{bankAccount.accountHolderName}</Text>
                  <Text style={styles.bankDetails}>
                    {bankAccount.bankName} • {maskAccount(bankAccount.accountNumber)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBankModal(true)} style={styles.bankEditBtn}>
                  <Feather name="edit-2" size={16} color="rgba(0, 48, 150, 1.00)" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addBankBtn} onPress={() => setShowBankModal(true)}>
              <Ionicons name="add-circle-outline" size={22} color="rgba(0, 48, 150, 1.00)" />
              <Text style={styles.addBankText}>Add Bank Details</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.withdrawBtn, (!hasBankDetails || walletBalance < 100) && styles.disabledBtn]}
            onPress={() => setShowWithdrawModal(true)}
            disabled={!hasBankDetails || walletBalance < 100}
          >
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
          
          {!hasBankDetails && !fetchingBank && (
            <Text style={styles.hint}>Add bank details to withdraw earnings</Text>
          )}
          {hasBankDetails && walletBalance < 100 && (
            <Text style={styles.hint}>Minimum withdrawal: ₹100</Text>
          )}
        </View>

        {/* ===== REFERRAL CARD ===== */}
        <View style={[styles.card, styles.referralCard]}>
          <View style={styles.referralIconBg}>
            <Ionicons name="gift-outline" size={32} color="rgba(0, 48, 150, 1.00)" />
          </View>
          <Text style={styles.referTitle}>Refer a Student</Text>
          <Text style={styles.referSubtitle}>Earn ₹{REFERRAL_AMOUNT} per referral</Text>
          
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <Text style={styles.codeText}>{referralCode}</Text>
            <View style={styles.codeDivider} />
            <Text style={styles.codeHint}>Share this code with students</Text>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={18} color="#fff" />
              <Text style={styles.btnText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={18} color="#fff" />
              <Text style={styles.btnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== REFERRAL STATS ===== */}
        <View style={styles.statsCardLarge}>
          <View style={styles.statsHeader}>
            <Ionicons name="trending-up-outline" size={20} color="rgba(0, 48, 150, 1.00)" />
            <Text style={styles.statsTitle}>Referral Earnings</Text>
          </View>
          <View style={styles.statsRowLarge}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalReferrals}</Text>
              <Text style={styles.statSmallLabel}>Students Referred</Text>
            </View>
            <View style={styles.statDividerLarge} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹{totalReferrals * REFERRAL_AMOUNT}</Text>
              <Text style={styles.statSmallLabel}>Total Earned</Text>
            </View>
          </View>
        </View>

        {/* ===== HOW IT WORKS ===== */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="bulb-outline" size={22} color="rgba(0, 48, 150, 1.00)" />
            <Text style={styles.infoTitle}>How Student Referral Works</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, { backgroundColor: "rgba(0, 48, 150, 1.00)" }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.infoText}>Share your referral code with students</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, { backgroundColor: "rgba(0, 48, 150, 1.00)" }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.infoText}>Student signs up using your code</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, { backgroundColor: "rgba(0, 48, 150, 1.00)" }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.infoText}>You earn ₹{REFERRAL_AMOUNT} after verification</Text>
          </View>
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, { backgroundColor: "rgba(0, 48, 150, 1.00)" }]}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.infoText}>Withdraw earnings to your bank account</Text>
          </View>
        </View>
      </ScrollView>

      {/* ===== BANK DETAILS MODAL ===== */}
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
              placeholderTextColor="#9CA3AF"
              value={bankForm.bankName}
              onChangeText={(text) => setBankForm({ ...bankForm, bankName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              placeholderTextColor="#9CA3AF"
              value={bankForm.accountHolderName}
              onChangeText={(text) => setBankForm({ ...bankForm, accountHolderName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={bankForm.accountNumber}
              onChangeText={(text) => setBankForm({ ...bankForm, accountNumber: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="IFSC Code"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              value={bankForm.ifscCode}
              onChangeText={(text) => setBankForm({ ...bankForm, ifscCode: text.toUpperCase() })}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveBankAccount} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Bank Details</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== BANK SUCCESS MODAL ===== */}
      <Modal visible={showBankSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={[styles.successIconCircle, { backgroundColor: "#10B981" }]}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Bank Details Saved!</Text>
            
            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Holder</Text>
                <Text style={styles.successDetailValue}>{savedBankData?.accountHolderName}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Bank Name</Text>
                <Text style={styles.successDetailValue}>{savedBankData?.bankName}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Number</Text>
                <Text style={styles.successDetailValue}>{maskAccount(savedBankData?.accountNumber)}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>IFSC Code</Text>
                <Text style={styles.successDetailValue}>{savedBankData?.ifscCode}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.successButton} onPress={() => setShowBankSuccessModal(false)}>
              <Text style={styles.successButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== WITHDRAW MODAL ===== */}
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
                <Ionicons name="business-outline" size={20} color="rgba(0, 48, 150, 1.00)" />
                <View style={styles.bankPreviewInfo}>
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
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <View style={styles.quickAmounts}>
              {[100, 500, 1000, 5000].map((amt) => (
                <TouchableOpacity 
                  key={amt} 
                  style={[styles.quickAmount, withdrawAmount === amt.toString() && styles.quickAmountActive]} 
                  onPress={() => setWithdrawAmount(amt.toString())}
                >
                  <Text style={[styles.quickAmountText, withdrawAmount === amt.toString() && styles.quickAmountTextActive]}>
                    ₹{amt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.balanceInfo}>Available Balance: ₹{walletBalance}</Text>

            <TouchableOpacity 
              style={[styles.withdrawBtnModal, (!withdrawAmount || Number(withdrawAmount) < 100) && styles.disabledBtn]} 
              onPress={handleWithdraw} 
              disabled={withdrawing || !withdrawAmount || Number(withdrawAmount) < 100}
            >
              <Text style={styles.withdrawText}>
                {withdrawing ? "Processing..." : "Request Withdrawal"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== WITHDRAWAL SUCCESS MODAL ===== */}
      <Modal visible={showSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={[styles.successIconCircle, { backgroundColor: "#10B981" }]}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Withdrawal Requested!</Text>
            <Text style={styles.successMessage}>Amount: ₹{withdrawAmount}</Text>
            <View style={styles.successNoteBox}>
              <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
              <Text style={styles.successNote}>Will be credited within 3-5 business days</Text>
            </View>
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
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },

  // ===== HEADER =====
  header: {
    backgroundColor: "rgba(0, 48, 150, 1.00)",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerBackBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },

  headerRefreshBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  headerSubtitle: {
    color: "#C7D2FE",
    fontSize: 14,
    marginTop: 6,
  },

  // ===== CONTENT =====
  content: {
    padding: 16,
    paddingBottom: 30,
  },

  // ===== TEACHER BADGE =====
  teacherBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: -8,
    marginBottom: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  teacherBadgeText: {
    color: "rgba(0, 48, 150, 1.00)",
    fontSize: 13,
    fontWeight: "500",
  },

  // ===== CARD =====
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    alignSelf: "flex-start",
  },

  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },

  balance: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 4,
  },

  balanceLabel: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },

  statLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },

  statDividerSmall: {
    width: 1,
    height: 30,
    backgroundColor: "#E2E8F0",
  },

  // ===== BANK =====
  bankBox: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  bankIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },

  bankInfo: {
    flex: 1,
  },

  bankName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065F46",
  },

  bankDetails: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2,
  },

  bankEditBtn: {
    padding: 6,
  },

  addBankBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF2FF",
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
  },

  addBankText: {
    color: "rgba(0, 48, 150, 1.00)",
    fontWeight: "500",
    fontSize: 14,
  },

  withdrawBtn: {
    backgroundColor: "rgba(0, 48, 150, 1.00)",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  disabledBtn: {
    opacity: 0.5,
  },

  withdrawText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  hint: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },

  // ===== REFERRAL =====
  referralCard: {
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  referralIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  referTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },

  referSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 2,
  },

  codeBox: {
    backgroundColor: "#EEF2FF",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 16,
  },

  codeLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },

  codeText: {
    fontSize: 26,
    fontWeight: "800",
    color: "rgba(0, 48, 150, 1.00)",
    letterSpacing: 3,
    marginTop: 4,
  },

  codeDivider: {
    width: 40,
    height: 2,
    backgroundColor: "#C7D2FE",
    marginVertical: 8,
  },

  codeHint: {
    fontSize: 11,
    color: "#94A3B8",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  copyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(0, 48, 150, 1.00)",
    paddingVertical: 12,
    borderRadius: 12,
  },

  shareBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 12,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // ===== STATS LARGE =====
  statsCardLarge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#4F46E5",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  statsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  statsRowLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "rgba(0, 48, 150, 1.00)",
  },

  statSmallLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  statDividerLarge: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },

  // ===== INFO CARD =====
  infoCard: {
    backgroundColor: "#EEF2FF",
    padding: 16,
    borderRadius: 16,
    width: "100%",
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },

  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  infoText: {
    color: "#4B5563",
    fontSize: 13,
    flex: 1,
  },

  // ===== MODALS =====
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
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    marginBottom: 14,
    color: "#1E293B",
  },

  saveBtn: {
    backgroundColor: "rgba(0, 48, 150, 1.00)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  bankPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  bankPreviewInfo: {
    flex: 1,
  },

  bankPreviewName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
  },

  bankPreviewDetail: {
    fontSize: 12,
    color: "#94A3B8",
  },

  amountInput: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  quickAmounts: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },

  quickAmount: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  quickAmountActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "rgba(0, 48, 150, 1.00)",
  },

  quickAmountText: {
    color: "#6B7280",
    fontWeight: "500",
  },

  quickAmountTextActive: {
    color: "rgba(0, 48, 150, 1.00)",
  },

  balanceInfo: {
    textAlign: "center",
    marginTop: 14,
    color: "#94A3B8",
    fontSize: 14,
  },

  withdrawBtnModal: {
    backgroundColor: "rgba(0, 48, 150, 1.00)",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },

  // ===== SUCCESS MODALS =====
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  successModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "88%",
    alignItems: "center",
  },

  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },

  successMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(0, 48, 150, 1.00)",
    marginBottom: 6,
  },

  successNoteBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },

  successNote: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },

  successDetails: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    width: "100%",
    marginBottom: 18,
  },

  successDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  successDetailLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },

  successDetailValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },

  successButton: {
    backgroundColor: "rgba(0, 48, 150, 1.00)",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
  },

  successButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
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
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";

import {
  withdrawPayment,
  getWalletBalance,
  updateBankDetails,
  getBankDetails,
} from "../../../../constants/api/apiPayment";

export default function ReferEarnScreen() {
  const [user, setUser] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
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

  useEffect(() => {
    loadUserData();
    loadWallet();
    loadBankDetails();
  }, []);

  const loadUserData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) setUser(JSON.parse(userData));
  };

  const loadWallet = async () => {
    try {
      const data = await getWalletBalance();
      setWalletBalance(Number(data.current_balance || 0));
      setTotalReferrals(Number(data.total_referrals || 0));
    } catch (error) {
      console.log("Wallet error:", error);
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
      }
    } catch (error) {
      console.log("No bank details");
    } finally {
      setFetchingBank(false);
    }
  };

  const referralCode = user?.referral_code || "NO-CODE";
  const hasBankDetails = bankAccount !== null;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("Success", "Code copied!");
  };

  const handleShare = async () => {
    await Share.share({
      message: `Join us! Use code: ${referralCode}`,
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
      await AsyncStorage.setItem("bankAccount", JSON.stringify(bankData));
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

    if (!amount || amount < 10) {
      Alert.alert("Error", "Minimum ₹10");
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
      Alert.alert(
        "Error",
        error.response?.data?.message || "Withdrawal failed",
      );
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== SIMPLE HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ===== WALLET CARD ===== */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name="wallet-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.cardTitle}>My Wallet</Text>
          </View>
          <Text style={styles.balance}>₹{walletBalance}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>

          {fetchingBank ? (
            <ActivityIndicator color="#4F46E5" style={{ marginVertical: 20 }} />
          ) : hasBankDetails ? (
            <View style={styles.bankBox}>
              <View style={styles.bankRow}>
                <View style={styles.bankIcon}>
                  <Ionicons name="business-outline" size={16} color="#10B981" />
                </View>
                <View style={styles.bankInfo}>
                  <Text style={styles.bankName}>
                    {bankAccount.accountHolderName}
                  </Text>
                  <Text style={styles.bankDetails}>
                    {bankAccount.bankName} • {maskAccount(bankAccount.accountNumber)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBankModal(true)} style={styles.bankEditBtn}>
                  <Feather name="edit-2" size={16} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBankBtn}
              onPress={() => setShowBankModal(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#4F46E5" />
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

          {!hasBankDetails && !fetchingBank && <Text style={styles.hint}>Add bank details to withdraw</Text>}
          {hasBankDetails && walletBalance < 100 && <Text style={styles.hint}>Minimum withdrawal: ₹100</Text>}
        </View>

        {/* ===== REFERRAL CARD ===== */}
        <View style={[styles.card, styles.referralCard]}>
          <View style={styles.referralIconBg}>
            <Ionicons name="gift-outline" size={28} color="#4F46E5" />
          </View>
          <Text style={styles.referTitle}>Earn ₹50 per Referral</Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Your Code</Text>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.btnText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.btnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== STATS ===== */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{walletBalance}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalReferrals}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
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
              onChangeText={(text) =>
                setBankForm({ ...bankForm, bankName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              placeholderTextColor="#9CA3AF"
              value={bankForm.accountHolderName}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, accountHolderName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={bankForm.accountNumber}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, accountNumber: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="IFSC Code"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              value={bankForm.ifscCode}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, ifscCode: text.toUpperCase() })
              }
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={saveBankAccount}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== BANK SUCCESS MODAL ===== */}
      <Modal visible={showBankSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>

            <Text style={styles.successTitle}>Bank Details Saved!</Text>
            <Text style={styles.successMessage}>
              Your bank account has been successfully added.
            </Text>

            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Holder</Text>
                <Text style={styles.successDetailValue}>
                  {savedBankData?.accountHolderName}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Bank Name</Text>
                <Text style={styles.successDetailValue}>
                  {savedBankData?.bankName}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Number</Text>
                <Text style={styles.successDetailValue}>
                  {maskAccount(savedBankData?.accountNumber)}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>IFSC Code</Text>
                <Text style={styles.successDetailValue}>
                  {savedBankData?.ifscCode}
                </Text>
              </View>
            </View>

            <Text style={styles.successNote}>
              You can now withdraw your earnings to this account.
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowBankSuccessModal(false);
                setSavedBankData(null);
              }}
            >
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
              <Text style={styles.modalTitle}>Withdraw</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {bankAccount && (
              <View style={styles.bankPreview}>
                <Ionicons name="business-outline" size={20} color="#4F46E5" />
                <View style={styles.bankPreviewInfo}>
                  <Text style={styles.bankPreviewName}>
                    {bankAccount.accountHolderName}
                  </Text>
                  <Text style={styles.bankPreviewDetail}>
                    {bankAccount.bankName} • {maskAccount(bankAccount.accountNumber)}
                  </Text>
                </View>
              </View>
            )}

            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="Enter amount (Minimum ₹100)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <View style={styles.quickAmounts}>
              {[100, 200, 500].map((amt) => (
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

            <Text style={styles.balanceInfo}>Available: ₹{walletBalance}</Text>

            <TouchableOpacity
              style={[styles.withdrawBtn, (!withdrawAmount || Number(withdrawAmount) < 100) && styles.disabledBtn]}
              onPress={handleWithdraw}
              disabled={withdrawing || !withdrawAmount || Number(withdrawAmount) < 100}
            >
              <Text style={styles.withdrawText}>
                {withdrawing ? "Processing..." : "Withdraw"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== WITHDRAWAL SUCCESS MODAL ===== */}
      <Modal visible={showSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>

            <Text style={styles.successTitle}>Withdrawal Requested!</Text>
            <Text style={styles.successMessage}>
              Your withdrawal request has been submitted successfully.
            </Text>

            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Amount</Text>
                <Text style={styles.successDetailValue}>₹{withdrawAmount}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Bank</Text>
                <Text style={styles.successDetailValue}>
                  {bankAccount?.bankName}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account</Text>
                <Text style={styles.successDetailValue}>
                  {maskAccount(bankAccount?.accountNumber)}
                </Text>
              </View>
            </View>

            <Text style={styles.successNote}>
              Funds will be credited within 3-5 business days.
            </Text>

            <TouchableOpacity
              style={styles.successButton}
              onPress={() => {
                setShowSuccessModal(false);
                setWithdrawAmount("");
              }}
            >
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  headerBackBtn: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },

  // ===== CONTENT =====
  content: {
    padding: 16,
    paddingBottom: 30,
  },

  // ===== CARD =====
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  referralCard: {
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
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
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  balance: {
    fontSize: 38,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 2,
  },

  balanceLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 14,
  },

  // ===== BANK =====
  bankBox: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
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
    width: 30,
    height: 30,
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
    marginTop: 1,
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
    marginBottom: 14,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    borderStyle: "dashed",
  },

  addBankText: {
    color: "#4F46E5",
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
    backgroundColor: "#D1D5DB",
  },

  withdrawText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  hint: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },

  // ===== REFERRAL =====
  referralIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  referTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },

  codeBox: {
    backgroundColor: "#EEF2FF",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 14,
  },

  codeLabel: {
    color: "#94A3B8",
    fontSize: 11,
  },

  codeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4F46E5",
    letterSpacing: 3,
    marginTop: 3,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },

  copyBtn: {
    flex: 1,
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  shareBtn: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // ===== STATS =====
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4F46E5",
  },

  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E2E8F0",
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
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    backgroundColor: "#F8FAFC",
    marginBottom: 14,
    color: "#1E293B",
  },

  saveBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 15,
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
    fontSize: 11,
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
    marginTop: 6,
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
    borderColor: "#4F46E5",
  },

  quickAmountText: {
    color: "#6B7280",
    fontWeight: "500",
  },

  quickAmountTextActive: {
    color: "#4F46E5",
  },

  balanceInfo: {
    textAlign: "center",
    marginTop: 12,
    color: "#94A3B8",
    fontSize: 13,
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

  successIconContainer: {
    marginBottom: 10,
  },

  successTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 6,
  },

  successMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },

  successDetails: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    width: "100%",
    marginBottom: 14,
  },

  successDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
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

  successNote: {
    fontSize: 12,
    color: "#4F46E5",
    textAlign: "center",
    marginBottom: 16,
  },

  successButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
  },

  successButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
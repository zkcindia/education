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

      const response = await updateBankDetails(bankData);

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Wallet Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={24}
              color="#EA580C"
            />
            <Text style={styles.cardTitle}>My Wallet</Text>
          </View>
          <Text style={styles.balance}>₹{walletBalance}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>

          {fetchingBank ? (
            <ActivityIndicator color="#EA580C" style={{ marginVertical: 20 }} />
          ) : hasBankDetails ? (
            <View style={styles.bankBox}>
              <View style={styles.bankRow}>
                <MaterialCommunityIcons name="bank" size={20} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bankName}>
                    {bankAccount.accountHolderName}
                  </Text>
                  <Text style={styles.bankDetails}>
                    {bankAccount.bankName} •{" "}
                    {maskAccount(bankAccount.accountNumber)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBankModal(true)}>
                  <Feather name="edit-2" size={18} color="#EA580C" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBankBtn}
              onPress={() => setShowBankModal(true)}
            >
              <MaterialCommunityIcons
                name="bank-plus"
                size={20}
                color="#EA580C"
              />
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

  {/* 👇 UPDATE THIS LINE - Add the hint text here */}
  {!hasBankDetails && !fetchingBank && <Text style={styles.hint}>Add bank details to withdraw</Text>}
  {hasBankDetails && walletBalance < 100 && <Text style={styles.hint}>Minimum withdrawal: ₹100</Text>}
        </View>

        {/* Referral Card */}
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="gift-outline"
            size={50}
            color="#EA580C"
          />
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

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{walletBalance}</Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalReferrals}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
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
              onChangeText={(text) =>
                setBankForm({ ...bankForm, bankName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              value={bankForm.accountHolderName}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, accountHolderName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              keyboardType="numeric"
              value={bankForm.accountNumber}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, accountNumber: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="IFSC Code"
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

      {/* Bank Success Modal - Shows saved bank details */}
      <Modal visible={showBankSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <MaterialCommunityIcons
                name="check-circle"
                size={60}
                color="#10B981"
              />
            </View>

            <Text style={styles.successTitle}>Bank Details Saved!</Text>
            <Text style={styles.successMessage}>
              Your bank account has been successfully added.
            </Text>

            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Holder:</Text>
                <Text style={styles.successDetailValue}>
                  {savedBankData?.accountHolderName}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Bank Name:</Text>
                <Text style={styles.successDetailValue}>
                  {savedBankData?.bankName}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account Number:</Text>
                <Text style={styles.successDetailValue}>
                  {maskAccount(savedBankData?.accountNumber)}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>IFSC Code:</Text>
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

      {/* Withdraw Modal */}
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
                <MaterialCommunityIcons name="bank" size={20} color="#EA580C" />
                <View>
                  <Text style={styles.bankPreviewName}>
                    {bankAccount.accountHolderName}
                  </Text>
                  <Text style={styles.bankPreviewDetail}>
                    {bankAccount.bankName} •{" "}
                    {maskAccount(bankAccount.accountNumber)}
                  </Text>
                </View>
              </View>
            )}

<TextInput
  style={[styles.input, styles.amountInput]}
  placeholder="Enter amount (Minimum ₹100)"
  keyboardType="numeric"
  value={withdrawAmount}
  onChangeText={setWithdrawAmount}
/>

<View style={styles.quickAmounts}>
  {[100, 200, 500].map((amt) => (
    <TouchableOpacity key={amt} style={styles.quickAmount} onPress={() => setWithdrawAmount(amt.toString())}>
      <Text style={styles.quickAmountText}>₹{amt}</Text>
    </TouchableOpacity>
  ))}
</View>

            <Text style={styles.balanceInfo}>Available: ₹{walletBalance}</Text>

            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={handleWithdraw}
              disabled={withdrawing}
            >
              <Text style={styles.withdrawText}>
                {withdrawing ? "Processing..." : "Withdraw"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdrawal Success Modal */}
      <Modal visible={showSuccessModal} animationType="fade" transparent>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <MaterialCommunityIcons
                name="check-circle"
                size={60}
                color="#10B981"
              />
            </View>

            <Text style={styles.successTitle}>Withdrawal Requested!</Text>
            <Text style={styles.successMessage}>
              Your withdrawal request has been submitted successfully.
            </Text>

            <View style={styles.successDetails}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Amount:</Text>
                <Text style={styles.successDetailValue}>₹{withdrawAmount}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Bank:</Text>
                <Text style={styles.successDetailValue}>
                  {bankAccount?.bankName}
                </Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account:</Text>
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#374151" },
  balance: { fontSize: 40, fontWeight: "bold", color: "#EA580C", marginTop: 8 },
  balanceLabel: { color: "#6B7280", fontSize: 14, marginBottom: 20 },
  bankBox: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
  },
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
  withdrawBtn: {
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  disabledBtn: { backgroundColor: "#D1D5DB" },
  withdrawText: { color: "#fff", fontWeight: "600" },
  referTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EA580C",
    marginTop: 12,
    textAlign: "center",
  },
  codeBox: {
    backgroundColor: "#fff",
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
  codeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EA580C",
    letterSpacing: 2,
    marginTop: 6,
  },
  buttonRow: { flexDirection: "row", gap: 12, width: "100%" },
  copyBtn: {
    flex: 1,
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  shareBtn: {
    flex: 1,
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#EA580C" },
  statLabel: { color: "#78716C", marginTop: 4 },
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
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
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
  saveBtn: {
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
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
  quickAmounts: { flexDirection: "row", gap: 12, marginTop: 16 },
  quickAmount: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    alignItems: "center",
  },
  quickAmountText: { color: "#EA580C", fontWeight: "600" },
  balanceInfo: { textAlign: "center", marginTop: 16, color: "#6B7280" },
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
    width: "85%",
    alignItems: "center",
  },
  successIconContainer: { marginBottom: 16 },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  successDetails: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 16,
  },
  successDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  successDetailLabel: { fontSize: 13, color: "#6B7280" },
  successDetailValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  successNote: {
    fontSize: 12,
    color: "#EA580C",
    textAlign: "center",
    marginBottom: 20,
  },
  successButton: {
    backgroundColor: "#EA580C",
    paddingVertical: 12,
    paddingHorizontal: 32,
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

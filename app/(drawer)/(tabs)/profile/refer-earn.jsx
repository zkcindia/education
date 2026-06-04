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
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";

import {
  withdrawPayment,
  getWalletBalance,
} from "../../../../constants/api/apiPayment";

export default function ReferEarnScreen() {
  const [user, setUser] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);

  const [showBankModal, setShowBankModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });

  useEffect(() => {
    loadData();
    loadWalletBalance();
  }, []);

  const loadData = async () => {
    const userData = await AsyncStorage.getItem("userData");
    const savedBank = await AsyncStorage.getItem("bankAccount");

    if (userData) setUser(JSON.parse(userData));

    if (savedBank) {
      const parsedBank = JSON.parse(savedBank);
      setBankAccount(parsedBank);
      setBankForm(parsedBank);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const data = await getWalletBalance();
      setWalletBalance(Number(data.current_balance || 0));
      setTotalReferrals(Number(data.total_referrals || 0));
    } catch (error) {
      console.log("Wallet Balance Error:", error.response?.data || error.message);
    }
  };

  const referralCode = user?.referral_code || "NO-CODE";
  const totalEarnings = walletBalance;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referralCode);
    Alert.alert("Success", "Referral code copied!");
  };

  const handleShare = async () => {
    await Share.share({
      message: `Join Candlelight Learning App\nUse my referral code: ${referralCode}\nEarn rewards after signup!`,
    });
  };

  const saveBankAccount = async () => {
    if (
      !bankForm.bankName ||
      !bankForm.accountNumber ||
      !bankForm.ifscCode ||
      !bankForm.accountHolderName
    ) {
      Alert.alert("Error", "Please fill all bank details");
      return;
    }

    await AsyncStorage.setItem("bankAccount", JSON.stringify(bankForm));
    setBankAccount(bankForm);
    setShowBankModal(false);
    setShowWithdrawModal(true);
    Alert.alert("Success", "Bank details added. Now request withdrawal again.");
  };

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);

    if (!amount || amount < 10) {
      Alert.alert("Error", "Minimum withdrawal is ₹10");
      return;
    }

    if (amount > totalEarnings) {
      Alert.alert("Error", "Insufficient wallet balance");
      return;
    }

    try {
      setWithdrawing(true);

      const data = {
        amount,
        bank_name: bankAccount?.bankName || "",
        account_number: bankAccount?.accountNumber || "",
        ifsc_code: bankAccount?.ifscCode || "",
        account_holder_name: bankAccount?.accountHolderName || "",
      };

      const response = await withdrawPayment(data);

      setShowWithdrawModal(false);
      setWithdrawAmount("");

      await loadWalletBalance();

      Alert.alert(
        "Success",
        response.message || `Withdrawal request for ₹${amount} submitted successfully`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Withdrawal failed";

      if (errorMessage === "Please update bank details first") {
        setShowWithdrawModal(false);
        setShowBankModal(true);
        return;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setWithdrawing(false);
    }
  };

  const maskBankNumber = (number) => {
    if (!number) return "";
    return "XXXX XXXX XXXX " + number.slice(-4);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <MaterialCommunityIcons name="wallet-outline" size={24} color="#EA580C" />
            <Text style={styles.walletTitle}>My Wallet</Text>
          </View>

          <Text style={styles.walletBalance}>₹{totalEarnings}</Text>
          <Text style={styles.walletSubtext}>Available Balance</Text>

          {bankAccount && (
            <View style={styles.bankInfoBox}>
              <View style={styles.bankInfoRow}>
                <MaterialCommunityIcons name="bank" size={20} color="#10B981" />
                <View style={styles.bankInfoDetails}>
                  <Text style={styles.bankInfoName}>{bankAccount.accountHolderName}</Text>
                  <Text style={styles.bankInfoNumber}>
                    {bankAccount.bankName} • {maskBankNumber(bankAccount.accountNumber)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBankModal(true)}>
                  <Feather name="edit-2" size={18} color="#EA580C" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.withdrawBtn,
              totalEarnings < 10 && styles.disabledBtn,
            ]}
            onPress={() => setShowWithdrawModal(true)}
            disabled={totalEarnings < 10}
          >
            <MaterialCommunityIcons name="bank-transfer" size={20} color="#fff" />
            <Text style={styles.withdrawBtnText}>Withdraw to Bank</Text>
          </TouchableOpacity>

          {totalEarnings < 10 && (
            <Text style={styles.minWithdrawText}>Minimum withdrawal: ₹10</Text>
          )}
        </View>

        <View style={styles.referralCard}>
          <MaterialCommunityIcons name="gift-outline" size={60} color="#EA580C" />
          <Text style={styles.title}>Earn ₹100 per Referral</Text>

          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Your Code</Text>
            <Text style={styles.codeText}>{referralCode}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.buttonText}>Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₹{totalEarnings}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalReferrals}</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.step}>1. Share your referral code with friends</Text>
          <Text style={styles.step}>2. Friend signs up using your code</Text>
          <Text style={styles.step}>3. You earn ₹100 after their first purchase</Text>
        </View>
      </ScrollView>

      <Modal visible={showBankModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Bank Details</Text>
              <TouchableOpacity onPress={() => setShowBankModal(false)}>
                <Feather name="x" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Bank Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Bank name"
              value={bankForm.bankName}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, bankName: text })
              }
            />

            <Text style={styles.inputLabel}>Account Holder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name as in bank"
              value={bankForm.accountHolderName}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, accountHolderName: text })
              }
            />

            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Bank account number"
              keyboardType="numeric"
              value={bankForm.accountNumber}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, accountNumber: text })
              }
            />

            <Text style={styles.inputLabel}>IFSC Code</Text>
            <TextInput
              style={styles.input}
              placeholder="IFSC code"
              autoCapitalize="characters"
              value={bankForm.ifscCode}
              onChangeText={(text) =>
                setBankForm({ ...bankForm, ifscCode: text.toUpperCase() })
              }
            />

            <TouchableOpacity style={styles.saveBtn} onPress={saveBankAccount}>
              <Text style={styles.saveBtnText}>Submit Bank Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                  <Text style={styles.bankPreviewName}>
                    {bankAccount.accountHolderName}
                  </Text>
                  <Text style={styles.bankPreviewNumber}>
                    {bankAccount.bankName} • {maskBankNumber(bankAccount.accountNumber)}
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.inputLabel}>Enter Amount (₹)</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="Min ₹10"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <View style={styles.quickAmounts}>
              {[10, 50, 100].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={styles.quickAmount}
                  onPress={() => setWithdrawAmount(amt.toString())}
                >
                  <Text style={styles.quickAmountText}>₹{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.balanceInfo}>Available: ₹{totalEarnings}</Text>

            <TouchableOpacity
              style={[
                styles.withdrawSubmitBtn,
                withdrawing && styles.disabledBtn,
              ]}
              onPress={handleWithdraw}
              disabled={withdrawing}
            >
              <Text style={styles.withdrawSubmitText}>
                {withdrawing ? "Processing..." : "Request Withdrawal"}
              </Text>
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
  content: { padding: 20, paddingBottom: 40 },
  walletCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  walletTitle: { fontSize: 18, fontWeight: "600", color: "#374151" },
  walletBalance: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#EA580C",
    marginTop: 8,
  },
  walletSubtext: { color: "#6B7280", fontSize: 14, marginBottom: 20 },
  bankInfoBox: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  bankInfoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bankInfoDetails: { flex: 1 },
  bankInfoName: { fontSize: 14, fontWeight: "500", color: "#065F46" },
  bankInfoNumber: { fontSize: 12, color: "#047857", marginTop: 2 },
  withdrawBtn: {
    backgroundColor: "#EA580C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  disabledBtn: { backgroundColor: "#D1D5DB" },
  withdrawBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  minWithdrawText: {
    color: "#6B7280",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  referralCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  title: {
    fontSize: 24,
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
    marginTop: 20,
  },
  codeLabel: { color: "#78716C", fontSize: 13 },
  codeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#EA580C",
    letterSpacing: 2,
    marginTop: 6,
  },
  buttonRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  copyBtn: {
    flex: 1,
    backgroundColor: "#EA580C",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  shareBtn: {
    flex: 1,
    backgroundColor: "#F59E0B",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 18 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },
  statValue: { fontSize: 24, fontWeight: "bold", color: "#EA580C" },
  statLabel: { color: "#78716C", marginTop: 5 },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    marginTop: 18,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  step: { color: "#374151", marginBottom: 10, lineHeight: 20 },
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
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  saveBtn: {
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
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
  bankPreviewNumber: { fontSize: 12, color: "#6B7280" },
  amountInput: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  quickAmounts: { flexDirection: "row", gap: 12, marginTop: 16 },
  quickAmount: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  quickAmountText: { color: "#EA580C", fontWeight: "600" },
  balanceInfo: {
    textAlign: "center",
    marginTop: 16,
    color: "#6B7280",
    fontSize: 14,
  },
  withdrawSubmitBtn: {
    backgroundColor: "#EA580C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  withdrawSubmitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
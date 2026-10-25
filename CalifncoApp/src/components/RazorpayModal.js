import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const RAZORPAY_TEST_KEY = 'rzp_test_CalifncoAppSpark2026';

export const RazorpayModal = ({
  visible,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  onClose,
  onSuccess
}) => {
  const { colors } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('karthik@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('889');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('input'); // 'input' | 'authorizing' | 'success'
  const [paymentResult, setPaymentResult] = useState(null);

  const handlePayNow = () => {
    setProcessing(true);
    setStep('authorizing');

    // Simulate authentic Razorpay payment gateway handshake
    setTimeout(() => {
      const generatedPayId = `pay_rzp_test_${Math.floor(10000000 + Math.random() * 90000000)}`;
      const result = {
        razorpay_payment_id: generatedPayId,
        razorpay_order_id: `order_rzp_${Math.floor(100000 + Math.random() * 900000)}`,
        razorpay_signature: `sig_${Math.random().toString(36).substring(2, 15)}`,
        method: selectedMethod,
        amount: amount,
        test_mode: true
      };
      setPaymentResult(result);
      setStep('success');
      setProcessing(false);

      // Auto close and notify parent after 1.8 seconds of celebration
      setTimeout(() => {
        onSuccess(result);
      }, 1600);
    }, 1800);
  };

  const handleModalClose = () => {
    if (!processing) {
      setStep('input');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleModalClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.dialogContainer, { backgroundColor: colors.card }]}>
          {/* Razorpay Brand Header */}
          <View style={styles.rzpHeader}>
            <View style={styles.rzpLogoRow}>
              <View style={styles.rzpLogoBox}>
                <Ionicons name="flash" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.rzpBrandText}>Razorpay Checkout</Text>
                <Text style={styles.rzpTestModeBadge}>TEST MODE (rzp_test_...)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleModalClose} disabled={processing} style={{ padding: 4 }}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Amount Due Banner */}
          <View style={styles.amountBanner}>
            <View>
              <Text style={styles.merchantName}>Califnco Water Systems</Text>
              <Text style={styles.merchantRef}>{customerEmail || 'support@califnco.com'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amountLabel}>AMOUNT TO PAY</Text>
              <Text style={styles.amountValue}>₹{amount.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Interactive Steps */}
          {step === 'authorizing' ? (
            <View style={styles.authorizingView}>
              <ActivityIndicator size="large" color="#3395FF" style={{ marginBottom: 16 }} />
              <Text style={[styles.authorizingTitle, { color: colors.text }]}>
                Authorizing with Bank Gateway...
              </Text>
              <Text style={[styles.authorizingSub, { color: colors.textSecondary }]}>
                Secured 256-bit encryption • Razorpay Test Network
              </Text>
            </View>
          ) : step === 'success' ? (
            <View style={styles.successView}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={40} color="#FFFFFF" />
              </View>
              <Text style={[styles.successTitle, { color: colors.text }]}>Payment Verified!</Text>
              <Text style={[styles.successPayId, { color: colors.primary }]}>
                Payment ID: {paymentResult?.razorpay_payment_id}
              </Text>
              <Text style={[styles.successSub, { color: colors.textSecondary }]}>
                Generating order confirmation and dispatching notifications...
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {/* Payment Method Selector Tabs */}
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                SELECT PAYMENT METHOD:
              </Text>
              <View style={styles.methodTabsRow}>
                {[
                  { id: 'upi', label: 'UPI / QR', icon: 'phone-portrait-outline' },
                  { id: 'card', label: 'Cards', icon: 'card-outline' },
                  { id: 'netbanking', label: 'NetBanking', icon: 'business-outline' },
                  { id: 'cod', label: 'COD', icon: 'cash-outline' }
                ].map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.methodTab,
                      {
                        backgroundColor: selectedMethod === m.id ? '#0C2340' : colors.cardAlt,
                        borderColor: selectedMethod === m.id ? '#3395FF' : colors.border
                      }
                    ]}
                    onPress={() => setSelectedMethod(m.id)}
                  >
                    <Ionicons
                      name={m.icon}
                      size={18}
                      color={selectedMethod === m.id ? '#3395FF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodTabText,
                        { color: selectedMethod === m.id ? '#FFFFFF' : colors.textSecondary }
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* UPI Form */}
              {selectedMethod === 'upi' && (
                <View style={[styles.methodContentBox, { borderColor: colors.border }]}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                    Virtual Payment Address (VPA / UPI ID):
                  </Text>
                  <View style={[styles.inputField, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Ionicons name="at" size={18} color="#3395FF" style={{ marginRight: 6 }} />
                    <TextInput
                      style={[styles.textInput, { color: colors.text }]}
                      value={upiId}
                      onChangeText={setUpiId}
                      placeholder="e.g. mobile@upi or name@okaxis"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  <Text style={styles.upiAppsHint}>
                    ⚡ Supports Google Pay, PhonePe, Paytm, CRED & BHIM
                  </Text>
                </View>
              )}

              {/* Card Form */}
              {selectedMethod === 'card' && (
                <View style={[styles.methodContentBox, { borderColor: colors.border }]}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Card Number:</Text>
                  <View style={[styles.inputField, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Ionicons name="card" size={18} color="#3395FF" style={{ marginRight: 6 }} />
                    <TextInput
                      style={[styles.textInput, { color: colors.text }]}
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.cardRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Expiry (MM/YY):</Text>
                      <TextInput
                        style={[styles.inputField, styles.textInput, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CVV:</Text>
                      <TextInput
                        style={[styles.inputField, styles.textInput, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        secureTextEntry
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* NetBanking Form */}
              {selectedMethod === 'netbanking' && (
                <View style={[styles.methodContentBox, { borderColor: colors.border }]}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Select Bank:</Text>
                  <View style={styles.banksGrid}>
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank'].map((b) => (
                      <TouchableOpacity
                        key={b}
                        style={[
                          styles.bankChip,
                          {
                            backgroundColor: selectedBank === b ? '#0C2340' : colors.cardAlt,
                            borderColor: selectedBank === b ? '#3395FF' : colors.border
                          }
                        ]}
                        onPress={() => setSelectedBank(b)}
                      >
                        <Text
                          style={[
                            styles.bankChipText,
                            { color: selectedBank === b ? '#3395FF' : colors.text }
                          ]}
                        >
                          {b}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Cash On Delivery Form */}
              {selectedMethod === 'cod' && (
                <View style={[styles.methodContentBox, { borderColor: colors.border }]}>
                  <Ionicons name="cash" size={24} color="#10B981" style={{ marginBottom: 6 }} />
                  <Text style={[styles.codTitle, { color: colors.text }]}>Pay on Delivery</Text>
                  <Text style={[styles.codText, { color: colors.textSecondary }]}>
                    Pay via Cash, QR, or Card machine upon delivery at your doorstep.
                  </Text>
                </View>
              )}

              {/* Test Mode Notification */}
              <View style={styles.testNoteBox}>
                <Ionicons name="information-circle" size={16} color="#0284C7" style={{ marginRight: 6 }} />
                <Text style={styles.testNoteText}>
                  Test Gateway: No real money will be charged. Payment simulates instant 200 OK authorization.
                </Text>
              </View>

              {/* Pay Now Button */}
              <TouchableOpacity
                style={styles.payBtn}
                onPress={handlePayNow}
                activeOpacity={0.88}
              >
                <Ionicons name="lock-closed" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.payBtnText}>
                  PAY ₹{amount.toLocaleString('en-IN')} (TEST)
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end'
  },
  dialogContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    overflow: 'hidden'
  },
  rzpHeader: {
    backgroundColor: '#0C2340',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rzpLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  rzpLogoBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#3395FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rzpBrandText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  rzpTestModeBadge: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  amountBanner: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  merchantName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  merchantRef: {
    color: '#94A3B8',
    fontSize: 11
  },
  amountLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700'
  },
  amountValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900'
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  methodTabsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12
  },
  methodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 4
  },
  methodTabText: {
    fontSize: 11,
    fontWeight: '700'
  },
  methodContentBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    padding: 0
  },
  upiAppsHint: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6
  },
  cardRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4
  },
  bankChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1
  },
  bankChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  codTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4
  },
  codText: {
    fontSize: 12
  },
  testNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16
  },
  testNoteText: {
    color: '#0369A1',
    fontSize: 11,
    flex: 1,
    fontWeight: '500'
  },
  payBtn: {
    backgroundColor: '#3395FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    marginBottom: 10
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  authorizingView: {
    padding: 40,
    alignItems: 'center'
  },
  authorizingTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6
  },
  authorizingSub: {
    fontSize: 12
  },
  successView: {
    padding: 30,
    alignItems: 'center'
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6
  },
  successPayId: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8
  },
  successSub: {
    fontSize: 12,
    textAlign: 'center'
  }
});

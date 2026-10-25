import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { AddressPickerModal } from '../components/AddressPickerModal';
import { RazorpayModal } from '../components/RazorpayModal';
import { sendOrderConfirmationEmail } from '../services/emailService';
import { sendOrderSMS } from '../services/smsService';

export const CheckoutScreen = ({ onBack, onOrderSuccess, onViewOrderHistory }) => {
  const { colors } = useTheme();
  const { role, user } = useAuth();
  const {
    items,
    subtotal,
    gstAmount,
    shippingFee,
    promoDiscountAmount,
    walletDiscount,
    grandTotal,
    clearCart,
    isDealer
  } = useCart();
  const { placeOrder } = useOrders();

  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [razorpayModalVisible, setRazorpayModalVisible] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('standard'); // 'standard' | 'express'

  // Selected delivery address
  const [selectedAddress, setSelectedAddress] = useState(
    user.savedAddresses && user.savedAddresses[0]
      ? user.savedAddresses[0]
      : {
          tag: 'Home',
          street: 'Flat 402, Green Valley Apartments, 100 Feet Road',
          area: 'Velachery',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600042',
          lat: 12.9759,
          lng: 80.2212
        }
  );

  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null);

  // Trigger Razorpay Payment
  const handleProceedToPayment = () => {
    setRazorpayModalVisible(true);
  };

  // Razorpay payment completed
  const handlePaymentSuccess = async (rzpResult) => {
    setRazorpayModalVisible(false);

    // Place order in OrderContext
    const orderData = {
      customerName: user.name,
      dealerBusiness: isDealer ? user.businessName : undefined,
      gstin: isDealer ? user.gstin : undefined,
      email: user.email,
      phone: user.phone,
      role: role,
      paymentMethod: `Razorpay Test (${rzpResult.method.toUpperCase()})`,
      paymentId: rzpResult.razorpay_payment_id,
      address: selectedAddress,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        unitPrice: isDealer ? i.wholesalePrice : i.retailPrice,
        image: i.image
      })),
      subtotal,
      gst: gstAmount,
      discount: promoDiscountAmount + walletDiscount,
      total: grandTotal
    };

    const created = placeOrder(orderData);
    setConfirmedOrder(created);

    // Dispatch EmailJS and TextBee notifications
    try {
      const emailRes = await sendOrderConfirmationEmail({
        customerName: user.name,
        customerEmail: user.email,
        orderId: created.id,
        totalAmount: created.total,
        items: created.items,
        trackingNumber: created.trackingNumber
      });

      const smsRes = await sendOrderSMS(user.phone, created.id, created.total);

      setNotificationStatus({
        email: emailRes.message,
        sms: smsRes.message
      });
    } catch (e) {
      console.log('Notification dispatch finished', e);
    }

    clearCart();
  };

  // If order was successfully confirmed, show the receipt celebration view
  if (confirmedOrder) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
          <View style={[styles.successIconBg, { backgroundColor: colors.successLight }]}>
            <Ionicons name="checkmark-circle" size={72} color={colors.success} />
          </View>

          <Text style={[styles.confirmedTitle, { color: colors.text }]}>Order Placed Successfully!</Text>
          <Text style={[styles.confirmedSub, { color: colors.textSecondary }]}>
            Thank you for choosing Califnco Water Systems.
          </Text>

          {/* Order Details Card */}
          <View style={[styles.receiptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Order ID:</Text>
              <Text style={[styles.receiptVal, { color: colors.primary }]}>{confirmedOrder.id}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Tracking Number:</Text>
              <Text style={[styles.receiptVal, { color: colors.text }]}>{confirmedOrder.trackingNumber}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Delivery Partner:</Text>
              <Text style={[styles.receiptVal, { color: colors.text }]}>{confirmedOrder.deliveryPartner}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Estimated Delivery:</Text>
              <Text style={[styles.receiptVal, { color: colors.success }]}>{confirmedOrder.estimatedDelivery}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Razorpay Payment ID:</Text>
              <Text style={[styles.receiptVal, { color: colors.textMuted }]}>{confirmedOrder.paymentId}</Text>
            </View>
            <View style={[styles.receiptDivider, { backgroundColor: colors.border }]} />
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: colors.text, fontWeight: '800' }]}>Total Amount Paid:</Text>
              <Text style={[styles.receiptTotal, { color: colors.primary }]}>₹{confirmedOrder.total.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Live Notification Dispatched Feedback */}
          {notificationStatus && (
            <View style={[styles.notifStatusBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              <View style={styles.notifRow}>
                <Ionicons name="mail" size={16} color={colors.primary} />
                <Text style={[styles.notifText, { color: colors.textSecondary }]}>{notificationStatus.email}</Text>
              </View>
              <View style={styles.notifRow}>
                <Ionicons name="chatbubble-ellipses" size={16} color={colors.success} />
                <Text style={[styles.notifText, { color: colors.textSecondary }]}>{notificationStatus.sms}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={onViewOrderHistory}
          >
            <Ionicons name="list" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.actionBtnText}>Track Order in Order History</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={{ padding: 6 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Delivery Address Card with OpenStreetMap Indicator */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Delivery Address</Text>
            </View>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
              <Text style={[styles.changeText, { color: colors.primary }]}>Change / OSM Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressBox}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>{selectedAddress.tag || 'Home'}</Text>
            </View>
            <Text style={[styles.addressText, { color: colors.text }]}>
              {selectedAddress.flat ? `${selectedAddress.flat}, ` : ''}{selectedAddress.street}
            </Text>
            <Text style={[styles.addressSub, { color: colors.textSecondary }]}>
              {selectedAddress.area ? `${selectedAddress.area}, ` : ''}{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            </Text>
            {selectedAddress.coordinates && (
              <View style={styles.osmCoordRow}>
                <Ionicons name="map" size={12} color={colors.primary} />
                <Text style={[styles.osmCoordText, { color: colors.textMuted }]}>
                  OSM Pin: {selectedAddress.coordinates.lat?.toFixed?.(4)}°N, {selectedAddress.coordinates.lng?.toFixed?.(4)}°E
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Delivery Option */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 10 }]}>Shipping Method</Text>
          <TouchableOpacity
            style={[
              styles.shippingOption,
              {
                backgroundColor: deliveryOption === 'standard' ? colors.primaryLight : colors.cardAlt,
                borderColor: deliveryOption === 'standard' ? colors.primary : colors.border
              }
            ]}
            onPress={() => setDeliveryOption('standard')}
          >
            <Ionicons
              name={deliveryOption === 'standard' ? 'radio-button-on' : 'radio-button-off'}
              size={18}
              color={deliveryOption === 'standard' ? colors.primary : colors.textSecondary}
            />
            <View style={{ flex: 1, marginHorizontal: 8 }}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Standard Courier Delivery</Text>
              <Text style={[styles.optionSub, { color: colors.textSecondary }]}>Delivery in 2-4 Business Days via DTDC / BlueDart</Text>
            </View>
            <Text style={[styles.optionPrice, { color: colors.success }]}>FREE</Text>
          </TouchableOpacity>
        </View>

        {/* Items Summary */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 8 }]}>
            Order Items ({items.length})
          </Text>
          {items.map((i) => (
            <View key={i.id} style={styles.checkoutItemRow}>
              <Text style={[styles.checkoutItemName, { color: colors.text }]} numberOfLines={1}>
                {i.name}
              </Text>
              <Text style={[styles.checkoutItemQty, { color: colors.textSecondary }]}>x{i.quantity}</Text>
              <Text style={[styles.checkoutItemPrice, { color: colors.text }]}>
                ₹{((isDealer ? i.wholesalePrice : i.retailPrice) * i.quantity).toLocaleString('en-IN')}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 8 }]}>Payment Details</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Items Total</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>GST (18% HSN 8421)</Text>
            <Text style={[styles.summaryVal, { color: colors.text }]}>₹{gstAmount.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Delivery</Text>
            <Text style={[styles.summaryVal, { color: colors.success }]}>FREE</Text>
          </View>
          {(promoDiscountAmount > 0 || walletDiscount > 0) && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.success }]}>Total Discount</Text>
              <Text style={[styles.summaryVal, { color: colors.success }]}>
                -₹{(promoDiscountAmount + walletDiscount).toLocaleString('en-IN')}
              </Text>
            </View>
          )}
          <View style={[styles.receiptDivider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryRow}>
            <Text style={[styles.grandLabel, { color: colors.text }]}>Grand Total</Text>
            <Text style={[styles.grandVal, { color: isDealer ? colors.dealerBadge : colors.primary }]}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar with Razorpay CTA */}
      <View style={[styles.stickyFooter, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.footerSub, { color: colors.textSecondary }]}>Total Payable</Text>
          <Text style={[styles.footerAmount, { color: colors.text }]}>
            ₹{grandTotal.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: '#3395FF' }]}
          onPress={handleProceedToPayment}
          activeOpacity={0.88}
        >
          <Ionicons name="flash" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.payBtnText}>Pay with Razorpay</Text>
        </TouchableOpacity>
      </View>

      {/* OpenStreetMap Address Picker Modal */}
      <AddressPickerModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSelectAddress={setSelectedAddress}
      />

      {/* Razorpay Test Mode Payment Gateway Modal */}
      <RazorpayModal
        visible={razorpayModalVisible}
        amount={grandTotal}
        customerName={user.name}
        customerEmail={user.email}
        customerPhone={user.phone}
        onClose={() => setRazorpayModalVisible(false)}
        onSuccess={handlePaymentSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  addressBox: {
    marginTop: 4
  },
  tagBadge: {
    backgroundColor: '#E0F2FE',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 4
  },
  tagBadgeText: {
    color: '#0284C7',
    fontSize: 10,
    fontWeight: '700'
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18
  },
  addressSub: {
    fontSize: 12,
    marginTop: 2
  },
  osmCoordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6
  },
  osmCoordText: {
    fontSize: 11
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  optionSub: {
    fontSize: 11,
    marginTop: 2
  },
  optionPrice: {
    fontSize: 12,
    fontWeight: '800'
  },
  checkoutItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6
  },
  checkoutItemName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600'
  },
  checkoutItemQty: {
    width: 36,
    fontSize: 12,
    textAlign: 'center'
  },
  checkoutItemPrice: {
    fontSize: 12,
    fontWeight: '700'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  summaryLabel: {
    fontSize: 12
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '600'
  },
  receiptDivider: {
    height: 1,
    marginVertical: 8
  },
  grandLabel: {
    fontSize: 14,
    fontWeight: '800'
  },
  grandVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1
  },
  footerSub: {
    fontSize: 11
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '900'
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successIconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 20
  },
  confirmedTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6
  },
  confirmedSub: {
    fontSize: 13,
    marginBottom: 20
  },
  receiptCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  receiptLabel: {
    fontSize: 12
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '700'
  },
  receiptTotal: {
    fontSize: 18,
    fontWeight: '900'
  },
  notifStatusBox: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    gap: 6
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  notifText: {
    fontSize: 11,
    flex: 1
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  }
});

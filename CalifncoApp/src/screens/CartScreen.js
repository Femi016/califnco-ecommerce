import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const CartScreen = ({ onProceedToCheckout, onStartShopping }) => {
  const { colors } = useTheme();
  const { role, user } = useAuth();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    gstAmount,
    shippingFee,
    promoCode,
    applyPromo,
    discountPercent,
    promoDiscountAmount,
    useWalletCredits,
    setUseWalletCredits,
    walletDiscount,
    grandTotal,
    isDealer
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyCode = () => {
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode);
    setPromoMessage(res);
  };

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyCircle, { backgroundColor: colors.cardAlt }]}>
          <Ionicons name="cart-outline" size={60} color={colors.textSecondary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your Cart is Empty</Text>
        <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
          Explore 50+ water purifiers, commercial RO plants, booster pumps, and genuine spares.
        </Text>
        <TouchableOpacity
          style={[styles.shopBtn, { backgroundColor: colors.primary }]}
          onPress={onStartShopping}
        >
          <Ionicons name="water" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.shopBtnText}>Explore Product Catalog</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isDealer ? 'Wholesale Bulk Cart' : 'Shopping Cart'}
          </Text>
          <TouchableOpacity onPress={clearCart}>
            <Text style={[styles.clearBtnText, { color: colors.danger }]}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Dealer Wholesale Notice */}
        {isDealer && (
          <View style={[styles.dealerBanner, { backgroundColor: colors.dealerBadgeLight }]}>
            <Ionicons name="pricetag" size={16} color={colors.dealerBadge} />
            <Text style={[styles.dealerBannerText, { color: colors.dealerBadge }]}>
              Wholesale pricing active. Commercial B2B Tax invoice will be generated.
            </Text>
          </View>
        )}

        {/* Items List */}
        <View style={styles.itemsList}>
          {items.map((item) => {
            const unitPrice = isDealer ? item.wholesalePrice : item.retailPrice;
            const itemTotal = unitPrice * item.quantity;
            const belowMoq = isDealer && item.quantity < item.moq;

            return (
              <View
                key={item.id}
                style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />

                <View style={styles.itemDetails}>
                  <View style={styles.itemTitleRow}>
                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Ionicons name="trash-outline" size={18} color={colors.danger} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemMetaRow}>
                    <Text style={[styles.unitPrice, { color: isDealer ? colors.dealerBadge : colors.text }]}>
                      ₹{unitPrice.toLocaleString('en-IN')}
                    </Text>
                    {isDealer && (
                      <Text style={[styles.moqNote, { color: belowMoq ? colors.danger : colors.textSecondary }]}>
                        MOQ: {item.moq} pcs
                      </Text>
                    )}
                  </View>

                  {/* Quantity Stepper */}
                  <View style={styles.stepperRow}>
                    <View style={[styles.stepper, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={16} color={colors.text} />
                      </TouchableOpacity>
                      <Text style={[styles.qtyText, { color: colors.text }]}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={16} color={colors.text} />
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.itemTotal, { color: colors.text }]}>
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Promo Code Card */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Apply Promo / Wholesale Voucher</Text>
          <View style={styles.promoInputRow}>
            <View style={[styles.promoBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              <Ionicons name="ticket-outline" size={18} color={colors.textSecondary} style={{ marginRight: 6 }} />
              <TextInput
                style={[styles.promoInput, { color: colors.text }]}
                placeholder={isDealer ? 'Enter DEALERBULK5' : 'Enter CLEANWATER10'}
                placeholderTextColor={colors.textMuted}
                value={inputCode}
                onChangeText={setInputCode}
                autoCapitalize="characters"
              />
            </View>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={handleApplyCode}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {promoMessage && (
            <Text
              style={[
                styles.promoFeedback,
                { color: promoMessage.success ? colors.success : colors.danger }
              ]}
            >
              {promoMessage.message}
            </Text>
          )}

          {/* Quick Clickable Suggestions */}
          <View style={styles.quickVouchers}>
            <TouchableOpacity onPress={() => setInputCode('CLEANWATER10')}>
              <Text style={[styles.quickVoucherTag, { color: colors.primary }]}>CLEANWATER10 (-10%)</Text>
            </TouchableOpacity>
            {isDealer && (
              <TouchableOpacity onPress={() => setInputCode('DEALERBULK5')}>
                <Text style={[styles.quickVoucherTag, { color: colors.dealerBadge }]}>DEALERBULK5 (-5%)</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setInputCode('FREESHIP')}>
              <Text style={[styles.quickVoucherTag, { color: colors.textSecondary }]}>FREESHIP</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Califnco Wallet Credit Redemption */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.walletRow}>
            <View style={styles.walletIconCircle}>
              <Ionicons name="wallet" size={20} color="#F59E0B" />
            </View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={[styles.walletTitle, { color: colors.text }]}>Califnco Wallet Balance</Text>
              <Text style={[styles.walletSub, { color: colors.textSecondary }]}>
                Available: ₹{user.walletBalance || 0} • Use up to ₹500
              </Text>
            </View>
            <Switch
              value={useWalletCredits}
              onValueChange={setUseWalletCredits}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        {/* Price Breakdown Bill */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Price Summary</Text>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Items Subtotal</Text>
            <Text style={[styles.billVal, { color: colors.text }]}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.textSecondary }]}>GST (18% HSN 8421 Machinery)</Text>
            <Text style={[styles.billVal, { color: colors.text }]}>+₹{gstAmount.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.billRow}>
            <Text style={[styles.billLabel, { color: colors.textSecondary }]}>Standard Delivery</Text>
            <Text style={[styles.billVal, { color: shippingFee === 0 ? colors.success : colors.text }]}>
              {shippingFee === 0 ? 'FREE' : `+₹${shippingFee}`}
            </Text>
          </View>

          {promoDiscountAmount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.success }]}>
                Promo Voucher ({promoCode})
              </Text>
              <Text style={[styles.billVal, { color: colors.success }]}>
                -₹{promoDiscountAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          {walletDiscount > 0 && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.gold }]}>Wallet Credits Redeemed</Text>
              <Text style={[styles.billVal, { color: colors.gold }]}>
                -₹{walletDiscount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.billRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Final Payable Amount</Text>
            <Text style={[styles.totalVal, { color: isDealer ? colors.dealerBadge : colors.primary }]}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Checkout Action */}
      <View style={[styles.stickyFooter, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Total to Pay</Text>
          <Text style={[styles.footerAmount, { color: colors.text }]}>
            ₹{grandTotal.toLocaleString('en-IN')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutBtn,
            { backgroundColor: isDealer ? colors.dealerBadge : colors.primary }
          ]}
          onPress={onProceedToCheckout}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  shopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '800'
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  dealerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12
  },
  dealerBannerText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1
  },
  itemsList: {
    gap: 10,
    marginBottom: 14
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    gap: 10
  },
  itemImage: {
    width: 75,
    height: 75,
    borderRadius: 8
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between'
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 6
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2
  },
  unitPrice: {
    fontSize: 14,
    fontWeight: '800'
  },
  moqNote: {
    fontSize: 10,
    fontWeight: '600'
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1
  },
  stepBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 6
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '800'
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  promoBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10
  },
  promoInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    padding: 0
  },
  applyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  promoFeedback: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6
  },
  quickVouchers: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  quickVoucherTag: {
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline'
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  walletIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  walletTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  walletSub: {
    fontSize: 11
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  billLabel: {
    fontSize: 12
  },
  billVal: {
    fontSize: 12,
    fontWeight: '600'
  },
  divider: {
    height: 1,
    marginVertical: 8
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800'
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900'
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '600'
  },
  footerAmount: {
    fontSize: 20,
    fontWeight: '900'
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 6
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});

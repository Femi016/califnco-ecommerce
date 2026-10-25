import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PRODUCT_REVIEWS } from '../data/mockData';

const { width } = Dimensions.get('window');

export const ProductLightboxModal = ({ visible, product, onClose, onBuyNow }) => {
  const { colors } = useTheme();
  const { role } = useAuth();
  const { addToCart, items } = useCart();
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);

  if (!product) return null;

  const isDealer = role === 'dealer';
  const minQty = isDealer ? (product.moq || 1) : 1;
  const activeQty = Math.max(minQty, selectedQty);
  const unitPrice = isDealer ? product.wholesalePrice : product.retailPrice;
  const totalPrice = unitPrice * activeQty;

  const handleAddToCart = () => {
    addToCart(product, activeQty);
    onClose();
  };

  const handleInstantBuy = () => {
    addToCart(product, activeQty);
    onClose();
    if (onBuyNow) onBuyNow();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Navigation Bar */}
        <View style={[styles.navBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: colors.text }]} numberOfLines={1}>
            {product.name}
          </Text>
          <TouchableOpacity
            style={styles.zoomToggle}
            onPress={() => setIsZoomed(!isZoomed)}
          >
            <Ionicons
              name={isZoomed ? 'contract-outline' : 'scan-outline'}
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
          {/* Lightbox / Zoomable Hero Image */}
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => setIsZoomed(!isZoomed)}
            style={[
              styles.imageContainer,
              { backgroundColor: colors.cardAlt },
              isZoomed && styles.imageContainerZoomed
            ]}
          >
            <Image
              source={{ uri: product.image }}
              style={[styles.heroImage, isZoomed && styles.heroImageZoomed]}
              resizeMode={isZoomed ? 'contain' : 'cover'}
            />
            <View style={styles.zoomHintBadge}>
              <Ionicons name={isZoomed ? 'contract' : 'expand'} size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.zoomHintText}>
                {isZoomed ? 'Tap to fit screen' : 'Tap for Lightbox Zoom'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Product Header & Pricing */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.categoryRow}>
              <Text style={[styles.categoryBadge, { color: colors.primary }]}>
                {product.category.toUpperCase()}
              </Text>
              {product.badge && (
                <View style={[styles.badgeTag, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.badgeTagText, { color: colors.primaryDark }]}>{product.badge}</Text>
                </View>
              )}
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{product.name}</Text>

            {/* Ratings */}
            <View style={styles.ratingBar}>
              <View style={styles.starBox}>
                <Ionicons name="star" size={14} color="#F59E0B" />
                <Text style={styles.starText}>{product.rating}</Text>
              </View>
              <Text style={[styles.reviewsCount, { color: colors.textSecondary }]}>
                {product.reviewsCount} Customer Ratings & Verified Purchases
              </Text>
            </View>

            {/* Pricing Section */}
            <View style={[styles.pricingBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
              {isDealer ? (
                <View>
                  <View style={styles.dealerHeaderRow}>
                    <Text style={[styles.wholesaleTag, { color: colors.dealerBadge }]}>
                      ⭐ AUTHORIZED WHOLESALE RATE
                    </Text>
                    <View style={[styles.moqBadge, { backgroundColor: colors.dealerBadgeLight }]}>
                      <Text style={[styles.moqBadgeText, { color: colors.dealerBadge }]}>
                        MOQ: {product.moq} Units
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={[styles.mainPrice, { color: colors.dealerBadge }]}>
                      ₹{product.wholesalePrice.toLocaleString('en-IN')}
                    </Text>
                    <Text style={[styles.retailRef, { color: colors.textMuted }]}>
                      Retail: ₹{product.retailPrice.toLocaleString('en-IN')}
                    </Text>
                    <Text style={[styles.savingsBadge, { color: colors.success }]}>
                      Margin: ₹{(product.retailPrice - product.wholesalePrice).toLocaleString('en-IN')} / unit
                    </Text>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.priceRow}>
                    <Text style={[styles.mainPrice, { color: colors.text }]}>
                      ₹{product.retailPrice.toLocaleString('en-IN')}
                    </Text>
                    <Text style={[styles.mrpRef, { color: colors.textMuted }]}>
                      ₹{Math.round(product.retailPrice * 1.35).toLocaleString('en-IN')}
                    </Text>
                    <View style={[styles.discountPill, { backgroundColor: colors.successLight }]}>
                      <Text style={[styles.discountPillText, { color: colors.success }]}>25% OFF</Text>
                    </View>
                  </View>
                  <Text style={[styles.inclusiveText, { color: colors.textSecondary }]}>
                    Inclusive of all taxes & Free Home Installation
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {product.description}
            </Text>
          </View>

          {/* Key Features List */}
          {product.features && product.features.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.card, marginTop: 10 }]}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Key Highlights</Text>
              {product.features.map((feat, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} style={{ marginRight: 8 }} />
                  <Text style={[styles.featureText, { color: colors.text }]}>{feat}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Technical Specifications Table */}
          {product.specs && (
            <View style={[styles.section, { backgroundColor: colors.card, marginTop: 10 }]}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>Technical Specifications</Text>
              <View style={[styles.specsTable, { borderColor: colors.border }]}>
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <View
                    key={key}
                    style={[
                      styles.specRow,
                      {
                        backgroundColor: idx % 2 === 0 ? colors.cardAlt : colors.card,
                        borderBottomColor: colors.border
                      }
                    ]}
                  >
                    <Text style={[styles.specKey, { color: colors.textSecondary }]}>{key}</Text>
                    <Text style={[styles.specVal, { color: colors.text }]}>{val}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Verified Customer & Dealer Reviews */}
          <View style={[styles.section, { backgroundColor: colors.card, marginTop: 10 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.sectionHeading, { color: colors.text, marginBottom: 0 }]}>Customer Reviews</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.success }}>Verified Purchases</Text>
              </View>
            </View>

            {PRODUCT_REVIEWS.map((rev) => (
              <View key={rev.id} style={{ marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{rev.author}</Text>
                  <Text style={{ fontSize: 10, color: colors.textMuted }}>{rev.date}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <View style={{ flexDirection: 'row', gap: 1 }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Ionicons key={i} name="star" size={12} color="#F59E0B" />
                    ))}
                  </View>
                  <Text style={{ fontSize: 10, color: colors.textSecondary }}>• {rev.location}</Text>
                </View>
                <Text style={{ fontSize: 12, lineHeight: 17, color: colors.textSecondary }}>{rev.comment}</Text>
              </View>
            ))}
          </View>

          {/* Quantity Selector */}
          <View style={[styles.section, { backgroundColor: colors.card, marginTop: 10 }]}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {isDealer ? 'Select Wholesale Order Quantity (Units)' : 'Select Quantity'}
            </Text>
            <View style={styles.qtyControlRow}>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
                onPress={() => setSelectedQty(Math.max(minQty, activeQty - (isDealer ? product.moq || 1 : 1)))}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.qtyDisplay}>
                <Text style={[styles.qtyNumber, { color: colors.text }]}>{activeQty}</Text>
                <Text style={[styles.qtyUnit, { color: colors.textSecondary }]}>units</Text>
              </View>

              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
                onPress={() => setSelectedQty(activeQty + (isDealer ? product.moq || 1 : 1))}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {isDealer && (
              <View style={[styles.dealerOrderSummary, { backgroundColor: colors.dealerBadgeLight }]}>
                <Ionicons name="information-circle" size={16} color={colors.dealerBadge} />
                <Text style={[styles.dealerOrderSummaryText, { color: colors.dealerBadge }]}>
                  Total Wholesale Lot: {activeQty} pcs × ₹{unitPrice.toLocaleString('en-IN')} = ₹{totalPrice.toLocaleString('en-IN')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sticky Action Bar */}
        <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View>
            <Text style={[styles.bottomLabel, { color: colors.textSecondary }]}>Total Price</Text>
            <Text style={[styles.bottomTotal, { color: isDealer ? colors.dealerBadge : colors.text }]}>
              ₹{totalPrice.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.cartBtn, { borderColor: colors.primary }]}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart-outline" size={18} color={colors.primary} />
              <Text style={[styles.cartBtnText, { color: colors.primary }]}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.buyBtn,
                { backgroundColor: isDealer ? colors.dealerBadge : colors.primary }
              ]}
              onPress={handleInstantBuy}
            >
              <Text style={styles.buyBtnText}>{isDealer ? 'Wholesale PO' : 'Buy Now'}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  closeBtn: {
    padding: 6
  },
  navTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 12
  },
  zoomToggle: {
    padding: 6
  },
  imageContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  imageContainerZoomed: {
    height: 400
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  heroImageZoomed: {
    width: '100%',
    height: '100%'
  },
  zoomHintBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 14
  },
  zoomHintText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600'
  },
  section: {
    padding: 16
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  badgeTag: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  badgeTagText: {
    fontSize: 10,
    fontWeight: '700'
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 8
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  starBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    gap: 4
  },
  starText: {
    color: '#D97706',
    fontSize: 12,
    fontWeight: '800'
  },
  reviewsCount: {
    fontSize: 12
  },
  pricingBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12
  },
  dealerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  wholesaleTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  moqBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  moqBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  mainPrice: {
    fontSize: 24,
    fontWeight: '900'
  },
  mrpRef: {
    fontSize: 14,
    textDecorationLine: 'line-through'
  },
  retailRef: {
    fontSize: 13
  },
  discountPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  discountPillText: {
    fontSize: 11,
    fontWeight: '800'
  },
  savingsBadge: {
    fontSize: 11,
    fontWeight: '700'
  },
  inclusiveText: {
    fontSize: 11,
    marginTop: 4
  },
  description: {
    fontSize: 13,
    lineHeight: 20
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  featureText: {
    fontSize: 13,
    flex: 1
  },
  specsTable: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1
  },
  specKey: {
    width: '38%',
    fontSize: 12,
    fontWeight: '700'
  },
  specVal: {
    flex: 1,
    fontSize: 12
  },
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 8
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qtyDisplay: {
    alignItems: 'center'
  },
  qtyNumber: {
    fontSize: 22,
    fontWeight: '900'
  },
  qtyUnit: {
    fontSize: 11
  },
  dealerOrderSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    marginTop: 10
  },
  dealerOrderSummaryText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1
  },
  bottomLabel: {
    fontSize: 11
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: '900'
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 4
  },
  cartBtn: {
    borderWidth: 1.5
  },
  cartBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  buyBtn: {
    paddingHorizontal: 18
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});

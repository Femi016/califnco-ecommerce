import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product, onPress }) => {
  const { colors } = useTheme();
  const { role } = useAuth();
  const { addToCart, items } = useCart();

  const isDealer = role === 'dealer';
  const cartItem = items.find(i => i.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  // Price calculations
  const displayPrice = isDealer ? product.wholesalePrice : product.retailPrice;
  const mrpPrice = Math.round(product.retailPrice * 1.35); // Estimated MRP
  const dealerSavings = isDealer ? product.retailPrice - product.wholesalePrice : 0;

  const handleAddPress = (e) => {
    e?.stopPropagation?.();
    addToCart(product);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDealer ? colors.dealerBadgeLight : colors.border
        }
      ]}
      onPress={() => onPress(product)}
      activeOpacity={0.88}
    >
      {/* Product Image & Badges */}
      <View style={[styles.imageContainer, { backgroundColor: colors.cardAlt }]}>
        <Image
          source={{ uri: product.image }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Feature / Bestseller Badge */}
        {product.badge && (
          <View
            style={[
              styles.badgePill,
              {
                backgroundColor:
                  product.badge === 'Commercial' || product.badge === 'Heavy Commercial'
                    ? colors.text
                    : colors.primary
              }
            ]}
          >
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}

        {/* Dealer MOQ Badge */}
        {isDealer && (
          <View style={[styles.moqPill, { backgroundColor: colors.dealerBadge }]}>
            <Ionicons name="layers" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
            <Text style={styles.moqText}>MOQ: {product.moq} pcs</Text>
          </View>
        )}

        {/* In-Stock Indicator */}
        <View style={styles.stockIndicator}>
          <View style={[styles.stockDot, { backgroundColor: product.inStock ? colors.success : colors.danger }]} />
          <Text style={[styles.stockText, { color: colors.textSecondary }]}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        {/* Rating & Category */}
        <View style={styles.metaRow}>
          <Text style={[styles.categoryTag, { color: colors.primary }]}>
            {product.category.toUpperCase()}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.text }]}>{product.rating}</Text>
            <Text style={[styles.reviewsText, { color: colors.textMuted }]}>
              ({product.reviewsCount})
            </Text>
          </View>
        </View>

        {/* Product Title */}
        <Text
          style={[styles.productName, { color: colors.text }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>

        {/* Quick Highlights */}
        {product.features && product.features[0] && (
          <Text style={[styles.featureHighlight, { color: colors.textSecondary }]} numberOfLines={1}>
            ✓ {product.features[0]}
          </Text>
        )}

        {/* Price & Cart Action */}
        <View style={styles.priceActionRow}>
          <View>
            {isDealer ? (
              <View>
                <View style={styles.dealerLabelRow}>
                  <Text style={[styles.dealerWholesaleTag, { color: colors.dealerBadge }]}>
                    WHOLESALE
                  </Text>
                  <Text style={[styles.savingsTag, { color: colors.success }]}>
                    Save ₹{dealerSavings.toLocaleString('en-IN')}
                  </Text>
                </View>
                <Text style={[styles.price, { color: colors.dealerBadge }]}>
                  ₹{displayPrice.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.mrpText, { color: colors.textMuted }]}>
                  Retail: ₹{product.retailPrice.toLocaleString('en-IN')}
                </Text>
              </View>
            ) : (
              <View>
                <Text style={[styles.price, { color: colors.text }]}>
                  ₹{displayPrice.toLocaleString('en-IN')}
                </Text>
                <View style={styles.mrpRow}>
                  <Text style={[styles.mrpText, { color: colors.textMuted }]}>
                    ₹{mrpPrice.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.discountTag, { color: colors.success }]}>
                    25% OFF
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={[
              styles.addBtn,
              {
                backgroundColor: isDealer ? colors.dealerBadge : colors.primary
              }
            ]}
            onPress={handleAddPress}
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
            <Text style={styles.addBtnText}>
              {inCartQty > 0 ? `${inCartQty} in Cart` : isDealer ? `+${product.moq}` : '+ Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative'
  },
  productImage: {
    width: '100%',
    height: '100%'
  },
  badgePill: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  moqPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 6
  },
  moqText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  stockIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600'
  },
  infoContainer: {
    padding: 12
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700'
  },
  reviewsText: {
    fontSize: 10
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 4
  },
  featureHighlight: {
    fontSize: 11,
    marginBottom: 8
  },
  priceActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4
  },
  price: {
    fontSize: 16,
    fontWeight: '800'
  },
  mrpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  mrpText: {
    fontSize: 11,
    textDecorationLine: 'line-through'
  },
  discountTag: {
    fontSize: 10,
    fontWeight: '700'
  },
  dealerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2
  },
  dealerWholesaleTag: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  savingsTag: {
    fontSize: 9,
    fontWeight: '700'
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  }
});

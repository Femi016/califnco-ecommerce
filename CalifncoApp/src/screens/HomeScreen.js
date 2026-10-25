import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

const { width } = Dimensions.get('window');

export const HomeScreen = ({
  searchQuery,
  onSelectProduct,
  onNavigateTab,
  onOpenCart
}) => {
  const { colors } = useTheme();
  const { role, switchRole } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const isDealer = role === 'dealer';

  // Filter products by category and search query
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            {/* Dealer Notice Banner if in dealer mode */}
            {isDealer ? (
              <View style={[styles.dealerTopBanner, { backgroundColor: colors.dealerBadge }]}>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dealerBannerTitle}>Wholesale Partner Mode Active</Text>
                  <Text style={styles.dealerBannerSub}>
                    Showing wholesale dealer prices (up to 40% margin) with MOQ.
                  </Text>
                </View>
              </View>
            ) : (
              /* Customer Hero Banner */
              <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
                <View style={styles.heroContent}>
                  <View style={styles.heroBadge}>
                    <Ionicons name="water" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.heroBadgeText}>100% PURE DRINKING WATER</Text>
                  </View>
                  <Text style={styles.heroTitle}>Clean Water for Healthy Living</Text>
                  <Text style={styles.heroSub}>
                    Certified RO+UV purifiers, authentic booster pumps & OEM spare parts.
                  </Text>
                  <View style={styles.heroStatsRow}>
                    <View style={styles.heroStat}>
                      <Text style={styles.heroStatNum}>50+</Text>
                      <Text style={styles.heroStatLabel}>Catalog Items</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                      <Text style={styles.heroStatNum}>0.0001µ</Text>
                      <Text style={styles.heroStatLabel}>RO Filtration</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                      <Text style={styles.heroStatNum}>₹0 Cost</Text>
                      <Text style={styles.heroStatLabel}>Free Tools</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Service Desk Quick Banner */}
            <TouchableOpacity
              style={[
                styles.serviceBanner,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              onPress={() => onNavigateTab('service')}
              activeOpacity={0.88}
            >
              <View style={[styles.serviceIconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="construct" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={[styles.serviceBannerTitle, { color: colors.text }]}>
                  Water Purifier Servicing & AMC
                </Text>
                <Text style={[styles.serviceBannerSub, { color: colors.textSecondary }]}>
                  Book certified technician in 2 mins. Free TDS testing.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </TouchableOpacity>

            {/* B2B Dealer Banner if currently regular customer */}
            {!isDealer && (
              <TouchableOpacity
                style={[
                  styles.dealerTeaser,
                  { backgroundColor: colors.dealerBadgeLight, borderColor: colors.dealerBadge }
                ]}
                onPress={() => onNavigateTab('dealer')}
                activeOpacity={0.88}
              >
                <Ionicons name="briefcase" size={20} color={colors.dealerBadge} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dealerTeaserTitle, { color: colors.dealerBadge }]}>
                    Are you a Water Purifier Dealer / Technician?
                  </Text>
                  <Text style={[styles.dealerTeaserSub, { color: colors.dealerBadge }]}>
                    Access bulk pricing, wholesale pumps & membranes with GST invoices.
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={colors.dealerBadge} />
              </TouchableOpacity>
            )}

            {/* Category Filter Pills */}
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Explore Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={15}
                      color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.categoryPillText,
                        { color: isSelected ? '#FFFFFF' : colors.text }
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Product Count Header */}
            <View style={styles.listHeaderRow}>
              <Text style={[styles.productCountText, { color: colors.textSecondary }]}>
                Showing <Text style={{ fontWeight: '800', color: colors.text }}>{filteredProducts.length}</Text> items
              </Text>
              {isDealer && (
                <Text style={[styles.dealerModeTag, { color: colors.dealerBadge }]}>
                  Wholesale Rates Applied
                </Text>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={onSelectProduct} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dealerTopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    marginBottom: 8
  },
  dealerBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  dealerBannerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11
  },
  heroCard: {
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6
  },
  heroContent: {
    gap: 6
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28
  },
  heroSub: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 12,
    lineHeight: 18
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 6
  },
  heroStat: {
    flex: 1,
    alignItems: 'center'
  },
  heroStatNum: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900'
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '600'
  },
  heroStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  serviceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10
  },
  serviceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  serviceBannerTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  serviceBannerSub: {
    fontSize: 11,
    marginTop: 2
  },
  dealerTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10
  },
  dealerTeaserTitle: {
    fontSize: 12,
    fontWeight: '800'
  },
  dealerTeaserSub: {
    fontSize: 10,
    opacity: 0.85,
    marginTop: 2
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 18,
    marginBottom: 10
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 4
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8
  },
  productCountText: {
    fontSize: 12
  },
  dealerModeTag: {
    fontSize: 11,
    fontWeight: '800'
  }
});

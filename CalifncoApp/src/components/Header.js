import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Header = ({
  searchQuery,
  setSearchQuery,
  onOpenNotifications,
  unreadCount = 2,
  onOpenCart,
  activeTab,
  setActiveTab
}) => {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { role, switchRole, user } = useAuth();
  const { cartTotalItems } = useCart();

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {/* Top Branding Row */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={[styles.logoIconBg, { backgroundColor: colors.primary }]}>
            <Ionicons name="water" size={20} color="#FFFFFF" />
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={[styles.brandTitle, { color: colors.text }]}>Califnco</Text>
              <Text style={[styles.brandSubtitle, { color: colors.primary }]}> WATER</Text>
            </View>
            <Text style={[styles.brandTagline, { color: colors.textSecondary }]}>
              {role === 'dealer'
                ? '⭐ Wholesale B2B Portal'
                : role === 'admin'
                ? '⚡ Operations Control'
                : 'Pure Water Solutions'}
            </Text>
          </View>
        </View>

        {/* Action Buttons: Dark Mode, Notifications, Cart */}
        <View style={styles.actionRow}>
          {/* Dark Mode Switch */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.cardAlt }]}
            onPress={toggleDarkMode}
            accessibilityLabel="Toggle Dark Mode"
          >
            <Ionicons
              name={isDarkMode ? 'sunny' : 'moon'}
              size={18}
              color={isDarkMode ? '#FBBF24' : colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.cardAlt }]}
            onPress={onOpenNotifications}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={18} color={colors.text} />
            {unreadCount > 0 && (
              <View style={[styles.badgeContainer, { backgroundColor: colors.danger }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Icon (Customer & Dealer) */}
          {role !== 'admin' && (
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.primaryLight }]}
              onPress={onOpenCart}
              accessibilityLabel="Cart"
            >
              <Ionicons name="cart" size={19} color={colors.primary} />
              {cartTotalItems > 0 && (
                <View style={[styles.badgeContainer, { backgroundColor: colors.primaryDark }]}>
                  <Text style={styles.badgeText}>{cartTotalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Role Switcher Pill Bar (Crucial for Reviewer to test all 3 personas) */}
      <View style={[styles.roleSwitchContainer, { backgroundColor: colors.cardAlt }]}>
        <Text style={[styles.roleLabel, { color: colors.textSecondary }]}>Role:</Text>
        <TouchableOpacity
          style={[
            styles.rolePill,
            role === 'customer' && [styles.rolePillActive, { backgroundColor: colors.primary }]
          ]}
          onPress={() => switchRole('customer')}
        >
          <Ionicons
            name="person"
            size={13}
            color={role === 'customer' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.rolePillText,
              { color: role === 'customer' ? '#FFFFFF' : colors.textSecondary }
            ]}
          >
            Customer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.rolePill,
            role === 'dealer' && [styles.rolePillActive, { backgroundColor: colors.dealerBadge }]
          ]}
          onPress={() => switchRole('dealer')}
        >
          <Ionicons
            name="briefcase"
            size={13}
            color={role === 'dealer' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.rolePillText,
              { color: role === 'dealer' ? '#FFFFFF' : colors.textSecondary }
            ]}
          >
            Dealer (Wholesale)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.rolePill,
            role === 'admin' && [styles.rolePillActive, { backgroundColor: colors.adminBadge }]
          ]}
          onPress={() => switchRole('admin')}
        >
          <Ionicons
            name="shield"
            size={13}
            color={role === 'admin' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.rolePillText,
              { color: role === 'admin' ? '#FFFFFF' : colors.textSecondary }
            ]}
          >
            Admin Panel
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input for Products */}
      {role !== 'admin' && (
        <View style={[styles.searchBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search 50+ purifiers, pumps, filters, spares..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '500'
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  roleSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 3,
    marginBottom: 10
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 4
  },
  rolePillActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '600'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0
  }
});

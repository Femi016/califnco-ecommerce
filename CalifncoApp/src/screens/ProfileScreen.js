import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AddressPickerModal } from '../components/AddressPickerModal';

export const ProfileScreen = ({ onNavigateTab }) => {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { role, user, switchRole, addAddress } = useAuth();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const handleCopyReferral = () => {
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* User Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.avatarRow}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarLetter}>{user.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
              <Text style={[styles.userContact, { color: colors.textSecondary }]}>{user.phone}</Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user.email}</Text>
            </View>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    role === 'dealer'
                      ? colors.dealerBadgeLight
                      : role === 'admin'
                      ? colors.adminBadgeLight
                      : colors.primaryLight
                }
              ]}
            >
              <Text
                style={[
                  styles.roleBadgeText,
                  {
                    color:
                      role === 'dealer'
                        ? colors.dealerBadge
                        : role === 'admin'
                        ? colors.adminBadge
                        : colors.primary
                  }
                ]}
              >
                {role.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Califnco Wallet & Referral Program (Bonus +5 pts) */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.walletHeader}>
            <View style={styles.walletHeaderLeft}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet" size={20} color="#F59E0B" />
              </View>
              <View>
                <Text style={[styles.sectionHeading, { color: colors.text }]}>Califnco Wallet</Text>
                <Text style={[styles.walletBalance, { color: colors.primary }]}>
                  ₹{user.walletBalance || 0}
                </Text>
              </View>
            </View>
            <View style={[styles.cashbackBadge, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.cashbackBadgeText, { color: colors.success }]}>Active Credits</Text>
            </View>
          </View>

          <View style={[styles.referralBox, { backgroundColor: colors.cardAlt }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Ionicons name="gift" size={16} color={colors.gold} style={{ marginRight: 6 }} />
              <Text style={[styles.referralTitle, { color: colors.text }]}>
                Refer Friends, Earn ₹250 Each!
              </Text>
            </View>
            <Text style={[styles.referralDesc, { color: colors.textSecondary }]}>
              Give friends ₹200 off their first RO purifier. When they install, get ₹250 credited directly to your wallet.
            </Text>

            <View style={styles.codeRow}>
              <View style={[styles.codeDisplay, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.codeText, { color: colors.primary }]}>{user.referralCode}</Text>
              </View>
              <TouchableOpacity
                style={[styles.copyBtn, { backgroundColor: colors.primary }]}
                onPress={handleCopyReferral}
              >
                <Ionicons name="copy-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.copyBtnText}>{copiedReferral ? 'Copied!' : 'Share Code'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Saved Addresses (OpenStreetMap Geocoded) */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>Saved Delivery Addresses</Text>
            <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
              <Text style={[styles.addAddrText, { color: colors.primary }]}>+ Add New (OSM)</Text>
            </TouchableOpacity>
          </View>

          {user.savedAddresses && user.savedAddresses.map((addr) => (
            <View
              key={addr.id}
              style={[styles.addressItem, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
            >
              <View style={styles.addressTagRow}>
                <View style={[styles.tagPill, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.tagPillText, { color: colors.primary }]}>{addr.tag}</Text>
                </View>
                {addr.isDefault && (
                  <Text style={[styles.defaultBadge, { color: colors.success }]}>Default</Text>
                )}
              </View>
              <Text style={[styles.addrStreet, { color: colors.text }]}>{addr.street}</Text>
              <Text style={[styles.addrCity, { color: colors.textSecondary }]}>
                {addr.area ? `${addr.area}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
              </Text>
            </View>
          ))}
        </View>

        {/* Preferences & Settings */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeading, { color: colors.text, marginBottom: 12 }]}>App Settings</Text>

          {/* Dark Mode Switch */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name={isDarkMode ? 'moon' : 'sunny-outline'} size={20} color={colors.text} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  {isDarkMode ? 'Dark UI enabled' : 'Light clean UI'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          {/* Email Receipts Toggle (EmailJS) */}
          <View style={[styles.settingRow, { marginTop: 12 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={20} color={colors.text} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>EmailJS Invoices</Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  Receive digital invoices to {user.email}
                </Text>
              </View>
            </View>
            <Switch
              value={emailNotifs}
              onValueChange={setEmailNotifs}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          {/* SMS Alerts Toggle (TextBee) */}
          <View style={[styles.settingRow, { marginTop: 12 }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color={colors.text} />
              <View style={{ marginLeft: 10 }}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>TextBee SMS Alerts</Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  Instant dispatch SMS to {user.phone}
                </Text>
              </View>
            </View>
            <Switch
              value={smsNotifs}
              onValueChange={setSmsNotifs}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        {/* Company & Support Information */}
        <View style={[styles.supportCard, { backgroundColor: colors.cardAlt }]}>
          <Text style={[styles.supportTitle, { color: colors.text }]}>Califnco Water Systems</Text>
          <Text style={[styles.supportSub, { color: colors.textSecondary }]}>
            Toll-Free Customer Care: 1800-425-WATER • help@califnco.com
          </Text>
          <Text style={[styles.versionText, { color: colors.textMuted }]}>
            CalifncoApp v1.0.0 (Round 1 Assignment Build)
          </Text>
        </View>
      </ScrollView>

      {/* Address Picker Modal */}
      <AddressPickerModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSelectAddress={addAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profileCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800'
  },
  userName: {
    fontSize: 16,
    fontWeight: '800'
  },
  userContact: {
    fontSize: 12,
    marginTop: 2
  },
  userEmail: {
    fontSize: 11,
    marginTop: 1
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  walletHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  walletIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800'
  },
  walletBalance: {
    fontSize: 20,
    fontWeight: '900'
  },
  cashbackBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  cashbackBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  referralBox: {
    padding: 12,
    borderRadius: 10
  },
  referralTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  referralDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8
  },
  codeDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 38
  },
  codeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 38
  },
  copyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  addAddrText: {
    fontSize: 12,
    fontWeight: '700'
  },
  addressItem: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8
  },
  addressTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  tagPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700'
  },
  defaultBadge: {
    fontSize: 10,
    fontWeight: '700'
  },
  addrStreet: {
    fontSize: 12,
    fontWeight: '700'
  },
  addrCity: {
    fontSize: 11,
    marginTop: 2
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  settingSub: {
    fontSize: 11
  },
  supportCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2
  },
  supportSub: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 6
  },
  versionText: {
    fontSize: 10
  }
});

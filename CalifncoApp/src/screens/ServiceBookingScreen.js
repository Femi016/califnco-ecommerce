import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useService } from '../context/ServiceContext';
import { sendTechnicianAssignedSMS } from '../services/smsService';

export const ServiceBookingScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { services, bookNewService, SERVICE_TYPES } = useService();

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'history'
  const [selectedService, setSelectedService] = useState(SERVICE_TYPES[0]);
  const [purifierModel, setPurifierModel] = useState('Califnco AquaShield Pro RO+UV');
  const [preferredDate, setPreferredDate] = useState('2026-10-27');
  const [preferredSlot, setPreferredSlot] = useState('10:00 AM - 01:00 PM');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '+91 98401 23456');
  const [serviceNotes, setServiceNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleBookService = () => {
    const newService = bookNewService({
      type: selectedService.name,
      customerName: user.name,
      phone: customerPhone,
      address: user.savedAddresses?.[0]?.street || 'Velachery, Chennai',
      preferredDate,
      preferredSlot,
      purifierModel,
      notes: serviceNotes || 'Periodic filter replacement & complete system inspection',
      estimatedCost: selectedService.price
    });

    setBookingSuccess(newService);
    setActiveTab('history');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Tab Switcher */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'book' && [styles.tabActive, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('book')}
        >
          <Ionicons
            name="calendar-outline"
            size={18}
            color={activeTab === 'book' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'book' ? colors.primary : colors.textSecondary }
            ]}
          >
            Book RO Service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'history' && [styles.tabActive, { borderBottomColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons
            name="clipboard-outline"
            size={18}
            color={activeTab === 'history' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'history' ? colors.primary : colors.textSecondary }
            ]}
          >
            My Service Tickets ({services.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {activeTab === 'book' ? (
          <View>
            {/* Header Banner */}
            <View style={[styles.headerBanner, { backgroundColor: colors.primary }]}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Califnco Certified RO Care</Text>
                <Text style={styles.bannerSub}>
                  Expert doorstep water purifier repair, genuine filter replacements, and digital TDS water testing.
                </Text>
              </View>
            </View>

            {/* Service Type Selection */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Service Required</Text>
            <View style={styles.serviceTypesList}>
              {SERVICE_TYPES.map((type) => {
                const isSelected = selectedService.id === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.serviceTypeCard,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => setSelectedService(type)}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <View style={{ flex: 1, marginHorizontal: 10 }}>
                      <Text style={[styles.serviceTypeName, { color: colors.text }]}>{type.name}</Text>
                      <Text style={[styles.serviceTypeDuration, { color: colors.textSecondary }]}>
                        Duration: {type.duration}
                      </Text>
                    </View>
                    <Text style={[styles.serviceTypePrice, { color: colors.primary }]}>
                      ₹{type.price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Purifier Model Input */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}>Purifier Model</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="cube-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={purifierModel}
                onChangeText={setPurifierModel}
                placeholder="e.g. Califnco AquaShield Pro or Kent / Aquaguard"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* Date Selection */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}>Preferred Visit Date</Text>
            <View style={styles.dateChipsRow}>
              {['2026-10-25 (Today)', '2026-10-26 (Tomorrow)', '2026-10-27 (Tuesday)'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: preferredDate === d.split(' ')[0] ? colors.primary : colors.card,
                      borderColor: preferredDate === d.split(' ')[0] ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setPreferredDate(d.split(' ')[0])}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      { color: preferredDate === d.split(' ')[0] ? '#FFFFFF' : colors.text }
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Time Slot Selection */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}>Preferred Time Slot</Text>
            <View style={styles.slotRow}>
              {['10:00 AM - 01:00 PM', '02:00 PM - 05:00 PM', '05:00 PM - 08:00 PM'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.slotChip,
                    {
                      backgroundColor: preferredSlot === s ? colors.primaryLight : colors.card,
                      borderColor: preferredSlot === s ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setPreferredSlot(s)}
                >
                  <Text
                    style={[
                      styles.slotChipText,
                      { color: preferredSlot === s ? colors.primary : colors.text }
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Phone Number Input */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}>Contact Mobile</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="call-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Service Notes */}
            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 14 }]}>Specific Issues / Remarks</Text>
            <View style={[styles.notesBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={serviceNotes}
                onChangeText={setServiceNotes}
                placeholder="e.g. Water taste salty, slow water flow from tap, vibration noise..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Confirm Service Booking CTA */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.primary }]}
              onPress={handleBookService}
            >
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Confirm Doorstep Service Request (₹{selectedService.price})</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Service Tickets History */
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active & Past Service Requests</Text>
            {services.map((srv) => (
              <View
                key={srv.id}
                style={[styles.ticketCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.ticketHeader}>
                  <View>
                    <Text style={[styles.ticketId, { color: colors.primary }]}>{srv.id}</Text>
                    <Text style={[styles.ticketType, { color: colors.text }]}>{srv.type}</Text>
                  </View>
                  <View
                    style={[
                      styles.ticketStatusBadge,
                      {
                        backgroundColor:
                          srv.status === 'Completed'
                            ? colors.successLight
                            : srv.status === 'Assigned'
                            ? colors.primaryLight
                            : colors.warningLight
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.ticketStatusText,
                        {
                          color:
                            srv.status === 'Completed'
                              ? colors.success
                              : srv.status === 'Assigned'
                              ? colors.primary
                              : colors.warning
                        }
                      ]}
                    >
                      {srv.status}
                    </Text>
                  </View>
                </View>

                <View style={[styles.ticketDetailRow, { backgroundColor: colors.cardAlt }]}>
                  <Ionicons name="calendar" size={14} color={colors.primary} />
                  <Text style={[styles.ticketDetailText, { color: colors.textSecondary }]}>
                    Date: {srv.preferredDate} ({srv.preferredSlot})
                  </Text>
                </View>

                {/* Assigned Technician Card if assigned */}
                {srv.technician ? (
                  <View style={[styles.techBox, { backgroundColor: colors.successLight, borderColor: colors.success }]}>
                    <Ionicons name="person-circle" size={32} color={colors.success} style={{ marginRight: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.techTitle, { color: colors.success }]}>
                        Assigned Certified Technician
                      </Text>
                      <Text style={[styles.techName, { color: colors.text }]}>{srv.technician.name}</Text>
                      <Text style={[styles.techPhone, { color: colors.textSecondary }]}>
                        📞 {srv.technician.phone} • ★ {srv.technician.rating} ({srv.technician.experience})
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.pendingTechBox, { backgroundColor: colors.warningLight }]}>
                    <Ionicons name="time" size={18} color={colors.warning} style={{ marginRight: 6 }} />
                    <Text style={[styles.pendingTechText, { color: colors.warning }]}>
                      Technician assignment in progress. Admin Desk reviewing nearest technician.
                    </Text>
                  </View>
                )}

                <View style={styles.ticketFooter}>
                  <Text style={[styles.ticketNotes, { color: colors.textMuted }]}>
                    Notes: {srv.notes}
                  </Text>
                  <Text style={[styles.ticketCost, { color: colors.text }]}>
                    Est. Charge: ₹{srv.estimatedCost}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabActive: {
    borderBottomWidth: 2
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700'
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12
  },
  bannerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8
  },
  serviceTypesList: {
    gap: 8
  },
  serviceTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5
  },
  serviceTypeName: {
    fontSize: 13,
    fontWeight: '700'
  },
  serviceTypeDuration: {
    fontSize: 11,
    marginTop: 2
  },
  serviceTypePrice: {
    fontSize: 14,
    fontWeight: '900'
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1
  },
  notesBox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1
  },
  input: {
    flex: 1,
    fontSize: 13,
    padding: 0
  },
  dateChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  dateChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  slotChip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1.5
  },
  slotChipText: {
    fontSize: 11,
    fontWeight: '700'
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 10,
    marginTop: 20
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  ticketCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '800'
  },
  ticketType: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2
  },
  ticketStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  ticketStatusText: {
    fontSize: 11,
    fontWeight: '800'
  },
  ticketDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    gap: 6,
    marginBottom: 8
  },
  ticketDetailText: {
    fontSize: 11
  },
  techBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8
  },
  techTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  techName: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 1
  },
  techPhone: {
    fontSize: 11,
    marginTop: 2
  },
  pendingTechBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },
  pendingTechText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  ticketNotes: {
    fontSize: 11,
    flex: 1
  },
  ticketCost: {
    fontSize: 12,
    fontWeight: '800'
  }
});

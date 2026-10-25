import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useService } from '../context/ServiceContext';

export const AdminDashboardScreen = () => {
  const { colors } = useTheme();
  const { dealersList, approveDealer, rejectDealer } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const { services, assignTechnician, updateServiceStatus, TECHNICIANS_LIST } = useService();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'dealers' | 'services'
  const [selectedTechModal, setSelectedTechModal] = useState(null);

  // Compute analytics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const approvedDealersCount = dealersList.filter(d => d.status === 'approved').length;
  const pendingDealersCount = dealersList.filter(d => d.status === 'pending').length;
  const pendingServicesCount = services.filter(s => s.status !== 'Completed').length;

  const handleStatusChange = (orderId, currentStatus) => {
    const nextStates = {
      'Placed': 'Processing',
      'Processing': 'Shipped',
      'Shipped': 'Out for Delivery',
      'Out for Delivery': 'Delivered',
      'Delivered': 'Delivered'
    };
    const next = nextStates[currentStatus] || 'Processing';
    updateOrderStatus(orderId, next);
  };

  const handleAssignTech = (serviceId, tech) => {
    assignTechnician(serviceId, tech);
    setSelectedTechModal(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Admin Title Header */}
      <View style={[styles.adminHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.adminTitleRow}>
          <View style={[styles.adminBadgeIcon, { backgroundColor: colors.adminBadge }]}>
            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.adminTitle, { color: colors.text }]}>Califnco Admin Ops Console</Text>
            <Text style={[styles.adminSub, { color: colors.adminBadge }]}>
              Master Control • Orders, Wholesale Dealers & Service Desk
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* KPI Overview Cards */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Total Gross Sales</Text>
            <Text style={[styles.kpiValue, { color: colors.primary }]}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </Text>
            <Text style={[styles.kpiSub, { color: colors.success }]}>↑ 18.4% vs last week</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Total Orders</Text>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{totalOrders}</Text>
            <Text style={[styles.kpiSub, { color: colors.primary }]}>
              {orders.filter(o => o.role === 'dealer').length} Wholesale B2B
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Dealer Network</Text>
            <Text style={[styles.kpiValue, { color: colors.dealerBadge }]}>{approvedDealersCount}</Text>
            <Text style={[styles.kpiSub, { color: colors.warning }]}>
              {pendingDealersCount} Pending Review
            </Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Service Desk</Text>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{services.length}</Text>
            <Text style={[styles.kpiSub, { color: colors.danger }]}>
              {pendingServicesCount} Actionable
            </Text>
          </View>
        </View>

        {/* Section Navigation Tabs */}
        <View style={[styles.adminTabBar, { backgroundColor: colors.cardAlt }]}>
          {[
            { id: 'orders', label: `Orders (${orders.length})`, icon: 'cube' },
            { id: 'dealers', label: `Dealers (${dealersList.length})`, icon: 'briefcase' },
            { id: 'services', label: `Service Desk (${services.length})`, icon: 'construct' }
          ].map(t => (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.adminTab,
                activeTab === t.id && [styles.adminTabActive, { backgroundColor: colors.card }]
              ]}
              onPress={() => setActiveTab(t.id)}
            >
              <Ionicons
                name={t.icon}
                size={14}
                color={activeTab === t.id ? colors.adminBadge : colors.textSecondary}
              />
              <Text
                style={[
                  styles.adminTabText,
                  { color: activeTab === t.id ? colors.adminBadge : colors.textSecondary }
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <View>
            <Text style={[styles.tabHeading, { color: colors.text }]}>All Customer & Wholesale Orders</Text>
            {orders.map((ord) => (
              <View
                key={ord.id}
                style={[styles.manageCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.manageHeader}>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={[styles.manageOrderId, { color: colors.primary }]}>{ord.id}</Text>
                      <View
                        style={[
                          styles.rolePill,
                          {
                            backgroundColor:
                              ord.role === 'dealer' ? colors.dealerBadgeLight : colors.primaryLight
                          }
                        ]}
                      >
                        <Text
                          style={[
                            styles.rolePillText,
                            { color: ord.role === 'dealer' ? colors.dealerBadge : colors.primary }
                          ]}
                        >
                          {ord.role === 'dealer' ? 'B2B WHOLESALE' : 'CUSTOMER'}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.manageCustomer, { color: colors.text }]}>
                      {ord.customerName} {ord.dealerBusiness ? `(${ord.dealerBusiness})` : ''}
                    </Text>
                    <Text style={[styles.manageContact, { color: colors.textMuted }]}>
                      {ord.phone} • {ord.email}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.manageTotal, { color: colors.text }]}>
                      ₹{ord.total.toLocaleString('en-IN')}
                    </Text>
                    <Text style={[styles.manageDate, { color: colors.textMuted }]}>{ord.date}</Text>
                  </View>
                </View>

                {/* Items Summary */}
                <View style={[styles.itemsBox, { backgroundColor: colors.cardAlt }]}>
                  {ord.items.map((it, idx) => (
                    <Text key={idx} style={[styles.itemSummaryLine, { color: colors.textSecondary }]}>
                      • {it.name} (x{it.quantity})
                    </Text>
                  ))}
                  <Text style={[styles.trackingLine, { color: colors.textMuted }]}>
                    Tracking: {ord.deliveryPartner} ({ord.trackingNumber})
                  </Text>
                </View>

                {/* Status Update Controller */}
                <View style={styles.statusControlRow}>
                  <View style={styles.currentStatusBox}>
                    <Text style={[styles.statusPrefix, { color: colors.textSecondary }]}>Current Status:</Text>
                    <Text style={[styles.statusValue, { color: colors.primary }]}>{ord.status}</Text>
                  </View>

                  {ord.status !== 'Delivered' && (
                    <TouchableOpacity
                      style={[styles.advanceBtn, { backgroundColor: colors.primary }]}
                      onPress={() => handleStatusChange(ord.id, ord.status)}
                    >
                      <Text style={styles.advanceBtnText}>Advance Status →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: DEALER MANAGEMENT */}
        {activeTab === 'dealers' && (
          <View>
            <Text style={[styles.tabHeading, { color: colors.text }]}>
              Dealer Partner Verification & Whitelist
            </Text>
            {dealersList.map((dlr) => {
              const isApproved = dlr.status === 'approved';
              const isPending = dlr.status === 'pending';

              return (
                <View
                  key={dlr.id}
                  style={[styles.manageCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.manageHeader}>
                    <View>
                      <Text style={[styles.dealerBizName, { color: colors.text }]}>
                        {dlr.businessName}
                      </Text>
                      <Text style={[styles.dealerOwner, { color: colors.textSecondary }]}>
                        Contact: {dlr.ownerName} ({dlr.phone})
                      </Text>
                      <Text style={[styles.dealerGst, { color: colors.textMuted }]}>
                        GSTIN: {dlr.gstin} • {dlr.city}, {dlr.state}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.dealerStatusBadge,
                        {
                          backgroundColor: isApproved
                            ? colors.successLight
                            : isPending
                            ? colors.warningLight
                            : colors.dangerLight
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.dealerStatusText,
                          {
                            color: isApproved
                              ? colors.success
                              : isPending
                              ? colors.warning
                              : colors.danger
                          }
                        ]}
                      >
                        {dlr.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.dealerKpis, { backgroundColor: colors.cardAlt }]}>
                    <Text style={[styles.dealerKpiText, { color: colors.textSecondary }]}>
                      Applied Date: <Text style={{ color: colors.text, fontWeight: '700' }}>{dlr.appliedDate}</Text>
                    </Text>
                    <Text style={[styles.dealerKpiText, { color: colors.textSecondary }]}>
                      Credit Limit: <Text style={{ color: colors.dealerBadge, fontWeight: '800' }}>₹{dlr.creditLimit.toLocaleString('en-IN')}</Text>
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.dealerActionsRow}>
                    {!isApproved ? (
                      <TouchableOpacity
                        style={[styles.approveBtn, { backgroundColor: colors.success }]}
                        onPress={() => approveDealer(dlr.id)}
                      >
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.approveBtnText}>Approve Wholesale Dealer</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="shield-checkmark" size={16} color={colors.success} style={{ marginRight: 4 }} />
                        <Text style={[styles.approvedNotice, { color: colors.success }]}>
                          Wholesale Access Active
                        </Text>
                      </View>
                    )}

                    {isPending && (
                      <TouchableOpacity
                        style={[styles.rejectBtn, { borderColor: colors.danger }]}
                        onPress={() => rejectDealer(dlr.id)}
                      >
                        <Text style={[styles.rejectBtnText, { color: colors.danger }]}>Reject</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 3: SERVICE DESK */}
        {activeTab === 'services' && (
          <View>
            <Text style={[styles.tabHeading, { color: colors.text }]}>Service Desk & Technician Dispatch</Text>
            {services.map((srv) => (
              <View
                key={srv.id}
                style={[styles.manageCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.manageHeader}>
                  <View>
                    <Text style={[styles.manageOrderId, { color: colors.primary }]}>{srv.id}</Text>
                    <Text style={[styles.serviceCustName, { color: colors.text }]}>{srv.customerName}</Text>
                    <Text style={[styles.serviceTypeTitle, { color: colors.textSecondary }]}>{srv.type}</Text>
                    <Text style={[styles.serviceAddr, { color: colors.textMuted }]}>
                      📍 {srv.address} • 📞 {srv.phone}
                    </Text>
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

                {/* Technician Status */}
                <View style={[styles.itemsBox, { backgroundColor: colors.cardAlt }]}>
                  {srv.technician ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="person" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                      <Text style={[styles.techText, { color: colors.text }]}>
                        Assigned: {srv.technician.name} ({srv.technician.phone}) • Slot: {srv.preferredDate} ({srv.preferredSlot})
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.techText, { color: colors.warning }]}>
                      ⚠️ No technician assigned yet. Slot requested: {srv.preferredDate} ({srv.preferredSlot})
                    </Text>
                  )}
                  <Text style={[styles.notesText, { color: colors.textMuted }]}>
                    Remarks: {srv.notes}
                  </Text>
                </View>

                {/* Actions: Assign Technician or Complete */}
                <View style={styles.serviceActionsRow}>
                  {!srv.technician && (
                    <TouchableOpacity
                      style={[styles.assignBtn, { backgroundColor: colors.primary }]}
                      onPress={() => setSelectedTechModal(srv.id)}
                    >
                      <Ionicons name="person-add" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.assignBtnText}>Assign Technician</Text>
                    </TouchableOpacity>
                  )}

                  {srv.status !== 'Completed' ? (
                    <TouchableOpacity
                      style={[styles.completeBtn, { backgroundColor: colors.success }]}
                      onPress={() => updateServiceStatus(srv.id, 'Completed')}
                    >
                      <Ionicons name="checkmark-done" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={styles.completeBtnText}>Mark Resolved</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.resolvedText, { color: colors.success }]}>
                      ✓ Service Ticket Resolved & Closed
                    </Text>
                  )}
                </View>

                {/* Modal Picker for Certified Technicians */}
                {selectedTechModal === srv.id && (
                  <View style={[styles.techModalBox, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
                    <Text style={[styles.pickTechTitle, { color: colors.text }]}>
                      Select Certified Technician to Dispatch:
                    </Text>
                    {TECHNICIANS_LIST.map((tech) => (
                      <TouchableOpacity
                        key={tech.id}
                        style={[styles.techPickItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => handleAssignTech(srv.id, tech)}
                      >
                        <Ionicons name="person-circle" size={24} color={colors.primary} style={{ marginRight: 8 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.techPickName, { color: colors.text }]}>{tech.name}</Text>
                          <Text style={[styles.techPickSub, { color: colors.textSecondary }]}>
                            {tech.experience} • ★ {tech.rating}
                          </Text>
                        </View>
                        <Text style={[styles.techPickAction, { color: colors.primary }]}>Assign</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.cancelTechBtn}
                      onPress={() => setSelectedTechModal(null)}
                    >
                      <Text style={[styles.cancelTechText, { color: colors.danger }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  adminHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  adminTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  adminBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  adminSub: {
    fontSize: 11,
    fontWeight: '700'
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  kpiCard: {
    width: '48.5%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600'
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 4
  },
  kpiSub: {
    fontSize: 10,
    fontWeight: '700'
  },
  adminTabBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
    marginBottom: 16
  },
  adminTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4
  },
  adminTabActive: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  adminTabText: {
    fontSize: 11,
    fontWeight: '700'
  },
  tabHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10
  },
  manageCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12
  },
  manageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  manageOrderId: {
    fontSize: 13,
    fontWeight: '800'
  },
  rolePill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  rolePillText: {
    fontSize: 9,
    fontWeight: '800'
  },
  manageCustomer: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  manageContact: {
    fontSize: 11,
    marginTop: 2
  },
  manageTotal: {
    fontSize: 16,
    fontWeight: '900'
  },
  manageDate: {
    fontSize: 11,
    marginTop: 2
  },
  itemsBox: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    gap: 2
  },
  itemSummaryLine: {
    fontSize: 11
  },
  trackingLine: {
    fontSize: 10,
    marginTop: 4
  },
  statusControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4
  },
  currentStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusPrefix: {
    fontSize: 11
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '800'
  },
  advanceBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  advanceBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  dealerBizName: {
    fontSize: 14,
    fontWeight: '800'
  },
  dealerOwner: {
    fontSize: 12,
    marginTop: 2
  },
  dealerGst: {
    fontSize: 11,
    marginTop: 2
  },
  dealerStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  dealerStatusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  dealerKpis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8
  },
  dealerKpiText: {
    fontSize: 11
  },
  dealerActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  approvedNotice: {
    fontSize: 12,
    fontWeight: '700'
  },
  rejectBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1
  },
  rejectBtnText: {
    fontSize: 11,
    fontWeight: '700'
  },
  serviceCustName: {
    fontSize: 13,
    fontWeight: '700'
  },
  serviceTypeTitle: {
    fontSize: 12,
    marginTop: 1
  },
  serviceAddr: {
    fontSize: 11,
    marginTop: 2
  },
  ticketStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  ticketStatusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  techText: {
    fontSize: 11,
    fontWeight: '600'
  },
  notesText: {
    fontSize: 10,
    marginTop: 2
  },
  serviceActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  assignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  assignBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  resolvedText: {
    fontSize: 11,
    fontWeight: '700'
  },
  techModalBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginTop: 10
  },
  pickTechTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8
  },
  techPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6
  },
  techPickName: {
    fontSize: 12,
    fontWeight: '700'
  },
  techPickSub: {
    fontSize: 10
  },
  techPickAction: {
    fontSize: 11,
    fontWeight: '800'
  },
  cancelTechBtn: {
    alignItems: 'center',
    paddingTop: 6
  },
  cancelTechText: {
    fontSize: 11,
    fontWeight: '700'
  }
});

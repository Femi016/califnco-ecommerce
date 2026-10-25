import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

export const OrderHistoryScreen = ({ onStartShopping }) => {
  const { colors } = useTheme();
  const { role, user } = useAuth();
  const { orders } = useOrders();
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'active' | 'delivered'

  // Filter orders according to user role and tab
  const userOrders = orders.filter(o => {
    const isOwner = role === 'admin' ? true : (o.role === role || o.email === user.email);
    if (!isOwner) return false;

    if (filterTab === 'active') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (filterTab === 'delivered') return o.status === 'Delivered';
    return true;
  });

  const getStatusProgress = (status) => {
    switch (status) {
      case 'Placed':
        return 0.25;
      case 'Processing':
        return 0.5;
      case 'Shipped':
        return 0.75;
      case 'Out for Delivery':
        return 0.88;
      case 'Delivered':
        return 1.0;
      default:
        return 0.25;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return colors.success;
      case 'Shipped':
      case 'Out for Delivery':
        return colors.primary;
      case 'Processing':
        return colors.warning;
      case 'Cancelled':
        return colors.danger;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={[styles.heading, { color: colors.text }]}>
            {role === 'dealer' ? 'Dealer Bulk Purchase Orders' : 'Order History & Tracking'}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: role === 'dealer' ? colors.dealerBadgeLight : colors.primaryLight }]}>
            <Text style={[styles.roleBadgeText, { color: role === 'dealer' ? colors.dealerBadge : colors.primary }]}>
              {role.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={[styles.filterBar, { backgroundColor: colors.cardAlt }]}>
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active & In-Transit' },
            { id: 'delivered', label: 'Delivered' }
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                filterTab === tab.id && [styles.filterTabActive, { backgroundColor: colors.card }]
              ]}
              onPress={() => setFilterTab(tab.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: filterTab === tab.id ? colors.primary : colors.textSecondary }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <View style={styles.emptyView}>
            <Ionicons name="cube-outline" size={54} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No orders found</Text>
            <TouchableOpacity
              style={[styles.startShoppingBtn, { backgroundColor: colors.primary }]}
              onPress={onStartShopping}
            >
              <Text style={styles.startShoppingBtnText}>Browse 50+ Califnco Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          userOrders.map((ord) => {
            const progress = getStatusProgress(ord.status);
            const statusColor = getStatusColor(ord.status);

            return (
              <View
                key={ord.id}
                style={[styles.orderCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                {/* Header: Order ID & Date */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.orderId, { color: colors.primary }]}>{ord.id}</Text>
                    <Text style={[styles.orderDate, { color: colors.textMuted }]}>Placed on {ord.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                    <Text style={[styles.statusBadgeText, { color: statusColor }]}>{ord.status}</Text>
                  </View>
                </View>

                {/* Tracking Progress Bar */}
                <View style={styles.trackingContainer}>
                  <View style={[styles.progressTrack, { backgroundColor: colors.cardAlt }]}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${progress * 100}%`, backgroundColor: statusColor }
                      ]}
                    />
                  </View>
                  <View style={styles.stagesRow}>
                    <Text style={[styles.stageText, { color: progress >= 0.25 ? statusColor : colors.textMuted }]}>
                      Placed
                    </Text>
                    <Text style={[styles.stageText, { color: progress >= 0.5 ? statusColor : colors.textMuted }]}>
                      Processing
                    </Text>
                    <Text style={[styles.stageText, { color: progress >= 0.75 ? statusColor : colors.textMuted }]}>
                      Dispatched
                    </Text>
                    <Text style={[styles.stageText, { color: progress >= 1.0 ? statusColor : colors.textMuted }]}>
                      Delivered
                    </Text>
                  </View>
                </View>

                {/* Delivery Info */}
                <View style={[styles.deliveryInfoBox, { backgroundColor: colors.cardAlt }]}>
                  <View style={styles.deliveryInfoRow}>
                    <Ionicons name="airplane-outline" size={16} color={colors.primary} />
                    <Text style={[styles.deliveryText, { color: colors.textSecondary }]}>
                      {ord.deliveryPartner} : <Text style={{ fontWeight: '700', color: colors.text }}>{ord.trackingNumber}</Text>
                    </Text>
                  </View>
                  <View style={styles.deliveryInfoRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.success} />
                    <Text style={[styles.deliveryText, { color: colors.textSecondary }]}>
                      Estimated Delivery: <Text style={{ fontWeight: '700', color: colors.success }}>{ord.estimatedDelivery}</Text>
                    </Text>
                  </View>
                </View>

                {/* Items Thumbnails */}
                <View style={styles.itemsList}>
                  {ord.items.map((it, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Image source={{ uri: it.image }} style={styles.itemThumb} resizeMode="cover" />
                      <View style={{ flex: 1, marginHorizontal: 8 }}>
                        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                          {it.name}
                        </Text>
                        <Text style={[styles.itemQtyPrice, { color: colors.textSecondary }]}>
                          Qty: {it.quantity} • ₹{it.unitPrice.toLocaleString('en-IN')} each
                        </Text>
                      </View>
                      <Text style={[styles.itemSubtotal, { color: colors.text }]}>
                        ₹{(it.quantity * it.unitPrice).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Footer: Payment Method & Total */}
                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <View>
                    <Text style={[styles.payMethodText, { color: colors.textSecondary }]}>
                      Paid via {ord.paymentMethod}
                    </Text>
                    <Text style={[styles.addressText, { color: colors.textMuted }]} numberOfLines={1}>
                      📍 {ord.address?.street}, {ord.address?.city}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Invoice Total</Text>
                    <Text style={[styles.totalAmount, { color: colors.primary }]}>
                      ₹{ord.total.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  heading: {
    fontSize: 18,
    fontWeight: '800'
  },
  roleBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  filterBar: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 10,
    marginBottom: 16
  },
  filterTab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8
  },
  filterTabActive: {
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700'
  },
  emptyView: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 16
  },
  startShoppingBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8
  },
  startShoppingBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  orderCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800'
  },
  orderDate: {
    fontSize: 11,
    marginTop: 2
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  trackingContainer: {
    marginBottom: 12
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4
  },
  progressBar: {
    height: '100%',
    borderRadius: 3
  },
  stagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stageText: {
    fontSize: 10,
    fontWeight: '600'
  },
  deliveryInfoBox: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    gap: 4
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  deliveryText: {
    fontSize: 11
  },
  itemsList: {
    gap: 8,
    marginBottom: 12
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemThumb: {
    width: 38,
    height: 38,
    borderRadius: 6
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700'
  },
  itemQtyPrice: {
    fontSize: 10,
    marginTop: 2
  },
  itemSubtotal: {
    fontSize: 12,
    fontWeight: '800'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1
  },
  payMethodText: {
    fontSize: 11,
    fontWeight: '600'
  },
  addressText: {
    fontSize: 10,
    maxWidth: 180,
    marginTop: 2
  },
  totalLabel: {
    fontSize: 10
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '900'
  }
});

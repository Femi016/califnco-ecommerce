import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export const NotificationModal = ({ visible, onClose }) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Push Notifications</Text>
            <Text style={[styles.headerSub, { color: colors.primary }]}>Firebase Cloud Messaging (FCM)</Text>
          </View>
        </View>

        {/* Notifications List */}
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {INITIAL_NOTIFICATIONS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                {
                  backgroundColor: colors.card,
                  borderColor: item.unread ? colors.primary : colors.border
                }
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconTagRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor:
                          item.type === 'order'
                            ? colors.primaryLight
                            : item.type === 'dealer'
                            ? colors.dealerBadgeLight
                            : item.type === 'referral'
                            ? colors.successLight
                            : '#FEF3C7'
                      }
                    ]}
                  >
                    <Ionicons
                      name={
                        item.type === 'order'
                          ? 'cube'
                          : item.type === 'dealer'
                          ? 'briefcase'
                          : item.type === 'referral'
                          ? 'gift'
                          : 'flash'
                      }
                      size={18}
                      color={
                        item.type === 'order'
                          ? colors.primary
                          : item.type === 'dealer'
                          ? colors.dealerBadge
                          : item.type === 'referral'
                          ? colors.success
                          : '#D97706'
                      }
                    />
                  </View>
                  <Text style={[styles.titleText, { color: colors.text }]}>{item.title}</Text>
                </View>
                {item.unread && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                )}
              </View>

              <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                {item.message}
              </Text>

              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                <Text style={[styles.timeText, { color: colors.textMuted }]}>{item.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  backBtn: {
    padding: 6
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '700'
  },
  itemCard: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  iconTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  messageText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  timeText: {
    fontSize: 10
  }
});

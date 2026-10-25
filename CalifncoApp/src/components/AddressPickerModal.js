import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { searchAddressOSM } from '../services/osmService';

export const AddressPickerModal = ({ visible, onClose, onSelectAddress }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState('Home');
  const [flatNumber, setFlatNumber] = useState('');

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length >= 2) {
      setLoading(true);
      const items = await searchAddressOSM(text);
      setResults(items);
      setLoading(false);
    } else {
      setResults([]);
    }
  };

  const handlePickAddress = (item) => {
    const fullAddress = {
      tag,
      flat: flatNumber || 'Door No. 12/B',
      street: item.road || item.displayName.split(',')[0],
      area: item.displayName.split(',')[1]?.trim() || item.city,
      city: item.city || 'Chennai',
      state: item.state || 'Tamil Nadu',
      pincode: item.pincode || '600042',
      coordinates: { lat: item.lat, lng: item.lng },
      source: 'OpenStreetMap (OSM Nominatim Free Tier)'
    };

    onSelectAddress(fullAddress);
    onClose();
  };

  const quickLocations = [
    { name: 'Velachery 100 Feet Rd', city: 'Chennai', lat: 12.9759, lng: 80.2212, pincode: '600042' },
    { name: 'Anna Nagar West', city: 'Chennai', lat: 13.0850, lng: 80.2101, pincode: '600040' },
    { name: 'Guindy Industrial Estate (B2B Hub)', city: 'Chennai', lat: 13.0067, lng: 80.2033, pincode: '600032' },
    { name: 'Indiranagar 100ft Rd', city: 'Bengaluru', lat: 12.9716, lng: 77.6412, pincode: '560038' },
    { name: 'Madhapur Hitec City', city: 'Hyderabad', lat: 17.4435, lng: 78.3772, pincode: '500081' }
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Navigation Bar */}
        <View style={[styles.navBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginHorizontal: 10 }}>
            <Text style={[styles.navTitle, { color: colors.text }]}>Delivery Location</Text>
            <View style={styles.osmBadge}>
              <Ionicons name="map" size={11} color={colors.primary} style={{ marginRight: 3 }} />
              <Text style={[styles.osmBadgeText, { color: colors.primary }]}>OpenStreetMap Live Geocoding</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Address Tag Selector */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Address Type / Label:</Text>
          <View style={styles.tagRow}>
            {['Home', 'Office', 'Warehouse', 'Store'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tagPill,
                  { backgroundColor: tag === t ? colors.primary : colors.cardAlt }
                ]}
                onPress={() => setTag(t)}
              >
                <Ionicons
                  name={t === 'Home' ? 'home' : t === 'Office' ? 'business' : 'cube'}
                  size={14}
                  color={tag === t ? '#FFFFFF' : colors.textSecondary}
                />
                <Text style={[styles.tagPillText, { color: tag === t ? '#FFFFFF' : colors.textSecondary }]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Flat / Building Input */}
          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 12 }]}>
            Door / Flat / Building / Floor:
          </Text>
          <View style={[styles.inputBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="home-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g. Flat 402, Green Valley Apts"
              placeholderTextColor={colors.textMuted}
              value={flatNumber}
              onChangeText={setFlatNumber}
            />
          </View>

          {/* OpenStreetMap Search Box */}
          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>
            Search Street, Landmark, or Area (OSM):
          </Text>
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Type area (e.g. Velachery, Guindy, Anna Nagar)..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCorrect={false}
            />
            {loading && <ActivityIndicator size="small" color={colors.primary} />}
          </View>

          {/* Search Results */}
          {results.length > 0 && (
            <View style={[styles.resultsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.resultsHeader, { color: colors.primary }]}>
                Nominatim OpenStreetMap Results:
              </Text>
              {results.map((res, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.resultItem, { borderBottomColor: colors.border }]}
                  onPress={() => handlePickAddress(res)}
                >
                  <Ionicons name="location" size={18} color={colors.primary} style={{ marginTop: 2, marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resultTitle, { color: colors.text }]}>{res.displayName}</Text>
                    <Text style={[styles.resultCoord, { color: colors.textMuted }]}>
                      Lat: {res.lat.toFixed(4)}, Lng: {res.lng.toFixed(4)} • Pincode: {res.pincode}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quick Preset Indian Hubs */}
          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>
            Or Quick Pick Popular Delivery Centers:
          </Text>
          <View style={styles.presetsGrid}>
            {quickLocations.map((loc, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.presetCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() =>
                  handlePickAddress({
                    displayName: `${loc.name}, ${loc.city} - ${loc.pincode}`,
                    road: loc.name,
                    city: loc.city,
                    state: 'Tamil Nadu',
                    pincode: loc.pincode,
                    lat: loc.lat,
                    lng: loc.lng
                  })
                }
              >
                <Ionicons name="navigate-circle" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.presetName, { color: colors.text }]}>{loc.name}</Text>
                  <Text style={[styles.presetCity, { color: colors.textSecondary }]}>
                    {loc.city} ({loc.pincode})
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  closeBtn: {
    padding: 6
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  osmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  osmBadgeText: {
    fontSize: 10,
    fontWeight: '700'
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.5
  },
  input: {
    flex: 1,
    fontSize: 13,
    padding: 0
  },
  resultsCard: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden'
  },
  resultsHeader: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4
  },
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '600'
  },
  resultCoord: {
    fontSize: 11,
    marginTop: 2
  },
  presetsGrid: {
    gap: 8
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1
  },
  presetName: {
    fontSize: 13,
    fontWeight: '700'
  },
  presetCity: {
    fontSize: 11,
    marginTop: 2
  }
});

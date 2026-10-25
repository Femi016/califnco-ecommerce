// Free OpenStreetMap (OSM) / Nominatim Geocoding Service
// Zero credit card required - 100% Free & Open Source

export const searchAddressOSM = async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5&countrycodes=in`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CalifncoWaterPurifierApp/1.0 (califnco-water-systems)'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.map((item) => ({
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        road: item.address?.road || item.address?.suburb || '',
        city: item.address?.city || item.address?.town || item.address?.county || 'Chennai',
        state: item.address?.state || 'Tamil Nadu',
        pincode: item.address?.postcode || '600042'
      }));
    }
  } catch (error) {
    console.warn('OSM search online lookup failed, using local offline fallback geocoding', error);
  }

  // Graceful offline fallback catalog of locations
  const fallbackCities = [
    { displayName: 'Velachery 100 Feet Road, Chennai, Tamil Nadu - 600042', lat: 12.9759, lng: 80.2212, city: 'Chennai', state: 'Tamil Nadu', pincode: '600042' },
    { displayName: 'Anna Nagar Roundtana, Chennai, Tamil Nadu - 600040', lat: 13.0850, lng: 80.2101, city: 'Chennai', state: 'Tamil Nadu', pincode: '600040' },
    { displayName: 'Tidel Park, OMR IT Highway, Taramani, Chennai - 600113', lat: 12.9892, lng: 80.2483, city: 'Chennai', state: 'Tamil Nadu', pincode: '600113' },
    { displayName: 'Indiranagar 100 Feet Road, Bengaluru, Karnataka - 560038', lat: 12.9716, lng: 77.6412, city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
    { displayName: 'Hitec City, Madhapur, Hyderabad, Telangana - 500081', lat: 17.4435, lng: 78.3772, city: 'Hyderabad', state: 'Telangana', pincode: '500081' },
    { displayName: 'Gandhipuram Cross Cut Road, Coimbatore, Tamil Nadu - 641012', lat: 11.0168, lng: 76.9558, city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012' }
  ];

  return fallbackCities.filter(c => c.displayName.toLowerCase().includes(query.toLowerCase()));
};

export const reverseGeocodeOSM = async (lat, lng) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CalifncoWaterPurifierApp/1.0'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        displayName: data.display_name,
        city: data.address?.city || data.address?.town || 'Chennai',
        state: data.address?.state || 'Tamil Nadu',
        pincode: data.address?.postcode || '600042'
      };
    }
  } catch (error) {
    console.warn('Reverse geocode error, returning formatted coordinates', error);
  }

  return {
    displayName: `Location: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (Chennai Metro Region)`,
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600042'
  };
};

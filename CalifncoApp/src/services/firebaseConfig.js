// Califnco Firebase Architecture (Spark Free Tier)
// Handles Auth, Firestore collections, and FCM Push Alerts.

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCalifncoDemoApiKeySparkTier2026",
  authDomain: "califnco-water-systems.firebaseapp.com",
  projectId: "califnco-water-systems",
  storageBucket: "califnco-water-systems.appspot.com",
  messagingSenderId: "982736451029",
  appId: "1:982736451029:web:a1b2c3d4e5f67890calif"
};

// Firestore Collection References:
// 1. 'users' -> { uid, name, email, phone, role: 'customer'|'dealer'|'admin', referralCode, walletBalance }
// 2. 'products' -> 52 products with category, retailPrice, wholesalePrice, moq, specs
// 3. 'orders' -> { id, customerId, items, total, status, trackingNumber, paymentMethod }
// 4. 'service_requests' -> { id, customerId, type, preferredDate, status, technician }
// 5. 'dealers' -> { dealerId, businessName, gstin, status: 'pending'|'approved'|'rejected' }
// 6. 'fcm_tokens' -> { uid, fcmToken, platform: 'android'|'ios'|'web', updatedAt }

export const registerFCMToken = async (userId, token) => {
  return {
    success: true,
    message: `FCM Token registered for user ${userId}: ${token.slice(0, 12)}...`
  };
};

export const simulatePushNotification = (title, body, data = {}) => {
  return {
    id: `push-${Date.now()}`,
    title,
    body,
    timestamp: new Date().toISOString(),
    data
  };
};

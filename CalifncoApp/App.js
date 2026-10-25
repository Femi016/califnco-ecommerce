import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Context Providers
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { ServiceProvider } from './src/context/ServiceContext';

// Components
import { Header } from './src/components/Header';
import { ProductLightboxModal } from './src/components/ProductLightboxModal';
import { NotificationModal } from './src/components/NotificationModal';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { OrderHistoryScreen } from './src/screens/OrderHistoryScreen';
import { ServiceBookingScreen } from './src/screens/ServiceBookingScreen';
import { DealerPortalScreen } from './src/screens/DealerPortalScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

function MainApp() {
  const { colors, isDarkMode } = useTheme();
  const { role } = useAuth();
  const { cartTotalItems } = useCart();

  // Navigation State: 'home' | 'dealer' | 'service' | 'orders' | 'profile' | 'cart' | 'checkout' | 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setLightboxVisible(true);
  };

  const handleInstantBuy = () => {
    setActiveTab('checkout');
  };

  // Render active screen
  const renderCurrentScreen = () => {
    if (role === 'admin' && activeTab !== 'profile') {
      return <AdminDashboardScreen />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            searchQuery={searchQuery}
            onSelectProduct={handleProductSelect}
            onNavigateTab={setActiveTab}
            onOpenCart={() => setActiveTab('cart')}
          />
        );
      case 'dealer':
        return (
          <DealerPortalScreen
            onBrowseWholesale={() => setActiveTab('home')}
            onViewDealerOrders={() => setActiveTab('orders')}
          />
        );
      case 'service':
        return <ServiceBookingScreen />;
      case 'orders':
        return <OrderHistoryScreen onStartShopping={() => setActiveTab('home')} />;
      case 'cart':
        return (
          <CartScreen
            onProceedToCheckout={() => setActiveTab('checkout')}
            onStartShopping={() => setActiveTab('home')}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            onBack={() => setActiveTab('cart')}
            onOrderSuccess={() => {}}
            onViewOrderHistory={() => setActiveTab('orders')}
          />
        );
      case 'admin':
        return <AdminDashboardScreen />;
      case 'profile':
        return <ProfileScreen onNavigateTab={setActiveTab} />;
      default:
        return (
          <HomeScreen
            searchQuery={searchQuery}
            onSelectProduct={handleProductSelect}
            onNavigateTab={setActiveTab}
            onOpenCart={() => setActiveTab('cart')}
          />
        );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.card }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card}
      />

      {/* Top Universal Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNotifications={() => setNotificationsVisible(true)}
        unreadCount={2}
        onOpenCart={() => setActiveTab('cart')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <View style={[styles.contentArea, { backgroundColor: colors.background }]}>
        {renderCurrentScreen()}
      </View>

      {/* Bottom Navigation Tab Bar */}
      <View style={[styles.bottomTabBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        {/* Tab 1: Shop */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'water' : 'water-outline'}
            size={22}
            color={activeTab === 'home' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'home' ? colors.primary : colors.textSecondary }
            ]}
          >
            Catalog
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Dealer Portal */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('dealer')}
        >
          <Ionicons
            name={activeTab === 'dealer' ? 'briefcase' : 'briefcase-outline'}
            size={22}
            color={activeTab === 'dealer' ? colors.dealerBadge : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'dealer' ? colors.dealerBadge : colors.textSecondary }
            ]}
          >
            Wholesale
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Service Desk */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('service')}
        >
          <Ionicons
            name={activeTab === 'service' ? 'construct' : 'construct-outline'}
            size={22}
            color={activeTab === 'service' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'service' ? colors.primary : colors.textSecondary }
            ]}
          >
            RO Service
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Orders */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('orders')}
        >
          <Ionicons
            name={activeTab === 'orders' ? 'receipt' : 'receipt-outline'}
            size={22}
            color={activeTab === 'orders' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === 'orders' ? colors.primary : colors.textSecondary }
            ]}
          >
            Orders
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Admin Console (or Profile) */}
        {role === 'admin' ? (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('admin')}
          >
            <Ionicons
              name={activeTab === 'admin' ? 'shield' : 'shield-outline'}
              size={22}
              color={activeTab === 'admin' ? colors.adminBadge : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'admin' ? colors.adminBadge : colors.textSecondary }
              ]}
            >
              Admin Ops
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('profile')}
          >
            <Ionicons
              name={activeTab === 'profile' ? 'person' : 'person-outline'}
              size={22}
              color={activeTab === 'profile' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: activeTab === 'profile' ? colors.primary : colors.textSecondary }
              ]}
            >
              Account
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Product Lightbox & Specifications Modal (Bonus Feature) */}
      <ProductLightboxModal
        visible={lightboxVisible}
        product={selectedProduct}
        onClose={() => setLightboxVisible(false)}
        onBuyNow={handleInstantBuy}
      />

      {/* Push Notifications Modal */}
      <NotificationModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <ServiceProvider>
              <MainApp />
            </ServiceProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  contentArea: {
    flex: 1
  },
  bottomTabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 4
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2
  }
});

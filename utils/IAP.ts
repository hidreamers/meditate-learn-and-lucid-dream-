import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock product data for development
const MOCK_PRODUCTS = [
  {
    productId: 'com.hidreamers.premiumupgrade',
    title: 'Premium Upgrade',
    description: 'Unlock all premium content',
    price: 9.99,
    localizedPrice: '$9.99',
  }
];

const PREMIUM_STATUS_KEY = '@hidreamers:premium_status';

class IAP {
  isInitialized = false;

  // Get mock product info
  getProductInfo = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_PRODUCTS;
  };

  // Process purchase (mock)
  requestPurchase = async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await this.savePremiumStatus(true);
    return true;
  };

  // Restore purchases (mock)
  restorePurchases = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const status = await this.isPremium();
    return status;
  };

  // Save premium status
  savePremiumStatus = async (isPremium) => {
    try {
      await AsyncStorage.setItem(PREMIUM_STATUS_KEY, JSON.stringify(isPremium));
    } catch (e) {
      console.error('Failed to save premium status', e);
    }
  };

  // Check premium status
  isPremium = async () => {
    try {
      const status = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
      return status === 'true';
    } catch (e) {
      console.error('Failed to get premium status', e);
      return false;
    }
  };

  // Cleanup when app closes (if real IAP used)
  disconnect = async () => {
    if (this.isInitialized && typeof InAppPurchases !== 'undefined') {
      try {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
      } catch (e) {
        console.error('Failed to disconnect IAP', e);
      }
    }
  };
}

export default new IAP();

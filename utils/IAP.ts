
import * as InAppPurchases from 'expo-in-app-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCT_IDS = ['com.hidreamers.premiumupgrade'];
const PREMIUM_STATUS_KEY = '@hidreamers:premium_status';

class IAP {
  isInitialized = false;
  products = [];

  // Initialize IAP connection and get products
  init = async () => {
    if (this.isInitialized) return;
    await InAppPurchases.connectAsync();
    this.isInitialized = true;
    const { responseCode, results } = await InAppPurchases.getProductsAsync(PRODUCT_IDS);
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      this.products = results;
    }
  };

  // Get product info
  getProductInfo = async () => {
    if (!this.isInitialized) await this.init();
    return this.products;
  };

  // Request purchase
  requestPurchase = async (productId) => {
    if (!this.isInitialized) await this.init();
    await InAppPurchases.purchaseItemAsync(productId);
  };

  // Listen for purchase updates (should be called in a useEffect in your component)
  purchaseListener = (callback) => {
    return InAppPurchases.setPurchaseListener(async ({ responseCode, results, errorCode }) => {
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        for (const purchase of results) {
          if (!purchase.acknowledged) {
            if (purchase.productId === PRODUCT_IDS[0]) {
              await this.savePremiumStatus(true);
            }
            await InAppPurchases.finishTransactionAsync(purchase, false);
            callback && callback(purchase);
          }
        }
      } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
        // User cancelled
      } else {
        // Error
        console.error('IAP Error:', errorCode);
      }
    });
  };

  // Restore purchases
  restorePurchases = async () => {
    if (!this.isInitialized) await this.init();
    const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      const hasPremium = results.some(p => p.productId === PRODUCT_IDS[0]);
      await this.savePremiumStatus(hasPremium);
      return hasPremium;
    }
    return false;
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

  // Cleanup when app closes
  disconnect = async () => {
    if (this.isInitialized) {
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

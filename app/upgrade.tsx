import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import IAP from '../utils/IAP';
import { usePremium } from '../contexts/PremiumContext';
import { useNavigation } from '@react-navigation/native';

export default function UpgradeScreen() {
    const navigation = useNavigation();
    const { isPremium } = usePremium();
    const [showingPremiumThankYou, setShowingPremiumThankYou] = useState(false);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [restoring, setRestoring] = useState(false);

    useEffect(() => {
        checkPremiumStatus();
        loadProduct();
    }, []);

    const checkPremiumStatus = async () => {
        const status = await IAP.isPremium();
        if (status && isPremium) {
            setShowingPremiumThankYou(true);
        }
    };

    const loadProduct = async () => {
        const products = await IAP.getProductInfo();
        if (products && products.length > 0) {
            setProduct(products[0]);
        }
        setLoading(false);
    };

    const handleUpgrade = async (planType = 'monthly') => {
        setPurchasing(true);
        try {
            const productId = planType === 'yearly' ? 'your_yearly_product_id' : 'your_monthly_product_id';
            await IAP.requestPurchase(productId);
            setShowingPremiumThankYou(true);
            Alert.alert(
                "Purchase Successful",
                "Thank you for upgrading to Premium! All features are now unlocked.",
                [{ text: "Continue", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert("Error", "An error occurred during purchase. Please try again later.");
        } finally {
            setPurchasing(false);
        }
    };

    const handleRestore = async () => {
        setRestoring(true);
        try {
            await IAP.restorePurchases();
            setShowingPremiumThankYou(true);
            Alert.alert(
                "Purchases Restored",
                "Your premium access has been restored!",
                [{ text: "Continue", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to restore purchases. Please try again later.");
        } finally {
            setRestoring(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient colors={['#3a1c71', '#b993d6', '#fff']} style={styles.gradient}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerBox}>
                        <Text style={styles.headerTitle}>Premium Upgrade</Text>
                        <Text style={styles.headerSubtitle}>Unlock the full potential of your dream practice</Text>
                    </View>
                    <View style={styles.contentCard}>
                        {showingPremiumThankYou ? (
                            <View style={styles.premiumContainer}>
                                <Ionicons name="checkmark-circle" size={80} color="#3a1c71" />
                                <Text style={styles.premiumTitle}>You're Premium!</Text>
                                <Text style={styles.premiumText}>
                                    Thank you for supporting our app. All premium features are unlocked and ready to use.
                                </Text>
                            </View>
                        ) : loading || !product ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#3a1c71" />
                                <Text style={styles.loadingText}>Loading product information...</Text>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.title}>Unlock Full Access to Your Lucid Dreaming Journey</Text>
                                <View style={styles.featureContainer}>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="videocam-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>12 In-Depth Video Lessons</Text> - Step-by-step training in lucid dreaming and dream yoga
                                        </Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="book-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>9 Premium Books + Audiobooks</Text> - Downloadable guides and audio training
                                        </Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="headset-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>7 Guided Meditations</Text> - Professionally recorded audio journeys
                                        </Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="pulse-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>All Binaural Beats</Text> - From Alpha to Gamma with customizable soundscapes
                                        </Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="musical-notes-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>5 Didgeridoo Lessons</Text> - Learn breath control and sound healing techniques
                                        </Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="refresh-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>New Content Monthly</Text> - Fresh lessons, meditations, and techniques
                                        </Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="people-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>Tech Support & Community</Text> - Get help and connect with other dreamers
                                        </Text>
                                    </View>
                                    <View style={styles.featureRow}>
                                        <Ionicons name="globe-outline" size={24} color="#3a1c71" />
                                        <Text style={styles.featureText}>
                                            <Text style={styles.featureBold}>Full HiDreamers.com Membership</Text> - Progress tracking and dream journaling
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.subscriptionOptions}>
                                    <Text style={styles.subscriptionTitle}>Choose Your Membership Plan</Text>
                                    <View style={styles.pricingContainer}>
                                        <TouchableOpacity
                                            style={[styles.pricingOption, styles.monthlyOption]}
                                            onPress={() => handleUpgrade('monthly')}
                                            disabled={purchasing}
                                        >
                                            <Text style={styles.pricingTitle}>Monthly</Text>
                                            <Text style={styles.pricingPrice}>$2.99</Text>
                                            <Text style={styles.pricingPeriod}>per month</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.pricingOption, styles.yearlyOption]}
                                            onPress={() => handleUpgrade('yearly')}
                                            disabled={purchasing}
                                        >
                                            <View style={styles.saveBadge}>
                                                <Text style={styles.saveText}>Save 30%</Text>
                                            </View>
                                            <Text style={styles.pricingTitle}>Yearly</Text>
                                            <Text style={styles.pricingPrice}>$25</Text>
                                            <Text style={styles.pricingPeriod}>per year</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{marginTop: 16, backgroundColor: '#b993d6', borderRadius: 8, padding: 12}}
                                    onPress={handleRestore}
                                    disabled={restoring}
                                >
                                    {restoring ? (
                                        <ActivityIndicator color="#3a1c71" size="small" />
                                    ) : (
                                        <Text style={{color: '#fff', fontWeight: 'bold'}}>Restore Purchases</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </ScrollView>
            </LinearGradient>
            <View style={styles.navContainer}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    headerBox: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
    contentCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        alignItems: 'center',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#3a1c71',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3a1c71',
        marginBottom: 24,
        textAlign: 'center',
    },
    featureContainer: {
        width: '100%',
        marginBottom: 30,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingRight: 10,
    },
    featureText: {
        fontSize: 15,
        color: '#333',
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
    featureBold: {
        fontWeight: 'bold',
        color: '#3a1c71',
    },
    subscriptionOptions: {
        width: '100%',
        marginBottom: 24,
    },
    subscriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3a1c71',
        textAlign: 'center',
        marginBottom: 16,
    },
    pricingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    pricingOption: {
        backgroundColor: '#f0f0f5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '48%',
        position: 'relative',
        borderWidth: 2,
    },
    monthlyOption: {
        borderColor: '#b993d6',
    },
    yearlyOption: {
        borderColor: '#3a1c71',
        backgroundColor: 'rgba(58, 28, 113, 0.05)',
    },
    pricingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3a1c71',
        marginBottom: 8,
    },
    pricingPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d76d77',
    },
    pricingPeriod: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    saveBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#d76d77',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    saveText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999
    },
    premiumContainer: {
        padding: 20,
        alignItems: 'center',
    },
    premiumTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3a1c71',
        marginTop: 16,
        marginBottom: 12,
    },
    premiumText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        lineHeight: 24,
    }
});
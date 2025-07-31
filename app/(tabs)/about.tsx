import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';

const VIDEO_ID = 'X0-chVDW2Q4';
const VIDEO_URL = `https://www.youtube.com/embed/${VIDEO_ID}`;
const CARD_WIDTH = 320;

export default function About() {
  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Jerimiah Molfese</Text>
        <Text style={styles.headerSubtitle}>Author • Wellness Innovator • Leadership Coach</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Jerimiah-Molfese-cover-image.jpg' }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.bodyText}>
            Jerimiah Molfese is a transformational speaker, author, and visionary educator with over two decades of experience guiding individuals into the power of conscious dreaming, meditation, and inner healing. After overcoming a traumatic brain injury through lucid dreaming, visualization, and brain–heart coherence practices, Jerimiah dedicated his life to unlocking human potential through altered states of consciousness.
          </Text>
          <Text style={styles.bodyText}>
            His talks blend ancient spiritual wisdom, Egyptian alchemical principles, and cutting-edge insights into quantum manifestation. Jerimiah empowers audiences to awaken within their dreams—and within their lives—teaching practical methods to harness lucid dreaming, dream yoga, and intention-based healing to access the quantum realm of infinite possibilities.
          </Text>
          <Text style={styles.bodyText}>
            As the author of <Text style={styles.bookTitle}>Manifestation: Unlock the Secrets of Lucid Dreaming and Alchemy</Text>, <Text style={styles.bookTitle}>The Great Journey: Dying and What Lies Beyond</Text>, <Text style={styles.bookTitle}>A Dreamer's Odyssey: True Stories of a Dream Traveler</Text>, and the <Text style={styles.bookTitle}>Guardians</Text> 4-book series, Jerimiah weaves profound personal experience with practical tools for transformation. His sessions are dynamic, deeply inspiring, and offer actionable techniques for personal growth, healing, and spiritual evolution.
          </Text>
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: VIDEO_URL }}
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Enjoy your journey!</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 36,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  bookTitle: {
    fontWeight: 'bold',
    color: '#b06ab3',
  },
  bodyText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    textAlign: 'justify', // <-- changed from 'center' to 'justify'
  },
  videoContainer: {
    width: CARD_WIDTH - 20,
    height: ((CARD_WIDTH - 20) * 9) / 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    borderRadius: 12,
  },
});
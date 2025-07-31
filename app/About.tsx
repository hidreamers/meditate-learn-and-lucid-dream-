import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Jerimiah Molfese</Text>
        <Text style={styles.headerSubtitle}>Author • Wellness Innovator • Leadership Coach</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: 'https://www.hidreamers.com/wp-content/uploads/2024/05/jerimiah-molfese-profile.jpg' }}
          style={styles.avatar}
        />
        <Text style={styles.bio}>
          Jerimiah Molfese is a transformational speaker, author, and visionary educator with over two decades of experience guiding individuals into the power of conscious dreaming, meditation, and inner healing. After overcoming a traumatic brain injury through lucid dreaming, visualization, and brain–heart coherence practices, Jerimiah dedicated his life to unlocking human potential through altered states of consciousness.
        </Text>
        <Text style={styles.bio}>
          His talks blend ancient spiritual wisdom, Egyptian alchemical principles, and cutting-edge insights into quantum manifestation. Jerimiah empowers audiences to awaken within their dreams—and within their lives—teaching practical methods to harness lucid dreaming, dream yoga, and intention-based healing to access the quantum realm of infinite possibilities.
        </Text>
        <Text style={styles.bio}>
          As the author of <Text style={styles.bookTitle}>Manifestation: Unlock the Secrets of Lucid Dreaming and Alchemy</Text>, <Text style={styles.bookTitle}>The Great Journey: Dying and What Lies Beyond</Text>, <Text style={styles.bookTitle}>A Dreamer's Odyssey: True Stories of a Dream Traveler</Text>, and the <Text style={styles.bookTitle}>Guardians</Text> 4-book series, Jerimiah weaves profound personal experience with practical tools for transformation. His sessions are dynamic, deeply inspiring, and offer actionable techniques for personal growth, healing, and spiritual evolution.
        </Text>
        <Text style={styles.sectionTitle}>Watch: The Power of Dreams</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://youtu.be/X0-chVDW2Q4')}
          style={styles.videoButton}
          activeOpacity={0.8}
        >
          <Text style={styles.videoButtonText}>Step by Step Program in the Art of Lucid Dreaming</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const HEADER_HEIGHT = 90; // Adjust if your header is taller/shorter

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 36, // 36 for iOS, status bar height for Android
    paddingBottom: 16,
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
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 18,
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
  bio: {
    fontSize: 16,
    color: '#d1c4e9',
    marginBottom: 18,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#3a1c71',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    textAlign: 'center',
  },
  bookTitle: {
    color: '#ffaf7b',
    fontWeight: 'bold',
  },
  videoButton: {
    backgroundColor: '#d76d77',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 6,
    marginBottom: 24,
  },
  videoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
});
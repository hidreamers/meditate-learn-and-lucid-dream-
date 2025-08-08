import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


export default function Meditation() {
  const router = useRouter();
  const topPadding = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 36;

  return (
    <LinearGradient colors={['#3a1c71', '#b993d6', '#fff']} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: topPadding }}>
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Meditation Resources</Text>
          <Text style={styles.headerSubtitle}>
            Explore our meditation resources below. Each section offers a unique approach to meditation, lucid dreaming, and sound healing. Tap a button to dive into detailed lessons and guided experiences.
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => router.push('/dream-yoga-and-lucid-dreaming-lessons')}
          >
            <Ionicons name="moon" size={32} color="#3a1c71" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>Lucid Dreaming & Dream Yoga</Text>
              <Text style={styles.linkDesc}>
                Lessons and practices for lucid dreaming, dream yoga, and techniques to awaken within your dreams.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => router.push('/didgeridoo-lessons')}
          >
            <Ionicons name="musical-notes" size={32} color="#b06ab3" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>Didgeridoo Lessons</Text>
              <Text style={styles.linkDesc}>
                Sound healing and didgeridoo lessons for relaxation, energy, and deep meditative states.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => router.push('/guided-meditations')}
          >
            <Ionicons name="headset" size={32} color="#d76d77" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>Guided Meditations</Text>
              <Text style={styles.linkDesc}>
                Guided audio and video meditations for healing, relaxation, and spiritual connection.
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => router.push('/binaural-beats')}
          >
            <Ionicons name="pulse" size={32} color="#4a90e2" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>Binaural Beats</Text>
              <Text style={styles.linkDesc}>
                Frequency-based audio tracks designed to enhance meditation, improve focus, and promote better sleep.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => router.push('/dream-journal')}
          >
            <Ionicons name="book" size={32} color="#b06ab3" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>Dream Journal</Text>
              <Text style={styles.linkDesc}>
                Write, view, and analyze your dreams.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkCard}
            onPress={() => router.push('/my-custom-content')}
          >
            <Ionicons name="star" size={32} color="#d76d77" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.linkTitle}>My Custom Content</Text>
              <Text style={styles.linkDesc}>
                Your personalized meditations, lessons, and resources.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Add an upgrade button at the bottom for non-premium users */}
          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: '#d76d77',
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 24,
              alignSelf: 'center',
            }}
            onPress={() => router.push('/upgrade')}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              Upgrade for Full Meditation Access
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7fa',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: {
    marginRight: 18,
  },
  linkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 4,
  },
  linkDesc: {
    fontSize: 14,
    color: '#555',
  },
});

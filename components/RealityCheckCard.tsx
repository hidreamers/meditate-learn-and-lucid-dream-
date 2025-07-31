import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, StatusBar, Modal, TouchableOpacity, Alert, SafeAreaView, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import RealityCheckCard from '../../components/RealityCheckCard';
import ScreenSaver from '../../components/ScreenSaver';
import { RealityCheck } from '../../types';
import Colors from '../../constants/Colors';
import { useKeepAwake } from 'expo-keep-awake';



const realityCheckTypes = [
  {
    id: '1',
    name: 'Hand Check',
    description: 'Look at your hands. In dreams, hands often appear distorted or have the wrong number of fingers.',
    icon: 'hand-left',
  },
  // ...other reality checks...
];

const CARD_WIDTH = 320;

export default function RealityChecksScreen() {
  const [checks, setChecks] = useState<RealityCheck[]>(initialChecks);
  const [screenSaverVisible, setScreenSaverVisible] = useState(false);
  const [reminderOn, setReminderOn] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useColorScheme() ?? 'light';

  useKeepAwake();

  // Notification permission request
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications in settings.');
      }
    })();
  }, []);

  // Schedule a local notification for Reality Check
  const scheduleRealityCheckNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reality Check',
        body: 'Ask yourself: Am I dreaming?',
      },
      trigger: { seconds: 2 },
    });
  };

  // Start reminders when screensaver is active
  useEffect(() => {
    if (screenSaverVisible && reminderOn) {
      scheduleRealityCheckNotification();
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          scheduleRealityCheckNotification();
          setCountdown(2 * 60 * 60);
        }, 2 * 60 * 60 * 1000);
      }
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setCountdown(prev => (prev > 0 ? prev - 1 : 2 * 60 * 60));
        }, 1000);
      }
    } else if (!screenSaverVisible && (!reminderOn || !screenSaverVisible)) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      intervalRef.current = null;
      timerRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screenSaverVisible, reminderOn]);

  // In-app popup reminder every 2 hours (and notification)
  useEffect(() => {
    if (reminderOn) {
      scheduleRealityCheckNotification();
      setCountdown(2 * 60 * 60); // 2 hours in seconds
      intervalRef.current = setInterval(() => {
        scheduleRealityCheckNotification();
        setCountdown(2 * 60 * 60);
      }, 2 * 60 * 60 * 1000); // 2 hours
      timerRef.current = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 2 * 60 * 60));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      intervalRef.current = null;
      timerRef.current = null;
      setCountdown(null);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reminderOn]);

  // Handler for toggling a reality check
  const handleToggle = async (id: string) => {
    setChecks(prev =>
      prev.map(check =>
        check.id === id ? { ...check, completed: !check.completed } : check
      )
    );

    // Trigger a local notification when toggled
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reality Check',
        body: 'You just completed a reality check!',
      },
      trigger: { seconds: 2 },
    });
  };

  // Format seconds as hh:mm:ss or mm:ss
  const formatCountdown = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Perform a reality check (show alert and notification)
  const performRealityCheck = (check: RealityCheck) => {
    Alert.alert(
      check.name,
      check.description + '\n\nAsk yourself: "Am I dreaming?"',
      [{ text: 'OK' }]
    );
    scheduleRealityCheckNotification();
  };

  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reality Checks</Text>
        <Text style={styles.headerSubtitle}>
          Set reminders and learn techniques to help you perform reality checks throughout your day.
        </Text>
      </View>

      <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1646' }}>
        <View style={{ flex: 1, padding: 16 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.bodyText}>
                Try these reality checks throughout your day to help you become more aware and increase your chances of lucid dreaming.
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Keep Your App Awake</Text>
              <Text style={styles.infoText}>
                To keep reminders working, activate the screensaver below. This will keep your phone awake and notifications will continue.
              </Text>
              <TouchableOpacity
                style={styles.screensaverButton}
                onPress={() => setScreenSaverVisible(true)}
              >
                <Ionicons name="planet" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.screensaverButtonText}>Activate Screensaver</Text>
              </TouchableOpacity>
            </View>
            <Modal visible={screenSaverVisible} animationType="fade" transparent={false}>
              <ScreenSaver onExit={() => setScreenSaverVisible(false)} />
            </Modal>
          </ScrollView>
        </View>
      </SafeAreaView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    textAlign: 'justify',
  },
  infoCard: {
    backgroundColor: '#f0e6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 18,
    marginBottom: 30,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  screensaverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a1c71',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
  },
  screensaverButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

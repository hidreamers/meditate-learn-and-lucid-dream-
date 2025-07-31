import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenSaver from '../../components/ScreenSaver';

// Reality check types
const realityCheckTypes = [
  {
    id: '1',
    name: 'Hand Check',
    description: 'Look at your hands. In dreams, hands often appear distorted or have the wrong number of fingers.',
    icon: 'hand-left',
  },
  {
    id: '2',
    name: 'Text Check',
    description: 'Read some text, look away, then read it again. In dreams, text often changes when you look at it twice.',
    icon: 'text',
  },
  {
    id: '3',
    name: 'Breathing Check',
    description: 'Try to breathe with your nose closed. In dreams, you might still be able to breathe.',
    icon: 'fitness',
  },
  {
    id: '4',
    name: 'Jump Check',
    description: 'Jump slightly. In dreams, you might float or jump higher than normal.',
    icon: 'arrow-up',
  },
  {
    id: '5',
    name: 'Light Switch Check',
    description: "Flip a light switch. In dreams, light switches often don't work properly.",
    icon: 'bulb',
  },
  {
    id: '6',
    name: 'Mirror Check',
    description: 'Look in a mirror. In dreams, your reflection might be distorted or different.',
    icon: 'person',
  },
];

export default function RealityChecks() {
  const [reminderOn, setReminderOn] = useState(false);
  const [screenSaverVisible, setScreenSaverVisible] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  // Notification handler and Android channel
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications in settings.');
      }
    })();

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }, []);

  // Schedule a local notification for Reality Check
  const scheduleRealityCheckNotification = async (checkName) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reality Check Reminder',
        body: `Time for your "${checkName}" reality check!`,
        channelId: 'default',
      },
      trigger: { seconds: 2 * 60 * 60 }, // 2 hours
    });
  };

  // In-app popup reminder every 2 hours (and notification)
  useEffect(() => {
    if (reminderOn && selectedCheck) {
      scheduleRealityCheckNotification(selectedCheck);
      setCountdown(2 * 60 * 60);
      intervalRef.current = setInterval(() => {
        scheduleRealityCheckNotification(selectedCheck);
        setCountdown(2 * 60 * 60);
      }, 2 * 60 * 60 * 1000);
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
  }, [reminderOn, selectedCheck]);

  // Also run reminders while screensaver is active
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

  // Format seconds as hh:mm:ss or mm:ss
  const formatCountdown = (seconds) => {
    if (seconds === null) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Perform a reality check (show alert and notification)
  const performRealityCheck = (check) => {
    setSelectedCheck(check.name);
    Alert.alert(
      check.name,
      check.description + '\n\nAsk yourself: "Am I dreaming?"',
      [{ text: 'OK' }]
    );
    scheduleRealityCheckNotification(check.name);
  };

  // Handle reminder switch
  const handleReminderSwitch = (value) => {
    if (value && !selectedCheck) {
      Alert.alert(
        'Select a Reality Check',
        'Please tap a reality check card first. The app will remind you about the last one you selected.'
      );
      return;
    }
    setReminderOn(value);
  };

  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >
      {/* Info Dropdown at the very top */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setInfoOpen(!infoOpen)}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownHeaderText}>How does this page work?</Text>
          <Ionicons
            name={infoOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#3a1c71"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        {infoOpen && (
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownText}>
              Tap a reality check card below to set your preferred reminder. When reminders are enabled, you'll get a notification every 2 hours for the last reality check you selected. You can also activate the screensaver to keep reminders running while your phone is awake.
            </Text>
          </View>
        )}
      </View>

      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reality Checks</Text>
        <Text style={styles.headerSubtitle}>
          Practice these to increase lucid dreaming awareness
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Ionicons name="eye" size={44} color="#d76d77" style={{ marginBottom: 10 }} />
          <Text style={styles.cardTitle}>Automated Reality Check Reminders</Text>
          <Text style={styles.cardText}>
            You will receive a reality check notification every 2 hours while reminders are enabled.
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Reminders</Text>
            <Switch
              value={reminderOn}
              onValueChange={handleReminderSwitch}
              trackColor={{ false: '#d1c4e9', true: '#d76d77' }}
              thumbColor={reminderOn ? '#fff' : '#3a1c71'}
            />
          </View>
          <Text style={styles.countdown}>
            Next Reality Check in: {formatCountdown(countdown)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Reality Check Cards</Text>
        {realityCheckTypes.map((check) => (
          <TouchableOpacity
            key={check.id}
            style={styles.checkItem}
            onPress={() => performRealityCheck(check)}
          >
            <View style={styles.checkIconContainer}>
              <Ionicons name={check.icon} size={28} color="#3a1c71" />
            </View>
            <View style={styles.checkContent}>
              <Text style={styles.checkName}>{check.name}</Text>
              <Text style={styles.checkDescription}>{check.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        ))}

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
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    width: 320,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#3a1c71',
    fontWeight: 'bold',
    marginRight: 10,
  },
  countdown: {
    color: '#d76d77',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
    color: '#3a1c71',
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    textAlign: 'justify',
  },
  checkItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0e6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkContent: {
    flex: 1,
  },
  checkName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  checkDescription: {
    fontSize: 14,
    color: '#666',
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
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d76d77',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 18,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropdownContainer: {
    width: 320,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginTop: 18,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  dropdownHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a1c71',
  },
  dropdownContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },
});

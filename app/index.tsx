import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert, ScrollView, Image, Modal, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useKeepAwake } from 'expo-keep-awake';
import ScreenSaver from '../components/ScreenSaver';
import PracticeCard from '../components/PracticeCard';

// Remote audio files
const nightAudio = { uri: 'https://www.hidreamers.com/wp-content/uploads/2025/06/notification.mp3' };
const dayAudio = { uri: 'https://www.jerimiahmolfese.com/dream.wav' };

const TABS = [
  { name: 'Home', route: '/', description: 'Main dashboard and entry point for the app.' },
  { name: 'Reality Checks', route: '/reality-checks', description: 'Perform and track your daily reality checks.' },
  { name: 'Meditations', route: '/meditation', description: 'Guided meditations to help with lucid dreaming.' },
  { name: 'Binaural Beats', route: '/binaural-beats', description: 'Listen to binaural beats to enhance meditation and relaxation.' },
  { name: 'About', route: '/about', description: 'Learn about the app and lucid dreaming.' },
  { name: 'Books', route: '/books', description: 'Recommended reading and resources for lucid dreaming.' },
  { name: 'Instructions', route: '/instructions', description: 'Step-by-step instructions for using the app and lucid dreaming techniques.' },
  { name: 'Dream Journal', route: '/dream-journal', description: 'Write, view, and analyze your dreams.' },
];

const INITIAL_TIMER = 2 * 60 * 60; // 2 hours in seconds

export default function TabIndex() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [nightPracticeOn, setNightPracticeOn] = useState(false);
  const [dayPracticeOn, setDayPracticeOn] = useState(false);
  const [meditationOn, setMeditationOn] = useState(false);
  const [journalOn, setJournalOn] = useState(false);  const [screenSaverVisible, setScreenSaverVisible] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showTapNavigation, setShowTapNavigation] = useState(false);

  // Sound toggles
  const [nightSoundOn, setNightSoundOn] = useState(true);
  const [daySoundOn, setDaySoundOn] = useState(true);

  // Timers for each card
  const [nightCountdown, setNightCountdown] = useState(null);
  const [dayCountdown, setDayCountdown] = useState(null);
  const [meditationCountdown, setMeditationCountdown] = useState(null);
  const [journalCountdown, setJournalCountdown] = useState(null);

  const nightIntervalRef = useRef(null);
  const nightTimerRef = useRef(null);
  const dayIntervalRef = useRef(null);
  const dayTimerRef = useRef(null);
  const meditationIntervalRef = useRef(null);
  const meditationTimerRef = useRef(null);
  const journalIntervalRef = useRef(null);
  const journalTimerRef = useRef(null);

  // Notification handler and Android channel
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
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

  useKeepAwake();

  // NIGHT PRACTICE
  const triggerNightPractice = async () => {
    Alert.alert('Night Dream Practice', 'I AM DREAMING');
    if (nightSoundOn) {
      try {
        const { sound } = await Audio.Sound.createAsync(nightAudio);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (e) {
        console.log('Audio error:', e);
      }
    }
  };
  const scheduleNightPracticeNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Night Dream Practice',
        body: 'I AM DREAMING',
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
    });
  };

  const toggleNightPractice = (value) => {
    setNightPracticeOn(value);
    if (value) {
      triggerNightPractice();
      scheduleNightPracticeNotification();
      setNightCountdown(INITIAL_TIMER);
      nightIntervalRef.current = setInterval(() => {
        triggerNightPractice();
        scheduleNightPracticeNotification();
        setNightCountdown(INITIAL_TIMER);
      }, INITIAL_TIMER * 1000);
      nightTimerRef.current = setInterval(() => {
        setNightCountdown(prev => (prev > 0 ? prev - 1 : INITIAL_TIMER));
      }, 1000);
    } else {
      if (nightIntervalRef.current) clearInterval(nightIntervalRef.current);
      if (nightTimerRef.current) clearInterval(nightTimerRef.current);
      nightIntervalRef.current = null;
      nightTimerRef.current = null;
      setNightCountdown(null);
    }
  };

  // DAY PRACTICE
  const triggerDayPractice = async () => {
    Alert.alert('Day Practice', 'IS THIS A DREAM?');
    if (daySoundOn) {
      try {
        const { sound } = await Audio.Sound.createAsync(dayAudio);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (e) {
        console.log('Audio error:', e);
      }
    }
  };
  const scheduleDayPracticeNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Day Practice',
        body: 'IS THIS A DREAM?',
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
    });
  };

  useEffect(() => {
    if (dayPracticeOn) {
      triggerDayPractice();
      scheduleDayPracticeNotification();
      setDayCountdown(INITIAL_TIMER);
      dayIntervalRef.current = setInterval(() => {
        triggerDayPractice();
        scheduleDayPracticeNotification();
        setDayCountdown(INITIAL_TIMER);
      }, INITIAL_TIMER * 1000);
      dayTimerRef.current = setInterval(() => {
        setDayCountdown(prev => (prev > 0 ? prev - 1 : INITIAL_TIMER));
      }, 1000);
    } else {
      if (dayIntervalRef.current) clearInterval(dayIntervalRef.current);
      if (dayTimerRef.current) clearInterval(dayTimerRef.current);
      dayIntervalRef.current = null;
      dayTimerRef.current = null;
      setDayCountdown(null);
    }
    return () => {
      if (dayIntervalRef.current) clearInterval(dayIntervalRef.current);
      if (dayTimerRef.current) clearInterval(dayTimerRef.current);
    };
  }, [dayPracticeOn]);

  // MEDITATION
  const triggerMeditation = () => {
    Alert.alert('Meditation Reminder', 'Take a moment to meditate and reflect.');
  };
  const scheduleMeditationNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Meditation Reminder',
        body: 'Take a moment to meditate and reflect.',
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
    });
  };

  useEffect(() => {
    if (meditationOn) {
      triggerMeditation();
      scheduleMeditationNotification();
      setMeditationCountdown(INITIAL_TIMER);
      meditationIntervalRef.current = setInterval(() => {
        triggerMeditation();
        scheduleMeditationNotification();
        setMeditationCountdown(INITIAL_TIMER);
      }, INITIAL_TIMER * 1000);
      meditationTimerRef.current = setInterval(() => {
        setMeditationCountdown(prev => (prev > 0 ? prev - 1 : INITIAL_TIMER));
      }, 1000);
    } else {
      if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current);
      if (meditationTimerRef.current) clearInterval(meditationTimerRef.current);
      meditationIntervalRef.current = null;
      meditationTimerRef.current = null;
      setMeditationCountdown(null);
    }
    return () => {
      if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current);
      if (meditationTimerRef.current) clearInterval(meditationTimerRef.current);
    };
  }, [meditationOn]);

  // JOURNAL
  const triggerJournal = () => {
    Alert.alert('Journal Reminder', 'Write a quick journal entry about your day or dreams.');
  };
  const scheduleJournalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Journal Reminder',
        body: 'Write a quick journal entry about your day or dreams.',
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2 },
    });
  };

  useEffect(() => {
    if (journalOn) {
      triggerJournal();
      scheduleJournalNotification();
      setJournalCountdown(INITIAL_TIMER);
      journalIntervalRef.current = setInterval(() => {
        triggerJournal();
        scheduleJournalNotification();
        setJournalCountdown(INITIAL_TIMER);
      }, INITIAL_TIMER * 1000);
      journalTimerRef.current = setInterval(() => {
        setJournalCountdown(prev => (prev > 0 ? prev - 1 : INITIAL_TIMER));
      }, 1000);
    } else {
      if (journalIntervalRef.current) clearInterval(journalIntervalRef.current);
      if (journalTimerRef.current) clearInterval(journalTimerRef.current);
      journalIntervalRef.current = null;
      journalTimerRef.current = null;
      setJournalCountdown(null);
    }
    return () => {
      if (journalIntervalRef.current) clearInterval(journalIntervalRef.current);
      if (journalTimerRef.current) clearInterval(journalTimerRef.current);
    };
  }, [journalOn]);

  useEffect(() => {
    return () => {
      if (nightIntervalRef.current) clearInterval(nightIntervalRef.current);
      if (nightTimerRef.current) clearInterval(nightTimerRef.current);
      if (dayIntervalRef.current) clearInterval(dayIntervalRef.current);
      if (dayTimerRef.current) clearInterval(dayTimerRef.current);
      if (meditationIntervalRef.current) clearInterval(meditationIntervalRef.current);
      if (meditationTimerRef.current) clearInterval(meditationTimerRef.current);
      if (journalIntervalRef.current) clearInterval(journalIntervalRef.current);
      if (journalTimerRef.current) clearInterval(journalTimerRef.current);
    };
  }, []);

  const formatCountdown = (seconds) => {
    if (seconds === null) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}    >      {/* Header at the top, outside ScrollView */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meditate. Learn. Dream.</Text>
        <Text style={styles.headerSubtitle}>Your guide to conscious dreaming and mindful transformation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ padding: 12 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#3a1c71',
              borderRadius: 8,
              padding: 10,
              alignItems: 'center',
              marginBottom: 8,
            }}
            onPress={() => setShowGettingStarted(!showGettingStarted)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              {showGettingStarted ? 'Hide Getting Started' : 'Show Getting Started'}
            </Text>
          </TouchableOpacity>
          {showGettingStarted && (
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 14,
              marginBottom: 10,
              elevation: 2,
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#3a1c71' }}>
                Getting Started
              </Text>
              <Text style={{ fontSize: 15, color: '#333', marginBottom: 6 }}>
                Welcome to Meditate-Dream-Learn! Here's how to use the app:
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                1. Use the toggles on each card to set reminders for Night Practice, Day Practice, Meditation, and Dream Journal. These reminders help you build habits for lucid dreaming.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                2. When a reminder goes off, follow the prompt to perform a reality check, meditate, or journal your dreams.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                3. Use the navigation dropdown to explore reality checks, meditations, recommended books, instructions, and more.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                4. Write down your dreams in the Dream Journal to track your progress and increase dream recall.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                5. <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>Screensaver:</Text> Tap "Activate Screensaver" for a relaxing visual break. While the screensaver is active, your device's screen will stay on and will not automatically turn off or lock. This is helpful if you want to keep calming visuals on as you relax, meditate, or prepare for sleep, without worrying about your phone going to sleep or the display turning off. You can exit the screensaver at any time by tapping the screen or using the exit button.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                6. <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>Binaural Beats:</Text> Visit the Binaural Beats tab to enhance your meditation and relaxation. Binaural beats work by playing slightly different frequencies in each ear, which your brain processes as a rhythmic beat that can help induce specific mental states. You can select multiple audio loops for each ear independently - mix and match different frequencies and ambient sounds like ocean waves, thunder, or chakra tones to create your perfect meditation soundscape.
              </Text>
              <Text style={{ fontSize: 14, color: '#555' }}>
                Enjoy your journey to more conscious and vivid dreaming!
              </Text>
            </View>
          )}
        </View>

        <Image
          source={{ uri: 'https://www.hidreamers.com/wp-content/uploads/2025/05/ChatGPT-Image-May-6-2025-12_39_55-PM.png' }}
          style={styles.largeImage}
          resizeMode="contain"
        />

        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownToggle}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownToggleText}>
              {showDropdown ? 'Hide Tab Navigation' : 'Show Tab Navigation'}
            </Text>
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownContent}>
              {TABS.map(tab => (
                <View key={tab.route} style={styles.dropdownItem}>
                  <Text style={styles.tabName}>{tab.name}</Text>
                  <Text style={styles.tabDesc}>{tab.description}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push(tab.route)}
                  >
                    <Text style={styles.buttonText}>Go to {tab.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.cardContainer}>
          <PracticeCard
            icon="moon"
            iconColor="#3a1c71"
            title="Night Dream Practice"
            description="Set reminders to do night dream practices."
            showSound={true}
            reminderValue={nightPracticeOn}
            onReminderChange={toggleNightPractice}
            soundValue={nightSoundOn}
            onSoundChange={setNightSoundOn}
            countdown={formatCountdown(nightCountdown)}
          />
          <PracticeCard
            icon="sunny"
            iconColor="#d76d77"
            title="Day Practice"
            description="Set reminders to do day reality checks."
            showSound={true}
            reminderValue={dayPracticeOn}
            onReminderChange={setDayPracticeOn}
            soundValue={daySoundOn}
            onSoundChange={setDaySoundOn}
            countdown={formatCountdown(dayCountdown)}
          />
          <PracticeCard
            icon="leaf"
            iconColor="#b0b8ff"
            title="Meditation"
            description="Set reminders to meditate and reflect."
            showSound={false}
            reminderValue={meditationOn}
            onReminderChange={setMeditationOn}
            countdown={formatCountdown(meditationCountdown)}
          />
          <PracticeCard
            icon="book"
            iconColor="#b06ab3"
            title="Dream Journal"
            description="Write, view, and analyze your dreams."
            showSound={false}
            reminderValue={journalOn}
            onReminderChange={setJournalOn}
            countdown={formatCountdown(journalCountdown)}
          />
        </View>        <TouchableOpacity
          style={styles.screensaverButton}
          onPress={() => setScreenSaverVisible(true)}
        >
          <Ionicons name="planet" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.screensaverButtonText}>Activate Screensaver</Text>
        </TouchableOpacity>

        <Modal visible={screenSaverVisible} animationType="fade" transparent={false}>
          <ScreenSaver onExit={() => setScreenSaverVisible(false)} />
        </Modal>
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
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 28,
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
    paddingTop: 0,
    flexGrow: 1,
  },
  largeImage: {
    width: 300,
    height: 300,
    borderRadius: 50,
    marginTop: 24,
    marginBottom: 16,
    alignSelf: 'center',
  },
  dropdownContainer: { 
    padding: 8 
  },
  dropdownToggle: {
    backgroundColor: '#3a1c71',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  dropdownToggleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dropdownContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    elevation: 2,
  },
  dropdownItem: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 6,
  },
  tabName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d76d77',
  },
  tabDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#3a1c71',
    borderRadius: 8,
    padding: 6,
    alignItems: 'center',
    marginBottom: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    marginTop: 4,
    marginBottom: 0,
  },
  screensaverButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


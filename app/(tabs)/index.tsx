import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert, ScrollView, Image, Modal, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useKeepAwake } from 'expo-keep-awake';
import ScreenSaver from '../../components/ScreenSaver';

// Remote audio files
const nightAudio = { uri: 'https://www.hidreamers.com/wp-content/uploads/2025/06/notification.mp3' };
const dayAudio = { uri: 'https://www.jerimiahmolfese.com/dream.wav' };

const TABS = [
  { name: 'Home', route: '/', description: 'Main dashboard and entry point for the app.' },
  { name: 'Reality Checks', route: '/reality-checks', description: 'Perform and track your daily reality checks.' },
  { name: 'Meditations', route: '/meditation', description: 'Guided meditations to help with lucid dreaming.' },
  { name: 'Joe Dispenza Meditations', route: '/joe-dispenza', description: 'Special meditations by Dr. Joe Dispenza.' },
  { name: 'Binaural Beats', route: '/binaural-beats', description: 'Custom binaural beat audio sessions with multiple loop mixing.' },
  { name: 'About', route: '/about', description: 'Learn about the app and lucid dreaming.' },
  { name: 'Books', route: '/books', description: 'Recommended reading and resources for lucid dreaming.' },
  { name: 'Instructions', route: '/instructions', description: 'Step-by-step instructions for using the app and lucid dreaming techniques.' },
  { name: 'Dream Journal', route: '/dream-journal', description: 'Write, view, and analyze your dreams.' },
];

const INITIAL_TIMER = 2 * 60 * 60; // 2 hours in seconds

interface DreamCardProps {
  icon: any;
  iconColor: string;
  title: string;
  description: string;
  showSound: boolean;
  reminderValue: boolean;
  onReminderChange: (value: boolean) => void;
  soundValue: boolean;
  onSoundChange: (value: boolean) => void;
  countdown: string;
}

function DreamCard({
  icon,
  iconColor,
  title,
  description,
  showSound,
  reminderValue,
  onReminderChange,
  soundValue,
  onSoundChange,
  countdown,
}: DreamCardProps) {
  return (
    <View style={styles.nicerCard}>
      <Ionicons name={icon} size={40} color={iconColor} style={{ marginBottom: 12 }} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Reminders</Text>
        <Switch value={reminderValue} onValueChange={onReminderChange} />
      </View>
      {showSound && (
        <View style={styles.row}>
          <Text style={styles.label}>Sound</Text>
          <Switch value={soundValue} onValueChange={onSoundChange} />
        </View>
      )}
      <Text style={styles.countdown}>
        Next Reminder: {countdown}
      </Text>
    </View>
  );
}

export default function TabIndex() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [nightPracticeOn, setNightPracticeOn] = useState(false);
  const [dayPracticeOn, setDayPracticeOn] = useState(false);
  const [meditationOn, setMeditationOn] = useState(false);
  const [journalOn, setJournalOn] = useState(false);
  const [screenSaverVisible, setScreenSaverVisible] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  // NEW: Sound toggles
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

  const formatCountdown = (seconds: number | null): string => {
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
      style={styles.gradientBackground}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meditate. Learn. Dream.</Text>
        <Text style={styles.headerSubtitle}>Your guide to conscious dreaming and mindful transformation</Text>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 24 }}>
        {/* MILD Practice card at the very top */}
        <View style={{
          width: 320,
          backgroundColor: '#fff',
          borderRadius: 18,
          alignItems: 'center',
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
          flexDirection: 'row',
          marginBottom: 24,
        }}>
          <Ionicons name="bulb-outline" size={36} color="#b06ab3" style={{ marginRight: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#3a1c71',
              marginBottom: 4,
            }}>
              MILD Practice
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#555',
              marginBottom: 8,
            }}>
              Step-by-step guide for the Mnemonic Induction of Lucid Dreams technique.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#d76d77',
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
                alignSelf: 'flex-start',
              }}
              onPress={() => router.push('/mild-practice')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start Practice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Getting Started Dropdown */}
        <View style={{ alignItems: 'center', marginTop: 18, marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => setShowGettingStarted(!showGettingStarted)}
            style={{
              backgroundColor: '#3a1c71',
              borderRadius: 10,
              padding: 12,
              alignItems: 'center',
              width: 320,
            }}
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
              marginTop: 4,
              marginBottom: 10,
              elevation: 2,
              width: 320,
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#3a1c71' }}>
                Getting Started
              </Text>
              <Text style={{ fontSize: 15, color: '#333', marginBottom: 6 }}>
                Welcome to the Lucid Dreaming App! Here’s how to use all the features:
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>1. Dream Journal:</Text> Record your dreams each morning using "Add Dream." You can edit or clear dreams anytime. Tap "Analyze My Dreams" to see recurring dream signs in a popup—these help you recognize when you’re dreaming.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>2. Reality Checks:</Text> Tap any reality check card (like Hand Check, Text Check, etc.) to set it as your preferred reminder. Enable reminders to get a notification every 2 hours for the last check you selected. Practice reality checks throughout your day for best results.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>3. MILD Practice:</Text> At the top of the home page, tap the "MILD Practice" card to start a step-by-step guide for the Mnemonic Induction of Lucid Dreams technique. The guide will walk you through:
                {"\n"}• Preparing for practice (find a quiet, comfortable place)
                {"\n"}• Recalling a recent dream in detail
                {"\n"}• Recognizing your personal dream signs (from your journal)
                {"\n"}• Creating and repeating a positive affirmation (e.g., "The next time I’m dreaming, I will remember I’m dreaming")
                {"\n"}• Visualizing yourself becoming lucid in a dream
                {"\n"}• Repeating your affirmation as you fall asleep
                {"\n"}When you finish, remember to record any lucid dreams in your journal!
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>4. Binaural Beats:</Text> Navigate to the Binaural Beats tab to access custom audio sessions. Select multiple loops for each ear to create personalized soundscapes. Choose from Delta (deep sleep), Theta (meditation), Alpha (relaxation), Beta (focus), Gamma (peak consciousness), and nature sounds like Ocean and Thunder. Use headphones for the full binaural effect. Mix different frequencies to enhance lucid dreaming, meditation, or relaxation states.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>5. Tab Navigation:</Text> Use the tabs at the bottom of the screen to quickly switch between Dream Journal, Reality Checks, MILD Practice, Binaural Beats, and other features. Just tap a tab icon to go directly to that section.
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>6. Screensaver & Reminders:</Text> Activate the screensaver to keep your phone awake and ensure reminders continue to work. This is helpful if you want to keep reality check reminders running overnight or during naps.
              </Text>
              <Text style={{ fontSize: 14, color: '#555' }}>
                <Text style={{ fontWeight: 'bold', color: '#3a1c71' }}>Tips:</Text> Be consistent! The more you journal and practice reality checks, the more likely you are to have lucid dreams. Review your dream signs often and set clear intentions before sleep. Explore the dropdowns on each page for more information and guidance.
                {"\n\n"}Sweet dreams and happy journaling!
              </Text>
            </View>
          )}
        </View>

        {/* First image below the header */}
        <Image
          source={{ uri: 'https://www.hidreamers.com/wp-content/uploads/2025/05/ChatGPT-Image-May-6-2025-12_39_55-PM.png' }}
          style={styles.largeImage}
          resizeMode="contain"
        />

        {/* Dropdown Navigation */}
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

        {/* Nicer Cards with Functionality */}
        <View style={styles.cardContainer}>
          <DreamCard
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
          <DreamCard
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
          <DreamCard
            icon="leaf"
            iconColor="#b0b8ff"
            title="Meditation"
            description="Set reminders to meditate and reflect."
            showSound={false}
            reminderValue={meditationOn}
            onReminderChange={setMeditationOn}
            soundValue={false}
            onSoundChange={() => {}}
            countdown={formatCountdown(meditationCountdown)}
          />
          <DreamCard
            icon="book"
            iconColor="#b06ab3"
            title="Dream Journal"
            description="Write, view, and analyze your dreams."
            showSound={false}
            reminderValue={journalOn}
            onReminderChange={setJournalOn}
            soundValue={false}
            onSoundChange={() => {}}
            countdown={formatCountdown(journalCountdown)}
          />
        </View>

        {/* Screensaver Button */}
        <TouchableOpacity
          style={styles.screensaverButton}
          onPress={() => setScreenSaverVisible(true)}
        >
          <Ionicons name="planet" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.screensaverButtonText}>Activate Screensaver</Text>
        </TouchableOpacity>

        {/* Screen Saver Modal */}
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
  largeImage: {
    width: 300,      // or your preferred width
    height: 300,     // your preferred height
    borderRadius: 50, // optional, for a circle
    marginTop: 24,
    marginBottom: 16,
    alignSelf: 'center',
  },
  largeImageBottom: {
    width: '100%',
    height: 400,
    marginTop: 0,
    marginBottom: 4,
    alignSelf: 'center',
    borderRadius: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nicerCard: {
    width: 300,      // was 150
    height: 240,     // was 100
    borderRadius: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    padding: 18,     // a bit more padding for bigger cards
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
  },
  meditationCard: {
    backgroundColor: '#23243a',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#3a1c71',
    fontWeight: 'bold',
    marginRight: 8,
  },
  countdown: {
    color: '#d76d77',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 2,
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
    paddingTop: 8,
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
    color: '#3a1c71',
  },
  container: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 40,
  },
  gettingStartedButton: {
    backgroundColor: '#3a1c71',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
    marginBottom: 8,
    alignItems: 'center',
    width: 320,
  },
  gettingStartedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gettingStartedCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    width: 320,
  },
  gettingStartedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#3a1c71',
  },
  gettingStartedText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  gettingStartedSection: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  centeredCard: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    width: '100%',
  },
  mildCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    flexDirection: 'row',
  },
  mildCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 4,
  },
  mildCardDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  mildCardButton: {
    backgroundColor: '#d76d77',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
});

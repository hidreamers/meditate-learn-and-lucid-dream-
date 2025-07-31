import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const LOOPS = [
  {
    name: 'Delta',
    url: 'https://www.dropbox.com/scl/fi/hqi222ld5y4c744k7kq8q/delta-loop.mp3?rlkey=xaik08225ro5ef4adkjrrn3c5&dl=1',
    desc: 'Deep sleep, healing, unconscious (0.5–4 Hz)',
  },
  {
    name: 'Theta',
    url: 'https://www.dropbox.com/scl/fi/uom98m08gxzpkk8rubeln/theta-loop.mp3?rlkey=klt6usbe3t2ym53oy4csqhojb&dl=1',
    desc: 'Meditation, creativity, intuition (4–8 Hz)',
  },
  {
    name: 'Alpha',
    url: 'https://www.dropbox.com/scl/fi/60y06jjjx76bl2jd3cef1/alpha_loop.mp3?rlkey=eb2oqt6nprgkwtqee1f4k4iga&dl=1',
    desc: 'Relaxed awareness, light meditation (8–13 Hz)',
  },
  {
    name: 'Beta',
    url: 'https://www.dropbox.com/scl/fi/qjw1hxa0v6dbs65xhxmxp/beta-loop.mp3?rlkey=ubdcrmcow8k41v9riwaolas8d&dl=1',
    desc: 'Alertness, concentration, cognition (13–30 Hz)',
  },
  {
    name: 'Gamma',
    url: 'https://www.dropbox.com/scl/fi/cjtmtoc1ra8b73g5kw1o9/gamma-loop.mp3?rlkey=m07psd122kztf8bmk56e5l2m0&dl=1',
    desc: 'Peak focus, expanded consciousness (30–100 Hz)',
  },
  {
    name: 'Chakra',
    url: 'https://www.dropbox.com/scl/fi/o8mf3cmltwtjylo0bwuvv/Chakra.mp3?rlkey=cane8oh73ngb6nfpne8p9i0g4&dl=1',
    desc: 'Chakra balancing, energy alignment',
  },
  {
    name: 'Ocean',
    url: 'https://www.dropbox.com/scl/fi/563iuw1wstr9v7pp11v1u/ocian_loop.mp3?rlkey=cz8jx402aatmqtem6zjoney2e&dl=1',
    desc: 'Ocean waves, natural relaxation',
  },
  {
    name: 'Thunder',
    url: 'https://www.dropbox.com/scl/fi/3lseg6xrecazj2fu13mco/Thunder_crikit_loop.mp3?rlkey=jekf7u29qden8f0e19gcsde94&dl=1',
    desc: 'Thunder & crickets, nature ambiance',
  },
  {
    name: 'Delta Bowl',
    url: 'https://www.dropbox.com/scl/fi/6eeotc07t8vsj2pcub2ph/delta_bowl_harmonics_loop.mp3?rlkey=cpcz9hnxa83om7zp73zuaqwff&dl=1',
    desc: 'Delta bowl harmonics, healing frequencies',
  },
];

export default function BinauralBeats() {
  // Ensure initial selections are valid indices
  const [leftSelections, setLeftSelections] = useState<number[]>([0]); // Array of selected indices
  const [rightSelections, setRightSelections] = useState<number[]>([Math.min(1, LOOPS.length - 1)]); // Array of selected indices
  const [showPlayer, setShowPlayer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Validate initial selections on mount
  useEffect(() => {
    // Add a small delay to ensure everything is properly initialized
    const timer = setTimeout(() => {
      // Ensure all selections are valid indices
      setLeftSelections(prev => {
        const filtered = prev.filter(idx => idx >= 0 && idx < LOOPS.length);
        return filtered.length > 0 ? filtered : [0];
      });
      setRightSelections(prev => {
        const filtered = prev.filter(idx => idx >= 0 && idx < LOOPS.length);
        return filtered.length > 0 ? filtered : [Math.min(1, LOOPS.length - 1)];
      });
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleLeftSelection = (idx: number) => {
    setLeftSelections(prev => {
      if (prev.includes(idx)) {
        // Remove if already selected, but keep at least one
        return prev.length > 1 ? prev.filter(i => i !== idx) : prev;
      } else {
        // Add to selection
        return [...prev, idx];
      }
    });
  };

  const toggleRightSelection = (idx: number) => {
    setRightSelections(prev => {
      if (prev.includes(idx)) {
        // Remove if already selected, but keep at least one
        return prev.length > 1 ? prev.filter(i => i !== idx) : prev;
      } else {
        // Add to selection
        return [...prev, idx];
      }
    });
  };
  const getSelectedLoops = (selections: number[]) => {
    return selections.map(idx => LOOPS[idx]).filter(loop => loop !== undefined);
  };  const startSession = () => {
    setShowPlayer(true);
  };

  // Don't render content until properly initialized to prevent race conditions
  if (!isInitialized) {
    return (
      <LinearGradient
        colors={['#3a1c71', '#b993d6', '#fff']}
        style={styles.gradientBackground}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Custom Binaural Beats</Text>
          <Text style={styles.headerSubtitle}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Build selection strings outside JSX to guarantee only strings are rendered
  const leftSelectionString =
    'Left (' + leftSelections.length + '): ' +
    (leftSelections.length > 0
      ? leftSelections.map(idx => String(LOOPS[idx]?.name || 'Unknown')).join(', ')
      : 'None selected');
  const rightSelectionString =
    'Right (' + rightSelections.length + '): ' +
    (rightSelections.length > 0
      ? rightSelections.map(idx => String(LOOPS[idx]?.name || 'Unknown')).join(', ')
      : 'None selected');

  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >      <View style={styles.header}>
        <Text style={styles.headerTitle}>Custom Binaural Beats</Text>
        <Text style={styles.headerSubtitle}>
          Select multiple loops for each ear to create custom soundscapes. Tap any loop to add or remove it from your selection. Use headphones for the best binaural experience!
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Left Ear:</Text>
        <View style={styles.row}>
          {LOOPS.map((loop, idx) => (
            <TouchableOpacity
              key={loop.name + 'L'}
              style={[
                styles.loopBtn,
                ...(leftSelections.includes(idx) ? [styles.loopBtnActive] : []),
              ]}
              onPress={() => toggleLeftSelection(idx)}
            >
              <Text style={[
                styles.loopBtnText,
                ...(leftSelections.includes(idx) ? [styles.loopBtnTextActive] : []),
              ]}>
                {loop.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Right Ear:</Text>
        <View style={styles.row}>
          {LOOPS.map((loop, idx) => (
            <TouchableOpacity
              key={loop.name + 'R'}
              style={[
                styles.loopBtn,
                ...(rightSelections.includes(idx) ? [styles.loopBtnActive] : []),
              ]}
              onPress={() => toggleRightSelection(idx)}
            >
              <Text style={[
                styles.loopBtnText,
                ...(rightSelections.includes(idx) ? [styles.loopBtnTextActive] : []),
              ]}>
                {loop.name}
              </Text>
            </TouchableOpacity>
          ))}        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={startSession}
          >
            <Text style={styles.controlBtnText}>🎧 Start Session</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.desc}>{leftSelectionString}</Text>
          <Text style={styles.desc}>{rightSelectionString}</Text>
        </View>
      </ScrollView>

      {/* Popup Player Modal */}
      <Modal
        visible={showPlayer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPlayer(false)}
      >
        <View style={{ flex: 1 }}>
          <AudioPlayer
            leftLoops={getSelectedLoops(leftSelections)}
            rightLoops={getSelectedLoops(rightSelections)}
            onClose={() => setShowPlayer(false)}
          />
        </View>
      </Modal>
    </LinearGradient>
  );
}

// Separate Audio Player Component
interface AudioPlayerProps {
  leftLoops: Array<{ name: string; url: string; desc: string }>;
  rightLoops: Array<{ name: string; url: string; desc: string }>;
  onClose: () => void;
}

function AudioPlayer({ leftLoops, rightLoops, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  
  const leftSounds = useRef<Audio.Sound[]>([]);
  const rightSounds = useRef<Audio.Sound[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio session
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
        console.log('Audio session initialized');
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    };
    
    initAudio();
    
    return () => {
      cleanup();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  const cleanup = async () => {
    console.log('Cleaning up audio...');
    const promises = [];
    
    // Clean up left sounds
    leftSounds.current.forEach(sound => {
      if (sound) {
        promises.push(
          sound.stopAsync()
            .catch(() => {})
            .then(() => sound.unloadAsync().catch(() => {}))
        );
      }
    });
    
    // Clean up right sounds
    rightSounds.current.forEach(sound => {
      if (sound) {
        promises.push(
          sound.stopAsync()
            .catch(() => {})
            .then(() => sound.unloadAsync().catch(() => {}))
        );
      }
    });
    
    await Promise.all(promises);
    leftSounds.current = [];
    rightSounds.current = [];
    setIsPlaying(false);
  };
  const play = async () => {
    if (isPlaying || isLoading) return;
    
    setIsLoading(true);
    console.log('Starting playback...');
    
    try {
      // Clean up any existing audio first
      await cleanup();
      
      // Load left ear loops
      console.log('Loading left audio loops:', leftLoops.length);
      for (const loop of leftLoops) {
        console.log('Loading left audio:', loop.url);
        const result = await Audio.Sound.createAsync(
          { uri: loop.url },
          { 
            shouldPlay: false,
            isLooping: true,
            volume: 0.8 / leftLoops.length // Adjust volume based on number of loops
          }
        );
        leftSounds.current.push(result.sound);
      }
      
      // Load right ear loops
      console.log('Loading right audio loops:', rightLoops.length);
      for (const loop of rightLoops) {
        console.log('Loading right audio:', loop.url);
        const result = await Audio.Sound.createAsync(
          { uri: loop.url },
          { 
            shouldPlay: false,
            isLooping: true,
            volume: 0.8 / rightLoops.length // Adjust volume based on number of loops
          }
        );
        rightSounds.current.push(result.sound);
      }
      
      // Start playback for all sounds
      const playPromises = [
        ...leftSounds.current.map(sound => sound.playAsync()),
        ...rightSounds.current.map(sound => sound.playAsync())
      ];
      await Promise.all(playPromises);
      
      setIsPlaying(true);
      setIsLoading(false);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setPlaybackTime(prev => prev + 1);
      }, 1000);
      
      console.log('Playback started successfully');
      
    } catch (error) {
      console.log('Playback failed:', error);
      setIsLoading(false);
      Alert.alert('Playback Error', 'Failed to start audio playback. Please check your internet connection and try again.');
    }
  };

  const stop = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPlaybackTime(0);
    await cleanup();
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const closePlayer = async () => {
    await stop();
    onClose();
  };

  return (
    <LinearGradient
      colors={['#1a1c2e', '#16213e', '#0f3460']}
      style={styles.playerContainer}
    >
      <View style={styles.playerHeader}>
        <View style={{ zIndex: 2 }}>
          <TouchableOpacity 
            style={styles.closeBtn}
            onPress={closePlayer}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <Text style={styles.playerTitle}>Binaural Beat Session</Text>
        </View>
      </View>
      <View style={styles.playerContent}>
        <View style={styles.frequencyInfo}>
          <View style={styles.earInfo}>
            <Text style={styles.earLabel}>{`LEFT EAR (${leftLoops.length})`}</Text>
            {leftLoops.map((loop, idx) => (
              <View key={idx} style={{ marginBottom: 5 }}>
                <Text style={styles.earFreq}>{String(loop.name)}</Text>
                <Text style={styles.earDesc}>{String(loop.desc)}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.vsText}>{'VS'}</Text>
          <View style={styles.earInfo}>
            <Text style={styles.earLabel}>{`RIGHT EAR (${rightLoops.length})`}</Text>
            {rightLoops.map((loop, idx) => (
              <View key={idx} style={{ marginBottom: 5 }}>
                <Text style={styles.earFreq}>{String(loop.name)}</Text>
                <Text style={styles.earDesc}>{String(loop.desc)}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{String(formatTime(playbackTime))}</Text>
        </View>
        <View style={styles.playerControls}>
          {!isPlaying ? (
            <TouchableOpacity
              style={[styles.playBtn, ...(isLoading ? [styles.playBtnDisabled] : [])]}
              onPress={play}
              disabled={isLoading}
            >
              <Text style={styles.playBtnText}>
                {isLoading ? '⏳ Loading...' : '▶️ Play'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopBtn}
              onPress={stop}
            >
              <Text style={styles.stopBtnText}>{'⏹️ Stop'}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.instructionText}>{'🎧 Put on headphones for the full binaural beat experience'}</Text>
      </View>
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
  },  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  label: {
    fontSize: 18,
    color: '#3a1c71',
    marginTop: 18,
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loopBtn: {
    backgroundColor: '#e0c3fc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 6,
    marginVertical: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  loopBtnActive: {
    backgroundColor: '#3a1c71',
  },
  loopBtnText: {
    color: '#3a1c71',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loopBtnTextActive: {
    color: '#fff',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 36,
    flexWrap: 'wrap',
    gap: 10,
  },
  controlBtn: {
    backgroundColor: '#3a1c71',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginHorizontal: 6,
    marginVertical: 4,
    minWidth: 90,
    alignItems: 'center',
  },
  controlBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  // Player Modal Styles
  playerContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeBtnText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
    marginLeft: -40, // Compensate for close button
  },
  playerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  frequencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
  earInfo: {
    alignItems: 'center',
    flex: 1,
  },
  earLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  earFreq: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  earDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  vsText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  timerContainer: {
    marginBottom: 40,
  },
  timerText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerControls: {
    marginBottom: 40,
  },
  playBtn: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    minWidth: 120,
    alignItems: 'center',
  },
  playBtnDisabled: {
    backgroundColor: '#666',
  },
  playBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stopBtn: {
    backgroundColor: '#f44336',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    minWidth: 120,
    alignItems: 'center',
  },
  stopBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
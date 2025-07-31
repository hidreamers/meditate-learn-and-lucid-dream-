import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function AudioDropdown({ chapters, showImages = false, styles }) {
  const [open, setOpen] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setPlayingIndex(null);
    setPosition(0);
    setDuration(1);
    setIsPaused(false);
  };

  const playAudio = async (index: number, uri: string) => {
    try {
      await stopAudio();
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      setPlayingIndex(index);
      setIsPaused(false);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && !isSeeking) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 1);
          if (status.didJustFinish) {
            setPlayingIndex(null);
            setPosition(0);
            setIsPaused(false);
          }
        }
      });
    } catch (e) {
      setPlayingIndex(null);
      setPosition(0);
      setIsPaused(false);
    }
  };

  const pauseAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPaused(true);
    }
  };

  const resumeAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPaused(false);
    }
  };

  const seekAudio = async (value: number) => {
    if (soundRef.current) {
      setIsSeeking(true);
      await soundRef.current.setPositionAsync(value);
      setPosition(value);
      setIsSeeking(false);
    }
  };

  React.useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(!open)}
        style={styles.dropdownHeaderShadow}
      >
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownHeaderText}>
            Listen to Audio Book {open ? '▲' : '▼'}
          </Text>
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownMenu}>
          {chapters.map((chapter, idx) => (
            <View key={idx}>
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  playingIndex === idx && styles.dropdownItemActive,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  playingIndex === idx
                    ? stopAudio()
                    : playAudio(idx, chapter.audio)
                }
              >
                <View style={styles.chapterRow}>
                  {showImages && chapter.image && (
                    <Image
                      source={{ uri: chapter.image }}
                      style={styles.chapterImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text
                    style={[
                      styles.dropdownItemText,
                      playingIndex === idx && styles.dropdownItemTextActive,
                    ]}
                  >
                    {chapter.title}
                  </Text>
                  <Text style={styles.icon}>
                    {playingIndex === idx
                      ? isPaused
                        ? '▶️'
                        : '⏸️'
                      : '▶️'}
                  </Text>
                </View>
              </TouchableOpacity>
              {playingIndex === idx && (
                <View style={{ marginHorizontal: 10, marginBottom: 8 }}>
                  <Slider
                    style={{ width: '100%', height: 30 }}
                    minimumValue={0}
                    maximumValue={duration}
                    value={position}
                    minimumTrackTintColor="#3a1c71"
                    maximumTrackTintColor="#b993d6"
                    thumbTintColor="#3a1c71"
                    onSlidingComplete={seekAudio}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#3a1c71' }}>{formatTime(position)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {isPaused ? (
                        <TouchableOpacity onPress={resumeAudio} style={{ marginHorizontal: 8 }}>
                          <Text style={{ color: '#3a1c71', fontWeight: 'bold' }}>Resume</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={pauseAudio} style={{ marginHorizontal: 8 }}>
                          <Text style={{ color: '#3a1c71', fontWeight: 'bold' }}>Pause</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={stopAudio} style={{ marginHorizontal: 8 }}>
                        <Text style={{ color: '#3a1c71', fontWeight: 'bold' }}>Stop</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 12, color: '#3a1c71' }}>{formatTime(duration)}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// Example usage inside your render:
// <AudioDropdown
//   chapters={[
//     { title: "Chapter 1", audio: "https://..." },
//     // ...more chapters
//   ]}
//   showImages={true} // or false if no images
//   styles={audioStyles} // pass your audioStyles object
// />
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

export default function VideoPlayerScreen() {
  const params = useLocalSearchParams();
  const videoId = typeof params.videoId === 'string' ? params.videoId : '';
  const title = typeof params.title === 'string' ? params.title : '';

  return (
    <View style={styles.container}>
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={220}
          play={true}
          videoId={videoId}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', justifyContent: 'center', alignItems: 'center' },
  playerContainer: { width: width - 40, aspectRatio: 16 / 9, alignSelf: 'center' },
});

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const chapters = [
  {
    title: 'Chapter 1: The Journey Begins',
    audio: 'https://dl.dropboxusercontent.com/scl/fi/dyhbsu5o9tluvs2o96jfc/ch1.mp3?rlkey=vvs4uwkz16vxyengzjnbjboyt',
    image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/page11.png',
  },
  {
    title: 'Chapter 2: The Diary',
    audio: 'https://dl.dropboxusercontent.com/scl/fi/okfl0tgvhh6uiwlmx4amk/Ch-2-The-Diary.mp3?rlkey=y4ii46shryvfn0c2ukpfid5og',
    image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/xgvfbxmd.png',
  },
  {
    title: 'Chapter 3: The Awakening',
    audio: 'https://dl.dropboxusercontent.com/scl/fi/tu1n24636wp9wxfsvprta/ch3-1.mp3?rlkey=cqhelf8dku9ttrilj5fwyrq80',
    image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-24-17.19.37-The-image-portrays-two-angels-sitting-on-a-page-curl-symbolizing-a-transition-between-two-realms.-On-one-side-of-the-page-curl-theres-a-realm-fille.png',
  },
  {
    title: 'Chapter 4: The Confusion',
    audio: 'https://dl.dropboxusercontent.com/scl/fi/awje1jkparw25mwgpplrr/Ch-4-The-confusion.mp3?rlkey=qnxb5o4my6796i9brgmfm6y7z',
    image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-24-17.00.06-The-image-captures-a-transformative-moment-where-the-storm-begins-to-dissipate-around-Seth-giving-way-to-a-serene-and-spiritual-scene.-Six-angelic-be.png',
  },
  {
    title: 'Chapter 5: The Uniting',
    audio: 'https://dl.dropboxusercontent.com/scl/fi/tnk6085asmdrexolz99aj/Ch-5-The-Uniting.mp3?rlkey=ul5zsitqxdm07rmql1305zp0e',
    image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/8xzfx1k8.png',
  },
  {
    title: 'Chapter 6: The Transformation',
    audio: 'https://dl.dropboxusercontent.com/scl/fi/01nvyteyeeez21qs6zl7j/ch6-1-1.mp3?rlkey=2f7hzejqs4ya4u1rd5gb6vcde',
    image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/35jnv42k.png',
  },
];

export const options = {
  headerShown: false,
};

export default function JeremiahsBooksAudio() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setPlayingIndex(null);
  };

  const playAudio = async (index: number, uri: string) => {
    try {
      await stopAudio();
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      setPlayingIndex(index);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingIndex(null);
        }
      });
    } catch (e) {
      setPlayingIndex(null);
    }
  };

  React.useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jeremiah's Books in Audio</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: 'https://www.hidreamers.com/wp-content/uploads/2025/05/cover-scaled.jpg' }}
          style={styles.bookCover}
          resizeMode="contain"
        />
        <Text style={styles.title}>The Seventh Angel</Text>
        <Text style={styles.description}>
          "The Seventh Angel" delves into the life of Seth, a young man who grapples with profound questions of spirituality and reality through the realm of lucid dreaming. After the sudden death of his father, a scientist exploring the boundaries of consciousness, Seth inherits a legacy of dream experimentation that challenges his perception of life and his purpose in the cosmos. The narrative weaves a tapestry of metaphysical exploration and personal transformation, inviting readers to question the very fabric of their existence.
          {"\n\n"}
          My inspiration for "The Seventh Angel" stems from my deep interest in spiritual philosophy and the human psyche's untapped potentials.
        </Text>
        <TouchableOpacity style={{margin: 16, backgroundColor: '#d76d77', borderRadius: 8, padding: 12}} onPress={() => router.push('/upgrade')}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Upgrade for Full Access</Text>
        </TouchableOpacity>
        {chapters.map((chapter, idx) => (
          <View key={idx} style={styles.bookCard}>
            <LinearGradient
              colors={['#e0c3fc', '#b993d6', '#f8fafc']}
              style={styles.cardGradient}
            >
              <Image
                source={{ uri: chapter.image }}
                style={styles.chapterImage}
                resizeMode="contain"
              />
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <TouchableOpacity
                style={styles.audioButton}
                onPress={() =>
                  playingIndex === idx
                    ? stopAudio()
                    : playAudio(idx, chapter.audio)
                }
              >
                <Text style={styles.audioButtonText}>
                  {playingIndex === idx ? 'Pause' : 'Play'} Audio
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    alignItems: 'center',
  },
  bookCover: {
    width: width - 80,
    aspectRatio: 2 / 3,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3a1c71',
    textAlign: 'left',
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 18,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  bookCard: {
    width: width - 32,
    borderRadius: 18,
    marginBottom: 28,
    padding: 0,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#3a1c71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    backgroundColor: 'transparent',
  },
  cardGradient: {
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    width: '100%',
  },
  chapterImage: {
    width: width - 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#b993d6',
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3a1c71',
    textAlign: 'center',
    width: '100%',
  },
  audioButton: {
    backgroundColor: '#b993d6',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'center',
    shadowColor: '#3a1c71',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  audioButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

<Stack.Screen
  name="jeremiahs-books-audio"
  options={{ headerShown: false }}
/>
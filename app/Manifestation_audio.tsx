import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
const { width } = Dimensions.get('window');

const book = {
  title: "Manifestation Through Spiritual Power",
  cover: "https://www.hidreamers.com/wp-content/uploads/2024/05/cover_Page_1.jpeg",
  description: `The book "Manifestation Through Spiritual Power" by Jerimiah Molfese is focused on the art of transforming the inner world to manifest reality outwardly. It delves into understanding and experiencing altered states of consciousness through meditation or lucid dreaming and applying these experiences for manifestation in the waking world. It ties Egyptian philosophy of manifestation with the dream state, aiming to bridge the gap between dreams and reality through conscious manifestation, direct thinking, and induced emotion. The book is structured into chapters that explore various aspects of spiritual growth, lucid dreaming, healing, and the conscious manipulation of one's reality and character for personal betterment.`,
};

const chapters = [
  {
    title: "Chapter 1: The Beginning",
    audio: "https://dl.dropboxusercontent.com/scl/fi/g387tqmo4gri16kkigrii/Chapter-1_The-Beginning.mp3?rlkey=93cz1f8drybimz49gyppklgpq",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/t03awb8c.png",
  },
  {
    title: "Chapter 2: Awareness Through Dedication",
    audio: "https://dl.dropboxusercontent.com/scl/fi/10ukoyq9uc94kgq5nmnzm/Chapter-2_Awareness-Through-Dedication.mp3?rlkey=wqcp1dlmuelewkqizb8amm5fj",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/ond9wp6e.png",
  },
  {
    title: "Chapter 3: Non-Physical Weather - Thoughts and Emotions",
    audio: "https://dl.dropboxusercontent.com/scl/fi/91p7drtavwhil05wk40ia/Chapter-3_Non-Physical-Weather_-Thoughts-and-Emotions.mp3?rlkey=qtfobb7j172vuylrktv1aumy4",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/gji3fuuw.png",
  },
  {
    title: "Chapter 4: Alchemy Part 1",
    audio: "https://dl.dropboxusercontent.com/scl/fi/v4ppq2201ku7tdpmejg51/Chapter-4_Alchemy_Part-1.mp3?rlkey=k4iuacodc5n9xcc7bbp23yd1q",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-24-17.36.10-In-this-surreal-and-vivid-scene-Seth-finds-himself-1000-feet-in-the-air-holding-someones-hand-while-encountering-an-old-man-blending-with-the-elect-1.png",
  },
  {
    title: "Chapter 4: Alchemy Part 2",
    audio: "https://dl.dropboxusercontent.com/scl/fi/se2xkqf4eebuioab1j77a/Chapter-4_Alchemy_Part-2.mp3?rlkey=4pwi8hy2xy1z6a8rg5ov79ej8",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/atxvrv3v.png",
  },
  {
    title: "Chapter 5: Creating a Constructive Attitude and Building Will Power (1)",
    audio: "https://dl.dropboxusercontent.com/scl/fi/ov5k5wjb6mrujderp81hc/Chapter-5_Creating-a-Constructive-Attitude-and-Building-Will-Power-1.mp3?rlkey=glj0o85nrykj3v7s50yfiw9qs",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/b1x26lee.png",
  },
  {
    title: "Chapter 5: Creating a Constructive Attitude and Building Will Power (2)",
    audio: "https://dl.dropboxusercontent.com/scl/fi/djm0wmhaamtuua1156yn0/Chapter-5_Creating-a-Constructive-Attitude-and-Building-Will-Power.mp3?rlkey=258qbdg9juosv2ggdwv1juz5h",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/6ch8z3zp.png",
  },
  {
    title: "Chapter 6: Lucid Dreaming",
    audio: "https://dl.dropboxusercontent.com/scl/fi/m49vrc8xw5vxa1cii7vu2/Chapter-6_Lucid-Dreaming.mp3?rlkey=fxvx24c5gmscgnnu0w2q1fmd1",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/cover-hard-my-adventures-scaled.jpg",
  },
  {
  title: "Chapter 7: Wake Induced Lucid Dreaming",
  audio: "https://dl.dropboxusercontent.com/scl/fi/b35h1m89on9rlowjz47mb/Chapter-7_Wake-Induced-Lucid-Dreaming.mp3?rlkey=v5dwtcvwlfanecn72c5yfk086",
  image: "https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-25-14.38.07-The-image-captures-the-moment-of-Seths-incredible-dream-journey-to-space.-Seth-lies-in-bed-eyes-closed-determined-to-experience-a-dream.-He-realize.png",
},
  {
    title: "Chapter 8: Conversion Through Mnemonic Induced Manifestation",
    audio: "https://dl.dropboxusercontent.com/scl/fi/tbxokvh1zeeqb7ksjxny8/Chapter-8-_-Conversion-Through-Mnemonic-Induced-Manifestation.mp3?rlkey=8ltv7c7mp44nqtm3tjxyxtvzd",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-24-17.13.42-The-image-vividly-captures-a-mystical-and-transformative-moment.-Light-beings-swarm-around-the-viewer-radiating-light-with-every-movement.-A-flash-of-1.png",
  },
  {
    title: "Chapter 9: Wake Induced Manifestation",
    audio: "https://dl.dropboxusercontent.com/scl/fi/3awx49tngg9z1pnpbunyi/Chapter-9_Wake-Induced-Manifestation.mp3?rlkey=h3msd6p5hc668znuy9iqzv54p",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-25-17.30.51-In-my-dream-I-missed-my-dad-a-lot-but-the-bright-moonlight-made-me-feel-loved-and-special.-I-went-to-the-bathroom-and-looked-in-the-mirror.-It-felt-.png",
  },
  {
    title: "Chapter 10: Planetary Expressions",
    audio: "https://dl.dropboxusercontent.com/scl/fi/4fxo96dbmqhceeyxgctf8/Chapter-10_-Planetary-Expressions.mp3?rlkey=hu9yedlxy570exvzgsle3yw8a",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/8nvtzkof.png",
  },
  {
    title: "Chapter 11: Healing",
    audio: "https://dl.dropboxusercontent.com/scl/fi/niaehkxqx4utexaq7bfy4/Chapter-11_-Healing.mp3?rlkey=1rkne9jysb4gcqwfa4532nlco",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/6sosqwzh.png",
  },
  {
    title: "Chapter 12: Conclusion",
    audio: "https://dl.dropboxusercontent.com/scl/fi/wk4931ju6ouo11cx9ay2g/Chapter-12_-Conclusion.mp3?rlkey=jf61wvo3t9p9ph0pypdtizp53",
    image: "https://www.hidreamers.com/wp-content/uploads/2024/05/4vmsfgzb.png",
  },
];

export default function ManifestationAudio() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

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
        <Text style={styles.headerTitle}>{book.title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: book.cover }}
          style={styles.bookCover}
          resizeMode="contain"
        />
        <Text style={styles.bookDesc}>{book.description}</Text>
        {chapters.map((chapter, idx) => (
          <View key={idx} style={styles.bookCard}>
            <LinearGradient
              colors={['#e0c3fc', '#b993d6', '#f8fafc']}
              style={styles.cardGradient}
            >
              <Image source={{ uri: chapter.image }} style={styles.chapterImage} resizeMode="contain" />
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
  bookDesc: {
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
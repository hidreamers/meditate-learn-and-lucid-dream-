import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Dimensions, Platform, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const books = [
  {
    id: '1',
    title: "Convergence and the Love Code",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/Convergence-Through-a-Post-Apocalyptic-Dallas.png",
    link: "https://www.jerimiahmolfese.com/The_Love_Code.epub",
    description: "In a near-future world ravaged by nuclear devastation and an AI uprising, humanity finds itself on the brink of extinction. As society collapses and advanced machines wage war against the remnants of human civilization, a groundbreaking discovery offers a flicker of hope—a portal into an uncharted quantum realm where the laws of reality can be rewritten.\n\nConvergence and the Love Code is a sweeping tale of resilience, hope, and the transformative power of love—a story that challenges the boundaries between man and machine, and dares to imagine a world where even in the face of annihilation, the human spirit finds a way to prevail.",
  },
  {
    id: '2',
    title: "The Great Journey: What Lies Beyond",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/The-Great-Journey-What-Lies-Beyond-Fiction-or-reality-unraveling-some-of-humanitys-most-profound-questions-scaled.jpeg",
    link: "https://www.jerimiahmolfese.com/the_great_journy.epub",
    description: "Fiction or reality? Unraveling some of humanity's most profound questions.",
  },
  {
    id: '3',
    title: "My Adventures in Lucid Dreaming",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/Lucid-Dreaming-cover.png",
    link: "https://www.jerimiahmolfese.com/My_Adventures_in_lucid_dreaming.epub",
    description: "Unlock the secrets of lucid dreaming and explore your inner universe.",
  },
  {
    id: '4',
    title: "Manifestation Through Spiritual Power: Unlock the secrets of Lucid Dreaming and Alchemy",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/Manifestation-Unlock-the-Secrets-of-Lucid-Dreaming-and-Alchemy--scaled.jpeg",
    link: "https://www.jerimiahmolfese.com/Manifestation.epub",
    description: "Discover the connection between lucid dreaming and the art of manifestation.",
  },
  {
    id: '5',
    title: "Guardians Volume One",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/Guardians-Rise-of-The-Protectors-Jerimiah-Molfese.png",
    link: "https://www.jerimiahmolfese.com/Guardians_Book_1.epub",
    description: "The first adventure in the Guardians saga.",
  },
  {
    id: '6',
    title: "Guardians Book 2",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/Guardians-Battle-of-five-planets-Jerimiah-Molfese.png",
    link: "https://www.jerimiahmolfese.com/GUARDIANS_Book_2.epub",
    description: "The epic battle continues across the stars.",
  },
  {
    id: '7',
    title: "Guardians Volume Three",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/Guardians-Battle-For-The-Multiverse-Jerimiah-Molfese.png",
    link: "https://www.jerimiahmolfese.com/Gaurdians_Book_3.epub",
    description: "The fate of the multiverse hangs in the balance.",
  },
  {
    id: '8',
    title: "Guardians Volume Four",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/Guardians-Battle-For-The-Multiverse-Jerimiah-Molfese.png",
    link: "https://www.jerimiahmolfese.com/Guardians_Book_4.epub",
    description: "The final battle for the Guardians.",
  },
  {
    id: '9',
    title: "A Dreamer’s Odyssey: True Stories of a Dream Traveler",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/04/cover-scaled.jpg",
    link: "https://www.jerimiahmolfese/A_Dreamer_Odyssey.epub",
    description: "“A Dreamer’s Odyssey: True Stories of a Dream Traveler” is an intimate journey into the real-life experiences of lucid dreaming and spiritual discovery.",
  },
  {
    id: '10',
    title: "The Seventh Angel",
    cover: "https://www.hidreamers.com/wp-content/uploads/2025/05/cover-scaled.jpg",
    link: "https://www.dropbox.com/scl/fi/h0he9ko29yf3qx3jmvhjg/The-seventh-angel.pdf?rlkey=kiq9ax36gwd9x7cskjal6md88&dl=0",
    description: `"The Seventh Angel" delves into the life of Seth, a young man who grapples with profound questions of spirituality and reality through the realm of lucid dreaming. After the sudden death of his father, a scientist exploring the boundaries of consciousness, Seth inherits a legacy of dream experimentation that challenges his perception of life and his purpose in the cosmos. The narrative weaves a tapestry of metaphysical exploration and personal transformation, inviting readers to question the very fabric of their existence. My inspiration for "The Seventh Angel" stems from my deep interest in spiritual philosophy and the human psyche's untapped potentials.`,
  },
];

const convergenceChapters = [
  {
    title: "Chapter One: The Scientist",
    audio: "https://dl.dropboxusercontent.com/scl/fi/jkotslr0ddv8oeaancv4a/Chapter-One-The-Scientist.mp3?rlkey=bp6tvz3k2562b8urn0m09znbd",
  },
  {
    title: "Chapter Two: The Soldier",
    audio: "https://dl.dropboxusercontent.com/scl/fi/m1e9cay5z1t497tppep5t/Chapter-Two-The-Soldier.mp3?rlkey=6cg36oa70kx489ei1w4hzsf7s",
  },
  {
    title: "Chapter Three: The Hacker",
    audio: "https://dl.dropboxusercontent.com/scl/fi/1rdkp5pbigp1kmnr8ytug/Chapter-Three-The-Hacker.mp3?rlkey=s80xy512cryrpgx4d6cx2a0cm",
  },
  {
    title: "Chapter Four: Good and Evil",
    audio: "https://dl.dropboxusercontent.com/scl/fi/o17cr449g1zb5phj1qk3x/Chapter-Four-Good-and-Evil.mp3?rlkey=tsbwtzp7ds7xmyyuxbx37h38x",
  },
  {
    title: "Chapter Five: The Convergence",
    audio: "https://dl.dropboxusercontent.com/scl/fi/8rbcomxha462ggcn09q08/Chapter-Five-The-Convergence.mp3?rlkey=js07z19etybgmaz4vhl7l794t",
  },
  {
    title: "Chapter Six: A New World",
    audio: "https://dl.dropboxusercontent.com/scl/fi/3s1a4botx26a5drzsabvi/Chapter-Six-A-New-World.mp3?rlkey=xs25jw78th6tk722gj2bauued",
  },
  {
    title: "Chapter Seven: The Return Back to Earth",
    audio: "https://dl.dropboxusercontent.com/scl/fi/gfr35lul4mv6mmlr3xdu2/Chapter-Seven-The-Return-Back-to-Earth.mp3?rlkey=gtsdqit1lrgkyof8c1al5sgv8",
  },
  {
    title: "Chapter Eight: The Rebuilding of Earth",
    audio: "https://dl.dropboxusercontent.com/scl/fi/9alq4cm7h93uhz6965pty/Chapter-8-The-Rebuilding-of-Earth.mp3?rlkey=s0lsrp5lpu1dv20i8m1muhv9n",
  },
];

const { width } = Dimensions.get('window');

// --- Pop-out Audio Player Modal ---
function AudioPlayerModal({ visible, onClose, chapter }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    if (visible && chapter?.audio) {
      loadAndPlay();
    }
    return () => {
      unload();
    };
  }, [visible, chapter]);

  const loadAndPlay = async () => {
    try {
      await unload();
      const { sound } = await Audio.Sound.createAsync({ uri: chapter.audio });
      soundRef.current = sound;
      setIsPlaying(true);
      setIsPaused(false);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && !isSeeking) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 1);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setIsPaused(false);
            setPosition(0);
          }
        }
      });
    } catch (e) {
      setIsPlaying(false);
      setIsPaused(false);
      setPosition(0);
    }
  };

  const unload = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setPosition(0);
    setDuration(1);
  };

  const pause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resume = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const seek = async value => {
    if (soundRef.current) {
      setIsSeeking(true);
      await soundRef.current.setPositionAsync(value);
      setPosition(value);
      setIsSeeking(false);
    }
  };

  const seekRelative = async (deltaMs) => {
    let newPos = Math.max(0, Math.min(position + deltaMs, duration));
    await seek(newPos);
  };

  const formatTime = millis => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!visible || !chapter) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.playerCard}>
          <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
            <Text style={{ fontSize: 22, color: '#3a1c71' }}>✕</Text>
          </TouchableOpacity>
          <Text style={modalStyles.title}>{chapter?.title}</Text>
          <Slider
            style={{ width: '100%', height: 32, marginTop: 16 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#3a1c71"
            maximumTrackTintColor="#b993d6"
            thumbTintColor="#3a1c71"
            onSlidingComplete={seek}
          />
          <View style={modalStyles.timeRow}>
            <Text style={modalStyles.time}>{formatTime(position)}</Text>
            <Text style={modalStyles.time}>{formatTime(duration)}</Text>
          </View>
          <View style={modalStyles.controlsRow}>
            <TouchableOpacity onPress={() => seekRelative(-15000)} style={modalStyles.ctrlBtn}>
              <Text style={modalStyles.ctrlText}>⏪</Text>
            </TouchableOpacity>
            {isPaused ? (
              <TouchableOpacity onPress={resume} style={modalStyles.ctrlBtn}>
                <Text style={modalStyles.ctrlText}>▶️</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pause} style={modalStyles.ctrlBtn}>
                <Text style={modalStyles.ctrlText}>⏸️</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => seekRelative(15000)} style={modalStyles.ctrlBtn}>
              <Text style={modalStyles.ctrlText}>⏩</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(40,20,60,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#3a1c71',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a1c71',
    textAlign: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  time: {
    fontSize: 14,
    color: '#3a1c71',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  ctrlBtn: {
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctrlText: {
    fontSize: 18,
    color: '#3a1c71',
  },
});

// --- Generic Audio Dropdown ---
function AudioDropdown({ chapters, showImages = false }) {
  const [open, setOpen] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
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
    <View style={audioStyles.dropdownWrapper}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(!open)}
        style={audioStyles.dropdownHeaderShadow}
      >
        <LinearGradient
          colors={['#3a1c71', '#b993d6']}
          style={audioStyles.dropdownHeader}
        >
          <Text style={audioStyles.dropdownHeaderText}>
            Listen to Audio Book {open ? '▲' : '▼'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
      {open && (
        <View style={audioStyles.dropdownMenu}>
          {chapters.map((chapter, idx) => (
            <View key={idx}>
              <TouchableOpacity
                style={[
                  audioStyles.dropdownItem,
                  playingIndex === idx && audioStyles.dropdownItemActive,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  playingIndex === idx
                    ? stopAudio()
                    : playAudio(idx, chapter.audio)
                }
              >
                <View style={audioStyles.chapterRow}>
                  {showImages && chapter.image && (
                    <Image
                      source={{ uri: chapter.image }}
                      style={audioStyles.chapterImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text
                    style={[
                      audioStyles.dropdownItemText,
                      playingIndex === idx && audioStyles.dropdownItemTextActive,
                    ]}
                  >
                    {chapter.title}
                  </Text>
                  <Text style={audioStyles.icon}>
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
      {selectedChapter && (
        <AudioPlayerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          chapter={selectedChapter}
        />
      )}
    </View>
  );
}

// --- Dropdown wrappers for each book ---
function ConvergenceAudioDropdown() {
  const chapters = [
    {
      title: "Chapter One: The Scientist",
      audio: "https://dl.dropboxusercontent.com/scl/fi/jkotslr0ddv8oeaancv4a/Chapter-One-The-Scientist.mp3?rlkey=bp6tvz3k2562b8urn0m09znbd",
    },
    {
      title: "Chapter Two: The Soldier",
      audio: "https://dl.dropboxusercontent.com/scl/fi/m1e9cay5z1t497tppep5t/Chapter-Two-The-Soldier.mp3?rlkey=6cg36oa70kx489ei1w4hzsf7s",
    },
    {
      title: "Chapter Three: The Hacker",
      audio: "https://dl.dropboxusercontent.com/scl/fi/1rdkp5pbigp1kmnr8ytug/Chapter-Three-The-Hacker.mp3?rlkey=s80xy512cryrpgx4d6cx2a0cm",
    },
    {
      title: "Chapter Four: Good and Evil",
      audio: "https://dl.dropboxusercontent.com/scl/fi/o17cr449g1zb5phj1qk3x/Chapter-Four-Good-and-Evil.mp3?rlkey=tsbwtzp7ds7xmyyuxbx37h38x",
    },
    {
      title: "Chapter Five: The Convergence",
      audio: "https://dl.dropboxusercontent.com/scl/fi/8rbcomxha462ggcn09q08/Chapter-Five-The-Convergence.mp3?rlkey=js07z19etybgmaz4vhl7l794t",
    },
    {
      title: "Chapter Six: A New World",
      audio: "https://dl.dropboxusercontent.com/scl/fi/3s1a4botx26a5drzsabvi/Chapter-Six-A-New-World.mp3?rlkey=xs25jw78th6tk722gj2bauued",
    },
    {
      title: "Chapter Seven: The Return Back to Earth",
      audio: "https://dl.dropboxusercontent.com/scl/fi/gfr35lul4mv6mmlr3xdu2/Chapter-Seven-The-Return-Back-to-Earth.mp3?rlkey=gtsdqit1lrgkyof8c1al5sgv8",
    },
    {
      title: "Chapter Eight: The Rebuilding of Earth",
      audio: "https://dl.dropboxusercontent.com/scl/fi/9alq4cm7h93uhz6965pty/Chapter-8-The-Rebuilding-of-Earth.mp3?rlkey=s0lsrp5lpu1dv20i8m1muhv9n",
    },
  ];
  return <AudioDropdown chapters={chapters} />;
}

function ManifestationAudioDropdown() {
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
  return <AudioDropdown chapters={chapters} showImages />;
}

function SeventhAngelAudioDropdown() {
  const chapters = [
    {
      title: "Chapter 1: The Journey Begins",
      audio: "https://dl.dropboxusercontent.com/scl/fi/dyhbsu5o9tluvs2o96jfc/ch1.mp3?rlkey=vvs4uwkz16vxyengzjnbjboyt",
      image: "https://www.hidreamers.com/wp-content/uploads/2024/05/page11.png",
    },
    {
      title: "Chapter 2: The Diary",
      audio: "https://dl.dropboxusercontent.com/scl/fi/okfl0tgvhh6uiwlmx4amk/Ch-2-The-Diary.mp3?rlkey=y4ii46shryvfn0c2ukpfid5og",
      image: "https://www.hidreamers.com/wp-content/uploads/2024/05/xgvfbxmd.png",
    },
    {
      title: "Chapter 3: The Awakening",
      audio: "https://dl.dropboxusercontent.com/scl/fi/tu1n24636wp9wxfsvprta/ch3-1.mp3?rlkey=cqhelf8dku9ttrilj5fwyrq80",
      image: "https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-24-17.19.37-The-image-portrays-two-angels-sitting-on-a-page-curl-symbolizing-a-transition-between-two-realms.-On-one-side-of-the-page-curl-theres-a-realm-fille.png",
    },
    {
      title: "Chapter 4: The Confusion",
      audio: "https://dl.dropboxusercontent.com/scl/fi/awje1jkparw25mwgpplrr/Ch-4-The-confusion.mp3?rlkey=qnxb5o4my6796i9brgmfm6y7z",
      image: "https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-24-17.00.06-The-image-captures-a-transformative-moment-where-the-storm-begins-to-dissipate-around-Seth-giving-way-to-a-serene-and-spiritual-scene.-Six-angelic-be.png",
    },
    {
      title: "Chapter 5: The Uniting",
      audio: "https://dl.dropboxusercontent.com/scl/fi/tnk6085asmdrexolz99aj/Ch-5-The-Uniting.mp3?rlkey=ul5zsitqxdm07rmql1305zp0e",
      image: "https://www.hidreamers.com/wp-content/uploads/2024/05/8xzfx1k8.png",
    },
    {
      title: "Chapter 6: The Transformation",
      audio: "https://dl.dropboxusercontent.com/scl/fi/01nvyteyeeez21qs6zl7j/ch6-1-1.mp3?rlkey=2f7hzejqs4ya4u1rd5gb6vcde",
      image: "https://www.hidreamers.com/wp-content/uploads/2024/05/35jnv42k.png",
    },
   {
  title: "Chapter 7: Wake Induced Lucid Dreaming",
  audio: "https://dl.dropboxusercontent.com/scl/fi/b35h1m89on9rlowjz47mb/Chapter-7_Wake-Induced-Lucid-Dreaming.mp3?rlkey=v5dwtcvwlfanecn72c5yfk086",
  image: "https://www.hidreamers.com/wp-content/uploads/2024/05/DALL·E-2024-01-25-14.38.07-The-image-captures-the-moment-of-Seths-incredible-dream-journey-to-space.-Seth-lies-in-bed-eyes-closed-determined-to-experience-a-dream.-He-realize.png",
},
  ];
  return <AudioDropdown chapters={chapters} showImages />;
}

function OdysseyAudioDropdown() {
  const chapters = [
    {
      title: "Chapter One: The Beginning",
      audio: "https://dl.dropboxusercontent.com/scl/fi/ucm4bo2vyiwgkbew5x5mr/Chapter-One-The-Beginning.mp3?rlkey=fj6l9g9rqjjel4oexr7pzyi74",
    },
    {
      title: "Chapter Two: Becoming a Teenager",
      audio: "https://dl.dropboxusercontent.com/scl/fi/iln5bip90wbn9nisiqu2s/Chapter-Two-Becoming-a-Teenager.mp3?rlkey=9lrepawcbkiu4gadrc7qx4uh5",
    },
    {
      title: "Chapter Three: The Dreamer Awakens",
      audio: "https://dl.dropboxusercontent.com/scl/fi/ezomta4pt21k67f35nuh7/Chapter-Three-The-Dreamer-Awakens.mp3?rlkey=yqxqbkmffr52cclx435lwaw1p",
    },
    {
      title: "Chapter Four: Becoming an Adult",
      audio: "https://dl.dropboxusercontent.com/scl/fi/3rj4j59ewpovag82fw2rn/Chapter-Four-Becoming-an-Adult.mp3?rlkey=fr7tmau8pc3u5c0h8zybhii9s",
    },
    {
      title: "Chapter Five: Becoming a Shaman",
      audio: "https://dl.dropboxusercontent.com/scl/fi/7ybk6ewgh8vq15wpyg323/Chapter-Five-Becoming-a-Shaman.mp3?rlkey=ezjcntaqyxtifnr1chzltrqhd",
    },
    {
      title: "Chapter Six: Fatherhood",
      audio: "https://dl.dropboxusercontent.com/scl/fi/05prvrrsmhalgkms6jtt5/Chapter-six-Fatherhood.mp3?rlkey=hmmk2ez9ot9aashk7apz1tgrv",
    },
    {
      title: "Chapter Seven: Full Circle",
      audio: "https://dl.dropboxusercontent.com/scl/fi/ik7ny8ehma0rg9tx28w97/Chapter-seven-full-circle.mp3?rlkey=2j3pvg8jswtt8b3203ls4z2k0",
    },
    {
      title: "Chapter Eight: Conclusion",
      audio: "https://dl.dropboxusercontent.com/scl/fi/vjv664yzxssupbn2iibv6/Chapter-eight-Conclusion.mp3?rlkey=umojzxvdlnkjiqrfksfgyvki2",
    },
    {
      title: "Chapter Nine: Lucid Dreaming Introduction",
      audio: "https://dl.dropboxusercontent.com/scl/fi/u4z62gaioqawq41daafd0/Chapter-Nine-Lucid-Dreaming-Introduction.mp3?rlkey=6622ga29czpfdo7uephqbzwi0",
    },
    {
      title: "Chapter Ten: MILD - Mnemonic Induced Lucid Dreaming",
      audio: "https://dl.dropboxusercontent.com/scl/fi/d448nwdwmt7j17b48h6eb/Chapter-Ten-MILD-Mnemonic-Induced-Lucid-Dreaming.mp3?rlkey=qvcopp2c5dn4lkiaw21csiaxy",
    },
    {
      title: "Chapter Eleven: Wake Induced Lucid Dreaming and Dream Yoga",
      audio: "https://dl.dropboxusercontent.com/scl/fi/86qvfmsd83072uh5bplnc/Chapter-eleven-wake-induced-lucid-dreaming-and-dream-yoga.mp3?rlkey=3g8hu5d8ou6htlug292lninor",
    },
  ];
  return <AudioDropdown chapters={chapters} />;
}

export default function BooksScreen() {
  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Books by Jerimiah Molfese</Text>
        <Text style={styles.headerSubtitle}>
          Recommended reading and resources for lucid dreaming
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.bodyText}>
          You can use the{' '}
          <Text
            style={styles.linkText}
            onPress={() =>
              Linking.openURL('https://www.amazon.com/b/ref=ruby_redirect?ie=UTF8&node=16571048011')
            }
          >
            Kindle Reader app
          </Text>{' '}
          to access these books.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {books.map(book => (
          <View key={book.id} style={styles.bookCard}>
            <Image
              source={{ uri: book.cover }}
              style={styles.bookCover}
              resizeMode="contain"
            />
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookDesc}>{book.description}</Text>
            <TouchableOpacity
              style={{ marginTop: 2 }}
              onPress={() => Linking.openURL(book.link)}
              activeOpacity={0.85}
            >
              <Text style={styles.bookLink}>Read now</Text>
            </TouchableOpacity>
            {book.title === "Convergence and the Love Code" && <ConvergenceAudioDropdown />}
            {book.title === "Manifestation Through Spiritual Power: Unlock the secrets of Lucid Dreaming and Alchemy" && <ManifestationAudioDropdown />}
            {book.title === "The Seventh Angel" && <SeventhAngelAudioDropdown />}
            {book.title.startsWith("A Dreamer’s Odyssey") && <OdysseyAudioDropdown />}
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
  description: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  link: {
    color: '#d76d77',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  bookCard: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 28,
    padding: 18,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 10,
  },
  bookCover: {
    width: width - 80,
    aspectRatio: 2 / 3,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
    alignSelf: 'center',
  },
  bookTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#3a1c71',
    textAlign: 'center',
    marginBottom: 8,
  },
  bookDesc: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  bookLink: {
    color: '#d76d77',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  linkText: {
    color: '#3a1c71',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

const audioStyles = StyleSheet.create({
  dropdownWrapper: {
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#3a1c71',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    backgroundColor: 'transparent',
  },
  dropdownHeaderShadow: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  dropdownHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  dropdownMenu: {
    backgroundColor: '#f8f8ff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#b993d6',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0c3fc',
    backgroundColor: '#f8f8ff',
  },
  dropdownItemActive: {
    backgroundColor: '#e0c3fc',
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dropdownItemText: {
    color: '#3a1c71',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'left',
  },
  dropdownItemTextActive: {
    color: '#b993d6',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 20,
    marginLeft: 12,
  },
  chapterImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
  },
});
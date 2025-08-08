import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Dimensions, StatusBar, Platform } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { usePremium } from '../contexts/PremiumContext';

const { width } = Dimensions.get('window');

const guidedMeditationTracks = [
    {
        id: '18',
        title: 'Deep Healing Meditation: Didgeridoo, Theta Waves & 61 Points of Relaxation',
        videoUrl: 'https://youtu.be/U-OoFVeq16I?si=rAQQjaIKhhTH3P7v',
        image: 'https://img.youtube.com/vi/U-OoFVeq16I/hqdefault.jpg',
    },
    {
        id: '19',
        title: '61 Point Relaxation',
        videoUrl: 'https://youtu.be/4-yWJrL1Wyc?si=8wemevCjfWowUVdf',
        image: 'https://img.youtube.com/vi/4-yWJrL1Wyc/hqdefault.jpg',
    },
    {
        id: '20',
        title: 'Open Your Heart',
        videoUrl: 'https://youtu.be/q8xrwOck07Q?si=mXBkqjvKta83JCIG',
        image: 'https://img.youtube.com/vi/q8xrwOck07Q/hqdefault.jpg',
    },
    {
        id: '21',
        title: 'I Am Connected Meditation',
        description: `"I Am Connected" is a powerful guided meditation designed to help you realign with your higher self and awaken your inner knowing. This practice blends deeply relaxing theta wave binaural beats with soul-activating affirmations to create a sacred space for spiritual connection, healing, and inner clarity.

As the binaural tones gently shift your brain into the theta state—the gateway to deep meditation, intuition, and spiritual insight—you'll be guided to release resistance and tune in to the frequency of your higher power. The affirmations woven throughout the session act as energetic keys, opening channels to divine intelligence and reminding you that you are never alone.

Whether you're seeking guidance, inner peace, or a deeper connection to your purpose, this meditation will help you feel grounded, aligned, and supported.`,
        videoUrl: 'https://youtu.be/9JLsmoTqUSQ',
        image: 'https://img.youtube.com/vi/9JLsmoTqUSQ/hqdefault.jpg',
    },
    {
        id: '22',
        title: 'Lucid Dreaming Audio Meditation',
        audioFile: 'https://www.hidreamers.com/wp-content/uploads/2025/06/lucid_Dreaming.mp3',
        image: 'https://www.hidreamers.com/wp-content/uploads/2025/05/ChatGPT-Image-May-10-2025-11_13_39-AM.png',
        duration: 30,
    },
    {
        id: '23',
        title: 'Healing Spirit Guide with Lucid Dreaming',
        audioFile: 'https://www.jerimiahmolfese.com/Healing%20Spirit%20Guid%20with%20Lucid%20Dreaming.mp3',
        image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/mnucpb0w.png',
        description: 'A soothing meditation to connect with your spirit guide and enhance your lucid dreaming journey. Let healing energy guide you through your dreams for deeper insight and peace.',
        duration: 30,
    },
    {
        id: '24',
        title: 'Theta with I Am Light Affirmations',
        audioFile: 'https://www.jerimiahmolfese.com/Theta%20with%20I%20am%20Light%20Affermations.mp3',
        image: 'https://www.hidreamers.com/wp-content/uploads/2024/05/ypf109d9.png',
        description: "Immerse yourself in theta waves and uplifting 'I Am Light' affirmations. This meditation helps you relax deeply, raise your vibration, and prepare your mind for lucid dreaming.",
        duration: 30,
    },
];

function getYoutubeId(url: string) {
    if (!url) return '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

export default function GuidedMeditationsScreen() {
    const router = useRouter();
    const { isPremium } = usePremium();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any>(null);
    const [audio, setAudio] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioStatus, setAudioStatus] = useState<any>(null);
    const [audioPosition, setAudioPosition] = useState(0);
    const [audioDuration, setAudioDuration] = useState(1);

    const handleTrackPress = (track: any, index: number) => {
        const locked = index > 0 && !isPremium;
        if (locked) {
            router.push('/upgrade');
            return;
        }
        setSelectedTrack(track);
        setModalVisible(true);
    };

    const handleCloseModal = async () => {
        setModalVisible(false);
        setSelectedTrack(null);
        if (audio) {
            await audio.unloadAsync();
            setAudio(null);
            setIsPlaying(false);
            setAudioPosition(0);
            setAudioDuration(1);
        }
    };

    const handlePlayPause = async (audioFile: string) => {
        if (audio) {
            if (isPlaying) {
                await audio.pauseAsync();
                setIsPlaying(false);
            } else {
                await audio.playAsync();
                setIsPlaying(true);
            }
        } else {
            const { sound, status } = await Audio.Sound.createAsync(
                { uri: audioFile },
                {},
                (status) => {
                    setAudioStatus(status);
                    if (status.isLoaded) {
                        setAudioPosition(status.positionMillis || 0);
                        setAudioDuration(status.durationMillis || 1);
                    }
                }
            );
            setAudio(sound);
            setIsPlaying(true);
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                setAudioStatus(status);
                if (status.isLoaded) {
                    setAudioPosition(status.positionMillis || 0);
                    setAudioDuration(status.durationMillis || 1);
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setAudioPosition(0);
                    }
                }
            });
        }
    };

    const handleSeek = async (value: number) => {
        if (audio && audioStatus?.isLoaded) {
            await audio.setPositionAsync(value);
            setAudioPosition(value);
        }
    };

    const handleStop = async () => {
        if (audio) {
            await audio.stopAsync();
            setIsPlaying(false);
            setAudioPosition(0);
        }
    };

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3a1c71' }} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar translucent backgroundColor="transparent" />
            <LinearGradient colors={['#3a1c71', '#b993d6', '#fff']} style={{ flex: 1 }}>
                <View style={[styles.headerBox, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 36 }]}>
                    <Text style={styles.headerTitle}>Guided Meditations</Text>
                    <Text style={styles.headerSubtitle}>Guided audio and video meditations for healing, relaxation, and spiritual connection.</Text>
                </View>
                <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
                    {guidedMeditationTracks.map((track, index) => {
                        const locked = index > 0 && !isPremium;
                        return (
                            <TouchableOpacity
                                key={track.id}
                                style={locked ? [styles.card, { opacity: 0.4 }] : styles.card}
                                onPress={() => handleTrackPress(track, index)}
                                disabled={locked}
                            >
                                <Image source={{ uri: track.image }} style={styles.image} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{track.title}</Text>
                                    {track.description && (
                                        <Text style={styles.description}>{track.description}</Text>
                                    )}
                                    {locked && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                                            <Ionicons name="lock-closed" size={14} color="#d76d77" />
                                            <Text style={{ color: '#d76d77', marginLeft: 4, fontWeight: 'bold' }}>Premium</Text>
                                            <TouchableOpacity style={{ marginLeft: 12, backgroundColor: '#d76d77', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 12 }} onPress={() => router.push('/upgrade')}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Upgrade</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    {/* Upgrade Banner */}
                    {!isPremium && (
                        <TouchableOpacity
                            style={styles.upgradeBanner}
                            onPress={() => router.push('/upgrade')}
                        >
                            <Ionicons name="star" size={24} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.upgradeBannerText}>
                                Unlock All Guided Meditations
                            </Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    )}
                </ScrollView>
                {/* Modal for video/audio player */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContentFixed}>
                            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                            {selectedTrack && (selectedTrack.videoUrl || selectedTrack.audioFile) ? (
                                <>
                                    <Text style={styles.playerTitle}>{selectedTrack.title}</Text>
                                    {selectedTrack.videoUrl ? (
                                        <View style={{ width: width - 40, aspectRatio: 16 / 9, marginBottom: 20, alignSelf: 'center' }}>
                                            <YoutubePlayer
                                                height={220}
                                                play={true}
                                                videoId={getYoutubeId(selectedTrack.videoUrl)}
                                            />
                                        </View>
                                    ) : null}
                                    {selectedTrack.audioFile ? (
                                        <View style={{ alignItems: 'center', marginBottom: 20, width: '100%' }}>
                                            <Slider
                                                style={{ width: width - 80, height: 40 }}
                                                minimumValue={0}
                                                maximumValue={audioDuration}
                                                value={audioPosition}
                                                minimumTrackTintColor="#d76d77"
                                                maximumTrackTintColor="#fff"
                                                thumbTintColor="#d76d77"
                                                onSlidingComplete={handleSeek}
                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 80, marginBottom: 8 }}>
                                                <Text style={{ color: '#fff', fontSize: 12 }}>{formatTime(audioPosition)}</Text>
                                                <Text style={{ color: '#fff', fontSize: 12 }}>{formatTime(audioDuration)}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <TouchableOpacity
                                                    style={{ backgroundColor: '#3a1c71', padding: 12, borderRadius: 24, marginHorizontal: 10 }}
                                                    onPress={handleStop}
                                                >
                                                    <Ionicons name="stop" size={28} color="#fff" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ backgroundColor: isPlaying ? '#d76d77' : '#3a1c71', padding: 12, borderRadius: 24, marginHorizontal: 10 }}
                                                    onPress={() => handlePlayPause(selectedTrack.audioFile)}
                                                >
                                                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ) : null}
                                </>
                            ) : null}
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    headerBox: {
        alignItems: 'center',
        marginBottom: 18,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 16,
        marginRight: 18,
        backgroundColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3a1c71',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    pdfButton: {
        marginTop: 8,
        backgroundColor: '#d76d77',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    pdfButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentFixed: {
        backgroundColor: '#1a1a2e',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 50,
        padding: 20,
        alignSelf: 'center',
        width: width - 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    playerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    upgradeBanner: {
        backgroundColor: '#3a1c71',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        marginHorizontal: 0,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
        alignSelf: 'stretch',
    },
    upgradeBannerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
});
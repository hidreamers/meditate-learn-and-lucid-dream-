import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Image, StyleSheet, Modal, Dimensions, View, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { usePremium } from '../contexts/PremiumContext';

const { width } = Dimensions.get('window');



const didgeridooTracks = [
    {
        id: '1',
        title: 'How to Play the Didgeridoo Part 1: Find the Sweet Spot',
        videoUrl: 'https://youtu.be/_renfJmANio',
        image: 'https://img.youtube.com/vi/_renfJmANio/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/How-to-Find-the-Sweet-Spot-with-the-Didgeridoo.pdf',
    },
    {
        id: '2',
        title: 'How to Play the Didgeridoo Part 2: Circular Breathing',
        videoUrl: 'https://youtu.be/lWj16EFByCM',
        image: 'https://img.youtube.com/vi/lWj16EFByCM/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/How-to-Do-Circular-Breathing.pdf',
    },
    {
        id: '3',
        title: 'How to Play the Didgeridoo Part 3: Healing and how to make sounds',
        videoUrl: 'https://youtu.be/dTM83JE1rkc',
        image: 'https://img.youtube.com/vi/dTM83JE1rkc/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/How-to-Play-Overtones-on-the-Didgeridoo.pdf',
    },
    {
        id: '4',
        title: 'How to Play the Didgeridoo part 4 Build energy for healing part 1',
        videoUrl: 'https://youtu.be/zXc0i0UOqaU',
        image: 'https://img.youtube.com/vi/zXc0i0UOqaU/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/How-to-Play-the-Didgeridoo-Building-and-Directing-Energy-for-Healing.pdf',
    },
    {
        id: '5',
        title: 'Didgeridoo Lessons Part 4 How to Build energy for healing part 2',
        videoUrl: 'https://youtu.be/3-btEDAdEtM',
        image: 'https://img.youtube.com/vi/3-btEDAdEtM/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/How-to-Play-the-Didgeridoo-Building-and-Directing-Energy-for-Healing.pdf',
    },
];

function getYoutubeId(url: string) {
    if (!url) return '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

export default function DidgeridooLessonsScreen() {
    const router = useRouter();
    const { isPremium } = usePremium();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<any>(null);

    const handleLessonPress = (lesson, index) => {
        const isLocked = index > 0 && !isPremium;
        if (isLocked) {
            router.push('/upgrade');
            return;
        }
        setSelectedTrack(lesson);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedTrack(null);
    };

    const handleOpenPdf = (url: string, locked: boolean) => {
        if (locked) {
            router.push('/upgrade');
            return;
        }
        router.push({ pathname: '/pdf-viewer', params: { url } });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3a1c71' }} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar translucent backgroundColor="transparent" />
            <LinearGradient colors={['#3a1c71', '#b993d6', '#fff']} style={{ flex: 1 }}>
                <View style={[styles.headerBox, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 36 }]}>
                    <Text style={styles.headerTitle}>Didgeridoo Lessons</Text>
                    <Text style={styles.headerSubtitle}>Learn the ancient art of didgeridoo playing</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {didgeridooTracks.map((track, index) => {
                        const locked = index > 0 && !isPremium;
                        return (
                            <TouchableOpacity
                                key={track.id}
                                style={locked ? [styles.card, { opacity: 0.4 }] : styles.card}
                                onPress={() => handleLessonPress(track, index)}
                                disabled={locked}
                            >
                                <Image source={{ uri: track.image }} style={styles.image} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>{track.title}</Text>
                                    {track.pdf && (
                                        <TouchableOpacity
                                            style={styles.pdfButton}
                                            onPress={() => handleOpenPdf(track.pdf, locked)}
                                            disabled={locked}
                                        >
                                            <Ionicons name="document-text-outline" size={16} color="#fff" />
                                            <Text style={styles.pdfButtonText}>Read PDF Lesson</Text>
                                        </TouchableOpacity>
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
                                Unlock All Digeridoo Lessons and More!
                            </Text>
                            <Ionicons name="chevron-forward" size={24} color="#fff" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </LinearGradient>
            {modalVisible && (
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
                            {selectedLesson && selectedLesson.videoUrl ? (
                                (() => {
                                    const videoId = getYoutubeId(selectedLesson.videoUrl);
                                    if (!videoId) {
                                        return <Text style={{ color: '#fff', textAlign: 'center', margin: 20 }}>Invalid or missing YouTube video. Please contact support.</Text>;
                                    }
                                    return (
                                        <>
                                            <Text style={styles.playerTitle}>{selectedLesson.title}</Text>
                                            <View style={{ width: width - 40, aspectRatio: 16 / 9, marginBottom: 20, alignSelf: 'center' }}>
                                                <YoutubePlayer
                                                    height={220}
                                                    play={true}
                                                    videoId={videoId}
                                                />
                                            </View>
                                            {selectedLesson.pdf && (
                                                <TouchableOpacity
                                                    style={[styles.pdfButton, { alignSelf: 'center', marginBottom: 10 }]}
                                                    onPress={() => handleOpenPdf(selectedLesson.pdf)}
                                                >
                                                    <Ionicons name="document-text-outline" size={16} color="#fff" />
                                                    <Text style={styles.pdfButtonText}>Read PDF Lesson</Text>
                                                </TouchableOpacity>
                                            )}
                                        </>
                                    );
                                })()
                            ) : null}
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    upgradeBanner: {
        backgroundColor: '#3a1c71',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
    },
    upgradeBannerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
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
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    title: {
        fontWeight: 'bold',
        color: '#3a1c71',
        marginBottom: 4,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    tag: {
        backgroundColor: '#b993d6',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        fontSize: 12,
        marginRight: 6,
        marginBottom: 4,
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
});

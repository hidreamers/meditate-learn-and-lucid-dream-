import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Dimensions, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import { usePremium } from '../contexts/PremiumContext';

const { width } = Dimensions.get('window');

const dreamYogaLessons = [
    {
        id: '1',
        title: 'What Is Dream Yoga?',
        videoUrl: 'https://youtu.be/yhVgYI1Er_4',
        image: 'https://img.youtube.com/vi/yhVgYI1Er_4/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/what-is-Dream-yoga.pdf',
    },
    {
        id: '2',
        title: 'Relaxation and Dream Yoga',
        videoUrl: 'https://youtu.be/jSHXax5LDIE',
        image: 'https://img.youtube.com/vi/jSHXax5LDIE/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Relaxation-Exercises-for-Lucid-Dreaming-and-Meditation.pdf',
    },
    {
        id: '3',
        title: 'The Weirdness of WILDs | Wake-Induced Lucid Dreaming Class',
        videoUrl: 'https://youtu.be/jnLVh1PgGmw',
        image: 'https://img.youtube.com/vi/jnLVh1PgGmw/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/The-Weirdness-of-Wake-Induced-Lucid-Dreaming.pdf',
    },
    {
        id: '4',
        title: 'The Weirdness of WILDs Dream Yoga Step',
        videoUrl: 'https://youtu.be/xEe4OyFcoc4',
        image: 'https://img.youtube.com/vi/xEe4OyFcoc4/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/The-Weirdness-of-Wake-Induced-Lucid-Dreaming.pdf',
    },
    {
        id: '5',
        title: 'The Dream Lotus Technique Tibetan Dream Yoga',
        videoUrl: 'https://youtu.be/a0I9f8k-Yz4',
        image: 'https://img.youtube.com/vi/a0I9f8k-Yz4/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Dream-Lotus-and-Flame-Technique.pdf',
    },
    {
        id: '6',
        title: '5 Different Relaxation Exercises Dream Yoga step 3',
        videoUrl: 'https://youtu.be/JmYiKGjqIoo',
        image: 'https://img.youtube.com/vi/JmYiKGjqIoo/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Relaxation-Exercises-for-Lucid-Dreaming-and-Meditation.pdf',
    },
];

const mildLucidDreamingLessons = [
    {
        id: '7',
        title: 'What is Lucid dreaming and Dream Yoga',
        videoUrl: 'https://youtu.be/z33AMyp7sXc',
        image: 'https://img.youtube.com/vi/z33AMyp7sXc/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/introduction-to-lucid-dreaming.pdf',
    },
    {
        id: '8',
        title: 'Dream Signs',
        videoUrl: 'https://youtu.be/yhVgYI1Er_4',
        image: 'https://img.youtube.com/vi/yhVgYI1Er_4/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Dream-signs-1.pdf',
    },
    {
        id: '9',
        title: 'Dream Signs: Doorways to Lucidity',
        videoUrl: 'https://youtu.be/z_eTrZssaJQ',
        image: 'https://img.youtube.com/vi/z_eTrZssaJQ/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Dream-signs-1.pdf',
    },
    {
        id: '10',
        title: 'Lucid Dreaming Autosuggestion Technique',
        videoUrl: 'https://youtu.be/aoRKFasR7qY',
        image: 'https://img.youtube.com/vi/aoRKFasR7qY/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/The-Autosuggestion-Technique-1.pdf',
    },
    {
        id: '11',
        title: 'Lucid Dreaming Reflection Intention Technique',
        videoUrl: 'https://youtu.be/X1GyUQRhTLI',
        image: 'https://img.youtube.com/vi/X1GyUQRhTLI/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Reflection-Intention-Exercise.pdf',
    },
    {
        id: '12',
        title: 'Staying Lucid and Applications/Conclusion',
        videoUrl: 'https://youtu.be/Le9a9-oxTCQ',
        image: 'https://img.youtube.com/vi/Le9a9-oxTCQ/hqdefault.jpg',
        pdf: 'https://www.hidreamers.com/wp-content/uploads/2025/05/Staying-lucid-1.pdf',
    },
];

function getYoutubeId(url: string) {
    if (!url) return '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

export default function DreamYogaAndLucidDreamingScreen() {
    const router = useRouter();
    const { isPremium } = usePremium();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<any>(null);

    const handleLessonPress = (lesson, index, category) => {
        const isLocked = index > 0 && !isPremium;
        if (isLocked) {
            router.push('/upgrade');
            return;
        }
        setSelectedLesson(lesson);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedLesson(null);
    };

    const handleOpenPdf = (url: string) => {
        router.push({ pathname: '/pdf-viewer', params: { url } });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3a1c71' }} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient colors={['#3a1c71', '#b993d6', '#fff']} style={styles.gradient}>
                <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 36 }]}>
                    <Text style={styles.headerTitle}>Dream Yoga & Lucid Dreaming</Text>
                    <Text style={styles.headerSubtitle}>Master the art of conscious dreaming</Text>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.sectionTitle}>Dream Yoga Lessons</Text>
                    {dreamYogaLessons.map((lesson, index) => {
                        const locked = index > 0 && !isPremium;
                        return (
                            <TouchableOpacity
                                key={lesson.id}
                                style={locked ? [styles.lessonCard, { opacity: 0.4 }] : styles.lessonCard}
                                onPress={() => handleLessonPress(lesson, index, 'dreamYoga')}
                                disabled={locked}
                            >
                                <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
                                <View style={styles.lessonContent}>
                                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                    <TouchableOpacity style={styles.pdfButton} onPress={() => handleOpenPdf(lesson.pdf)} disabled={locked}>
                                        <Ionicons name="document-text-outline" size={16} color="#fff" />
                                        <Text style={styles.pdfButtonText}>Read PDF Lesson</Text>
                                    </TouchableOpacity>
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
                    <Text style={styles.sectionTitle}>MILD Lucid Dreaming</Text>
                    {mildLucidDreamingLessons.map((lesson, index) => {
                        const locked = index > 0 && !isPremium;
                        return (
                            <TouchableOpacity
                                key={lesson.id}
                                style={locked ? [styles.lessonCard, { opacity: 0.4 }] : styles.lessonCard}
                                onPress={() => handleLessonPress(lesson, index, 'mild')}
                                disabled={locked}
                            >
                                <Image source={{ uri: lesson.image }} style={styles.lessonImage} />
                                <View style={styles.lessonContent}>
                                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                    <TouchableOpacity style={styles.pdfButton} onPress={() => handleOpenPdf(lesson.pdf)} disabled={locked}>
                                        <Ionicons name="document-text-outline" size={16} color="#fff" />
                                        <Text style={styles.pdfButtonText}>Read PDF Lesson</Text>
                                    </TouchableOpacity>
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
                                Unlock All Lucid Dreaming Lessons
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
    gradient: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3a1c71',
        marginBottom: 16,
        marginTop: 24,
        marginLeft: 4,
    },
    lessonCard: {
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
    lessonImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        marginRight: 16,
        backgroundColor: '#eee',
    },
    lessonContent: {
        flex: 1,
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3a1c71',
        marginBottom: 4,
    },
    lessonDuration: {
        fontSize: 14,
        color: '#777',
        marginBottom: 8,
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d76d77',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 4,
    },
    lockText: {
        color: '#fff',
        marginLeft: 4,
        fontWeight: 'bold',
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
});
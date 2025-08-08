import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function PDFViewer({ visible, onClose, pdfUrl }: { visible?: boolean, onClose?: () => void, pdfUrl?: string }) {
  // If used as a screen, get url from params
  const router = useRouter();
  const params = useLocalSearchParams();
  const rawUrl = pdfUrl || (typeof params.url === 'string' ? params.url : '');
  const url = rawUrl ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(rawUrl)}` : '';

  // Always show a back button in the header for navigation
  const handleBack = onClose || router.back;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    height: 60,
    backgroundColor: '#3a1c71',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#3a1c71',
    marginLeft: 4,
  },
  webview: { flex: 1 },
});

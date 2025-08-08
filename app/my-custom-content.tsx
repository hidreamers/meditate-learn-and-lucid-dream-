import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function getYoutubeId(url: string) {
  if (!url) return '';
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

export default function MyCustomContent() {
  const [activeTab, setActiveTab] = useState('meditation');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await AsyncStorage.getItem('@custom_items');
      if (data) setItems(JSON.parse(data));
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const saveItems = async (newItems) => {
    try {
      await AsyncStorage.setItem('@custom_items', JSON.stringify(newItems));
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const handleAdd = () => {
    if (!title || !url) {
      Alert.alert('Error', 'Title and URL are required');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      title,
      url,
      description,
      type: activeTab
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    saveItems(newItems);

    setTitle('');
    setUrl('');
    setDescription('');
  };

  const handleDelete = (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    saveItems(newItems);
  };

  const handleOpenInApp = (item) => {
    // If it's a YouTube link and meditation, open as video modal page
    if (item.type === 'meditation') {
      const videoId = getYoutubeId(item.url);
      if (videoId) {
        router.push({
          pathname: '/video-player',
          params: { videoId, title: item.title }
        });
        return;
      }
    }
    // Otherwise, open as PDF/book in-app
    router.push({ pathname: '/pdf-viewer', params: { url: item.url } });
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient colors={['#3a1c71', '#b993d6', '#fff']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>My Custom Content</Text>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'meditation' && styles.activeTab]}
              onPress={() => setActiveTab('meditation')}
            >
              <Text style={[styles.tabText, activeTab === 'meditation' && styles.activeTabText]}>
                Meditations
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'book' && styles.activeTab]}
              onPress={() => setActiveTab('book')}
            >
              <Text style={[styles.tabText, activeTab === 'book' && styles.activeTabText]}>
                Books
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formCard}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
            />
            <Text style={styles.label}>URL</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com"
              keyboardType="url"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>Add {activeTab}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>
            My {activeTab === 'meditation' ? 'Meditations' : 'Books'}
          </Text>
          {filteredItems.length === 0 ? (
            <Text style={styles.emptyText}>No items added yet</Text>
          ) : (
            filteredItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.description ? (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  ) : null}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => handleOpenInApp(item)} style={styles.actionButton}>
                    <Ionicons name="open-outline" size={22} color="#3a1c71" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={22} color="#d76d77" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    flex: 1
  },
  content: {
    padding: 20,
    paddingBottom: 100
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 20
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: '#fff',
    borderRadius: 10
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  activeTabText: {
    color: '#3a1c71'
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  addButton: {
    backgroundColor: '#3a1c71',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 12
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a1c71'
  },
  itemDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 4
  },
  itemActions: {
    flexDirection: 'row'
  },
  actionButton: {
    padding: 6,
    marginLeft: 10
  }
});

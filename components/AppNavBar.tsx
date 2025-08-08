import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const dropdownItems = {
  home: [
    { label: 'Home', route: '/(tabs)' },
    { label: 'Instructions', route: '/instructions' },
    { label: 'About', route: '/about' },
  ],
  books: [
    { label: 'Books By Jerimiah', route: '/books' },
    { label: 'My Custom Content', route: '/my-custom-content' },
  ],
  reality: [
    { label: 'Test my Reality', route: '/(tabs)/reality-checks' },
    { label: 'Start my MILD Practice', route: '/mild-practice' },
  ],
  meditate: [
    { label: 'Meditations', route: '/(tabs)/meditation' },
    { label: 'Custom Binaural Beats', route: '/binaural-beats' },
    { label: 'Lucid Dreaming & Dream Yoga', route: '/dream-yoga-and-lucid-dreaming-lessons' },
    { label: 'Dream Yoga', route: '/dream-yoga-and-lucid-dreaming-lessons' },
    { label: 'Didgeridoo Lessons', route: '/didgeridoo-lessons' },
    { label: 'Guided Meditations', route: '/guided-meditations' },
    { label: 'My Custom Content', route: '/my-custom-content' },
  ],
};

export default function AppNavBar() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdown = (tab: string) => {
    setOpenDropdown(openDropdown === tab ? null : tab);
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#3a1c71' }}>
      <View style={styles.tabBar}>
        {/* Home Tab with Dropdown */}
        <View style={styles.tabWithDropdown}>
          <TouchableOpacity style={styles.tabItem} onPress={() => handleDropdown('home')}>
            <Ionicons name="home-outline" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Home</Text>
            <Ionicons name={openDropdown === 'home' ? 'chevron-up' : 'chevron-down'} size={16} color="#fff" />
          </TouchableOpacity>
          {openDropdown === 'home' && (
            <View style={[styles.dropdownMenu, { left: 0, right: 'auto' }]}> 
              {dropdownItems.home.map(item => (
                <TouchableOpacity key={item.label} style={styles.dropdownItem} onPress={() => { router.push(item.route); setOpenDropdown(null); }}>
                  <Text style={styles.dropdownText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Books Tab with Dropdown */}
        <View style={styles.tabWithDropdown}>
          <TouchableOpacity style={styles.tabItem} onPress={() => handleDropdown('books')}>
            <Ionicons name="library-outline" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Books</Text>
            <Ionicons name={openDropdown === 'books' ? 'chevron-up' : 'chevron-down'} size={16} color="#fff" />
          </TouchableOpacity>
          {openDropdown === 'books' && (
            <View style={styles.dropdownMenu}>
              {dropdownItems.books.map(item => (
                <TouchableOpacity key={item.label} style={styles.dropdownItem} onPress={() => { router.push(item.route); setOpenDropdown(null); }}>
                  <Text style={styles.dropdownText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Reality Tab with Dropdown */}
        <View style={styles.tabWithDropdown}>
          <TouchableOpacity style={styles.tabItem} onPress={() => handleDropdown('reality')}>
            <Ionicons name="eye-outline" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Reality</Text>
            <Ionicons name={openDropdown === 'reality' ? 'chevron-up' : 'chevron-down'} size={16} color="#fff" />
          </TouchableOpacity>
          {openDropdown === 'reality' && (
            <View style={styles.dropdownMenu}>
              {dropdownItems.reality.map(item => (
                <TouchableOpacity key={item.label} style={styles.dropdownItem} onPress={() => { router.push(item.route); setOpenDropdown(null); }}>
                  <Text style={styles.dropdownText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {/* Meditate Tab with Dropdown */}
        <View style={styles.tabWithDropdown}>
          <TouchableOpacity style={styles.tabItem} onPress={() => handleDropdown('meditate')}>
            <Ionicons name="musical-notes-outline" size={24} color="#fff" />
            <Text style={styles.tabLabel}>Meditate</Text>
            <Ionicons name={openDropdown === 'meditate' ? 'chevron-up' : 'chevron-down'} size={16} color="#fff" />
          </TouchableOpacity>
          {openDropdown === 'meditate' && (
            <View style={[styles.dropdownMenu, { left: 'auto', right: 0 }]}> 
              {dropdownItems.meditate.map(item => (
                <TouchableOpacity key={item.label} style={styles.dropdownItem} onPress={() => { router.push(item.route); setOpenDropdown(null); }}>
                  <Text style={styles.dropdownText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      {/* My Dream Journal button below the tab bar */}
          <View style={{ backgroundColor: '#3a1c71', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#eee' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3a1c71', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20 }}
          onPress={() => router.push('/dream-journal')}
        >
          <Ionicons name="book" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>My Dream Journal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#3a1c71',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 0,
  },
  tabWithDropdown: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tabLabel: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: 60, // Position above the tab bar
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    zIndex: 100,
    minWidth: 180, // Increased for longer labels
    maxWidth: 260, // Allow more space for long text
    maxHeight: 320, // Increased height for longer lists
    overflow: 'scroll', // Allow scrolling if dropdown is too tall
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: '100%',
  },
  dropdownText: {
    color: '#3a1c71',
    fontSize: 14,
    flexWrap: 'wrap', // Allow text to wrap
    textAlign: 'left',
    width: '100%',
  },
});

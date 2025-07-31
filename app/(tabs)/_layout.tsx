import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#3a1c71',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: any = 'ellipse-outline';
          if (route.name === 'index') iconName = 'home-outline';
          else if (route.name === 'meditation') iconName = 'musical-notes-outline';
          else if (route.name === 'reality-checks') iconName = 'eye-outline';
          else if (route.name === 'about') iconName = 'person-circle-outline';
          else if (route.name === 'books') iconName = 'book-outline';
          else if (route.name === 'dream-journal') iconName = 'book-outline'; // changed from 'journal-outline'
         
          else if (route.name === 'binaural-beats') iconName = 'musical-note-outline';
          // Add more as needed
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}

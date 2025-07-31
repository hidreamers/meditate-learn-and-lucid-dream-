import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const dreamEntries = [
  "I was flying over a city and saw a giant clock.",
  "I was late for school and couldn't find my shoes.",
  "I saw a clock melting on the wall.",
  "I was flying again, this time with my dog.",
  "I couldn't find my classroom and felt lost.",
];

const STOP_WORDS = [
  "the", "and", "a", "to", "of", "in", "was", "for", "on", "with", "my", "i", "it", "at", "is", "again", "this", "time", "couldn't", "find", "felt", "lost", "over", "saw", "giant", "clock", "school", "shoes", "classroom", "dog", "wall", "melting", "city", "dream", "dreaming", "dreamt"
];

function extractDreamSigns(entries: string[]): string[] {
  const wordDreams: { [key: string]: Set<number> } = {};
  entries.forEach((entry, dreamIdx) => {
    const words = entry
      .replace(/[^\w\s]/g, '')
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word && !STOP_WORDS.includes(word));
    const uniqueWords = new Set(words);
    uniqueWords.forEach(word => {
      if (!wordDreams[word]) wordDreams[word] = new Set();
      wordDreams[word].add(dreamIdx);
    });
  });
  return Object.entries(wordDreams)
    .filter(([word, dreamSet]) => dreamSet.size >= 2)
    .map(([word]) => word);
}

export default function InstructionsScreen() {
  const [dreamSigns, setDreamSigns] = useState([]);

  const handleAnalyzeDreams = () => {
    const signs = extractDreamSigns(dreamEntries);
    setDreamSigns(signs);
  };

  return (
    <LinearGradient
      colors={['#3a1c71', '#b993d6', '#fff']}
      style={styles.gradientBackground}
    >
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instructions</Text>
        <Text style={styles.headerSubtitle}>Welcome to the Lucid Dreaming App!</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page content goes here */}
        <View style={styles.pageContent}>
          <Text style={styles.sectionTitle}>Welcome!</Text>
          <Text style={styles.text}>
            This app helps you build habits for lucid dreaming. If you’re new to technology, don’t worry—just follow these simple steps!
          </Text>

          <Text style={styles.sectionTitle}>1. Home Screen Overview</Text>
          <Text style={styles.text}>
            When you open the app, you’ll see several cards: Night Dream Practice, Day Practice, Meditation, and Dream Journal. Each card has a switch (toggle) you can turn ON or OFF.
          </Text>
          <Text style={styles.text}>
            - Turning ON a switch means you’ll get a reminder every two hours for that activity.
            {"\n"}- For example, if you turn on Night Dream Practice, you’ll get a reminder every two hours to do your night practice.
          </Text>

          <Text style={styles.sectionTitle}>2. How Reminders Work</Text>
          <Text style={styles.text}>
            - Reminders are automatic and repeat every two hours as long as the switch is ON.
            {"\n"}- When a reminder appears, your phone will show a message telling you what to do.
            {"\n"}- You don’t need to set anything else—just turn the switch ON or OFF as you like.
          </Text>

          <Text style={styles.sectionTitle}>3. What Each Card Means</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Night Dream Practice:</Text> Reminds you to do a night-time lucid dreaming exercise.
            {"\n"}<Text style={styles.bold}>Day Practice:</Text> Reminds you to check if you’re dreaming during the day.
            {"\n"}<Text style={styles.bold}>Meditation:</Text> Reminds you to take a moment to meditate and relax.
            {"\n"}<Text style={styles.bold}>Dream Journal:</Text> Reminds you to write down your dreams or thoughts.
          </Text>

          <Text style={styles.sectionTitle}>4. Using the Navigation Dropdown</Text>
          <Text style={styles.text}>
            At the top of the home screen, there’s a button that says “Show Tab Navigation.” Tap it to see more sections of the app, like Reality Checks, Meditations, Books, Instructions, and Dream Journal. Tap any button to go to that section.
          </Text>

          <Text style={styles.sectionTitle}>5. The Screensaver Feature</Text>
          <Text style={styles.text}>
            There’s a button labeled “Activate Screensaver.” When you tap it:
            {"\n"}- The app will show calming visuals and animations.
            {"\n"}- While the screensaver is active, your device’s screen will stay ON and will NOT automatically turn off or lock.
            {"\n"}- This is helpful if you want to keep the screen on while relaxing, meditating, or preparing for sleep.
            {"\n"}- To exit the screensaver, just tap the screen or use the exit button.
          </Text>

          <Text style={styles.sectionTitle}>6. Dream Journal</Text>
          <Text style={styles.text}>
            In the Dream Journal section, you can write down your dreams or anything you remember from your sleep. This helps you remember your dreams better and track your progress.
          </Text>

          <Text style={styles.sectionTitle}>7. Tips for Beginners</Text>
          <Text style={styles.text}>
            - You don’t need to change any settings—just use the switches to turn reminders on or off.
            {"\n"}- If you get stuck, try tapping around the app—nothing will break!
            {"\n"}- If you want to stop reminders, just turn the switch OFF.
            {"\n"}- You can always come back to these instructions from the navigation dropdown.
          </Text>

          <Text style={styles.sectionTitle}>8. How Dream Sign Analysis Works</Text>
          <Text style={styles.text}>
            When you write in your Dream Journal, the app looks for patterns and keywords in your entries. These patterns are called “dream signs”—things that often appear in your dreams, like certain people, places, feelings, or events. Over time, the app helps you notice what shows up most often in your dreams. This makes it easier to recognize when you’re dreaming, which can help you become lucid (aware that you’re dreaming) while you sleep.
          </Text>

          <Text style={styles.sectionTitle}>9. How Binaural Beats Work</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>What are Binaural Beats?</Text>
            {"\n"}Binaural beats are a special type of audio that can help relax your mind and enhance meditation. When you wear headphones and play slightly different frequencies in each ear (for example, 440 Hz in your left ear and 444 Hz in your right ear), your brain automatically creates a "beat" at the difference between these frequencies (4 Hz in this example).
          </Text>
          
          <Text style={styles.text}>
            <Text style={styles.bold}>How to Use the Binaural Beats Page:</Text>
            {"\n"}1. <Text style={styles.bold}>Choose Audio for Each Ear:</Text> You'll see two sections—"Left Ear" and "Right Ear." You can select different audio loops for each ear independently.
            
            {"\n"}2. <Text style={styles.bold}>Multi-Select Feature:</Text> Unlike regular music players, you can select multiple audio files for each ear at the same time. This lets you layer different sounds and frequencies to create your perfect meditation soundscape.
            
            {"\n"}3. <Text style={styles.bold}>Available Audio Types:</Text>
            {"\n"}   • <Text style={styles.italic}>Frequency Tones:</Text> Pure tones like Alpha waves (8-13 Hz) for relaxation, Beta waves (13-30 Hz) for focus, Theta waves (4-8 Hz) for deep meditation, and Delta waves (0.5-4 Hz) for deep sleep.
            {"\n"}   • <Text style={styles.italic}>Ambient Sounds:</Text> Ocean waves, thunderstorms, and nature sounds that can be mixed with frequencies.
            {"\n"}   • <Text style={styles.italic}>Chakra Tones:</Text> Specific frequencies associated with energy centers in the body.
            {"\n"}   • <Text style={styles.italic}>Meditation Bowls:</Text> Harmonic bowl sounds that create soothing resonances.
          </Text>
          
          <Text style={styles.text}>
            <Text style={styles.bold}>Step-by-Step Instructions:</Text>
            {"\n"}1. Put on good-quality headphones (this is essential for binaural beats to work properly).
            {"\n"}2. Go to the Binaural Beats tab from the navigation menu.
            {"\n"}3. In the "Left Ear" section, tap on one or more audio loops you want to hear in your left ear.
            {"\n"}4. In the "Right Ear" section, tap on one or more audio loops you want to hear in your right ear.
            {"\n"}5. Tap the "Play" button to start your personalized binaural beats session.
            {"\n"}6. Adjust the volume to a comfortable level—it should be audible but not overwhelming.
            {"\n"}7. Close your eyes, relax, and let the beats guide your meditation or relaxation.
          </Text>
          
          <Text style={styles.text}>
            <Text style={styles.bold}>Tips for Best Results:</Text>
            {"\n"}• Use good headphones or earbuds—speakers won't create the binaural effect.
            {"\n"}• Start with sessions of 10-20 minutes and gradually increase as you get used to the experience.
            {"\n"}• Try different combinations: pair a low-frequency tone in one ear with ocean sounds in the other.
            {"\n"}• Use Alpha frequencies (8-13 Hz) for general relaxation and stress relief.
            {"\n"}• Use Theta frequencies (4-8 Hz) for deep meditation and visualization.
            {"\n"}• Use Delta frequencies (0.5-4 Hz) before sleep to promote deeper rest.
            {"\n"}• Experiment with layering: select multiple gentle sounds for a richer experience.
          </Text>
          
          <Text style={styles.text}>
            <Text style={styles.bold}>Safety Notes:</Text>
            {"\n"}• Keep volume at moderate levels to protect your hearing.
            {"\n"}• If you experience any discomfort, headaches, or dizziness, stop the session and lower the volume.
            {"\n"}• Don't use binaural beats while driving or operating machinery.
            {"\n"}• People with epilepsy should consult a doctor before using binaural beats.
          </Text>

          <Text style={styles.sectionTitle}>Need More Help?</Text>
          <Text style={styles.text}>
            If you’re confused or something isn’t working, try closing and reopening the app. If you still need help, ask a friend or family member to help you read these instructions.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const HEADER_HEIGHT = 90; // Adjust if your header is taller/shorter

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop: 36,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
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
    paddingTop: HEADER_HEIGHT, // So content starts below the header
    paddingBottom: 24,
  },
  pageContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
    color: '#3a1c71',
  },
  italic: {
    fontStyle: 'italic',
    color: '#d76d77',
  },
  footer: {
    fontSize: 16,
    color: '#3a1c71',
    marginTop: 32,
    alignSelf: 'center',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 30,
  },
});
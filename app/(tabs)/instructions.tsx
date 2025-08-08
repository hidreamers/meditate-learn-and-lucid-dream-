import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import AppNavBar from '../../components/AppNavBar';

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

export default function Instructions() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent backgroundColor="transparent" />

      <LinearGradient colors={['#3a1c71', '#b993d6', '#fff']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerBox}>
            <Text style={styles.headerTitle}>App Instructions</Text>
            <Text style={styles.headerSubtitle}>Getting the most out of your lucid dreaming, meditation, and custom content features</Text>
          </View>

          <View style={styles.pageContent}>
            {/* FULL INSTRUCTIONAL CONTENT STARTS HERE */}

            <Text style={styles.sectionTitle}>Welcome!</Text>
            <Text style={styles.text}>This app helps you build habits for lucid dreaming, meditation, and personal growth. If you're new to technology, don't worry—just follow these simple steps!</Text>

            <Text style={styles.sectionTitle}>1. Home Screen Overview</Text>
            <Text style={styles.text}>When you open the app, you'll see several cards: Night Dream Practice, Day Practice, Meditation, and Dream Journal. Each card has a switch (toggle) you can turn ON or OFF.</Text>
            <Text style={styles.text}>- Turning ON a switch means you'll get a reminder every two hours for that activity.\n- For example, if you turn on Night Dream Practice, you'll get a reminder every two hours to do your night practice.</Text>

            <Text style={styles.sectionTitle}>2. How Reminders Work</Text>
            <Text style={styles.text}>- Reminders are automatic and repeat every two hours as long as the switch is ON.\n- When a reminder appears, your phone will show a message telling you what to do.\n- You don't need to set anything else—just turn the switch ON or OFF as you like.</Text>

            <Text style={styles.sectionTitle}>3. What Each Card Means</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Night Dream Practice:</Text> Reminds you to do a night-time lucid dreaming exercise.{"\n"}
              <Text style={styles.bold}>Day Practice:</Text> Reminds you to check if you're dreaming during the day.{"\n"}
              <Text style={styles.bold}>Meditation:</Text> Reminds you to take a moment to meditate and relax.{"\n"}
              <Text style={styles.bold}>Dream Journal:</Text> Reminds you to write down your dreams or thoughts.
            </Text>

            <Text style={styles.sectionTitle}>4. My Custom Content</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>What is My Custom Content?</Text>{"\n"}
              Save and organize your favorite meditation resources, YouTube links, and books. Create your own personal library of practices and learning materials.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>How to Access:</Text>{"\n"}
              Go to the Meditate or Books tab and tap My Custom Content. You can also find it in the navigation dropdown.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>How to Add Content:</Text>{"\n"}
              Enter a title, URL (starting with http:// or https://), and an optional description, then tap Add. Your content will be saved for easy access.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Using Saved Content:</Text>{"\n"}
              Tap Open to launch the content, or Delete to remove it. You can organize meditations and books in separate tabs.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Special Features:</Text>{"\n"}
              YouTube integration, in-app browser, and easy organization for your resources.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Tips:</Text>{"\n"}
              Save useful links, organize your practices, and build a personal library for quick access.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Troubleshooting:</Text>{"\n"}
              Check that links begin with http:// or https://. Make sure you're connected to the internet.
            </Text>

            <Text style={styles.sectionTitle}>5. The Screensaver Feature</Text>
            <Text style={styles.text}>
              {`There's a button labeled "Activate Screensaver." When you tap it:
- The app will show calming visuals and animations.
- While the screensaver is active, your device's screen will stay ON and will NOT automatically turn off or lock.
- This is helpful if you want to keep the screen on while relaxing, meditating, or preparing for sleep.
- To exit the screensaver, just tap the screen or use the exit button.`}
            </Text>

            <Text style={styles.sectionTitle}>6. Dream Journal</Text>
            <Text style={styles.text}>In the Dream Journal section, you can write down your dreams or anything you remember from your sleep. This helps you remember your dreams better and track your progress. You can also analyze your dream signs for recurring patterns.</Text>

            <Text style={styles.sectionTitle}>7. Tips for Beginners</Text>
            <Text style={styles.text}>
              {`- You don't need to change any settings—just use the switches to turn reminders on or off.
- If you get stuck, try tapping around the app—nothing will break!
- If you want to stop reminders, just turn the switch OFF.
- You can always come back to these instructions from the navigation dropdown.`}
            </Text>

            <Text style={styles.sectionTitle}>8. How Dream Sign Analysis Works</Text>
            <Text style={styles.text}>When you write in your Dream Journal, the app looks for patterns and keywords in your entries. These patterns are called "dream signs"—things that often appear in your dreams, like certain people, places, feelings, or events. Over time, the app helps you notice what shows up most often in your dreams. This makes it easier to recognize when you're dreaming, which can help you become lucid (aware that you're dreaming) while you sleep.</Text>

            <Text style={styles.sectionTitle}>9. How Binaural Beats Work</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>What are Binaural Beats?</Text>{"\n"}
              Binaural beats are a special type of audio that can help relax your mind and enhance meditation. When you wear headphones and play slightly different frequencies in each ear (for example, 440 Hz in your left ear and 444 Hz in your right ear), your brain automatically creates a "beat" at the difference between these frequencies (4 Hz in this example).
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>How to Use the Binaural Beats Page:</Text>{"\n"}
              1. Choose Audio for Each Ear: You'll see two sections—Left Ear and Right Ear. You can select different audio loops for each ear independently.{"\n"}
              2. Multi-Select Feature: You can select multiple audio files for each ear at the same time.{"\n"}
              3. Available Audio Types: Frequency Tones (Alpha, Beta, Theta, Delta), Ambient Sounds, Chakra Tones, Meditation Bowls.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Step-by-Step Instructions:</Text>{"\n"}
              1. Use good headphones.{"\n"}
              2. Open the Binaural Beats page.{"\n"}
              3. Select sounds for Left and Right ear.{"\n"}
              4. Tap Play.{"\n"}
              5. Adjust volume and relax.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Tips for Best Results:</Text>{"\n"}
              Use Alpha for relaxation, Theta for meditation, Delta before sleep. Try layering ambient sounds with frequencies.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Safety Notes:</Text>{"\n"}
              Keep volume moderate. Stop if you feel discomfort. Don't use while driving. Epileptic users should consult a doctor first.
            </Text>

            <Text style={styles.sectionTitle}>Need More Help?</Text>
            <Text style={styles.text}>If you're confused or something isn't working, try closing and reopening the app. You can always revisit this page anytime.</Text>

            {/* FULL INSTRUCTIONAL CONTENT ENDS HERE */}
          </View>
        </ScrollView>
      </LinearGradient>

      <View style={styles.navContainer}>
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerBox: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 6, textAlign: 'center' },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 8 },
  pageContent: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#3a1c71', marginBottom: 12 },
  text: { fontSize: 15, lineHeight: 22, color: '#333', marginBottom: 12 },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  navContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 9999 },
});
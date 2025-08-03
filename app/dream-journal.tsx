import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DreamJournalScreen() {
  const [upgraded, setUpgraded] = useState(false);

  // ...existing state and functions...

  return (
    <View style={styles.container}>
      {/* ...existing dream journal UI... */}

      {/* Analyze Dream Button (locked if not upgraded) */}
      <TouchableOpacity
        style={[
          styles.analyzeButton,
          !upgraded && styles.lockedButton,
        ]}
        onPress={() => {
          if (!upgraded) {
            Alert.alert('Upgrade Required', 'Upgrade to unlock dream analysis.');
            return;
          }
          // ...existing analyze logic...
        }}
        disabled={!upgraded}
      >
        <Ionicons name="analytics" size={22} color={upgraded ? "#fff" : "#aaa"} style={{ marginRight: 8 }} />
        <Text style={[
          styles.analyzeButtonText,
          !upgraded && styles.lockedButtonText,
        ]}>
          Analyze My Dreams
        </Text>
        {!upgraded && (
          <Ionicons name="lock-closed" size={18} color="#fff" style={{ marginLeft: 8 }} />
        )}
      </TouchableOpacity>

      {/* Optionally, add an upgrade button somewhere */}
      {!upgraded && (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => {
            // Replace with your upgrade logic
            Alert.alert('Upgrade', 'Upgrade flow goes here.');
            // setUpgraded(true); // Uncomment to simulate upgrade
          }}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Unlock Analysis</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a1c71',
    padding: 14,
    borderRadius: 8,
    marginTop: 18,
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lockedButton: {
    backgroundColor: '#aaa',
  },
  lockedButtonText: {
    color: '#eee',
  },
  upgradeButton: {
    marginTop: 18,
    backgroundColor: '#b06ab3',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignSelf: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // ...existing styles...
});
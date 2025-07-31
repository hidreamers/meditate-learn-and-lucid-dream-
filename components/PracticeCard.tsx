import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PracticeCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  description: string;
  showSound?: boolean;
  reminderValue: boolean;
  onReminderChange: (value: boolean) => void;
  soundValue?: boolean;
  onSoundChange?: (value: boolean) => void;
  countdown?: string;
};

export default function PracticeCard({
  icon,
  iconColor,
  title,
  description,
  showSound = false,
  reminderValue,
  onReminderChange,
  soundValue = false,
  onSoundChange,
  countdown
}: PracticeCardProps) {
  return (
    <View style={styles.nicerCard}>
      <Ionicons name={icon} size={48} color={iconColor} style={{ marginBottom: 12 }} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Reminder:</Text>
        <Switch
          value={reminderValue}
          onValueChange={onReminderChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={reminderValue ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      {showSound && (
        <View style={styles.row}>
          <Text style={styles.label}>Sound:</Text>
          <Switch
            value={soundValue}
            onValueChange={onSoundChange}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={soundValue ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      )}
      
      {countdown && (
        <Text style={styles.countdown}>Next in: {countdown}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nicerCard: {
    width: 250,
    height: 350,
    borderRadius: 24,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3a1c71',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#3a1c71',
    fontWeight: 'bold',
    marginRight: 10,
  },
  countdown: {
    color: '#d76d77',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
});

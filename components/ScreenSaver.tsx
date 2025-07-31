import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const TWINKLE_STAR_COUNT = 80;

const FLOATING_WORDS = [
  'IS THIS A DREAM',
  'AM I DREAMING',
  'AM I AWAKE',
  'I WILL REMEMBER MY DREAMS',
  'THE NEXT TIME IM DREAMING I WILL WAKE UP IN MY DREAM',
];

function getRandomTwinkleStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1.2 + Math.random() * 1.8,
    opacity: 0.8 + Math.random() * 0.2,
  };
}

function getRandomWordState(word: string) {
  return {
    word,
    x: Math.random() * (width - 180),
    y: Math.random() * (height - 40),
    dx: (Math.random() - 0.5) * 1.2,
    dy: (Math.random() - 0.5) * 1.2,
    w: 180,
    h: 40,
  };
}

// Helper to check if two words overlap (bounding box collision)
function isColliding(a: any, b: any) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export default function ScreenSaver({ onExit }: { onExit?: () => void }) {
  const [twinkleStars, setTwinkleStars] = useState(() =>
    Array.from({ length: TWINKLE_STAR_COUNT }, getRandomTwinkleStar)
  );
  const [floatingWords, setFloatingWords] = useState(() =>
    FLOATING_WORDS.map(getRandomWordState)
  );

  // Animate floating words and twinkle stars
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingWords(prev => {
        // Move all words
        let next = prev.map(w => {
          let nx = w.x + w.dx;
          let ny = w.y + w.dy;
          let ndx = w.dx;
          let ndy = w.dy;
          if (nx < 0 || nx > width - w.w) ndx *= -1;
          if (ny < 0 || ny > height - w.h) ndy *= -1;
          return { ...w, x: nx, y: ny, dx: ndx, dy: ndy };
        });

        // Improved collision: push apart by minimum overlap
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            if (isColliding(next[i], next[j])) {
              // Calculate overlap in x and y
              const dx = (next[i].x + next[i].w / 2) - (next[j].x + next[j].w / 2);
              const dy = (next[i].y + next[i].h / 2) - (next[j].y + next[j].h / 2);
              const overlapX = next[i].w / 2 + next[j].w / 2 - Math.abs(dx);
              const overlapY = next[i].h / 2 + next[j].h / 2 - Math.abs(dy);

              // Push apart along the axis of least overlap
              if (overlapX < overlapY) {
                const push = overlapX / 2 + 1;
                next[i].x += dx > 0 ? push : -push;
                next[j].x -= dx > 0 ? push : -push;
                next[i].dx *= -1;
                next[j].dx *= -1;
              } else {
                const push = overlapY / 2 + 1;
                next[i].y += dy > 0 ? push : -push;
                next[j].y -= dy > 0 ? push : -push;
                next[i].dy *= -1;
                next[j].dy *= -1;
              }
            }
          }
        }
        return next;
      });

      setTwinkleStars(prev =>
        prev.map(s => ({
          ...s,
          opacity: 0.8 + Math.random() * 0.2,
        }))
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Exit Button */}
      <TouchableOpacity style={styles.exitButton} onPress={onExit}>
        <Ionicons name="close-circle" size={32} color="#b0b8ff" />
      </TouchableOpacity>
      {/* Stretched constellation image as background */}
      <Image
        source={require('../assets/images/taurus.png')}
        style={styles.constellationImage}
        resizeMode="stretch"
      />
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        {/* Brighter, twinkling background stars */}
        {twinkleStars.map((s, i) => (
          <Circle
            key={'twinkle-star' + i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#fff"
            opacity={s.opacity}
          />
        ))}
      </Svg>
      {floatingWords.map((w, i) => (
        <View
          key={i}
          style={[
            styles.textContainer,
            { left: w.x, top: w.y, position: 'absolute', maxWidth: 180 }
          ]}
        >
          <Text style={styles.text}>{w.word}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#05051a',
    zIndex: 999,
  },
  exitButton: {
    position: 'absolute',
    top: 36,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(20,20,40,0.7)',
    borderRadius: 20,
    padding: 2,
  },
  constellationImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.18,
    zIndex: 0,
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(20,20,40,0.7)',
    borderWidth: 1,
    borderColor: '#181828',
    alignItems: 'center',
    maxWidth: 180,
  },
  text: {
    color: '#b0b8ff',
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: '#181828',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
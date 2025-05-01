// screens/SwipingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';

export default function SwipingScreen() {
  const [cards, setCards]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dummy data loader
  useEffect(() => {
    setTimeout(() => {
      setCards([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
        { id: '3', name: 'Carol' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on ${cards[currentIndex].name}`);
    setCurrentIndex((i) => i + 1);
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  if (currentIndex >= cards.length) {
    return (
      <View style={styles.center}>
        <Text>No more profiles</Text>
      </View>
    );
  }

  const card = cards[currentIndex];
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{card.name}</Text>
      <View style={styles.buttons}>
        <Button title="❌ Nope" onPress={() => handleSwipe('left')} />
        <Button title="✅ Like" onPress={() => handleSwipe('right')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  name:      { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  buttons:   { flexDirection: 'row', width: '80%', justifyContent: 'space-around' },
});
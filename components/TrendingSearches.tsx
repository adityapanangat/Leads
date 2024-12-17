import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TrendingSearches = () => {
  const trendingSearches = [
    'Breaking News',
    'COVID-19 Updates',
    'Technology Trends',
    'Stock Market',
    'Climate Change',
  ];

  return (
    <View style={styles.trendingContainer}>
      <Text style={styles.trendingTitle}>Trending Searches:</Text>
      {trendingSearches.map((search, index) => (
        <TouchableOpacity key={index} style={styles.trendingItem}>
          <Text style={styles.trendingText}>{search}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  trendingContainer: {
    width: '95%', // Set width to 100% to fill the screen
    padding:'5%',
    top:'-20%',
    backgroundColor: '#3A3A3A',
    borderRadius: 5,
    marginTop: 10, // Add margin to separate from search bar
  },
  trendingTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  trendingItem: {
    paddingVertical: 5,
  },
  trendingText: {
    color: '#fff', // Text color for trending searches
    fontSize: 14,
  },
});

export default TrendingSearches;

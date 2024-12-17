import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

function SearchBar() {
  const [query, setQuery] = useState(''); // State to store the search query

  const handleInputChange = (text: string) => {
    setQuery(text); // Update the query state as the user types
  };

  const handleSearchPress = () => {
    // Handle the search action here
    console.log('Search pressed:', query);
    // You can also clear the input after search
    setQuery('');
  };

  const handleClearPress = () => {
    setQuery(''); // Clear the query when the "X" button is pressed
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter news headline or topic..."
        placeholderTextColor="#bdbdbd"
        value={query}
        onChangeText={handleInputChange}
        autoCorrect={true} // Enable auto-correction
        autoCapitalize="none" // No auto-capitalization
        keyboardType="default" // Default keyboard for typing
        returnKeyType='search'
        onSubmitEditing={handleSearchPress}
      />
      {/* Clear Button */}
      {query.length > 0 && ( // Show the clear button only if there's text
        <TouchableOpacity style={styles.clearButton} onPress={handleClearPress}>
          <Text style={styles.clearButtonText}>X</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#282727',
    flexDirection: 'row', // Use row to align input and buttons
    justifyContent: 'space-between', // Space between input and buttons
    alignItems: 'center', // Center items vertically
    position: 'absolute', // Position the search bar at the top
    top: '10%', // Top of the screen
    zIndex: 1, // Ensure the search bar is above other elements
  },
  searchInput: {
    flex: 1, // Take up available space
    height: '90%',
    padding: 10,
    backgroundColor: '#fff', // White background for input field
    borderRadius: 5,
    fontFamily: 'Tahoma',
    fontSize: 16,
    color: '#000', // Black text color
    marginRight: 10, // Space between input and button
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15, // Make it circular
    backgroundColor: '#3A3A3A', // Background color
    justifyContent: 'center', // Center the text
    alignItems: 'center', // Center the text
    marginRight: 10, // Space before the search button
  },
  clearButtonText: {
    color: '#fff', // Button text color
    fontSize: 16,
  },
  searchButton: {
    paddingVertical: 10,
    height: '100%',
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#3A3A3A', // Button background color
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontSize: 16,
  },
});

export default SearchBar;

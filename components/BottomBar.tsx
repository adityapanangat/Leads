import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

interface BottomBarProps {
  onHomeSelect: () => void;
  onSearchSelect: () => void;
}

function BottomBar({ onHomeSelect, onSearchSelect }: BottomBarProps) {
  return (
    <View style={styles.bottomBar}>
      {/* Home Button */}
      <TouchableOpacity style={styles.option} onPress={onHomeSelect}>
        <Icon name="home" size={RFValue(24, 680)} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={onSearchSelect}>
        <Icon name="search" size={RFValue(24, 680)} color="white" />
      </TouchableOpacity> 
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '10%',
    backgroundColor: '#3A3A3A',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: RFValue(1, 680), // Responsive border width
    borderColor: 'white',
  },
  option: {
    flex: 1, // each option will take up equal space
    alignItems: 'center',
    padding: RFPercentage(2), // Responsive padding
  },
});

export default BottomBar;

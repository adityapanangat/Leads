import { StyleSheet, View, TouchableOpacity,Text } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

interface BottomBarProps {
    options: string[];
    onOptionSelect: () => void;
}

function BottomBar({options, onOptionSelect}:BottomBarProps) {
    return (
        <View style={styles.bottomBar}>
        {
            options.map((option, index) => (
                <TouchableOpacity style={styles.option} key={index} onPress = {onOptionSelect}>
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))
        }
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
  optionText: {
    color: 'white',
    fontSize: RFValue(16, 680), // Responsive font size
  },
});

export default BottomBar;

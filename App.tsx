import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomBar from "./components/BottomBar";
import Feed from "./components/Feed";

function App() {

  return (
    <View style={styles.container}>
      <Feed></Feed>
      <BottomBar options={["News", "Stories", "Poems", "Profile"]} onOptionSelect={() => {}}></BottomBar>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282727',
  },
  text: {
    color: "white",
  },
});

export default App;
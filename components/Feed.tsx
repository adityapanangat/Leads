import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const items = [
  "Key Hezbollah leader killed in strike, Israeli military says (WaPo)",
  "4 dead and 17 injured after gunfire erupts at popular nightlife area in Birmingham, Alabama, police say (CNN)",
  "Secret Service identifies failures that preceded Trump assassination attempt at July campaign rally (CBS News)",
  "White Sox lose 120th game to tie post-1900 record by the 1962 expansion New York Mets (AP)",
  "South Carolina teen goes viral for his singing (CBS News)",
];

const windowHeight = Dimensions.get('window').height;

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / windowHeight);

    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()} // Ensure unique key for each item
        onScroll={handleScroll}
        decelerationRate={0.1}
        scrollEventThrottle={16}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282727',
  },
  flatList: {
    flex: 1,
    minWidth:'100%',
  },
  itemContainer: {
    height: windowHeight, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#fff',
    top: '-5%',
    maxWidth: '80%',
    fontSize: 24,
    fontFamily: 'Georgia',
  }
});

export default App;

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Image, Modal, TouchableOpacity, Linking } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Headline } from "../App"; // Ensure this path is correct
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have installed this package

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

interface FeedProps {
  headlinesData: Headline[];
  loadMoreHeadlines: () => void;
  loading: boolean;
  isEndReached: boolean;
}

interface FeedEntryProps {
  entryItem: string;
  author?: string;
  date?: string;
  time?: string;
  imageUrl?: string;
  style?: object;
  articleUrl: string;
  isFirstSlide: boolean; // New prop to determine if it's the first slide
}

const FeedEntry = React.memo(({ entryItem, author, date, time, imageUrl, style, articleUrl, isFirstSlide }: FeedEntryProps) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openLink = () => {
    Linking.openURL(articleUrl); // Open the article URL
  };

  return (
    <View style={styles.headlineContainer}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}
      <Text style={style}>{entryItem}</Text>
      {author && <Text style={styles.authorText}>By: {author}</Text>}
      {(date || time) && (
        <Text style={styles.dateTimeText}>
          {date ? `${date}` : ''} {time ? `at ${time}` : ''}
        </Text>
      )}

      {/* Button for copyright information, only shown on the first slide */}
      {isFirstSlide && (
        <TouchableOpacity style={styles.copyrightButton} onPress={openModal}>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal for copyright info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Copyright and Licensing</Text>
            <Text style={styles.modalText}>© BoingBoing News</Text>
            <Text style={styles.modalText}>Licensed under CC Attribution-NonCommercial 2.5 Generic.</Text>
            <Text style={styles.modalText}>This material is provided for educational and informational purposes.</Text>
            <TouchableOpacity onPress={openLink}>
              <Text style={styles.modalLink}>Read the original article</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

function Feed({ headlinesData, loadMoreHeadlines, loading, isEndReached }: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [horizontalIndices, setHorizontalIndices] = useState<number[]>(Array(headlinesData.length).fill(0));
  const horizontalListRefs = useRef<FlatList[]>([]);

  const handleVerticalScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.floor(offsetY / windowHeight);
    
    if (index !== currentIndex) {
      setCurrentIndex(index);
      horizontalListRefs.current[index]?.scrollToIndex({ index: 0, animated: true });

      // Trigger load more headlines when the first item is scrolled past
      if (index === 1 && !loading && !isEndReached) {
        loadMoreHeadlines();
      }
    }
  };

  const handleHorizontalScroll = (event: any, index: number) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newHorizontalIndex = Math.floor(offsetX / windowWidth);
    if (newHorizontalIndex !== horizontalIndices[index]) {
      const updatedIndices = [...horizontalIndices];
      updatedIndices[index] = newHorizontalIndex;
      setHorizontalIndices(updatedIndices);
    }
  };

  const handleLoadMore = () => {
    console.log("Fetching headlines");
    loadMoreHeadlines(); 
  };

  useEffect(() => {
    setHorizontalIndices(Array(headlinesData.length).fill(0));
  }, [headlinesData]);

  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
    const totalPages = item.subheadlines.length + 1; 
    const currentPage = horizontalIndices[index] + 1 !== 0 ? horizontalIndices[index] + 1 : 1;

    const pageDisplay = totalPages > 0 ? `${currentPage}/${totalPages}` : '0/0';

    return (
      <View style={styles.headlineWrapper}>        
        <FlatList
          ref={(ref) => (horizontalListRefs.current[index] = ref!)}
          data={[item.headline, ...item.subheadlines]}
          renderItem={({ item: subItem, index: subIndex }) => (
            <FeedEntry 
              entryItem={subItem} 
              author={subIndex === 0 ? item.author : undefined}
              date={subIndex === 0 ? item.date : undefined}
              time={subIndex === 0 ? item.time : undefined}
              imageUrl={subIndex === 0 ? item.imageUrl : undefined} // Show image only on first slide
              style={subIndex === 0 ? styles.headline : styles.subheadline}
              articleUrl={item.articleUrl} // Pass article URL to FeedEntry
              isFirstSlide={subIndex === 0} // Pass whether it's the first slide
            />
          )}
          keyExtractor={(subItem, subIndex) => subIndex.toString()}
          horizontal={true}
          pagingEnabled={true}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={(event) => handleHorizontalScroll(event, index)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          nestedScrollEnabled
          initialNumToRender={1}
          maxToRenderPerBatch={1}
        />
        <View style={styles.pageCounter}>
          <Text style={styles.pageCounterText}>
            {pageDisplay}
          </Text>
        </View>
      </View>
    );
  }, [horizontalIndices]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={headlinesData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled={true}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={handleVerticalScroll}
        showsVerticalScrollIndicator={false}
        style={styles.flatListVertical}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.9}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
      />
    </GestureHandlerRootView>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282727',
  },
  flatListVertical: {
    flex: 1,
    minWidth: '100%',
  },
  headlineWrapper: {
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalList: {
    flexGrow: 1,
    alignItems: 'center',
  },
  headlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    marginVertical: 10,
  },
  headline: {
    color: '#fff',
    lineHeight: RFPercentage(5),
    fontSize: RFPercentage(2.5),
    fontFamily: 'Georgia',
    maxWidth: '85%',
    top: '-90%',
    textAlign: 'center',
  },
  image: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.3,
    top:'10%',
    resizeMode: 'cover',
    marginBottom: 10,
  },
  authorText: {
    color: '#ccc',
    fontSize: RFPercentage(2),
    fontStyle: 'italic',
  },
  dateTimeText: {
    color: '#bbb',
    fontSize: RFPercentage(2),
  },
  copyrightButton: {
    position: 'absolute', // Keep it absolute
    left:'5%',
    bottom:'-20%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: RFPercentage(2),
    marginBottom: 10,
  },
  modalLink: {
    color: '#007bff',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: RFPercentage(2),
  },
  pageCounter: {
    position: 'absolute',
    bottom: '15%',
    right: '5%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageCounterText: {
    color: '#fff',
    padding: 5,
    fontSize: RFPercentage(2.5),
    textAlign: 'center',
  },
  attributionText: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'Georgia',
    position: 'absolute',
    bottom: '85%',
    left: '5%',
    color: '#fff',
  },
  attributionGreen: {
    color: 'green',
  },
  subheadline: {
    color: '#aaa',  // Different color for subheadlines
    lineHeight: RFPercentage(3.7),
    fontSize: RFPercentage(3),  // Smaller font size for subheadlines
    fontFamily: 'Georgia',
    top:'-10%',
    maxWidth: '85%',
    textAlign: 'center',
  },
});

export default Feed;

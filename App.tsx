import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import BottomBar from './components/BottomBar';
import Feed from './components/Feed';
import SearchBar from './components/SearchBar';
import TrendingSearches from './components/TrendingSearches';
import Chatbot from './components/Chatbot'; // Import the Chatbot component
import articles from "./components/newsArticleInformation.json";

const ITEMS_PER_PAGE = 20; // Number of headlines to fetch at a time

export interface Headline {
  headline: string;
  subheadlines: string[];
  author: string;
  date: string;
  time: string;
  imageUrl: string;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [headlinesData, setHeadlinesData] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const [pageIndex, setPageIndex] = useState(0); // Track current page index

  const chatbotResponses = [
    "Hello! How can I assist you today?",
    "An interest rate hike is an increase in the benchmark interest rate set by a central bank, like the Federal Reserve in the U.S.",
    "I'm here to help with your questions."
  ];

  const fetchHeadlines = async () => {
    if (loading || isEndReached) return; // Prevent fetching if already loading or no more headlines

    setLoading(true);

    try {
      const articlesArray = Object.entries(articles)
      .filter(([url, article]) => article.author !== "BOING BOING'S SHOP") // Filter by author
      .map(([url, article]) => ({ articleUrl: url, ...article })); // Include articleUrl in each article object

      // Calculate the start and end indices for the headlines based on the pageIndex
      const start = pageIndex * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;

      // Map articles into the desired format
      const newHeadlines: Headline[] = articlesArray.slice(start, end).map((article: any) => {
        const sentences = article.text.match(/[^.!?]+[.!?]+/g) || [];

        // Group sentences into pairs (2 sentences per subheadline)
        const subheadlines = [];
        for (let i = 0; i < sentences.length; i += 2) {
          const sentencePair = sentences.slice(i, i + 2).join(' ').trim(); // Join two sentences
          subheadlines.push(sentencePair);
        }

        return {
          headline: article.headline,
          subheadlines, // Use the text as subheadline, adjust if necessary
          author: article.author,
          date: article.date,
          time: article.time,
          imageUrl: article.imageUrl,
          articleUrl: article.articleUrl, // Include the articleUrl
        };
      });

      // Update headlines data
      setHeadlinesData((prevData) => [...prevData, ...newHeadlines]);

      // Check if we have reached the end of the articles
      if (newHeadlines.length < ITEMS_PER_PAGE) {
        setIsEndReached(true); // Mark as end reached
      }

      // Increment pageIndex for the next load
      if (newHeadlines.length > 0) {
        setPageIndex((prevPage) => prevPage + 1);
      }

    } catch (error) {
      console.error('Error reading headlines from file:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch initial headlines
  useEffect(() => {
    fetchHeadlines();
  }, []);

  // Load more headlines when triggered
  const loadMoreHeadlines = () => {
    fetchHeadlines();
  };

  // State for chatbot
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <View style={styles.container}>
      {currentPage === 'home' && !showChatbot ? (
        <Feed headlinesData={headlinesData} loadMoreHeadlines={loadMoreHeadlines} loading={loading} isEndReached={isEndReached}/>
      ) : showChatbot ? (
        <Chatbot responses={chatbotResponses} onClose={() => setShowChatbot(false)} />
      ) : (
        <View style={styles.searchContainer}>
          <SearchBar />
          <TrendingSearches />
        </View>
      )}
      <BottomBar 
        onHomeSelect={() => setShowChatbot(false)} 
        onSearchSelect={() => setShowChatbot(true)} // Open chatbot on search button press
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282727',
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default App;

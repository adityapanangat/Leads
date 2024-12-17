import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface ChatbotProps {
  responses: string[];
  onClose: () => void; // Function to call when closing the chatbot
}

const Chatbot: React.FC<ChatbotProps> = ({ responses, onClose }) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Send the first message from the bot when the component mounts
    if (responses.length > 0) {
      setMessages([{ text: responses[0], sender: 'bot' }]);
    }
  }, [responses]);

  const handleSend = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: 'user' }]);
      // Simulate bot response
      const nextBotResponse = responses[messages.length % responses.length]; // Loop through responses
      setMessages((prevMessages) => [...prevMessages, { text: nextBotResponse, sender: 'bot' }]);
      setInputValue(''); // Clear input
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60} // Adjust based on your layout
    >
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Type your message..."
          placeholderTextColor="#bababa"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#282727',
  },
  messagesContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  message: {
    padding: 10,
    height:'60%',
    width:'130%',
    top:210,
    borderRadius: 5,
    marginVertical: -155,
    maxWidth: '100%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#444',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10, // Reduced padding for the input box
    marginVertical: 10,
    borderRadius: 5,
    height:'130%',
    width: '130%', // Adjust width to fill the container
    position: 'absolute', // Position it absolutely
    bottom: 100, // Align to the bottom
    left:-72,
    color:'white',
    fontSize:25,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    height:'130%',
    width:'30%',
    bottom:117,
    left:240,
  },
  sendButtonText: {
    textAlign:'center',
    justifyContent:'center',
    fontSize:20,
    top:'15%',
    color: '#fff',
  },
  closeButton: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Chatbot;

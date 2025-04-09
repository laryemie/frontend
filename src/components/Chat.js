// src/components/Chat.js
import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, Box } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';

// Use environment variable for Socket.IO connection
const socket = io(process.env.REACT_APP_BACKEND_URL);

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chats/${chatId}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setChat(response.data);
        setMessages(response.data.messages);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChat();

    socket.emit('joinChat', chatId);

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [chatId]);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { chatId, message, senderId: user.id });
      setMessage('');
    }
  };

  if (!chat) return <div>Loading...</div>;

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Chat with {user.role === 'client' ? chat.worker.username : chat.client.username}
      </Typography>
      <Box sx={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.sender._id === user.id ? 'flex-end' : 'flex-start' }}>
              <Box
                sx={{
                  backgroundColor: msg.sender._id === user.id ? '#1976d2' : '#e0e0e0',
                  color: msg.sender._id === user.id ? 'white' : 'black',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  maxWidth: '60%',
                }}
              >
                <ListItemText primary={msg.message} secondary={`From: ${msg.sender._id === user.id ? 'You' : msg.sender.username}`} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <TextField
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default Chat;
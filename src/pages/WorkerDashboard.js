// src/pages/WorkerDashboard.js
import React, { useEffect, useState, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  TextField,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requestSearch, setRequestSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/requests`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
          params: { search: requestSearch, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined },
        });
        setRequests(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
  }, [requestSearch, minPrice, maxPrice]);

  const handleChat = async (clientId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chats`,
        { workerId: user.id },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      navigate(`/chat/${response.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Worker Dashboard
      </Typography>
      <Typography variant="h6">Available Service Requests</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by Description"
          value={requestSearch}
          onChange={(e) => setRequestSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Min Price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>
      <Grid container spacing={3} style={{ marginTop: '1rem' }}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request._id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar>{request.client.username[0]}</Avatar>
                  <Typography variant="h6" style={{ marginLeft: '1rem' }}>
                    {request.client.username}
                  </Typography>
                </Box>
                <Typography variant="body1">{request.description}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: ${request.proposedPrice}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Address: {request.address}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleChat(request.client._id)}
                >
                  Chat with Client
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WorkerDashboard;
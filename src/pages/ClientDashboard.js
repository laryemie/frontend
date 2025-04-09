// src/pages/ClientDashboard.js
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ClientDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [workerSearch, setWorkerSearch] = useState('');
  const [workerSkillFilter, setWorkerSkillFilter] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/workers`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
          params: { search: workerSearch, skill: workerSkillFilter },
        });
        setWorkers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/requests`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
          params: { search: requestSearch, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined },
        });
        setRequests(response.data.filter(req => req.client._id === user.id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchWorkers();
    fetchRequests();
  }, [user.id, workerSearch, workerSkillFilter, requestSearch, minPrice, maxPrice]);

  const handleChat = async (workerId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chats`,
        { workerId },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      navigate(`/chat/${response.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const uniqueSkills = [...new Set(workers.flatMap(worker => worker.skills.map(skill => skill.title)))];

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Client Dashboard
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/request-service">
        Request a Service
      </Button>

      <Typography variant="h6" style={{ marginTop: '2rem' }}>
        Your Requests
      </Typography>
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
      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} sm={6} md={4} key={request._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{request.description}</Typography>
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
                  component={Link}
                  to={`/payment/${request._id}`}
                >
                  Pay Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" style={{ marginTop: '2rem' }}>
        Available Workers
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by Username"
          value={workerSearch}
          onChange={(e) => setWorkerSearch(e.target.value)}
          variant="outlined"
          size="small"
        />
        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
          <InputLabel>Filter by Skill</InputLabel>
          <Select
            value={workerSkillFilter}
            onChange={(e) => setWorkerSkillFilter(e.target.value)}
            label="Filter by Skill"
          >
            <MenuItem value="">All Skills</MenuItem>
            {uniqueSkills.map((skill) => (
              <MenuItem key={skill} value={skill}>
                {skill}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {workers.map((worker) => (
          <Grid item xs={12} sm={6} md={4} key={worker._id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar>{worker.user.username[0]}</Avatar>
                  <Typography variant="h6" style={{ marginLeft: '1rem' }}>
                    {worker.user.username}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Skills: {worker.skills.map(s => s.title).join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleChat(worker.user._id)}
                >
                  Chat with Worker
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClientDashboard;
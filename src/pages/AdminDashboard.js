// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Tabs, Tab, Box, Avatar } from '@mui/material';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/users`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/jobs`, {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setJobs(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchJobs();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/users/${userId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkFraud = async (userId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/users/${userId}/fraud`,
        {},
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setUsers(users.map(user => (user._id === userId ? { ...user, enabled: false } : user)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/jobs/${jobId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
        <Tab label="Manage Users" />
        <Tab label="Manage Jobs" />
      </Tabs>
      {tab === 0 && (
        <Box>
          <Typography variant="h6" style={{ marginTop: '2rem' }}>
            Users
          </Typography>
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar>{user.username[0]}</Avatar>
                      <Typography variant="h6" style={{ marginLeft: '1rem' }}>
                        {user.username}
                      </Typography>
                    </Box>
                    <Typography variant="body1">Email: {user.email}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Role: {user.role} | Enabled: {user.enabled ? 'Yes' : 'No'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteUser(user._id)}
                      style={{ marginRight: '1rem' }}
                    >
                      Delete
                    </Button>
                    {user.enabled && (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleMarkFraud(user._id)}
                      >
                        Mark as Fraud
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {tab === 1 && (
        <Box>
          <Typography variant="h6" style={{ marginTop: '2rem' }}>
            Jobs
          </Typography>
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{job.description}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Client: {job.client.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: ${job.proposedPrice}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;
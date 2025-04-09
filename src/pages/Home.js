// job-skill-app/src/pages/Home.js
import React from 'react';
import { Container, Typography, Button, Card, CardContent, CardActions, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Job Skill App
      </Typography>
      <Typography variant="h6" gutterBottom>
        Connect with skilled workers or offer your services today!
      </Typography>
      <Grid container spacing={3} style={{ marginTop: '2rem' }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                For Clients
              </Typography>
              <Typography variant="body1">
                Find skilled workers for your tasks. Request a service and connect with professionals.
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" component={Link} to="/login">
                Get Started
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                For Workers
              </Typography>
              <Typography variant="body1">
                Offer your skills and connect with clients. Register as a worker today.
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" component={Link} to="/register-worker">
                Join Now
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
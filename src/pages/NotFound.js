// src/pages/NotFound.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
    </Container>
  );
};

export default NotFound;
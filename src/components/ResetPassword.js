// src/components/ResetPassword.js
import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
    </Container>
  );
};

export default ResetPassword;
// src/components/Payment.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Alert } from '@mui/material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = ({ requestId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/payments/create-payment-intent`,
          { requestId },
          { headers: { 'x-auth-token': localStorage.getItem('token') } }
        );
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError('Error initializing payment');
      }
    };
    fetchClientSecret();
  }, [requestId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      setSuccess('Payment successful!');
      setTimeout(() => navigate('/client-dashboard'), 2000);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Make Payment
      </Typography>
      <Typography variant="h6">Amount: ${amount}</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!stripe || !clientSecret}
          style={{ marginTop: '1rem' }}
        >
          Pay
        </Button>
      </form>
    </Container>
  );
};

export default Payment;
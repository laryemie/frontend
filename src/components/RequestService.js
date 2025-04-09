// src/components/RequestService.js
import React from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const RequestService = () => {
  const validationSchema = Yup.object({
    description: Yup.string().required('Required'),
    proposedPrice: Yup.number().required('Required').positive('Must be positive'),
    address: Yup.string().required('Required'),
  });

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Request a Service
      </Typography>
      <Formik
        initialValues={{ description: '', proposedPrice: '', address: '', success: '', error: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldValue, setFieldError }) => {
          try {
            await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/api/requests`,
              values,
              { headers: { 'x-auth-token': localStorage.getItem('token') } }
            );
            setFieldValue('success', 'Service request submitted successfully!');
          } catch (err) {
            setFieldError('error', 'Error submitting request');
          }
        }}
      >
        {({ errors, touched, values }) => (
          <Form>
            {errors.error && <Alert severity="error">{errors.error}</Alert>}
            {values.success && <Alert severity="success">{values.success}</Alert>}
            <Field
              as={TextField}
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
            />
            <Field
              as={TextField}
              label="Proposed Price"
              name="proposedPrice"
              type="number"
              fullWidth
              margin="normal"
              error={touched.proposedPrice && !!errors.proposedPrice}
              helperText={touched.proposedPrice && errors.proposedPrice}
            />
            <Field
              as={TextField}
              label="Address"
              name="address"
              fullWidth
              margin="normal"
              error={touched.address && !!errors.address}
              helperText={touched.address && errors.address}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit Request
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default RequestService;
// src/components/Login.js
import React, { useContext } from 'react';
import { TextField, Button, Container, Typography, Alert, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Login
          </Typography>
          <Formik
            initialValues={{ email: '', password: '', error: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setFieldError }) => {
              try {
                const user = await login(values.email, values.password);
                if (user.role === 'worker') {
                  navigate('/worker-dashboard');
                } else if (user.role === 'client') {
                  navigate('/client-dashboard');
                } else if (user.role === 'admin') {
                  navigate('/admin-dashboard');
                }
              } catch (err) {
                setFieldError('error', err.message);
                if (err.message.includes('Account locked')) {
                  navigate('/reset-password');
                }
              }
            }}
          >
            {({ errors, touched, values }) => (
              <Form>
                {errors.error && <Alert severity="error">{errors.error}</Alert>}
                <Field
                  as={TextField}
                  label="Email"
                  name="email"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
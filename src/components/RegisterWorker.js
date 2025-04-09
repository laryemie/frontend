// src/components/RegisterWorker.js
import React from 'react';
import { TextField, Button, Container, Typography, Alert, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const RegisterWorker = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    username: Yup.string().required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    skills: Yup.string().required('Required'),
    qualifications: Yup.string().required('Required'),
  });

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Register as Worker
          </Typography>
          <Formik
            initialValues={{
              email: '',
              username: '',
              password: '',
              skills: '',
              qualifications: '',
              error: '',
              success: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setFieldError, setFieldValue }) => {
              try {
                const userResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
                  email: values.email,
                  username: values.username,
                  password: values.password,
                  role: 'worker',
                });

                await axios.post(
                  `${process.env.REACT_APP_BACKEND_URL}/api/workers`,
                  {
                    skills: values.skills.split(',').map(s => ({ title: s.trim(), level: 'Intermediate', description: '' })),
                    qualifications: values.qualifications.split(',').map(q => ({
                      title: q.trim(),
                      country: 'Unknown',
                      center: 'Unknown',
                      startdate: new Date(),
                      enddate: new Date(),
                      description: '',
                    })),
                    experience: [],
                  },
                  { headers: { 'x-auth-token': userResponse.data.token } }
                );

                setFieldValue('success', 'Worker account created successfully! Please log in.');
                setTimeout(() => navigate('/login'), 2000);
              } catch (err) {
                setFieldError('error', err.response?.data?.msg || 'Error creating account');
              }
            }}
          >
            {({ errors, touched, values }) => (
              <Form>
                {errors.error && <Alert severity="error">{errors.error}</Alert>}
                {values.success && <Alert severity="success">{values.success}</Alert>}
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
                  label="Username"
                  name="username"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
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
                <Field
                  as={TextField}
                  label="Skills (comma-separated)"
                  name="skills"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.skills && !!errors.skills}
                  helperText={touched.skills && errors.skills}
                />
                <Field
                  as={TextField}
                  label="Qualifications (comma-separated)"
                  name="qualifications"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.qualifications && !!errors.qualifications}
                  helperText={touched.qualifications && errors.qualifications}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterWorker;
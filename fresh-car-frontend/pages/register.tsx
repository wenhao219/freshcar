import * as React from 'react';
import { useState } from 'react';
import { Grid, TextField, Button, Typography, Container, Snackbar, Alert, Stack } from '@mui/material';
import api from '../src/api';
import { useRouter } from 'next/router';

interface RegisterFormData {
  username: string;
  password: string;
}

const UserRegister: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData: RegisterFormData = {
      username,
      password,
    };
    try {
      const response = await api.post('/auth/register', formData);
      if (response.status === 201) {
        setSnackbarMessage('Account created successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Redirect to login page
        window.location.href = '/';
      } else {
        setSnackbarMessage('Error creating account');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('Error creating account');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              value={username}
              onChange={event => setUsername(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction={'row'} spacing={2}>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
              <Button type="button" variant="contained" color="primary" onClick={() => router.push('/')}>
                Back To Login Page
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={openSnackbar} onClose={handleCloseSnackbar}>
        <Alert severity={snackbarSeverity as any}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UserRegister;
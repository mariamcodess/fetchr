import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Grid, InputAdornment } from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';
import './LoginSignup.css';

export const LoginSignup = () => {
  const [action, setAction] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = action === 'Login' ? 'login' : 'signup';
    const payload = action === 'Login' ? { name, email } : { name, email, password };

    try {
      const response = await fetch(`https://frontend-take-home-service.fetch.com/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" className="login-container">
      <Box component="form" noValidate autoComplete="off">
        <Typography variant="h4" gutterBottom>{action}</Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />
        {action === 'Sign Up' && (
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
        )}
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" className="submit-button" fullWidth onClick={handleSubmit}>
          {action === 'Login' ? 'Login' : 'Sign Up'}
        </Button>
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Grid item>
            <Typography variant="body2">
              {action === 'Login' ? (
                <>
                  Don't have an account?{' '}
                  <Button color="secondary" onClick={() => setAction('Sign Up')}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Button color="secondary" onClick={() => setAction('Login')}>
                    Login
                  </Button>
                </>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginSignup;
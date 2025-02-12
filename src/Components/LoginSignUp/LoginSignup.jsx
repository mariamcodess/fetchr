import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import emailIcon from '../Assets/email.png';
import passwordIcon from '../Assets/password.png';
import userIcon from '../Assets/person.png';

export const LoginSignUp = () => {
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
      const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Login successful' || data.message === 'Signup successful') {
          navigate('/home');
        } else {
          setError(data.message || 'Something went wrong. Please try again.');
        }
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
    <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        <div className='input'>
          <img src={userIcon} alt='userIcon' />
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='input'>
          <img src={emailIcon} alt='emailIcon' />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {action === 'Sign Up' && (
          <div className='input'>
            <img src={passwordIcon} alt='passwordIcon' />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
      </div>
      {error && <div className='error'>{error}</div>}
      <div className='forgotPassword'>
        Lost Password? <span>Click Here!</span>
      </div>
      <div className='terms'>
        By signing up, you agree to our Terms, Data Policy and Cookies Policy.
      </div>
      <div className='submitContainer'>
        <div className='submit' onClick={handleSubmit}>
          {action === 'Login' ? 'Login' : 'Sign Up'}
        </div>
        <div
          className='switchAction'
          onClick={() => {
            setAction(action === 'Login' ? 'Sign Up' : 'Login');
            setError('');
          }}
        >
          {action === 'Login' ? 'Sign Up' : 'Login'}
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
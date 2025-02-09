import React, { useState } from 'react'
import './LoginSignup.css'
import emailIcon from '../Assets/email.png'
import passwordIcon from '../Assets/password.png'
import userIcon from '../Assets/person.png'


export const LoginSignup = () => {

    const [action, setAction] = useState('Login');


    return (
        <div className='container'>
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'>
        </div>
      </div>
      <div className='inputs'>
        {action === 'Login'? <div></div>: <div className='input'>
          <img src={userIcon} alt='userIcon' />
          <input type='text' placeholder='Name' />
        </div>}
        <div className='input'>
          <img src={emailIcon} alt='emailIcon' />
          <input type='email' placeholder='Email'/>
        </div>
        <div className='input'>
          <img src={passwordIcon} alt='passwordIcon' />
          <input type='password' placeholder='Password' />
        </div>
      </div>
      <div className='forgotPassword'>Lost Password? <span>Click Here!</span></div>
        By signing up, you agree to our Terms, Data Policy and Cookies Policy.
      <div className='submitContainer'>
        <div className={action === 'Login'?'submit gray': 'submit'} onClick={() => {setAction("Sign Up")}}>Sign Up</div>
        <div className={action === 'Sign Up'?'submit gray': 'submit'} onClick={() => {setAction("Login")}}>Login</div>
      </div>
      </div>
    );
}
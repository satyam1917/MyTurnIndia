import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import {useGoogleLogin} from '@react-oauth/google';
import Google from '../../assets/google.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    })
      .then(response => response.json())
      .then(data => {
        if(data.success){
          if(data.message === "OTP send successfully"){
            toast.success(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
            navigate("/otp-verification", {
              state: { email: email },
            });
          }
          else{
            toast.success(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
              Cookies.set('token', data.token, { expires: 365, secure: true, sameSite: 'Strict' });
              window.location.assign(`${import.meta.env.VITE_FRONTEND_URL}`);
          }
          
        }
        else{
          toast.error(data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
          
      })
      .catch(error => console.error('Error:', error));    
  };

  const reponseGoogle = async(authResult) => {
    try {
      if (authResult['code']) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/users/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: authResult['code']
          }),
        }).then(response => response.json()).then(data => {
          if(data.status){
            Cookies.set('token', data.token, { expires: 365, secure: true, sameSite: 'Strict' });
              window.location.assign(`${import.meta.env.VITE_FRONTEND_URL}`);
          }
          else{
            toast.error(data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
          }
        })
      }
    } catch (error) {
      console.error("Error while requesting Google code : ", error);
    }

  };

  const hangleLoginWithGoogle = useGoogleLogin({
    onSuccess: reponseGoogle,
    onError: reponseGoogle,
    flow: 'auth-code',
  });

  return (
    <div className="login-container">
       <div className='adjust-login'>
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="form-title">Login</h2>

        {/* Email Field with FontAwesome Icon */}
        <div className="input-group">
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Field with FontAwesome Icon and Visibility Toggle */}
        <div className="input-group password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
         
        </div>

        {/* Login Button */}
        <button type="submit" className="btn">Login</button>
        </form>

        {/* Login with Google */}
        <br/>
        <div className='google'>
        <button onClick={()=>hangleLoginWithGoogle()} className="google-btn"><img src={Google} alt="Google" className="google-logo"/>Login with Google</button>
        </div>

        {/* Register link */}
        <p className="helper-text">
          Don't have an account? <a href="/register" className="link">Register</a>
        </p>

       
        {/* Forgot Password Link */}
        <p className="forgot-password-text">
          Forgot your password? <a href="/forgot-password" className="link">Reset it here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

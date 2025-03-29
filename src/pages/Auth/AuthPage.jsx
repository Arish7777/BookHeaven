import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsLogin(params.get("mode") !== "signup"); // If "signup" is in the query, set it to false
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      if (isLogin) {
        // Login Logic
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
          setError('No account found with this email');
          return;
        }

        if (user.password !== password) {
          setError('Incorrect password');
          return;
        }

        // Generate a simple token (in a real app, this would be handled by the backend)
        const token = btoa(`${user.email}:${Date.now()}`);
        
        // Store user session
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          email: user.email,
          username: user.username,
          books: user.books || []
        }));

        navigate('/dashboard');
      } else {
        // Signup Logic
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email is already registered
        if (users.some(u => u.email === email)) {
          setError('Email already registered');
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          username,
          email,
          password,
          books: [],
          createdAt: new Date().toISOString()
        };

        // Generate token for new user
        const token = btoa(`${newUser.email}:${Date.now()}`);

        // Save user and token
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          books: []
        }));

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <button 
        className="back-button"
        onClick={() => navigate(-2)}
      >
        <FaArrowLeft />
        Back
      </button>
      
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>BookHaven</h1>
          <p>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group1">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                placeholder="Choose a username"
              />
            </div>
          )}
          
          <div className="form-group1">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group1">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="auth-button">
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        // Login API call
    console.log(isLogin, username, password);
        // response = await axios( {
        //   method: 'POST',
        //   baseURL: 'http://127.0.0.1:8000/api/token/',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: {
            // username: username,
            // password: password,
        //   },
        // });
        await axios.post('http://127.0.0.1:8000/api/token/', {
          username: username,
          password: password,
        })
        .then( (res) => {
          response=res
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      } else {
        // Signup API call
        // response = await axios( {
        //   method: 'POST',
        //   baseURL:'http://127.0.0.1:8000/api/chat/register/',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     username,
        //     email, // Include email in the signup request
        //     password,
        //   }),
        // });
        await axios.post('http://127.0.0.1:8000/api/chat/register/', {
          username: username,
          email: email, // Include email in the signup request
          password: password,
        })
        .then((res) => {
          response=res
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      }

      const data = await response.data;
      // Assuming the API returns a token on successful login/signup
      localStorage.setItem('token', data.access);
      
    navigate('/chat');
    } catch (error) {
      console.log('error.response', error.response);
      setError("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark:bg-gray-900 dark:text-white' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <Scale className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {!isLogin && ( // Show email input only during signup
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            className="text-blue-600 hover:text-blue-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

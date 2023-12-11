// App.js
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ConfBudget from './ConfBudget/ConfBudget';
import Expenditure from './Expenditure/Expenditure';
import Home from './Home/Home';
import Menu from './Menu/Menu';
import MonthlyExpenses from './MonthlyExpenses/MonthlyExpenses';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const userData = {user: user, token: token};

  useEffect(() => {
    // Check if the user is authenticated (e.g., by checking a token in local storage)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const intervalId = setInterval(() => {
        showAlertDialog();
      }, 60 * 1000); // 1 minute in milliseconds

      return () => clearInterval(intervalId);
    }
  }, [user]);
  const showAlertDialog = () => {
    const result = window.confirm('Your token is about to expire. Click OK to renew the token, or Cancel to Signout.');
  
    if (result) {
      handleRenewToken();
    } 
    else {
       handleSignOut();
      }
    
  };

  const handleRenewToken = async () => {
    try {
      // Make a request to the server to renew the token
      const response = await fetch('http://localhost:3001/renewToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
          'X-User-ID': userData.user._id,
        },
      });
  
      if (response.ok) {
        // If the renewal request is successful, get the new token from the response
        const { token: newToken } = await response.json();

        setToken(newToken);
  
      } else {
        // Handle the case where token renewal failed
        console.error('Token renewal failed');
      }
    } catch (error) {
      console.error('Error during token renewal:', error);
    }
  };


  const handleSignIn = (user, token) => {
    // Logic for signing in
    console.log(user)
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const handleSignOut = () => {
    // Logic for signing out
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      {user && <Menu handleSignOut={handleSignOut} />} 
      <Routes>
        <Route
          path="/"
          element={user ? <Home user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <SignIn onSignIn={handleSignIn} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUp onSignUp={handleSignIn} />}
        />
        {/* Pass user data to ConfBudget component */}
        <Route path="confBudget" element={<ConfBudget userData={userData} />} />
        <Route path="expenditure" element={<Expenditure userData={userData}/>} />
        <Route path="monthlyExpenses" element={<MonthlyExpenses userData={userData}/>} />
      </Routes>
    </Router>
  );
};

export default App;

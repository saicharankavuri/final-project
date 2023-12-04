// App.js
import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ConfBudget from './ConfBudget/ConfBudget';
import Expenditure from './Expenditure/Expenditure';
import Home from './Home/Home';
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

  // const scheduleTokenRefresh = () => {
  //   // Schedule token refresh 45 seconds before expiration
  //   const expirationTime = jwtDecode(token).exp * 1000;
  //   const refreshTime = expirationTime - 45000;
  //   setTimeout(refreshToken, refreshTime - Date.now());
  // };

  // const refreshToken = async () => {
  //   // Logic to refresh the token (e.g., make a request to the server to get a new token)
  //   // Update the user and token state with the new values
  // };

  // const handleTokenRefresh = () => {
  //   // Manually trigger token refresh
  //   refreshToken();
  // };

  return (
    <Router>
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

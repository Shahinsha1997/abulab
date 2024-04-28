import React, { Component } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Replace with your actual logic to check login state (e.g., localStorage or Redux)
const isLoggedIn = () => {
  // Implement login state check here
  // This example uses localStorage for demonstration (replace with your logic)
  const loginData = localStorage.getItem('isLoggedIn');
  return loginData == 'true';
};

class PrivateRoute extends Component {
  render() {
    if (isLoggedIn()) {
      return <Outlet />; // Render the child component (nested route)
    } else {
      return <Navigate to="/login" replace />; // Redirect to login if not logged in
    }
  }
}

export default PrivateRoute;

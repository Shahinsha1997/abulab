import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import { Provider } from 'react-redux';
import { store } from './store';
import { useMediaQuery } from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
const App =(props)=>{
  const [currentPath, setCurrentPath] = useState('login')
  const [isNavigateNeed, setIsNavigateNeed] = useState(false)
  const handleNavigate = (path)=>{
    setCurrentPath(path)
    setIsNavigateNeed(true)
  }
  useEffect(()=>{
    setIsNavigateNeed(false)
  },[isNavigateNeed])
  const isMobile = useMediaQuery('(max-width: 600px)');
  return (
    <Provider store={store} dispatch={store.dispatch}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage isNavigateNeed={isNavigateNeed} currentPath={currentPath} handleNavigate={handleNavigate}/>} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout isMobile={isMobile}/>} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

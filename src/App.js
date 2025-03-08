import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import { Provider } from 'react-redux';
import { store } from './store';
import AppointmentForm from './components/AppoinmentPage';
import { useMediaQuery } from '@mui/material';
import ReportDv from './components/ReportDv';
import ErrorBoundary from './components/ErrorBoundary';
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
    <ErrorBoundary from='wholeapp'>
      <Provider store={store} dispatch={store.dispatch}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage isNavigateNeed={isNavigateNeed} currentPath={currentPath} handleNavigate={handleNavigate}/>} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/reports/:reportId" element={<ReportDv isMobile={isMobile}/>} /> 
              <Route path="/dashboard" element={<ErrorBoundary from="dashboard"><DashboardLayout isMobile={isMobile}/></ErrorBoundary>} /> 
            </Route>
            <Route path="/appointments" element={<AppointmentForm/>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;

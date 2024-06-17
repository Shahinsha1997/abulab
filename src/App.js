import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import { changePathName } from './utils/utils';
import { Provider } from 'react-redux';
import { store } from './store';
import AppointmentForm from './components/AppoinmentPage';
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      currentPath:'login',
      isNavigateNeed: false
    }
    this.handleNavigate = this.handleNavigate.bind(this)
  }
  componentDidUpdate(prevProps, prevState){
    if(!prevState.isNavigateNeed && this.state.isNavigateNeed){
      this.setState({
        isNavigateNeed: false
      })
    }
  }
  handleNavigate(path){
    this.setState({
      currentPath: path,
      isNavigateNeed: true
    })
    // changePathName(path)
  }
  render() {
    const { currentPath, isNavigateNeed} = this.state;
    return (
      <Provider store={store} dispatch={store.dispatch}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage isNavigateNeed={isNavigateNeed} currentPath={currentPath} handleNavigate={this.handleNavigate}/>} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />} /> 
            </Route>
            <Route path="/appointments" element={<AppointmentForm/>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;

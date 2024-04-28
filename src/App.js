import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import { changePathName } from './utils/utils';
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      currentPath:'login'
    }
    this.handleNavigate = this.handleNavigate.bind(this)
  }
  handleNavigate(path){
    this.setState({
      currentPath: path
    })
    changePathName(path)
  }
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage handleNavigate={this.handleNavigate}/>} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;

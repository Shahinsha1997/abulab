import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


class PrivateRoute extends Component {
  render() {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      return <Outlet />; // Render the child component (nested route)
    } else {
      return <Navigate to="/login" replace />; // Redirect to login if not logged in
    }
  }
}


const mapStateToProps = (state)=>{
  const { user={}} =state;
  const { isLoggedIn } = user;
  return {
    isLoggedIn
  }
}

export default connect(mapStateToProps,{
  
})(PrivateRoute);
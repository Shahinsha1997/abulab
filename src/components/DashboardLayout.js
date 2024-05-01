import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser } from '../dispatcher/action';
import Form from './Form';
class DashboardLayout extends Component {
  render() {
    const { logoutUser } = this.props
    return (
        <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr', // Left: 1 fraction, Right: 3 fractions
          minHeight: '100vh'
        }}
      >
       
        <LeftPanel logoutUser={logoutUser}/>
        <RightPanel />
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  return {
    
  }
}

export default connect(mapStateToProps,{
  logoutUser
})(DashboardLayout);


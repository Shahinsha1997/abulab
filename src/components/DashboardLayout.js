import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
class DashboardLayout extends Component {
  render() {
    return (
        <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr', // Left: 1 fraction, Right: 3 fractions
          minHeight: '100vh'
        }}
      >
        <LeftPanel />
        <RightPanel />
      </Box>
      
    );
  }
}

export default DashboardLayout;


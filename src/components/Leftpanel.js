import React, { useState } from 'react';
import { Box, Typography, Tooltip, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
const LeftPanel = ({ 
    logoutUser, 
    isLogoutDisabled,
    handleFormType
  }) => {
    const handleLogoutClick = () => {
      logoutUser()
    };
    const [dateTime, setDateTime] = useState(new Date().toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }));

    const [time, setTime] = useState()
    return (
        <Box sx={{width: { xs: '50px', sm: '100px', md: '200px' }, flexShrink: 0 }}>
        <Box
        sx={{
          width: { xs: '100%' },
          maxWidth: '200px',
          height: '100vh',
          backgroundColor: 'lightblue',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '2px solid black',
          minHeight: '100vh'
        }}
      >
        <Box sx={{ padding: '1rem', textAlign: 'center', height:"25%"}}>
          <Box>
            <Box sx={{display:'flex',flexDirection:'column'}} >
                <img
                  src="./AbuLabLogoHeader.png"
                  alt="Abulab"
                  style={{ maxWidth: '100%', maxHeight: '150px', width:'200px' }}
                />
              <img
                  src="./AbuLabLogoFooter.png"
                  alt="Abulab"
                  style={{ maxWidth: '100%', maxHeight: '150px', width:'200px' }}
                />
              </Box>
            <Typography variant="h6">Abu Laboratory</Typography>
            <Typography variant="body2">[ECG | X-Ray]</Typography>
            <Typography variant="body2">{dateTime}</Typography>
            <Typography variant="body2">{time}</Typography>
          </Box>
        </Box>
  
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: "65%", maxHeight:'65%', overflow:'auto'  }}>
              <Button variant="contained" startIcon={<SettingsIcon />} id="add-income-btn" onClick={()=>handleFormType('settingsPage')}>
                Settings
              </Button>
              
      </Box>
      <Box sx={{ display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tooltip title={isLogoutDisabled ? "Sorry! You are not allowed to logout" : "Logout"}>
                  <Button variant="contained" color="error" disabled={isLogoutDisabled} startIcon={<LogoutIcon />} id="logout-btn" onClick={handleLogoutClick} sx={{ padding: '8px 16px' }}>
                  Logout
                  </Button>
              </Tooltip>
      </Box>
    </Box>
    </Box>
  )}
  
  export default LeftPanel;
  


import React, { useState } from 'react';
import { Box, Typography, Tooltip, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PrintIcon from '@mui/icons-material/Print';
import useMediaQuery from '@mui/material/useMediaQuery'; 
import SyncIcon from '@mui/icons-material/Sync';
import ReactToPrint from 'react-to-print';
import { getLocalStorageData } from '../utils/utils';
const LeftPanel = ({ 
  isAdmin, 
  logoutUser, 
  toggleForm, 
  syncNow, 
  isLogoutDisabled
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)'); // Adjust breakpoint as needed
  const [ adminSection, setAdminSection ] = useState('Hide')
  const [dateTime, setDateTime] = useState();
  setTimeout(()=>{
    let date = new Date();
    date  = date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: '2-digit',
        hour12: true
      });
      setDateTime(date)
  },1000)
  const toggleAdminSection = ()=>{
    setAdminSection(adminSection == 'Show' ? 'Hide' : 'Show')
  }

  const handleAddIncomeClick = () => {
    toggleForm('addIncome')
  };

  const handleAddExpensesClick = () => {
    toggleForm('addExpenses')
  };


  const handlePrintClick = () => {
  };

  const handleLogoutClick = () => {
    logoutUser()
  };

  return (
    <Box
      sx={{
        width: { xs: '100%' },
        maxWidth: '400px',
        height: '100vh',
        backgroundColor: 'lightblue',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid black',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ padding: '1rem', textAlign: 'center', height:"20%" }}>
        <Typography variant="h6">Abu Laboratory</Typography>
        <Typography variant="body2">[ECG | X-Ray]</Typography>
        <Typography variant="body2">{dateTime}</Typography>
        
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: isAdmin ? "40%" : "60%"  }}>
        {isMobile ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="add-income-btn" onClick={handleAddIncomeClick}>
              <AddIcon color="primary" />
              <Typography variant="body2">Add Income</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="add-expenses-btn" onClick={handleAddExpensesClick}>
              <AddIcon color="primary" />
              <Typography variant="body2">Add Expenses</Typography>
            </Box>
            {syncNow ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="add-expenses-btn" onClick={syncNow}>
                <SyncIcon color="primary" />
                <Typography variant="body2">Sync Now</Typography>
              </Box>
            ) : null}
            
          </>
        ) : (
          <>
            <Button variant="contained" startIcon={<AddIcon />} id="add-income-btn" onClick={handleAddIncomeClick} sx={{ padding: '8px 16px'}}>
              Add Income
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} id="add-expenses-btn" onClick={handleAddExpensesClick} sx={{ padding: '8px 16px' }}>
                Add Expenses
            </Button>
          {syncNow ? (
            <Button variant="contained" startIcon={<SyncIcon />} id="add-expenses-btn" onClick={syncNow} sx={{ padding: '8px 16px' }}>
              Sync Now
            </Button>
            ): null}
            
        </>
      )}
    </Box>
    {isAdmin && (
    <Box sx={{height: '20%'}}>
      
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} onClick={toggleAdminSection}>
          <Typography variant="h6">{adminSection} Admin Panel</Typography>
        </Box>
      {adminSection == 'Hide' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Income: Total Income</Typography>
            <Typography variant="body2">{/* Dynamic value */}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Expenses: Total Expenses</Typography>
            <Typography variant="body2">{/* Dynamic value */}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">Outstanding: Total Outstanding</Typography>
          </Box>
        </Box>
        )}
      </Box>
    )}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height:"20%" }}>
        <Box sx={{padding:"20px"}}>
              <Tooltip title="Not Implemented Yet Sorry...">
              {isMobile ? (
                  <IconButton color="primary" id="print-btn" onClick={handlePrintClick}>
                      <PrintIcon />
                  </IconButton>
              ) : (
                  <Button variant="contained" color="primary" startIcon={<PrintIcon />} id="print-btn" onClick={handlePrintClick} sx={{ padding: '8px 16px' }}>
                  Print
                  </Button>
              )}
          </Tooltip>
        </Box>
        <Box sx={{padding:"20px"}} >
            {isMobile ? (
            <Tooltip title={isLogoutDisabled ? "Sorry! You are not allowed to logout" : "Logout"}>
                <IconButton color="error" id="logout-btn" disabled={isLogoutDisabled} onClick={handleLogoutClick}>
                    <LogoutIcon />
                </IconButton>
            </Tooltip>
            ) : (
            <Tooltip title={isLogoutDisabled ? "Sorry! You are not allowed to logout" : "Logout"}>
                <Button variant="contained" color="error" disabled={isLogoutDisabled} startIcon={<LogoutIcon />} id="logout-btn" onClick={handleLogoutClick} sx={{ padding: '8px 16px' }}>
                Logout
                </Button>
            </Tooltip>
            )}
        </Box>
    </Box>
  </Box>
);
};

export default LeftPanel;

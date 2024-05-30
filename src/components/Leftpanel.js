

import React, { useState } from 'react';
import { Box, Typography, Tooltip, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PrintIcon from '@mui/icons-material/Print';
import useMediaQuery from '@mui/material/useMediaQuery'; 
import SyncIcon from '@mui/icons-material/Sync';
import ReactToPrint from 'react-to-print';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { clearCache, getLocalStorageData, printPage } from '../utils/utils';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
const LeftPanel = ({ 
  isAdmin, 
  logoutUser, 
  toggleForm, 
  syncNow, 
  isLogoutDisabled,
  totalIncome,
  totalExpense,
  totalOutstanding,
  patientCount
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)'); // Adjust breakpoint as needed
  const [ adminSection, setAdminSection ] = useState('Show')
  const [dateTime, setDateTime] = useState(new Date().toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }));
  const [time, setTime] = useState()
  setTimeout(()=>{
    let date = new Date();
    date  = date.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: '2-digit',
        hour12: true
      });
      setTime(date)
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
  const handleAddTest = () =>{
    toggleForm('addTests')
  }
  const handleClearCache = ()=>{
    clearCache();
  }

  const handlePrintClick = () => {
  };

  const handleLogoutClick = () => {
    logoutUser()
  };

  return (
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
      <Box sx={{ padding: '1rem', textAlign: 'center', height:"20%" }}>
        <img width="100px" height="100px" src='./AbuLabLogo.png' alt="Abulab" />
        <Typography variant="h6">Abu Laboratory</Typography>
        <Typography variant="body2">[ECG | X-Ray]</Typography>
        <Typography variant="body2">{dateTime}</Typography>
        <Typography variant="body2">{time}</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: "30%", maxHeight:'30%', overflow:'auto'  }}>
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
            <Button variant="contained" startIcon={<AddIcon />} id="add-test-btn" onClick={handleAddTest} sx={{ padding: '8px 16px' }}>
                Add/Edit Test
            </Button>
            <Button variant="contained" startIcon={<NotInterestedIcon />} id="clear-cache-btn" onClick={handleClearCache} sx={{ padding: '8px 16px' }}>
                Clear Cache
            </Button>
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
            <Button variant="contained" startIcon={<AddIcon />} id="add-test-btn" onClick={handleAddTest} sx={{ padding: '8px 16px' }}>
                Add/Edit Test
            </Button>
            <Button variant="contained" startIcon={<NotInterestedIcon />} id="add-expenses-btn" onClick={handleClearCache} sx={{ padding: '8px 16px' }}>
                Clear Cache
            </Button>
          {syncNow ? (
            <Button variant="contained" startIcon={<SyncIcon />} id="add-expenses-btn" onClick={syncNow} sx={{ padding: '8px 16px' }}>
              Sync Now
            </Button>
            ): null}
            
        </>
      )}
    </Box>
    <Box sx={{ height: isAdmin ? '32%' : '40%', width:'100%'}}>
    {isAdmin && (
      <>
       <Button variant="contained" startIcon={<SupervisorAccountIcon />} id="show-hide-admin-btn" onClick={toggleAdminSection} sx={{ padding: '8px 16px' }}>
            {adminSection} Admin Panel
        </Button>
      {adminSection == 'Hide' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight:'80%', marginBottom: 2, marginLeft:2 , overflow:'auto'}}>

         <Box sx={{ display: 'flex',  justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="body1" sx={{fontSize: 18, fontWeight: 'bold',color: 'green'}}>Profit </Typography>
            <Typography variant="body1" sx={{fontSize: 18, fontWeight: 'bold',color: 'green'}}>₹ {totalIncome - totalExpense}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="body1"  sx={{fontSize: 18, fontWeight: 'bold'}}>Income </Typography>
            <Typography variant="body1"  sx={{fontSize: 18, fontWeight: 'bold'}}>₹ {totalIncome}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="body1" sx={{fontSize: 18, fontWeight: 'bold', color: 'red' }}>Expenses </Typography>
            <Typography variant="body1" sx={{fontSize: 18, fontWeight: 'bold', color: 'red' }}>₹ {totalExpense}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="body1"  sx={{fontSize: 18, fontWeight: 'bold'}}>Outstanding </Typography>
            <Box sx={{display:'flex', flexDirection:'row'}}>
              <Typography variant="body1"  sx={{fontSize: 18, fontWeight: 'bold'}}>₹ {totalOutstanding}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="body1"  sx={{fontSize: 18, fontWeight: 'bold'}}>Patient Count</Typography>
            <Box sx={{display:'flex', flexDirection:'row'}}>
              <PersonIcon/>
              <Typography variant="body1"  sx={{fontSize: 18, fontWeight: 'bold'}}>{patientCount}</Typography>
            </Box>
          </Box>
        </Box>
        )}
      </>
    )}
    </Box>
    <Box sx={{ display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'center' }}>
    {isAdmin && (
        <Box sx={{padding:"20px"}}>
              <Tooltip title="Print">
              {isMobile ? (
                  <IconButton color="primary" id="print-btn" onClick={printPage}>
                      <PrintIcon />
                  </IconButton>
              ) : (
                  <Button variant="contained" color="primary" startIcon={<PrintIcon />} id="print-btn" onClick={printPage} sx={{ padding: '8px 16px' }}>
                  Print
                  </Button>
              )}
          </Tooltip>
        </Box>
    )}
        <Box>
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

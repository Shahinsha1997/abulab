

import React, { useState } from 'react';
import { Box, Typography, Tooltip, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import PrintIcon from '@mui/icons-material/Print';
import useMediaQuery from '@mui/material/useMediaQuery'; 
import SyncIcon from '@mui/icons-material/Sync';
import ReactToPrint from 'react-to-print';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { APPOINTMENTS_VIEW, LAB_VIEW, clearCache, getLocalStorageData, printPage } from '../utils/utils';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles'; 
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import EventSharpIcon from '@mui/icons-material/EventSharp';
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
const LeftPanel = ({ 
  isAdmin, 
  logoutUser, 
  toggleForm, 
  syncNow, 
  isLogoutDisabled,
  toggleAdminSection,
  adminSection,
  setPage,
  page
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)'); 
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
  const handleAppointmentsPage = ()=>{
    setPage(page == LAB_VIEW ? APPOINTMENTS_VIEW : LAB_VIEW)
  }

  const handleLogoutClick = () => {
    logoutUser()
  };
  const theme = useTheme();
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
      <Box sx={{ padding: '1rem', textAlign: 'center', height:"25%"}}>
        <Box sx={{display:isMobile? 'none' : ''}}>
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
        {isMobile ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="add-income-btn" onClick={handleAddIncomeClick}>
              <Tooltip
                title={'Add Income'}
                placement="top"
                disableInteractive={theme.breakpoints.down('sm')}
              >
              <AddIcon color="primary" />
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="add-expenses-btn" onClick={handleAddExpensesClick}>
            <Tooltip
                title={'Add Expenses'}
                placement="top"
                disableInteractive={theme.breakpoints.down('sm')}
              >
              <AddIcon color="primary" />
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="add-test-btn" onClick={handleAddTest}>
              <Tooltip
                  title={'Add/Edit Test'}
                  placement="top"
                  disableInteractive={theme.breakpoints.down('sm')}
                >
                <AddIcon color="primary" />
              </Tooltip>
            </Box>
            {isAdmin && (
              <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="add-appointment-btn" onClick={()=>window.open('/appointments','_self')}>
              <Tooltip
                  title={'Add Appointment'}
                  placement="top"
                  disableInteractive={theme.breakpoints.down('sm')}
                >
                <AddIcon color="primary" />
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="sync-now-btn" onClick={handleAppointmentsPage}>
                <Tooltip
                  title={`${page == APPOINTMENTS_VIEW ? 'Hide ' : 'Show ' } Appointments`}
                  placement="top"
                  disableInteractive={theme.breakpoints.down('sm')}
                >
                  {page == APPOINTMENTS_VIEW ? (
                    <EventTwoToneIcon color="primary" />
                 ): (
                   <EventSharpIcon color="primary" />
                  )}
                </Tooltip>
              </Box>
              </>
            )}
            {syncNow ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="sync-now-btn" onClick={syncNow}>
                <Tooltip
                title={'Sync Now'}
                placement="top"
                disableInteractive={theme.breakpoints.down('sm')}
              >
                <SyncIcon color="primary" />
                </Tooltip>
              </Box>
            ) : null}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="clear-cache-btn" onClick={handleClearCache}>
              <Tooltip
                  title={'Clear Cache'}
                  placement="top"
                  disableInteractive={theme.breakpoints.down('sm')}
                >
                <NotInterestedIcon color="primary" />
              </Tooltip>
            </Box>
            {isAdmin && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="clear-cache-btn" onClick={toggleAdminSection}>
              <Tooltip
                  title={'Clear Cache'}
                  placement="top"
                  disableInteractive={theme.breakpoints.down('sm')}
                >
                {adminSection ? (
                  <AdminPanelSettingsTwoToneIcon color="primary" />
                ): (
                  <AdminPanelSettingsIcon color="primary" />
                )}
              </Tooltip>
            </Box>
            )}
          </>
        ) : (
          <>
            <Button variant="contained" startIcon={<AddIcon />} id="add-income-btn" onClick={handleAddIncomeClick}>
              Add Income
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} id="add-expenses-btn" onClick={handleAddExpensesClick}>
                Add Expenses
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} id="add-test-btn" onClick={handleAddTest}>
                Add/Edit Test
            </Button>
            {isAdmin && (
            <>
              <Button variant="contained" startIcon={<AddIcon />} id="add-appoinment-btn" onClick={()=>window.open('/appointments','_self')}>
                  Add Appointment
              </Button>
              <Button variant="contained" startIcon={<EventSharpIcon />} id="show-appoinment-btn" onClick={handleAppointmentsPage}>
                  {`${page == APPOINTMENTS_VIEW ? 'Hide ' : 'Show ' } Appointments`}
              </Button>
            </>
            )}
            {syncNow ? (
            <Button variant="contained" startIcon={<SyncIcon />} id="sync-now-btn" onClick={syncNow} sx={{ padding: '8px 16px',  }}>
              Sync Now
            </Button>
            ): null}
            <Button variant="contained" startIcon={<NotInterestedIcon />} id="clear-cache-btn" onClick={handleClearCache}>
                Clear Cache
            </Button>
            {isAdmin && (
            <Button variant="contained" startIcon={<SupervisorAccountIcon />} id="show-hide-admin-btn" onClick={toggleAdminSection}>
                  {adminSection ? 'Hide' : 'Show'} Admin Panel
            </Button>
            )}
        </>
      )}
    </Box>
    <Box sx={{ display: 'flex', flexDirection:'column', justifyContent: 'space-between', alignItems: 'center' }}>
    {isAdmin && false && (
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

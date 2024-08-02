import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid, List, ListItem, ListItemText, ListItemIcon, LinearProgress, ListItemButton} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import { PersonOutlineOutlined, AccountTreeSharp, GroupAddOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getDeptArr } from '../selectors/moduleselectors';
import EditIcon from '@mui/icons-material/Edit';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
const DepartmentsList = ({
    setFormObj,
    isFormLoading,
    deleteBtn

}) => {
const departments = useSelector(getDeptArr);
const styles = {
    padding:'20px',
    cursor:'pointer',
    '&:hover': {
        backgroundColor: '#f0f0f0', // Adjust background color on hover
    }
}
const disableDept = (id)=>{
  deleteBtn({title:'Disable the Department', message:'Are you sure, you want to disable the department?', confirmFn:()=>{}})
}
return (
    <Container maxWidth="sm">
      {isFormLoading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ):(
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Grid item>
            <List>
              {departments.map(departmentObj =>{
                  const { deptName, id } = departmentObj;
                  return (
                      <ListItem sx={styles} key={id} secondaryAction={
                        <ListItemButton sx={{'&:hover' : {backgroundColor: 'transparent' }}}>
                          <IconButton sx={{ mr: 1, color:'#1400ffa6' }} edge="end" aria-label="edit">
                           <EditIcon onClick={() => setFormObj('departments',id)} />
                          </IconButton>
                          <IconButton sx={{ mr: 1, color:'#ff0000db' }} edge="end" aria-label="delete">
                            <NotInterestedIcon onClick={() => disableDept(id)} />
                          </IconButton>
                        </ListItemButton>
                        }>
                        <ListItemText primary={deptName} />
                      </ListItem>
                  )
              })}
            </List>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default formWrapper(DepartmentsList);
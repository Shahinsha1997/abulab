import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid, List, ListItem, ListItemText, ListItemIcon, LinearProgress, ListItemButton} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import { PersonOutlineOutlined, AccountTreeSharp, GroupAddOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getProfilesArr } from '../selectors/moduleselectors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const ProfilesList = ({
    setFormObj,
    isFormLoading,
    deleteBtn
}) => {
const profiles = useSelector(getProfilesArr);
const styles = {
    padding:'20px',
    cursor:'pointer',
    '&:hover': {
        backgroundColor: '#f0f0f0', // Adjust background color on hover
    }
}

const deleteProfile = (id)=>{
  deleteBtn({title:'Delete the Profile', message:'Are you sure, you want to delete the profile?', confirmFn:()=>{}})
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
              {profiles.map(departmentObj =>{
                  const { profileName, id } = departmentObj;
                  return (
                      <ListItem sx={styles} key={id} secondaryAction={
                        <ListItemButton sx={{'&:hover' : {backgroundColor: 'transparent' }}}>
                          <IconButton sx={{ mr: 1, color:'#1400ffa6' }} edge="end" aria-label="edit">
                           <EditIcon onClick={() => setFormObj('profiles',id)} />
                          </IconButton>
                          <IconButton sx={{ mr: 1, color:'#ff0000db' }} edge="end" aria-label="delete">
                            <DeleteIcon onClick={() =>deleteProfile(id)} />
                          </IconButton>
                        </ListItemButton>
                        }>
                        <ListItemText primary={profileName} />
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

export default formWrapper(ProfilesList);
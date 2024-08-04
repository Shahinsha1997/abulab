import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid, List, ListItem, ListItemText, ListItemIcon, LinearProgress, ListItemButton, ListItemAvatar, Avatar} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import { PersonOutlineOutlined, AccountTreeSharp, GroupAddOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getDeptArr, getSessionsArr } from '../selectors/moduleselectors';
import EditIcon from '@mui/icons-material/Edit';
import DesktopMacRoundedIcon from '@mui/icons-material/DesktopMacRounded';
import LaptopWindowsRoundedIcon from '@mui/icons-material/LaptopWindowsRounded';
import PhoneAndroidRoundedIcon from '@mui/icons-material/PhoneAndroidRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAccessSystemType } from '../utils/utils';
import { deleteSessionAPI } from '../actions/APIActions';
import { deleteData, showAlert } from '../dispatcher/action';
const SessionList = ({
    setFormObj,
    isFormLoading,
    deleteBtn 
}) => {
const dispatch = useDispatch();
const sessions = useSelector(getSessionsArr);
const styles = {
    padding:'20px',
    cursor:'pointer',
    '&:hover': {
        backgroundColor: '#f0f0f0', // Adjust background color on hover
    }
}
const avatar = {
    'Mac OS' : DesktopMacRoundedIcon,
    'Windows':LaptopWindowsRoundedIcon,
    'Linux': LaptopWindowsRoundedIcon,
    'Mobile': PhoneAndroidRoundedIcon
}
const getIconComp = (sysType)=>{
    const Component = avatar[sysType];
    return <Component />
}
const deleteSession = (id)=>{
  deleteBtn({title:'Revoke the Session', message:'Are you sure, you want to revoke the session?', confirmFn:()=>{
    deleteSessionAPI(id).then(res=>{
      dispatch(showAlert({type:'success', message:`Session revoked successfully`}));
      dispatch(deleteData({module:"sessions",id}))
      deleteBtn({title:''})

    }).catch(err=>{console.log(err);dispatch(showAlert({type:'error', message:`Unable to revoke the session`}))})
  }})
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
              {sessions.map(sessionObj =>{
                  const { name, id, userAgent } = sessionObj;
                  const sysType = getAccessSystemType(userAgent);
                  return (
                      <ListItem sx={styles} key={id} secondaryAction={
                        <ListItemButton sx={{'&:hover' : {backgroundColor: 'transparent' }}}>
                          <IconButton sx={{ mr: 1, color:'#ff0000db' }} edge="end" aria-label="delete">
                            <DeleteIcon onClick={()=>deleteSession(id)} />
                          </IconButton>
                        </ListItemButton>
                        }>
                        <ListItemAvatar>
                            <Avatar>{getIconComp(sysType)}</Avatar>
                          </ListItemAvatar>
                        <ListItemText primary={name} secondary={sysType} />
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

export default formWrapper(SessionList);
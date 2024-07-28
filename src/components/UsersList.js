import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid, List, ListItem, ListItemText, ListItemIcon, LinearProgress, ListItemButton, ListItemAvatar, Avatar} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import { PersonOutlineOutlined, AccountTreeSharp, GroupAddOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getUsersArr } from '../selectors/moduleselectors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInitials } from '../utils/utils';
const UsersList = ({
    setFormObj,
    isFormLoading
}) => {
const users = useSelector(getUsersArr);
const styles = {
    padding:'20px',
    cursor:'pointer',
    '&:hover': {
        backgroundColor: '#f0f0f0', // Adjust background color on hover
    }
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
              {users.map(usersObj =>{
                  const { name, id, userName, maxSessionTime, maxSessionLimit, isDisabled } = usersObj;
                  return (
                      <ListItem sx={styles} key={id} secondaryAction={
                        <ListItemButton sx={{'&:hover' : {backgroundColor: 'transparent' }}}>
                          <IconButton sx={{ mr: 1, color:'#1400ffa6' }} edge="end" aria-label="edit">
                           <EditIcon onClick={() => setFormObj('users',id)} />
                          </IconButton>
                          <IconButton sx={{ mr: 1, color:'#ff0000db' }} edge="end" aria-label="delete">
                            <DeleteIcon onClick={() => {}} />
                          </IconButton>
                        </ListItemButton>
                        }>
                          <ListItemAvatar>
                            <Avatar>{getInitials(name)}</Avatar>
                          </ListItemAvatar>
                        <ListItemText primary={name} secondary={userName} />
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

export default formWrapper(UsersList);
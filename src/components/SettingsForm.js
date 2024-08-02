import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid, List, ListItem, ListItemText, ListItemIcon, ListItemButton} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import { PersonOutlineOutlined, AccountTreeSharp, GroupAddOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
const SettingsPopup = ({
    setFormObj
}) => {
const styles = {
    padding:'20px',
    cursor:'pointer',
    '&:hover': {
        backgroundColor: '#f0f0f0', // Adjust background color on hover
    },
}
const listItems = {
  'users' : {
    icon: <PersonOutlineOutlined />,
    id: 'users',
    name: 'Users'
  },
  'departments' : {
    icon: <AccountTreeSharp />,
    id: 'departments',
    name: 'Departments'
  },
  'profiles' : {
    icon: <GroupAddOutlined />,
    id: 'profiles',
    name: 'Profiles'
  },
  'sessions' : {
    icon: <ManageAccountsRoundedIcon />,
    id: 'sessions',
    name: 'Sessions',
    isAddNeeded:false
  },
}

return (
    <Container maxWidth="sm">
      <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Grid item>
          <List>
            {Object.values(listItems).map(item=>{
              const { icon, id, name, isAddNeeded=true } = item;
              return (
                <ListItem sx={styles} key={id} secondaryAction={
                  isAddNeeded ? (
                  <ListItemButton sx={{'&:hover' : {backgroundColor: 'transparent' }}}>
                    <IconButton sx={{ mr: 1, color:'#4300ffa6' }} edge="end" aria-label="Add">
                     <AddIcon onClick={(e) => {
                      e.stopPropagation();
                      setFormObj(id,'add')}
                      } />
                    </IconButton>
                  </ListItemButton> ) :null
                  }  onClick={()=>setFormObj(id)}>
                    <ListItemIcon>
                      {icon}
                    </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              )
            })}
          </List>
        </Grid>
      </Grid>
    </Container>
  );
}

export default formWrapper(SettingsPopup);
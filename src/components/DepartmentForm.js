import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid, List, ListItem, ListItemText, ListItemIcon, LinearProgress, ListItemButton, FormControlLabel, Switch} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import { PersonOutlineOutlined, AccountTreeSharp, GroupAddOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getDepartments, getProfilesArr } from '../selectors/moduleselectors';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const DepartmentForm = ({
    setFormObj,
    id
}) => {
const departments = useSelector(getDepartments);
const [formObj, setDeptFormObj] = React.useState(id == 'add' ? {} : departments[id])
const handleInput = (e, value)=>{
    const { id, value:val, type } = e.target;
    setDeptFormObj({...formObj, [id]:type == 'checkbox' ? !value : val})
}
const { deptName, isDisabled } = formObj;
return (
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item sx={{padding:'20px'}}>
            <TextField
                  id="deptName"
                  label="Department Name"
                  variant="outlined"
                  autoComplete="off"
                  placeholder={"Enter the Department Name"}
                  onChange={handleInput}
                  value={deptName}
                  fullWidth
                />
            </Grid>
        <Grid item>
            <FormControlLabel labelPlacement="start" control={<Switch edge="end" id="isDisabled" checked={!isDisabled} onChange={handleInput} />} label="Department Enabled" />
        </Grid>
        </Grid>
    </Container>
  );
}

export default formWrapper(DepartmentForm);
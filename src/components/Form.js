import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
const statuses = [
  { value: 'income', label: 'Income' },
  { value: 'expenses', label: 'Expenses' },
];

const Form = () => {
  const [state, setState] = React.useState({
    open: false,
    patientId: '',
    name: '',
    mobileNumber: '',
    status: '',
    totalAmount: '',
    paidAmount: '',
    dueAmount: '',
  });

  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(state);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, open });
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={true}
      >
        <Box sx={{width:"350px"}}>
        <List dense={true}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="close" onClick={toggleDrawer(false)}>
                      <CloseIcon/>
                    </IconButton>
                  }
                >
                    <Typography gutterBottom variant="h5" component="div">
                     Income Form
                    </Typography>
                </ListItem>
            </List>
        <Box component="form" onSubmit={handleSubmit} sx={{display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px'}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ paddingRight: 1, fontWeight: 'bold' }}>AT-</Box>
                <TextField
                    label="Patient ID"
                    name="patientId"
                    value={state.name}
                    onChange={handleInputChange}
                    required
                    fullWidth
                />
                </Box>
            </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Name" name="name" value={state.name} onChange={handleInputChange} required fullWidth={isMobile} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Mobile Number" name="mobileNumber" value={state.mobileNumber} onChange={handleInputChange} required fullWidth={isMobile} />
          </Box>
          {/* Status dropdown with its own container */}
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField
              select
              labelId="status-label"
              id="status"
              value={state.status}
              label="Status"
              onChange={handleInputChange}
              fullWidth={isMobile}
            >
              {statuses.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Total Amount" name="totalAmount" value={state.totalAmount} onChange={handleInputChange} required fullWidth={isMobile} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Paid Amount" name="paidAmount" value={state.paidAmount} onChange={handleInputChange} required fullWidth={isMobile} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Due Amount" name="dueAmount" value={state.dueAmount} onChange={handleInputChange} disabled fullWidth={isMobile} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }}>
                Submit
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <Button type="submit" variant="contained" color="error" sx={{ padding:'10px', width: '100%' }}>
                Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Form;

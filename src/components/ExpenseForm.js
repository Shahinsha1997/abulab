import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { Alert, Container, Grid } from '@mui/material';


const IncomeForm = ({
    handleInputChange, 
    getIdPrefix, 
    state,
    isMobile,
    toggleDrawer,
    handleSubmit,
    errState={}
}) => {
const { patientId, name, mobileNumber, description, drName, status, totalAmount, paidAmount } = state;
const { name: nameError, description: descriptionErr, mobileNumber: mobileNumberErr, drName: drNameErr, totalAmount: totalAmountErr, paidAmount: paidAmountErr } = errState;
return(
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{display:'flex', flexDirection:'column'}}>
            <Grid item>
                <TextField label="Name" name="name" value={name} onChange={handleInputChange} required fullWidth />
                {nameError && <Alert severity="error">{nameError}</Alert>}
            </Grid>
            <Grid item>
                <TextField label="Description" name="description" value={description} onChange={handleInputChange} required fullWidth />
            </Grid>
            <Grid item>
                <TextField label="Total Amount" name="totalAmount" value={totalAmount} onChange={handleInputChange} required fullWidth />
                {totalAmountErr && <Alert severity="error">{totalAmountErr}</Alert>}
            </Grid>
            <Grid item>
                <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }} onClick={handleSubmit}>
                    Submit
                </Button>
            </Grid>
            <Grid item>
                <Button type="submit" variant="contained" color="error" sx={{ padding:'10px', width: '100%' }} onClick={toggleDrawer(false)}>
                    Cancel
                </Button>
            </Grid>
        </Grid>
    </Container>
    )
}



export default IncomeForm;
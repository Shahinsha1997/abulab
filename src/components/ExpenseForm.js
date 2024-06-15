import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Container, Grid, InputAdornment } from '@mui/material';
import { FormControlLabel, Checkbox } from '@mui/material';

const ExpenseForm = ({
    handleInputChange, 
    getIdPrefix, 
    state,
    isMobile,
    toggleDrawer,
    handleSubmit,
    errState={},
    isAdmin
}) => {
const { patientId, name, mobileNumber, description, drName, status, totalAmount, paidAmount, adminVisibilty } = state;
const { name: nameError, description: descriptionErr, mobileNumber: mobileNumberErr, drName: drNameErr, totalAmount: totalAmountErr, paidAmount: paidAmountErr } = errState;
const checkBox = adminVisibilty ? {checked:true} : {}
return(
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{display:'flex', flexDirection:'column'}}>
            <Grid item>
                <TextField label="Name" name="name" value={name} onChange={handleInputChange} required fullWidth />
                {nameError && <Alert severity="error">{nameError}</Alert>}
            </Grid>
            <Grid item>
                <TextField label="Description" name="description" value={description} onChange={handleInputChange} fullWidth />
            </Grid>
            {isAdmin ? (
                <Grid item>
                <FormControlLabel
                    control={<Checkbox name='adminVisibilty' checked={adminVisibilty} onChange={handleInputChange} />}
                    label="Visibility to Only Admin"
                    />
                </Grid>
            ) : null}
            <Grid item>
                <TextField 
                    label="Total Amount" 
                    name="totalAmount" 
                    value={totalAmount} 
                    onChange={handleInputChange} 
                    fullWidth  
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                    }}
                />
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



export default ExpenseForm;
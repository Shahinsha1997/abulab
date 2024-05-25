import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import { Autocomplete } from '@mui/material';

const IncomeForm = ({
    handleInputChange, 
    getIdPrefix, 
    state,
    isMobile,
    toggleDrawer,
    handleSubmit,
    errState={},
    isAdmin,
    isAddForm,
    drNamesList
}) => {
const { patientId, name, mobileNumber, description, drName, totalAmount, paidAmount, comments } = state;
const { name: nameError, description: descriptionErr, mobileNumber: mobileNumberErr, drName: drNameErr, totalAmount: totalAmountErr, paidAmount: paidAmountErr } = errState;
const isFieldDisabled = !(isAddForm || isAdmin)
return(
    <>
        <Box component="form" sx={{display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px'}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ paddingRight: 1, fontWeight: 'bold' }}>{getIdPrefix()}</Box>
            <TextField
                label="Patient ID"
                name="patientId"
                value={patientId}
                onChange={handleInputChange}
                required
                fullWidth
            />
            </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Name" name="name" value={name} onChange={handleInputChange} disabled={isFieldDisabled} required fullWidth={isMobile} />
            {nameError && <Alert severity="error">{nameError}</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Mobile Number" name="mobileNumber" value={mobileNumber} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth={isMobile} />
            {mobileNumberErr && <Alert severity="error">{mobileNumberErr}</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <Autocomplete
                value={drName}
                id={'drName'}
                name="drName"
                options={drNamesList || []}
                fullWidth={isMobile}
                onChange={handleInputChange}
                renderInput={(params) => <TextField {...params} name="drName" sx={{width:'100%'}} onChange={handleInputChange} label="Doctor Name" fullWidth={isMobile} />}
                />
            {/* <TextField label="Doctor Name" name="drName" value={drName} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth={isMobile} /> */}
            {drNameErr && <Alert severity="error">{drNameErr}</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Description" name="description" value={description} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth={isMobile} />
            {descriptionErr && <Alert severity="error">{descriptionErr}</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Total Amount" name="totalAmount" value={totalAmount} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth={isMobile} />
            {totalAmountErr && <Alert severity="error">{totalAmountErr}</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Paid Amount" name="paidAmount" value={paidAmount} onChange={handleInputChange} required fullWidth={isMobile} />
            {paidAmountErr && <Alert severity="error">{paidAmountErr}</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Due Amount" name="dueAmount" value={totalAmount-paidAmount} onChange={handleInputChange} disabled fullWidth={isMobile} />
            {totalAmount-paidAmount < 0 && <Alert severity="error">Due amount is less than 0</Alert>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <TextField label="Comments / Remarks" name="comments" value={comments} onChange={handleInputChange} fullWidth={isMobile} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }} onClick={handleSubmit}>
                Submit
            </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, padding:'10px' }}>
            <Button type="submit" variant="contained" color="error" sx={{ padding:'10px', width: '100%' }} onClick={toggleDrawer(false)}>
                Cancel
            </Button>
        </Box>
    </>
    )
}



export default IncomeForm;
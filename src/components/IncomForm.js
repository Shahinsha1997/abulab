import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import { PREFIX_NAMES_LIST } from '../utils/utils';
import { Autocomplete, TextField, Chip, Container, Grid, InputAdornment } from '@mui/material';
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
    drNamesList,
    testObj,
    handleTest
}) => {
const { patientId, name, mobileNumber, discount=0, description,testsArr, drName, totalAmount, paidAmount, comments, namePrefix } = state;
const { name: nameError, description: descriptionErr, mobileNumber: mobileNumberErr, drName: drNameErr, totalAmount: totalAmountErr, paidAmount: paidAmountErr } = errState;
const isFieldDisabled = !(isAddForm || isAdmin)
const dueAmount = (totalAmount-discount-paidAmount)
return(
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{display:'flex', flexDirection:'column'}}>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Patient ID"
                    name="patientId"
                    value={patientId}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">{getIdPrefix()}</InputAdornment>,
                      }}
                />
            </Grid>
            <Grid item>
                <Box sx={{display:'flex'}}>
                <Select value={namePrefix} name="namePrefix" onChange={(e)=>handleInputChange(e)}>
                    {PREFIX_NAMES_LIST.map(prefix=>
                        <MenuItem value={prefix}>{prefix}</MenuItem>
                    )}
                </Select>
                <TextField 
                    label="Name" 
                    name="name" 
                    value={name} 
                    onChange={handleInputChange} 
                    disabled={isFieldDisabled} 
                    required 
                    fullWidth
                />
                </Box>
                {nameError && <Alert severity="error">{nameError}</Alert>}
            </Grid>
            <Grid item>
                <TextField label="Mobile Number" name="mobileNumber" value={mobileNumber} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth />
                {mobileNumberErr && <Alert severity="error">{mobileNumberErr}</Alert>}
            </Grid>
            <Grid item>
                <Autocomplete
                    value={drName} 
                    disabled={isFieldDisabled}
                    id={'drName'}
                    name="drName"
                    options={drNamesList || []}
                    fullWidth
                    onChange={handleInputChange}
                    renderInput={(params) => <TextField {...params} name="drName" sx={{width:'100%'}} onChange={handleInputChange} label="Doctor Name" fullWidth />}
                    />
                {/* <TextField label="Doctor Name" name="drName" value={drName} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth /> */}
                {drNameErr && <Alert severity="error">{drNameErr}</Alert>}
            </Grid>
            <Grid item>
                    <Autocomplete
                        multiple
                        disabled={isFieldDisabled}
                        value={testsArr}
                        onChange={handleTest}
                        options={Object.values(testObj)}
                        noOptionsText={Object.values(testObj).length > 0 ? 'No Result Found' : 'Please add atleast one test from Add/Edit Test Option'}
                        getOptionLabel={(option) => option && `${option.testName} | ₹ ${option.testAmount}` || ''}
                        getOptionKey={(option) => option && option.testId || ''}
                        renderTags={(value, getTagProps) => value.map((option, index) => (
                            <Chip key={option.testId} label={`${option.testName} | ₹ ${option.testAmount}`} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Select Tests" placeholder="Search..." />
                        )}
                    />
                {/* <TextField label="Description" name="description" value={description} disabled={isFieldDisabled} onChange={handleInputChange} required fullWidth /> */}
                {descriptionErr && <Alert severity="error">{descriptionErr}</Alert>}
            </Grid>
            <Grid item>
                <TextField 
                    sx={{width:'60%'}} 
                    label="Total Amount" 
                    name="totalAmount" 
                    value={totalAmount} 
                    disabled={isFieldDisabled} 
                    onChange={handleInputChange} 
                    required 
                    fullWidth 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                    }}
                />
                <TextField 
                    sx={{width:'40%'}} 
                    label="Discount" 
                    name="discount" 
                    value={discount} 
                    onChange={handleInputChange} 
                    required 
                    fullWidth 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                    }}
                />
                {totalAmountErr && <Alert severity="error">{totalAmountErr}</Alert>}
            </Grid>
            <Grid item>
                <TextField 
                    label="Paid Amount" 
                    name="paidAmount" 
                    value={paidAmount} 
                    onChange={handleInputChange} 
                    required 
                    fullWidth 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                    }}
                />
                {paidAmountErr && <Alert severity="error">{paidAmountErr}</Alert>}
            </Grid>
            <Grid item>
                <TextField 
                    label="Due Amount" 
                    name="dueAmount" 
                    value={dueAmount} 
                    onChange={handleInputChange} 
                    disabled 
                    fullWidth 
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                    }}
                />
                {(dueAmount) < 0 && <Alert severity="error">Due amount is less than 0</Alert>}
            </Grid>
            <Grid item>
                <TextField label="Comments / Remarks" name="comments" value={comments} onChange={handleInputChange} fullWidth />
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
)}



export default IncomeForm;
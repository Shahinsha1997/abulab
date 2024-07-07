import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import { APPOINTMENTS_VIEW, EXPENSE_LABEL, INCOME_LABEL, OUTSTANDING_LABEL, PREFIX_NAMES_LIST, getAmountVal, getAsObj, getDetailViewIds, getEditedFormProperties, getIdPrefix, getLocalStorageData, getProperId, getStatus, isFormErrorFound, setLocalStorageData } from '../utils/utils';
import { Autocomplete, TextField, Chip, Container, Grid, InputAdornment, IconButton, useMediaQuery } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import formWrapper from './FormDrawerWrapper';
const DetailView = ({ 
    toggleForm,
    drNamesList,
    testObj,
    testArr,
    id,
    setDetailViewId,
    isAdmin,
    dataIds,
    nextRecord,
    prevRecord
}) => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    id = parseInt(id)
    const handleEdit = ()=>{
        setDetailViewId('')
        toggleForm((dataIds[id].uuid || '').toString())
    }
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
          nextRecord();
        } else if (event.key === 'ArrowLeft') { 
          prevRecord();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }); 
    const handleClose = ()=>{
        setDetailViewId('')
    }
    const initialState = ({...{
        open: false,
        name: '',
        mobileNumber: '',
        description:'',
        testsArr:[],
        drName:'',
        discount:0,
        totalAmount: '0',
        paidAmount: '0',
        comments: '',
        namePrefix: 'Mrs.',
        status:INCOME_LABEL,
        uuid:''
        }, ...(getEditedFormProperties(dataIds[id],testObj))})

    const { patientId, name, mobileNumber, discount=0, description,testsArr, drName, totalAmount, paidAmount, comments, namePrefix, status } = initialState;
    const dueAmount = (totalAmount-discount-paidAmount)
    return(
        <Container>
            <Grid container sx={{display:'flex', flexDirection:'row'}}>
                {/* <Grid item alignItems={'center'}  sx={{ padding:1, display: 'flex', justifyContent: 'center', height:'100vh' }}>
                    <IconButton  onClick={prevId !== '' && goToPrev}>
                    {(prevId !== '') && (
                        <ArrowBackIosNewIcon/>
                    )}
                    </IconButton>
                </Grid> */}
                {/* <Grid item> */}
                <Grid container spacing={2} sx={{display:'flex', flexDirection:'column', width:isMobile ? '100wh' :'500px'}}>
                    <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            label="Patient ID"
                            name="patientId"
                            value={patientId}
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{getIdPrefix()}</InputAdornment>,
                                readOnly:true
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Box sx={{display:'flex'}}>
                        <Select value={namePrefix} name="namePrefix">
                            {PREFIX_NAMES_LIST.map(prefix=>
                                <MenuItem value={prefix}>{prefix}</MenuItem>
                            )}
                        </Select>
                        <TextField 
                            label="Name" 
                            name="name" 
                            value={name} 
                            required 
                            fullWidth
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        </Box>
                    </Grid>
                    <Grid item>
                        <TextField 
                            label="Mobile Number" 
                            name="mobileNumber" 
                            value={mobileNumber} 
                            inputProps={{
                                maxLength: 10,
                                readOnly:true
                            }}
                            fullWidth 
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            value={drName} 
                            id={'drName'}
                            name="drName"
                            options={drNamesList || []}
                            fullWidth
                            readOnly
                            renderInput={(params) =>
                                <TextField 
                                    inputProps={{
                                        readOnly:true
                                    }} 
                                    {...params} 
                                    name="drName" 
                                    sx={{width:'100%'}} 
                                    label="Doctor Name"
                                    fullWidth 
                                />
                            }
                            />
                    </Grid>
                    <Grid item>
                            <Autocomplete
                                multiple
                                value={testsArr}
                                options={Object.values(testArr)}
                                noOptionsText={Object.values(testArr).length > 0 ? 'No Result Found' : 'Please add atleast one test from Add/Edit Test Option'}
                                getOptionLabel={(option) => option && `${option.testName} | ₹ ${option.testAmount}` || ''}
                                getOptionKey={(option) => option && option.testId || ''}
                                renderTags={(value, getTagProps) => value.map((option, index) => (
                                    <Chip key={option.testId} label={`${option.testName} | ₹ ${option.testAmount}`} {...getTagProps({ index })} />
                                    ))
                                }
                                readOnly
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Select Tests" 
                                        disabled
                                    />
                                )}
                            />
                    </Grid>
                    <Grid item>
                        <TextField 
                            sx={{width:'60%'}} 
                            label="Total Amount" 
                            name="totalAmount" 
                            value={totalAmount} 
                            required 
                            fullWidth 
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                                readOnly:true
                            }}
                        />
                        <TextField 
                            sx={{width:'40%'}} 
                            label="Discount" 
                            name="discount" 
                            value={discount} 
                            required 
                            fullWidth 
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                                readOnly:true
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField 
                            label="Paid Amount" 
                            name="paidAmount" 
                            value={paidAmount} 
                            required 
                            fullWidth 
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                                readOnly:true
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField 
                            label="Due Amount" 
                            name="dueAmount" 
                            value={dueAmount} 
                            disabled 
                            fullWidth 
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹ </InputAdornment>,
                                readOnly:true
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField 
                            label="Comments / Remarks" 
                            name="comments" 
                            value={comments} 
                            InputProps={{
                                readOnly:true
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item>
                    {(status == OUTSTANDING_LABEL || isAdmin) && (
                        <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }} onClick={handleEdit}>
                            Edit
                        </Button>
                    )}
                    </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" color="error" sx={{ padding:'10px', width: '100%' }} onClick={handleClose}>
                            Close
                        </Button>
                    </Grid>
                </Grid>
                {/* </Grid> */}
                {/* <Grid item alignItems={'center'}  sx={{ padding:1, display: 'flex', justifyContent: 'center',height:'100vh' }}>
                   {nextId !=='' && (
                    <IconButton onClick={goToNext}>
                        <ArrowForwardIosIcon/>
                    </IconButton>
                   )}
                </Grid> */}
            </Grid>
        </Container>
)}



export default formWrapper(DetailView);
import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, Button, TableHead, TableBody, TableRow, Paper, TextField, IconButton, InputAdornment, Autocomplete, useMediaQuery, Tooltip } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import Form from './Form';
import { APPOINTMENTS_VIEW, EXPENSE_LABEL, LIST_VIEW, getAsObj, getCurrentMonth, getDatasByProfit, getDetailViewIds, getFormFields, getIdPrefix, getLocalStorageData, getTimeFilter, selectn, setLocalStorageData } from '../utils/utils';
import PrintableList from './PrintableList';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AdminDashBoard from './AdminDashboard'
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { useTheme } from '@mui/material/styles'; 
import FilterPopup from './FilterPopup';
import PrintableCard from './PrintableCard';
import DetailView from './DetailView';
const RightPanel = ({ 
  isFormVisible=true, 
  addData, 
  formType, 
  toggleForm, 
  data, 
  dataIds=[], 
  multiAdd,
  previousId:previousID,
  applyFilters,
  isAdmin,
  tableColumns,
  filterObj,
  showAlert,
  setPreviousId,
  setSyncStatus,
  drNamesList,
  testObj,
  testArr,
  multiTestAdd,
  adminSection,
  allDataIds=[],
  isFetching,
  page,
  dueWithMobile,
  isListHide,
  setListHide,
  toggleFilterPopup,
  filterPopup,
  viewType,
  patientIdObj,
  deleteData,
  reportObj,
  reportDetails
}) => {
  const actions = [
    { icon: <AddIcon />, name: 'Test', type:'addTests' },
    { icon: <AddIcon />, name: 'Report', type:'addReports' },
    { icon: <AddIcon />, name: 'Expense', type:'addExpense' },
    { icon: <AddIcon />, name: 'Income', type:'addIncome'}
  ];
  const isMobile = useMediaQuery('(max-width: 600px)');
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (e) => {
    setOpen(false);
  }
  const handleBlockUser = (uuid)=>{
    const userData = data[uuid];
    const localStorageKey = 'updatePendingDatas'
    const addPending = getLocalStorageData(localStorageKey,'[]');
    userData.isBlockedUser = !userData.isBlockedUser
    userData.isScheduled = true;
    addPending.splice(0,0,userData)
    setLocalStorageData(localStorageKey, addPending);
    addData({data: getAsObj([userData])});
    setSyncStatus(true);
    setTimeout(()=>setSyncStatus(false),1)
    showAlert({type: 'success', message:"Datas Queued for Block Update successfully"})
  }
    const [timeFilter, setTimeFilter] = useState('MonthWise')
    const [typeFilter, setTypeFilter] = useState('All')
    const [showDoctorInput, setShowDoctorInput] = useState(false);
    const [timeInput, setTimeInput] = useState(getCurrentMonth())
    const [docInput, setDocInput] = useState('')
    const [detailViewId, setDetailViewId] = useState('')
    const handleDetailViewId = (id, isIndex=true)=>{
      if(isIndex){
        return setDetailViewId(id === '' ? '' : parseInt(id));
      }
      for(let i=0;i<dataIds.length;i++){
        if(dataIds[i].uuid == id){
          return setDetailViewId(i);
        }
      }
    }
    const handleTimeFilter = (e)=>{
        setTimeFilter(e.target.value)
        setTimeInput('')
    }
    const handleTypeFilter = (e)=>{
        const type = e.target.value;
        setTypeFilter(type)
        setShowDoctorInput(type === 'Doctor');
        setDocInput('')
    }
    const handleInput = (e, value) =>{
      if(e.target.id == 'timeFilterInput'){
        setTimeInput(e.target.value)
      }else{
        setDocInput(value || e.target.value)
      }
    }

    const handleFilterSubmit = ()=>{
      setListHide(true)
      applyFilters({
        timeFilter, 
        typeFilter, 
        timeInput, 
        docInput
      })
    }
    const getPlaceholder = () => {
        switch (timeFilter) {
          case 'DayWise':
            return 'DD/MM/YYYY';
          case 'MonthWise':
            return 'MM/YYYY';
          case 'YearWise':
            return 'YYYY';
          default:
            return '';
        }
      };
    return (
      <Box sx={{flexGrow:1, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            minHeight: isMobile ? '90vh' : '100vh',
            backgroundColor: 'lightblue',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid black',
            position: 'relative'
          }}
        >
          { isFormVisible ? (
          <Form 
            addData={addData} 
            showAlert={showAlert} 
            toggleForm={toggleForm} 
            formType={formType} 
            previousID={parseInt(previousID || '0')}
            setPreviousId={setPreviousId}
            setSyncStatus={setSyncStatus}
            data={data}
            isAdmin={isAdmin}
            drNamesList={drNamesList}
            testObj={testObj}
            multiTestAdd={multiTestAdd}
            testArr={testArr}
            reportObj={reportObj}
            reportDetails={reportDetails}
            page={page}
            dueWithMobile={dueWithMobile}
            patientIdObj={patientIdObj}
            setDetailViewId={handleDetailViewId}
          />
        ): null}
        {filterPopup ? (
          <FilterPopup 
              handleTimeFilter={handleTimeFilter}
              getPlaceholder={getPlaceholder}
              handleInput={handleInput}
              handleTypeFilter={handleTypeFilter}
              timeFilter={timeFilter}
              typeFilter={typeFilter}
              timeInput={timeInput}
              docInput={docInput}
              drNamesList={drNamesList}
              showDoctorInput={showDoctorInput}
              isMobile={isMobile}
              title={'Filters'}
              toggleForm={toggleFilterPopup}
              isAdmin={isAdmin}
              handleFilterSubmit={handleFilterSubmit}
          />
        ): null}
        {detailViewId !== '' ? (
          <DetailView
           id={detailViewId}
           toggleForm={toggleForm}
           drNamesList={drNamesList}
           testObj={testObj}
           testArr={testArr}
           nextRecord={()=>handleDetailViewId(getDetailViewIds({type:'next',dataIds,id:detailViewId}))}
           prevRecord={()=>handleDetailViewId(getDetailViewIds({type:'prev',dataIds,id:detailViewId}))}
           title={getIdPrefix()+selectn(`${detailViewId}.patientId`,dataIds)}
           formWidth= {isMobile ? '100wh' : '600px'}
           setDetailViewId={handleDetailViewId}
           closePopup={handleDetailViewId}
           dataIds={dataIds}
           isAdmin={isAdmin}
           />
        ): null}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height:'200px' }}>
              {!isMobile ? (
                <Box sx={{ flexGrow: 0, display: 'flex', padding: '1rem', alignItems:'center' }}>
                <FormControl sx={{ minWidth: isMobile ? 0 : 120 }}>
                <InputLabel id="filter1-label">Time Frame</InputLabel>
                <Select
                    labelId="filter1-label"
                    id="filter1-select"
                    value={timeFilter}
                    label="Time Frame"
                    onChange={handleTimeFilter}
                    IconProps={{ color: 'inherit' }}
                    sx={{fontSize: 'inherit', height:isMobile ? '40px' : 'inherit', width:isMobile ? '100px': 'inherit'}}
                >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="DayWise">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} />
                        <Typography variant="body2">Day Wise</Typography>
                    </Box>
                    </MenuItem>
                    <MenuItem value="MonthWise">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} />
                        <Typography variant="body2">Month Wise</Typography>
                    </Box>
                    </MenuItem>
                    <MenuItem value="YearWise">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarBorderOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} />
                        <Typography variant="body2">Year Wise</Typography>
                    </Box>
                    </MenuItem>
                </Select>
                </FormControl>
                <Box sx={{padding:isMobile ? '0' : "0 20px"}}>
                <TextField
                  id="timeFilterInput"
                  label="Date/Period"
                  variant="outlined"
                  autoComplete="off"
                  placeholder={getPlaceholder()}
                  disabled={timeFilter === 'All'} 
                  sx={{ display: timeFilter != 'All' ? 'block' : 'none' }}
                  onChange={handleInput}
                  value={timeInput}
                  InputProps={{
                      endAdornment: (
                      <InputAdornment position="end">
                          <IconButton>
                          </IconButton>
                      </InputAdornment>
                      ),
                  }}
                />
                </Box>
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="filter2-label">Type Filter</InputLabel>
                <Select
                labelId="filter2-label"
                id="filter2-select"
                value={typeFilter}
                label="Type Filter"
                onChange={handleTypeFilter}
                IconProps={{ color: 'inherit' }}
                sx={{fontSize: 'inherit', height:isMobile ? '40px' : 'inherit', width:isMobile ? '100px': 'inherit'}}
                >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Income">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceWalletOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} />
                    <Typography variant="body2">Income</Typography>
                    </Box>
                </MenuItem>
                <MenuItem value="Expense">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MoneyOffOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} />
                    <Typography variant="body2">Expense</Typography>
                    </Box>
                </MenuItem>
                <MenuItem value="Outstanding">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarBorderOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} color="warning.main" /> {/* Set outstanding icon color */}
                    <Typography variant="body2">Outstanding</Typography>
                    </Box>
                </MenuItem>
                <MenuItem value="Doctor">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StarBorderOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} color="primary.main" /> {/* Set doctor icon color */}
                    <Typography variant="body2">Doctor</Typography>
                    </Box>
                </MenuItem>
                <MenuItem value="profit" sx={{ display: isAdmin ? 'flex': 'none'}}>
                  <Box sx={{ display : 'flex', alignItems: 'center' }}>
                  <StarBorderOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} color="warning.main" /> {/* Set outstanding icon color */}
                  <Typography variant="body2">Profit</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="profitByDoc" sx={{ display: isAdmin ? 'flex': 'none'}}>
                    <Box sx={{ display : 'flex', alignItems: 'center' }}>
                    <StarBorderOutlined fontSize="small" sx={{ marginRight: '0.5rem' }} color="primary.main" /> {/* Set doctor icon color */}
                    <Typography variant="body2">Profit by Doctor</Typography>
                    </Box>
                </MenuItem>
                </Select>
            </FormControl>

            <Box sx={{padding:isMobile ? '0' : "0 20px"}}>
            <Autocomplete
                value={docInput}
                id={'docFilterInput'}
                options={drNamesList || []}
                onChange={handleInput}
                renderInput={(params) => 
                  <TextField
                    {...params}
                    label="Doctor Name"
                    variant="outlined"
                    placeholder="Search Doctor"
                    id="docFilterInput"
                    onChange={handleInput}
                    disabled={!showDoctorInput}
                    autoComplete="off"
                    sx={{ display: showDoctorInput ? 'block' : 'none', 'width': '200px' }}
                />
            }
                />
            </Box>
            <Button variant="contained" startIcon={<FilterAltIcon />} onClick={handleFilterSubmit}>
                Filter Results
            </Button>
            </Box>
              ) : null}
            {!isListHide ? (
              <Box sx={{ flexDirection: 'column', flexGrow: 1, overflow:'auto', backgroundColor:'#252b38', width:'100%'}}>
              {adminSection ? (
                <Box sx={{ width:isMobile ? '100vw' : 'calc(100vw - 180px)', border:'2px solid black'}}>
                  <AdminDashBoard 
                    allDataIds={allDataIds} 
                    data={data}
                    filterObj={filterObj}
                    isAdmin={isAdmin}
                  />
                </Box>
              ): (
                (isMobile && viewType == LIST_VIEW && page != APPOINTMENTS_VIEW) ? (
                  <PrintableCard 
                    isFetching={isFetching} 
                    setDetailViewId={handleDetailViewId} 
                    tableColumns={tableColumns} 
                    isAdmin={isAdmin} 
                    tableData={dataIds} 
                    filterObj={filterObj} 
                    toggleForm={toggleForm}
                    deleteData={deleteData} 
                    handleBlockUser={handleBlockUser}
                  />
                ) : (
                  <PrintableList 
                    deleteData={deleteData} 
                    isFetching={isFetching} 
                    setDetailViewId={handleDetailViewId} 
                    tableColumns={tableColumns} 
                    isAdmin={isAdmin} 
                    tableData={dataIds} 
                    filterObj={filterObj} 
                    toggleForm={toggleForm}
                    handleBlockUser={handleBlockUser}
                  />
                )
                
              )}
              
            </Box>
            ) : null}
            {isMobile ? null : (
              <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'absolute', bottom: 50, right: 50 }}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={()=>{
                      handleClose();
                      toggleForm(action.type)
                    }}
                  />
                ))}
              </SpeedDial>
            )}
              
          </Box>
        </Box>
        </Box>
      );
};

export default RightPanel;
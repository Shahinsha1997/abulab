import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, Button, TableHead, TableBody, TableRow, Paper, TextField, IconButton, InputAdornment } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import Form from './Form';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const RightPanel = ({ isFormVisible=true}) => {
    const tableData = [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        // ... more data objects
      ];
      
      const tableColumns = [
        { id: 'id', label: 'ID' },
        { id: 'name', label: 'Name' },
        { id: 'value', label: 'Value' },
      ];
    const [timeFilter, setTimeFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')
    const [showDoctorInput, setShowDoctorInput] = useState(false);
    const handleTimeFilter = (e)=>{
        setTimeFilter(e.target.value)
    }
    const handleTypeFilter = (e)=>{
        const type = e.target.value;
        setTypeFilter(type)
        setShowDoctorInput(type === 'Doctor');
    }

    const handleFilterSubmit = ()=>{

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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr',
            minHeight: '100vh',
            width: { xs: '100%' },
            height: '100vh',
            backgroundColor: 'lightblue',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid black',
            position: 'relative'
          }}
        >
          { isFormVisible ? (
          <Form />
        ): null}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 0, display: 'flex', padding: '1rem', alignItems:'center' }}>
                <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="filter1-label">Time Frame</InputLabel>
                <Select
                    labelId="filter1-label"
                    id="filter1-select"
                    value={timeFilter}
                    label="Time Frame"
                    onChange={handleTimeFilter}
                    IconProps={{ color: 'inherit' }}
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
                <Box sx={{padding:"0 20px"}}>
                <TextField
                label="Date/Period"
                variant="outlined"
                placeholder={getPlaceholder()}
                disabled={timeFilter === 'All'} 
                sx={{ display: timeFilter != 'All' ? 'block' : 'none' }}
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <IconButton>
                        {/* Add calendar icon or other visual cue based on your needs */}
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
                </Select>
            </FormControl>

            <Box sx={{padding:"0 20px"}}>
                <TextField
                    label="Doctor Name (if applicable)"
                    variant="outlined"
                    placeholder="Search Doctor"
                    disabled={!showDoctorInput} // Disable doctor input if not Doctor or timeframe is All
                    sx={{ display: showDoctorInput ? 'block' : 'none' }} // Hide doctor input conditionally using display
                />
            </Box>

            <Button variant="contained" onClick={handleFilterSubmit}>
                Filter Results
            </Button>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
              {/* Bottom Band content */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <StyledTableRow>
                      {tableColumns.map((column) => (
                        <StyledTableCell key={column.id}>{column.label}</StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell>{row.id}</StyledTableCell>
                        <StyledTableCell>{row.name}</StyledTableCell>
                        <StyledTableCell>{row.value}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      );
};

export default RightPanel;
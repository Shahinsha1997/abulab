import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, IconButton, InputAdornment, Autocomplete, Container, Grid} from '@mui/material';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons

const FilterPopup = ({
    handleTimeFilter,
    getPlaceholder,
    handleInput,
    handleTypeFilter,
    timeInput,
    timeFilter,
    typeFilter,
    docInput,
    drNamesList,
    showDoctorInput,
    isAdmin,
    toggleForm,
    handleFilterSubmit
}) => {
return(
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{display:'flex', flexDirection:'column'}}>
            <Grid item>
            <FormControl fullWidth>
                <InputLabel id="filter1-label">Time Frame</InputLabel>
                <Select
                    labelId="filter1-label"
                    id="filter1-select"
                    value={timeFilter}
                    label="Time Frame"
                    onChange={handleTimeFilter}
                    IconProps={{ color: 'inherit' }}
                    sx={{fontSize: 'inherit'}}
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
            </Grid>
            <Grid item>
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
                  fullWidth
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
            </Grid>
            <Grid item>
                <FormControl fullWidth>
                    <InputLabel id="filter2-label">Type Filter</InputLabel>
                    <Select
                    labelId="filter2-label"
                    id="filter2-select"
                    value={typeFilter}
                    label="Type Filter"
                    onChange={handleTypeFilter}
                    IconProps={{ color: 'inherit' }}
                    sx={{fontSize: 'inherit'}}
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
            </Grid>
            <Grid item>
            <Autocomplete
                fullWidth
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
                    sx={{ display: showDoctorInput ? 'block' : 'none'}}
                />
            }/>
            </Grid>
            <Grid item>
                <Button type="submit" variant="contained" color="primary" sx={{ padding:'10px', width: '100%' }} onClick={handleFilterSubmit}>
                    Submit
                </Button>
            </Grid>
            <Grid item>
                <Button type="submit" variant="contained" color="error" sx={{ padding:'10px', width: '100%' }} onClick={toggleForm}>
                    Cancel
                </Button>
            </Grid>
        </Grid>
    </Container>
    )
}

export default formWrapper(FilterPopup);
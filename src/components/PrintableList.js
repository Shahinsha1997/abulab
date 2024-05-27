import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, Button, TableHead, TableBody, TableRow, Paper, TextField, IconButton, InputAdornment, Tooltip } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import Form from './Form';
import { OUTSTANDING_LABEL, getCellFormattedVal, getFormFields, getIdPrefix, getTimeWithDate } from '../utils/utils';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Print from 'react-to-print';
import EditIcon from '@mui/icons-material/Edit';
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    '& .MuiIconButton-root': {
      visibility: 'visible', // Option B: Set visibility to visible on hover
    }
  }
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
}));

  const PrintableList = ({
    tableData, 
    tableColumns, 
    filterObj, 
    toggleForm,
    isAdmin
  }) =>{
    const { typeFilter, timeFilter } = filterObj;
    const filterType = timeFilter != 'All' ? typeFilter : ''
    return(
        <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <StyledTableRow>
              {tableColumns.map((column) => (
                <StyledTableCell key={column.id}>{column.label}</StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
              {
                tableData.map((row) => (
                <StyledTableRow key={row.time}>
                    {tableColumns.map((column) => {
                      if (column.id === 'isScheduled') {
                        return (
                          <StyledTableCell key={column.id}>
                            {row.isScheduled ? (
                              <ScheduleIcon style={{ color: '#ffa726' }}/>  
                            ) : null}
                            {isAdmin || row['status'] == OUTSTANDING_LABEL ? (
                              <IconButton sx={{visibility:'hidden'}} aria-label="Edit" color="primary" onClick={() => toggleForm((row.time || '').toString())}>
                                <EditIcon />
                              </IconButton>
                            ) : null}
                          </StyledTableCell>
                        );
                      } else {
                        return (
                          <Tooltip title={getCellFormattedVal(column.id,row[column.id], row['status'], filterType)} key={column.id}>
                            <StyledTableCell sx={{'maxWidth': column.maxWidth || 100}}>
                              {getCellFormattedVal(column.id,row[column.id],row['status'], filterType)}
                            </StyledTableCell>
                          </Tooltip>
                        );
                      }
                    })}
                  </StyledTableRow>
                ))
              }
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

export default PrintableList;
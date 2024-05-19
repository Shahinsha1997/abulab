import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, Button, TableHead, TableBody, TableRow, Paper, TextField, IconButton, InputAdornment, Tooltip } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { CalendarTodayOutlined, ScheduleOutlined, AccountBalanceWalletOutlined, MoneyOffOutlined, StarBorderOutlined } from '@mui/icons-material'; // Import icons
import Form from './Form';
import { getCellFormattedVal, getFormFields, getIdPrefix, getTimeWithDate } from '../utils/utils';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Print from 'react-to-print';
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
}));

  const PrintableList = ({tableData, tableColumns, filterObj}) =>{
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
                          </StyledTableCell>
                        );
                      } else {
                        return (
                          <Tooltip title={getCellFormattedVal(column.id,row[column.id], row['status'], filterType)} key={column.id}>
                            <StyledTableCell>
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
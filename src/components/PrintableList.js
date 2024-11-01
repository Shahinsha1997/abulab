import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Chip, IconButton, Link, Tooltip, useMediaQuery } from '@mui/material';
import { API_FETCH_LIMIT, EXPENSE_LABEL, OUTSTANDING_LABEL, getCellFormattedVal } from '../utils/utils';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/EditOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'; 
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIconPopup from './WhatsappIconPopup';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { FixedSizeList as List } from 'react-window';
const MyDataGrid = styled(DataGrid)(({ theme }) => {

  const isMobile = useMediaQuery('(max-width: 600px)');
  return {
    '& .MuiDataGrid-row,': {
      backgroundColor: '#242b38',
      color:'#a7b0bd',
      border: '1px dotted #2d3748'
      
    },
    '& .MuiDataGrid-Scheduled':{
      backgroundColor:'#ffa726ab',
      color: 'white'
    },
    '& .MuiDataGrid-cell':{
      border: 'none'
    },
    '& .Mui-selected': {
      backgroundColor: '#242b38',
      color:'#a7b0bd'
    },
    '& .MuiDataGrid-row:hover':{
      backgroundColor: '#262f3d',
    },
    '& .MuiDataGrid-footerContainer' : {
      display: 'none'
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#242b38',
      color: 'white'
    },
    '& .MuiSvgIcon-root': {
      backgroundColor: '#242b38',
      color: 'white'
    },
    width: `1800px`,
    fontSize: 'inherit',
    [theme.breakpoints.down('sm')]: { 
      fontSize: 14
    }
    
  }
});

  const PrintableList = ({
    tableData, 
    tableDataIds,
    tableColumns, 
    filterObj, 
    toggleForm,
    isAdmin,
    isFetching,
    setDetailViewId,
    deleteData,
    applyFilters,
    isLoading
  }) =>{
    const [hoveredCellId, setIsCellHovered] = useState(false);
    const handleRowEnter = (params) => {
      setIsCellHovered(params.currentTarget.id);
    };
    const handleRowLeave = ()=>{
      setIsCellHovered(false)
    }
    const sortFieldMethod = (apiKey) =>{
      if(apiKey){
        const { sortField, sortOrder } = filterObj;
        applyFilters({...filterObj, from:0, isNoMore: false, sortField: apiKey, sortOrder: (sortField != apiKey || sortOrder == "ASC") ? "DESC" : "ASC" })  
      }
     }
    const { typeFilter, timeFilter } = filterObj;
    const filterType = timeFilter != 'All' ? typeFilter : ''
    const columns = tableColumns.map((column) => ({
      field: column.id,
      headerName: column.label,
      flex:1,
      apiKey: column.apiKey,
      width: parseInt(column.maxWidth.replace('px','')) || 250,
      ...(column.id === 'isScheduled' ? {
        renderCell: (params) => {
          const { isScheduled, id, uuid, status } = params.row
          return (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            <Box sx={{width:"20px"}}>
                <WhatsAppIconPopup rowDetails={params.row} hoveredCellId={hoveredCellId}/>
            </Box>
            <Box sx={{width:"20px" , paddingLeft:'20px'}}>
            { (status == OUTSTANDING_LABEL || isAdmin) && (
              <IconButton color="white" sx={{visibility:hoveredCellId == id ? 'visible' : 'hidden',  backgroundColor: 'transparent'}} aria-label="Edit"  onClick={() => toggleForm((uuid || '').toString())}>
              <EditIcon style={{backgroundColor: 'transparent',color:'#1876d2'}}/>
            </IconButton>
            )}
            </Box>
            <Box sx={{width:"20px" , paddingLeft:'20px'}}>
            { isAdmin && (
              <IconButton color="white" sx={{visibility:hoveredCellId == id ? 'visible' : 'hidden',  backgroundColor: 'transparent'}} aria-label="Delete"  onClick={() => deleteData((uuid || '').toString())}>
              <DeleteIcon style={{backgroundColor: 'transparent',color:'#ff000087'}}/>
            </IconButton>
            )}
            </Box>
          </Box>
          )
          }
      } : column.id =='otherOptions' ? {
        renderCell: (params) =>{
          const { id, uuid } = params.row
          return (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
              <Box sx={{width:"20px"}}>
              <IconButton color="white" sx={{visibility:hoveredCellId == id ? 'visible' : 'hidden',  backgroundColor: 'transparent'}} aria-label="Add as Income"  onClick={() => toggleForm((uuid || '').toString())}>
                <NoteAddIcon style={{backgroundColor: 'transparent',color:'#1876d2'}}/>
              </IconButton>
              </Box>
            </Box>
          )
        }
      } : column.id =='address' ? {
        renderCell: (params) =>{
          const { address='' } = params.row
          if(address.includes(' || ')){
            const [latitude,longitude] = address.split(' || ');
            return <Link target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=bicycling`}>Open Map</Link>  
          }
          return address;
         }
      }: column.id =='name' ? {
        renderCell: (params) =>{
          const { id, status } = params.row
          if(status == EXPENSE_LABEL){
            return params.value;
          }
          return <span onClick={()=>setDetailViewId(id.split('_')[1])}>{params.value}</span>
         }
      }: {}),
    }));
    const rows = tableDataIds.map((row, index) => {
      const { uuid, drName, id, status } = tableData[row]
        const rowData= tableData[row]
        const resp = {id: `${(uuid || drName || id)}_${index}`, uuid}
        for(let i=0;i<tableColumns.length;i++){
            resp[tableColumns[i].id] = getCellFormattedVal(tableColumns[i].id,rowData[tableColumns[i].id],status, filterType)
        }
        resp['isScheduled'] = row['isScheduled']
        return resp
    });
    const Row = ({ index, style }) => {
      const arr = ['','time','patientId','name','mobileNumber','drName','status','description','totalAmount','discount','paidAmount','dueAmount','comments']
      const rowData = rows[index];
      return(
        <TableRow 
          style={{ ...style, display: 'flex',  backgroundColor: hoveredCellId == rowData.id ? 'rgb(204 201 190 / 45%)' : '#f5f5f5',
        }}
          onMouseEnter={handleRowEnter}
          onMouseLeave={handleRowLeave}
          id={rowData.id}
        >
          {arr.map((val,ind)=>
          rowData['status'] != EXPENSE_LABEL && val == 'description' ? (
            <TableCell style={{ width: columns[ind].width, color: 'black', padding: '8px', display: 'flex', whiteSpace: 'nowrap',overflowY: 'auto'
            }}>
            {rowData[val].split("|").map(val=>
              val && <Chip label={val} style={{ backgroundColor: 'rgb(162 0 255 / 55%)', color: 'white' }} />
            )}
            </TableCell>
            ) : val == '' ? (
              <TableCell style={{ width: columns[ind].width, color: 'black', padding: '8px', display: 'flex', whiteSpace: 'nowrap',overflowY: 'auto'
            }}>
              {columns[0].renderCell({row: rowData})}
              </TableCell>
            ) : (
            <TableCell style={{ overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap', width: columns[ind].width, color: 'black', padding: '8px' }}>
              <Tooltip title={rowData[val] || ''} arrow>
                {rowData[val] || ''}
              </Tooltip>
            </TableCell>
            )
            )}
        </TableRow>
      );
    };
    
    // Header component for the table header
    const tableHeader = () => (
      <div style={{display: 'flex', fontWeight: 'bold', borderBottom: '2px solid #000'}}>
        {columns.map(column=>
            <TableCell onClick={()=>sortFieldMethod(column.apiKey)}style={{ width: column.width, padding: '8px', backgroundColor:'#f5f5f5', fontColor:'black' }}>{column.headerName}</TableCell>
        )}
      </div>
    );
    // return(
    //     <MyDataGrid
    //       id="tableContainer"
    //       rows={rows}
    //       slotProps={{
    //         row:{
    //           onMouseEnter: handleRowEnter,
    //           onMouseLeave: handleRowLeave
    //         }
    //       }}
    //       getRowId={(row)=>row.id}
    //       disableExtendRowFullWidth={true}
    //       columns={columns}
    //       pageSize={Infinity}
    //       getRowClassName={(params)=>{
    //         console.log(params.row.isScheduled)
    //         return params.row.isScheduled ? 'MuiDataGrid-Scheduled' : ''
    //       }}
    //       paginationMode={'server'}
    //       hideFooterPagination
    //       hideFooterSelectedRowCount
    //       rowCount={rows.length}
    //       disableSelectionOnClick
    //       density='comfortable'
    //       loading={isFetching}
    //   />
    // )
    const listHeight = 1000;
    const tableWidth = 1830;
    const handleScroll = ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
      if (scrollDirection === 'forward' && !scrollUpdateWasRequested ) {
        const bottomOffset = 50; // Load more when 50px from the bottom
        if (scrollOffset > rows.length * 50 - listHeight - bottomOffset && !isLoading) {
          applyFilters({...filterObj, from: filterObj.from + API_FETCH_LIMIT})
        }
      }
    };
    if(rows.length == 0){
      return null;
    }
    return (
      <TableContainer component={Paper} style={{ height: '100%',width:tableWidth, overflow: 'hidden' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow style={{ backgroundColor: '#444', color: 'white' }}>
            {tableHeader()}
          </TableRow>
        </TableHead>
        <TableBody>
          <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
            <List
              height={listHeight} // Height of the scrollable area
              itemCount={rows.length} // Number of rows
              itemSize={60} // Height of each row, adjusted for wrapped content
              width="100%" // Width of the list
              onScroll={handleScroll}
            >
              {Row}
            </List>
          </div>
        </TableBody>
      </Table>
    </TableContainer>
  )
  }

export default PrintableList;
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Link, useMediaQuery } from '@mui/material';
import { EXPENSE_LABEL, OUTSTANDING_LABEL, getCellFormattedVal } from '../utils/utils';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/EditOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'; 
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIconPopup from './WhatsappIconPopup';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
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
    tableColumns, 
    filterObj, 
    toggleForm,
    isAdmin,
    isFetching,
    setDetailViewId,
    deleteData
  }) =>{
    const [hoveredCellId, setIsCellHovered] = useState(false);
    const handleRowEnter = (params) => {
      setIsCellHovered(params.currentTarget.dataset.id);
    };
    const handleRowLeave = ()=>{
      setIsCellHovered(false)
    }
    const { typeFilter, timeFilter } = filterObj;
    const filterType = timeFilter != 'All' ? typeFilter : ''
    const columns = tableColumns.map((column) => ({
      field: column.id,
      headerName: column.label,
      flex:1,
      width: 250 || parseInt(column.maxWidth.replace('px','')),
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
    const rows = tableData.map((row, index) => {
      const resp = {id: `${(row.uuid || row.drName || row.id)}_${index}`, uuid:row.uuid}
      for(let i=0;i<tableColumns.length;i++){
        resp[tableColumns[i].id] = getCellFormattedVal(tableColumns[i].id,row[tableColumns[i].id],row['status'], filterType)
      }
      resp['isScheduled'] = row['isScheduled']
      return resp
    });
    return(
        <MyDataGrid
          id="tableContainer"
          rows={rows}
          slotProps={{
            row:{
              onMouseEnter: handleRowEnter,
              onMouseLeave: handleRowLeave
            }
          }}
          getRowId={(row)=>row.id}
          disableExtendRowFullWidth={true}
          columns={columns}
          pageSize={Infinity}
          getRowClassName={(params)=>{
            console.log(params.row.isScheduled)
            return params.row.isScheduled ? 'MuiDataGrid-Scheduled' : ''
          }}
          paginationMode={'server'}
          hideFooterPagination
          hideFooterSelectedRowCount
          rowCount={rows.length}
          disableSelectionOnClick
          density='comfortable'
          loading={isFetching}
      />
    )
  }

export default PrintableList;
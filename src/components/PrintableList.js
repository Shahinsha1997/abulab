import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { OUTSTANDING_LABEL, getCellFormattedVal } from '../utils/utils';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid } from '@mui/x-data-grid';

const MyDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#f5f5f5',
    color:'black'
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: '#ffffff',
    color:'black'
  },
  '& .MuiDataGrid-footerContainer' : {
    display: 'none'
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: 'black',
    color: 'white'
  },
  '& .MuiSvgIcon-root': {
    backgroundColor: 'black',
    color: 'white'
  },
  width: `calc(100vw - 175px)`
}));

  const PrintableList = ({
    tableData, 
    tableColumns, 
    filterObj, 
    toggleForm,
    isAdmin
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
      width: parseInt(column.maxWidth.replace('px','')),
      ...(column.id === 'isScheduled' ? {
        renderCell: (params) => {
          return (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            <ScheduleIcon style={{ visibility: params.row.isScheduled ? 'visible' : 'hidden' ,color: '#ffa726',paddingTop: '8px', backgroundColor: 'transparent' }} />
            { (params.row.status == OUTSTANDING_LABEL || isAdmin) && (
              <IconButton color="white" sx={{visibility:hoveredCellId == params.id ? 'visible' : 'hidden',  backgroundColor: 'transparent'}} aria-label="Edit"  onClick={() => toggleForm((params.id || '').toString())}>
              <EditIcon style={{backgroundColor: 'transparent',color:'#1876d2'}}/>
            </IconButton>
            )}
          </Box>
          )
          }
      } : {}),
    }));
    const rows = tableData.map((row) => {
      const resp = {id: row.time || row.drName}
      for(let i=0;i<tableColumns.length;i++){
        resp[tableColumns[i].id] = getCellFormattedVal(tableColumns[i].id,row[tableColumns[i].id],row['status'], filterType)
      }
      resp['isScheduled'] = row['isScheduled']
      return resp
    });
    return(
        <MyDataGrid
        rows={rows}
        slotProps={{
          row:{
            onMouseEnter: handleRowEnter,
            onMouseLeave: handleRowLeave
          }
        }}
        disableExtendRowFullWidth={true}
        columns={columns}
        pageSize={Infinity}
        paginationMode={'server'}
        hideFooterPagination
        hideFooterSelectedRowCount
        rowCount={rows.length}
      />
    )
  }

export default PrintableList;
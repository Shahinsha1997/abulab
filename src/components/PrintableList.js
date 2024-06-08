import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import { OUTSTANDING_LABEL, getCellFormattedVal } from '../utils/utils';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/EditOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'; 
const MyDataGrid = styled(DataGrid)(({ theme }) => {

  const isMobile = useMediaQuery('(max-width: 600px)');
  return {
    '& .MuiDataGrid-row,': {
      backgroundColor: '#242b38',
      color:'#a7b0bd',
      border: '1px dotted #2d3748'
      
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
    width: isMobile ? `1800px`:`calc(100vw - 175px)`,
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
      width: 250 || parseInt(column.maxWidth.replace('px','')),
      ...(column.id === 'isScheduled' ? {
        renderCell: (params) => {
          const { mobileNumber, isScheduled, id, status, name, dueAmount } = params.row
          let message = 'Hi Sir/Madam,\n\n';
          message += `${name}'s report is ready.Please come and collect from Abu Lab.\n`;
          message += `${dueAmount > 0 ? 'Please Pay your due amount ₹ '+dueAmount+' while collecting your report from lab.': ''}`
          message += `\n\n_Thanks & Regards,_ \n*ABU LAB*`
          const whatsappLink = mobileNumber == '-' ? '' : `https://wa.me/${mobileNumber}?text=`+encodeURIComponent(message);
          return (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            <Box sx={{width:"20px"}}>
            { (status == OUTSTANDING_LABEL || isAdmin) && (
              <IconButton color="white" sx={{visibility:hoveredCellId == id ? 'visible' : 'hidden',  backgroundColor: 'transparent'}} aria-label="Edit"  onClick={() => toggleForm((id || '').toString())}>
              <EditIcon style={{backgroundColor: 'transparent',color:'#1876d2'}}/>
            </IconButton>
            )}
            </Box>
            <Box sx={{width:"20px", paddingLeft:'20px'}}>
            {whatsappLink ? (
              <IconButton 
                href={whatsappLink} 
                target="_blank"
                rel="noopener noreferrer"  
                aria-label="Report Status on Whatsapp"
                // sx={{visibility:hoveredCellId == id ? 'visible' : 'hidden',}}
                sx={{visibility:'hidden'}} // Not Open Yet.

              >
                <WhatsAppIcon style={{ color: 'green', backgroundColor: 'transparent' }} />
              </IconButton>
            ) : null}
            </Box>
            <Box sx={{width:"20px", paddingLeft:'20px', marginTop:'7px'}}>
              <ScheduleIcon style={{ visibility: isScheduled ? 'visible' : 'hidden' ,color: '#ffa726',paddingTop: '8px', backgroundColor: 'transparent' }} />
            </Box>
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
          id="tableContainer"
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
          disableSelectionOnClick
          density='comfortable'
      />
    )
  }

export default PrintableList;
import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, ListItemIcon, ListItemText, List, ListItem } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { API_FETCH_LIMIT, OUTSTANDING_LABEL, getCellFormattedVal, sendWhatsappMessage } from '../utils/utils';
import EditIcon from '@mui/icons-material/EditOutlined';
import BiotechSharpIcon from '@mui/icons-material/BiotechSharp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {  Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';
const styles = {
    root: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }
  };
const CustomCard = ({ index, data, handleClose, handlePopup, popupRef, popupType, popupOptions, openDv }) => {
    const { time, name, description,patientId, drName, totalAmount, paidAmount, dueAmount, isScheduled, uuid} = data[index];
    return (
            <Card onClick={()=>popupRef === '' && openDv(uuid,false)} style={{ background:isScheduled ? '#ffa726ab' : '#252b38', color:'white',border:'2px solid white', borderRadius:'10px'}}>
                <CardContent>
                <Grid container sx={{display:'flex', flexDirection:'column'}}>
                    <Grid container sx={{display:'flex', flexDirection:'row',padding:0.2}} spacing={1}>
                        <Grid item sx={{display:'flex', width:'50%'}}>
                            <Typography style={styles.root}>{name}</Typography>
                        </Grid>
                        <Grid item sx={{display:'flex', width:'25%'}}>
                            <Typography style={styles.root}>{patientId}</Typography>
                        </Grid>
                        <Grid item sx={{display:'flex'}}>
                            <Grid item>
                                <BiotechSharpIcon fontSize="medium" onClick={(e)=>handlePopup(e,'testList',description)}/>
                            </Grid>
                            <Grid item sx={{marginLeft:1}}>
                                <MoreHorizIcon fontSize='medium' onClick={(e)=>handlePopup(e,'morePopup',index)}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sx={{display:'flex', flexDirection:'row',padding:0.2}} spacing={1}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography>{time}</Typography>
                        </Grid>
                        {drName && !drName.toLowerCase().includes('self') &&(
                            <Grid item sx={{display:'flex'}}>
                                <Typography>{drName}</Typography>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container sx={{display:'flex', flexDirection:'row',padding:0.2}} spacing={1}>
                        <Grid item sx={{display:'flex',fontWeight: 'medium'}}>
                            <Typography>T.A: ₹ {totalAmount == '-' ? 0 : totalAmount}</Typography>
                        </Grid>
                        <Grid item sx={{display:'flex', color:'#26d626b0'}}>
                            <Typography sx={{fontWeight: 'medium'}}>P.A: ₹ {paidAmount == '-' ? 0 : paidAmount}</Typography>
                        </Grid>
                        {dueAmount != '-' && (
                            <Grid item sx={{display:'flex', color:'#df1e1ea8'}}>
                                <Typography sx={{fontWeight: 'medium'}}>D.A: ₹ {dueAmount}</Typography>
                            </Grid>
                        )}
                    </Grid>
                 </Grid>
                </CardContent>
                <Dialog open={popupRef} onClose={handleClose}>
                    <DialogTitle>{popupType == 'testList' ? 'Test List' : 'More Options'}</DialogTitle>
                    <DialogContent>
                        <List>
                            {popupOptions.map((option, index) => (
                                (option.isAllowed || popupType == 'testList') ? (
                                    <ListItem onClick={ option.handleClick && option.handleClick}>
                                    {option.icon && (
                                        <ListItemIcon>
                                            {option.icon}
                                        </ListItemIcon>
                                    )}
                                    <ListItemText>{option.label || option}</ListItemText>
                                </ListItem>
                                ) : null
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
    )
}

  const VirtualizedCardList = ({ items, applyFilters, filterObj, toggleForm, isAdmin, deleteData, setDetailViewId }) => {
    const [popupRef, setPopupRef] = useState('');
    const [popupType, setPopupType] = useState('');
    const [popupOptions, setPopupOptions] = useState([])
    const handleClose = (e)=>{
        e && e.preventDefault();
        e && e.stopPropagation()
        setPopupRef('')
    }
    const handleMoreOption = (e,index,type)=>{
        if(type == 'edit'){
            toggleForm((items[index].uuid).toString());
        }else if(type == 'delete'){
            deleteData((items[index].uuid).toString());
        }else{
            sendWhatsappMessage(type,items[index])
        }
        handleClose(e);
    }
    const handlePopup = (e,type, options)=>{
        e.preventDefault();
        e.stopPropagation()
        setPopupRef(e.currentTarget);
        setPopupType(type)
        if(type == 'testList'){
            options = options.split('|');
            options = options.slice(0,options.length-1)
        }else{
            const index = options;
            const moreOption= [
                {label:'Edit', isAllowed:(items[index].status == OUTSTANDING_LABEL || isAdmin), icon:<EditIcon />, handleClick:(e)=>handleMoreOption(e,index,'edit')},
                {label:'Delete', isAllowed:isAdmin, icon:<DeleteIcon sx={{color:'#ff000087'}}/>, handleClick:(e)=>handleMoreOption(e,index,'delete')},
                {label:'Send Report Progress', isAllowed:true, icon:<WhatsAppIcon style={{ color: 'green', backgroundColor: 'transparent' }} />, handleClick:(e)=>handleMoreOption(e,index,'sendReport')},
                {label:'Delay In Report', isAllowed:true, icon:<WhatsAppIcon style={{ color: 'green', backgroundColor: 'transparent' }} />, handleClick:(e)=>handleMoreOption(e,index,'delayReport')}
            ]
            options = moreOption;
        }
        setPopupOptions(options)
    }
    const handleScroll = ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
        if (scrollDirection === 'forward' && !scrollUpdateWasRequested ) {
          const bottomOffset = 5; // Load more when 50px from the bottom
          const listHeight = 800; // Height defined in List component
          if (scrollOffset > items.length * 140 - listHeight - bottomOffset) {
            applyFilters({...filterObj, from: filterObj.from + API_FETCH_LIMIT})
          }
        }
      };
    return (
    <Box sx={{minWidth:'100wh', overflow:'hidden', flexShrink:0, display:'flex',}}>
        <FixedSizeList
            height={800}
            itemCount={items.length}
            width={'100%'}
            itemSize={140} 
            itemData={items}
            onScroll={handleScroll}
        >
        {({ index, style }) => (
            <Box style={{ ...style}}>
                <CustomCard index={index} openDv={setDetailViewId} data={items} handleClose={handleClose} handlePopup={handlePopup} popupRef={popupRef} popupType={popupType} popupOptions={popupOptions}/>
            </Box>
        )}
        </FixedSizeList>
      </Box>
    );
  };
const printableCard = ({
    tableData, 
    tableDataIds,
    tableColumns, 
    filterObj, 
    toggleForm,
    isAdmin,
    isFetching,
    deleteData,
    setDetailViewId,
    applyFilters
})=>{
    const { typeFilter, timeFilter } = filterObj;
    const filterType = timeFilter != 'All' ? typeFilter : ''
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
    return (
        <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} md={8}>
                <VirtualizedCardList applyFilters={applyFilters} filterObj={filterObj} items={rows} setDetailViewId={setDetailViewId} toggleForm={toggleForm} isAdmin={isAdmin} deleteData={deleteData}/>
            </Grid>
        </Grid>
        );
}
  

export default printableCard;
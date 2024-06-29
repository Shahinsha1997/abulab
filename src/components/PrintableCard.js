import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, ListItemIcon, ListItemText, List, ListItem } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { OUTSTANDING_LABEL, getCellFormattedVal, sendWhatsappMessage } from '../utils/utils';
import EditIcon from '@mui/icons-material/EditOutlined';
import BiotechSharpIcon from '@mui/icons-material/BiotechSharp';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {  Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
const styles = {
    root: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }
  };
const CustomCard = ({ index, data, handleClose, handlePopup, popupRef, popupType, popupOptions }) => {
    const { time, name, description,patientId, drName, totalAmount, paidAmount, dueAmount, isScheduled} = data[index];
    return (
            <Card style={{ background:isScheduled ? '#ffa50094' : '#252b38', color:'white',border:'2px solid white', borderRadius:'10px'}}>
                <CardContent>
                <Grid container sx={{display:'flex', flexDirection:'column'}}>
                    <Grid container sx={{display:'flex', flexDirection:'row'}} spacing={1}>
                        <Grid item sx={{display:'flex', width:'50%'}}>
                            <Typography style={styles.root}>{name}</Typography>
                        </Grid>
                        <Grid item sx={{display:'flex', width:'30%'}}>
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
                    <Grid container sx={{display:'flex', flexDirection:'row'}} spacing={1}>
                        <Grid item sx={{display:'flex'}}>
                            <Typography>{time}</Typography>
                        </Grid>
                        {!drName.toLowerCase().includes('self') &&(
                            <Grid item sx={{display:'flex'}}>
                                <Typography>{drName}</Typography>
                            </Grid>
                        )}
                    </Grid>
                    <Grid container sx={{display:'flex', flexDirection:'row'}} spacing={1}>
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
                                <ListItem onClick={option.handleClick}>
                                    {option.icon && (
                                        <ListItemIcon>
                                            {option.icon}
                                        </ListItemIcon>
                                    )}
                                    <ListItemText>{option.label || option}</ListItemText>
                                </ListItem>
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

  const VirtualizedCardList = ({ items, toggleForm, isAdmin }) => {
    const [popupRef, setPopupRef] = useState('');
    const [popupType, setPopupType] = useState('');
    const [popupOptions, setPopupOptions] = useState([])
    const handleClose = ()=>{
        setPopupRef('')
    }
    const handleMoreOption = (index,type)=>{
        if(type == 'edit'){
            toggleForm((items[index].timeInMs).toString());
        }else{
            sendWhatsappMessage(type,items[index])
        }
        handleClose();
    }
    const handlePopup = (e,type, options)=>{
        setPopupRef(e.currentTarget);
        setPopupType(type)
        if(type == 'testList'){
            options = options.split('|');
            options = options.slice(0,options.length-1)
        }else{
            const index = options;
            const moreOption= [
                {label:'Edit', icon:<EditIcon />, handleClick:()=>handleMoreOption(index,'edit')},
                {label:'Send Report Progress', icon:<WhatsAppIcon style={{ color: 'green', backgroundColor: 'transparent' }} />, handleClick:()=>handleMoreOption(index,'sendReport')},
                {label:'Delay In Report', icon:<WhatsAppIcon style={{ color: 'green', backgroundColor: 'transparent' }} />, handleClick:()=>handleMoreOption(index,'delayReport')}
            ]
            !(items[index].status == OUTSTANDING_LABEL || isAdmin) && moreOption.splice(0,1)
            options = moreOption;
        }
        setPopupOptions(options)
    }
    return (
    <Box sx={{minWidth:'100wh', overflow:'hidden', flexShrink:0, display:'flex',}}>
        <FixedSizeList
            height={800}
            itemCount={items.length}
            width={'100%'}
            itemSize={140} 
            itemData={items}
        >
        {({ index, style }) => (
            <Box style={{ ...style}}>
                <CustomCard index={index} data={items} handleClose={handleClose} handlePopup={handlePopup} popupRef={popupRef} popupType={popupType} popupOptions={popupOptions}/>
            </Box>
        )}
        </FixedSizeList>
      </Box>
    );
  };
const printableCard = ({
    tableData, 
    tableColumns, 
    filterObj, 
    toggleForm,
    isAdmin,
    isFetching
})=>{

    const { typeFilter, timeFilter } = filterObj;
    const filterType = timeFilter != 'All' ? typeFilter : ''
    const rows = tableData.map((row, index) => {
        const resp = {id: `${(row.time || row.drName || row.id)}_${index}`, timeInMs: row.time}
        for(let i=0;i<tableColumns.length;i++){
          resp[tableColumns[i].id] = getCellFormattedVal(tableColumns[i].id,row[tableColumns[i].id],row['status'], filterType)
        }
        resp['isScheduled'] = row['isScheduled']
        return resp
      });
    return (
        <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12} md={8}>
                <VirtualizedCardList items={rows} toggleForm={toggleForm} isAdmin={isAdmin}/>
            </Grid>
        </Grid>
        );
}
  

export default printableCard;
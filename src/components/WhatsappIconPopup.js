import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { sendWhatsappMessage } from '../utils/utils';

const WhatsAppIconPopup = ({
    hoveredCellId,
    rowDetails
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const togglePopup = (event)=>{
    if(anchorEl == null){
        return setAnchorEl(event.currentTarget);
    }
    return setAnchorEl(null)
    
  }
  const handleClickList = (type)=>{
    setAnchorEl(null);
    sendWhatsappMessage(type, rowDetails)
  }

  const options = [
    { label: 'Send Report Progress', type:'sendReport'},
    { label: 'Delay in Report', type:'delayReport'}, 
    { label: 'Close Popup', type:'closePopup'}
  ];

  const open = Boolean(anchorEl);
  const { mobileNumber, id} = rowDetails
  if(mobileNumber == '-'){
    return null;
  }
  return (
    <>
      <IconButton
        aria-describedby={'whatsappPopup'}
        onClick={togglePopup}
        sx={{visibility:hoveredCellId == id ? 'visible' : 'hidden'}}
      >
        <WhatsAppIcon style={{ color: 'green', backgroundColor: 'transparent' }} />
      </IconButton>
      <Popover
        id={'whatsappPopup'}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{cursor:'pointer'}}
      >
        {options.map((option) => (
          <ListItem key={option.label} onClick={()=>handleClickList(option.type)}>
            <ListItemText primary={option.label} />
          </ListItem>
        ))}
      </Popover>
    </>
  );
};

export default WhatsAppIconPopup;

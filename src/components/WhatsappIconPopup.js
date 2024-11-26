import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { OUTSTANDING_LABEL, getAsObj, getLocalStorageData, sendWhatsappMessage, setLocalStorageData } from '../utils/utils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BlockIcon from '@mui/icons-material/Block';
const WhatsAppIconPopup = ({
    hoveredCellId,
    rowDetails,
    isAdmin,
    handleBlockUser
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
    if(type == 'blockUser'){
      handleBlockUser(rowDetails.uuid);
    }
    sendWhatsappMessage(type, rowDetails)
  }
  const options = [
    { label: 'Send Report Progress', type:'sendReport', icon: <WhatsAppIcon  style={{ color: 'green', backgroundColor: 'transparent' }} />},
    { label: 'Delay in Report', type:'delayReport', icon: <WhatsAppIcon  style={{ color: 'green', backgroundColor: 'transparent' }} />}, 
    { label: 'Close Popup', type:'closePopup'}
  ];
  (isAdmin && rowDetails.status == OUTSTANDING_LABEL) ? options.splice(0,0,{ label: rowDetails.isBlockedUser ? 'Unblock User': 'Block User', type:'blockUser', icon:<BlockIcon/>}) : '';
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
        <MoreVertIcon />
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
            {option.icon? (
              <ListItemIcon>
              {option.icon}
            </ListItemIcon>
            ) : null}
            <ListItemText primary={option.label} />
          </ListItem>
        ))}
      </Popover>
    </>
  );
};

export default WhatsAppIconPopup;

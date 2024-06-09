import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

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
    const { mobileNumber, name, dueAmount } = rowDetails
    let message = 'Hi Sir/Madam,\n\n';
    if(type === 'sendReport'){
        message += `${name} அவர்களது பரிசோதனை முடிவுகள் தயாராக உள்ளது.தாங்கள் அதனை எங்கள் ABU lab இல் வந்து பெற்றுக் கொள்ளவும்.\n`;
        message += `${dueAmount > 0 ? '\nதாங்கள் செலுத்த வேண்டிய மீதித் தொகை ₹ '+dueAmount: ''}`
        message += `\n\nவிரைவில் நலம் பெற வேண்டுகிறோம்`
    }else if(type == 'delayReport'){
      message += `${name}-ன் பரிசோதனை முடிவுகள் ஓரிரு நாட்கள் தாமதமாக கிடைக்கும். தாமதத்திற்கு மன்னிக்கவும்.\n`
    }else{
        return setAnchorEl(null)
    }
    message += `\n\nமிக்க நன்றி.,\n\n*அபு லேப்,*\nமேலப்பாளையம்.`
    window.open(`https://wa.me/+91${mobileNumber}?text=`+encodeURIComponent(message), '_blank');
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
        onMouseEnter={togglePopup}
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

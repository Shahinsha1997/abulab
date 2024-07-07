import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
const formWrapper = (ChildComponent) => (props) => {
    const { isMobile, toggleForm, title, formWidth='350px', closePopup, nextRecord, prevRecord } = props;
    return ( 
        <Drawer
            anchor="right"
            open={true}
        >
        <Box sx={{width: isMobile ? "100vw" : formWidth}}>
        <List dense={true}>
                <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="close" onClick={()=>closePopup && closePopup('') || toggleForm('')}>
                        <CloseIcon/>
                    </IconButton>
                }
                >
                    {prevRecord && (
                        <IconButton onClick={prevRecord}>
                            <ArrowBackIosNewIcon/>
                        </IconButton>
                    )}
                    <Typography gutterBottom style={{fontSize: '1.5rem', width:'100%'}} component="div" align='center'>
                    {title}
                    </Typography>
                    {nextRecord && (
                        <IconButton onClick={nextRecord}>
                            <ArrowForwardIosIcon/>
                        </IconButton>
                    )}
                </ListItem>
            </List>
            <ChildComponent {...props} />
        </Box>
    </Drawer>
    )
};

export default formWrapper;

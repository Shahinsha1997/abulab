import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
const formWrapper = (ChildComponent) => (props) => {
    const { isMobile, toggleForm, title } = props;
    return ( 
        <Drawer
            anchor="right"
            open={true}
        >
        <Box sx={{width: isMobile ? "100vw" : "350px"}}>
        <List dense={true}>
                <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="close" onClick={toggleForm}>
                    <CloseIcon/>
                    </IconButton>
                }
                >
                    <Typography gutterBottom style={{fontSize: '1.5rem'}} component="div">
                    {title}
                    </Typography>
                </ListItem>
            </List>
            <ChildComponent {...props} />
        </Box>
    </Drawer>
    )
};

export default formWrapper;

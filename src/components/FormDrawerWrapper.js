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
import { Button, Grid } from '@mui/material';
const formWrapper = (ChildComponent) => (props) => {
    const { isMobile, toggleForm, title, formWidth='350px', backPage, closePopup, nextRecord, prevRecord } = props;
    return ( 
        <Drawer
            anchor="right"
            open={true}
        >
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item sx={{width: isMobile ? "100vw" : formWidth}}>
                <List dense={true} sx={{background:'lightblue'}}>
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
                            <Typography gutterBottom style={{fontSize: '1.5rem', width:'100%', fontFamily:'bold' }} component="div" align='center'>
                            {title}
                            </Typography>
                            {nextRecord && (
                                <IconButton onClick={nextRecord}>
                                    <ArrowForwardIosIcon/>
                                </IconButton>
                            )}
                        </ListItem>
                    </List>
                </Grid>
                <Grid item sx={{flexGrow:1, height:'80vh', overflow:'auto'}}>
                    <ChildComponent {...props} />
                </Grid>
                <Grid container sx={{display:'flex', flexDirection:'column', background:'lightblue'}}>
                    {backPage ? (
                        <Grid item>
                        <Button variant="text" sx={{ color:'#0a2af2cf', padding:'10px', fontSize:'1rem', width: '100%', fontFamily:'bold' }} onClick={backPage}>
                            Back
                        </Button>
                    </Grid>
                    ) : null}
                    <Grid item sx={{border:'2px solid white'}}>
                        <Button variant="text" color="error" sx={{ padding:'10px',fontSize:'1rem',  width: '100%', fontFamily:'bold' }} onClick={toggleForm}>
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
    </Drawer>
    )
};

export default formWrapper;

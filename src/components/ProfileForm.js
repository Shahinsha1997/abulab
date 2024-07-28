import * as React from 'react';
import formWrapper from './FormDrawerWrapper';
import { Container, Grid, FormControlLabel, Switch, TextField, Box, Typography, Checkbox} from '@mui/material';
import { useSelector } from 'react-redux';
import { getProfiles } from '../selectors/moduleselectors';
import { getPermissionObj } from '../utils/utils';
const ProfileForm = ({
    setFormObj,
    id
}) => {
const profiles = useSelector(getProfiles);
const [formObj, setDeptFormObj] = React.useState(id == 'add' ? {} : {...profiles[id], ...profiles[id].permissions})
const handleInput = (e, value)=>{
    const { id, value:val, type } = e.target;
    setDeptFormObj({...formObj, [id]:type == 'checkbox' ? value : val})
}

const { profileName } = formObj;
return (
    <Container maxWidth="sm">
        <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid item sx={{padding:'10px'}}>
            <TextField
                  id="profileName"
                  label="Profile Name"
                  variant="outlined"
                  autoComplete="off"
                  placeholder={"Enter the Profile Name"}
                  onChange={handleInput}
                  value={profileName}
                  fullWidth
                />
            </Grid>
            <Grid item>
                {getPermissionObj().map(moduleObj=>{
                    const { permissions, permissionNames, id, name } = moduleObj;
                return (
                    <>
                    <Typography variant="overline" sx={{fontSize:'1rem'}}>{name}</Typography>
                    <Grid container sx={{display:'flex', flexDirection:'column', ml:2}} >
                        {permissionNames.map((permissionName,index)=>(
                            <Grid item>
                                <FormControlLabel
                                    control={<Checkbox id={permissions[index]} checked={formObj[permissions[index]]} onChange={handleInput} />}
                                    label={permissionName}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    </>
                )
                }
            )}
            </Grid>
        </Grid>
    </Container>
  );
}

export default formWrapper(ProfileForm);
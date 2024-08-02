import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { connect } from 'react-redux'
import { setUser } from '../dispatcher/action';
import { authenticate } from '../actions/APIActions';
import { changePathName, getLocalStorageData, setLocalStorageData } from '../utils/utils';

import { Navigate } from 'react-router-dom';
import { Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      showPassword:false
    };
    this.setShowPassword = this.setShowPassword.bind(this);
  }
  setShowPassword(){
    const { showPassword } = this.state;
    this.setState({showPassword:!showPassword})
  }
  componentDidMount(){
    const userObj = getLocalStorageData('userObj');
    const { setUser, handleNavigate } = this.props;
    if(userObj.name){
      setUser(userObj)
      handleNavigate('/dashboard')
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    const { setUser, handleNavigate } = this.props;
      authenticate(username, password).then(res=>{
        console.log(res);
        if(res.status != 200){
          const { message } = res;
          return this.setState({ error: message || "Please check the user name or password" });
        }
        setUser(res.response)
        setLocalStorageData('userObj', res.response)
        handleNavigate('/dashboard')
      }).catch(err=>{
        this.setState({ error: "Please check the user name or password" });
      })
  };

  render() {
    const { username, password, error, showPassword } = this.state;
    const { isNavigateNeed, currentPath } = this.props
    return (
      isNavigateNeed ? <Navigate to={currentPath} replace />  :
      <div className="login-page" style={{ backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}> {/* Added background color, flexbox for centering, and minimum height */}
        <Box sx={{display:'flex'}}>
        <div style={{ display: 'flex', padding:10, justifyContent: 'center' }}>
          <Box sx={{display:'flex',flexDirection:'column'}} >
              <img
                src="./AbuLabLogoHeader.png"
                alt="Abulab"
                style={{ maxWidth: '100%', maxHeight: '150px', width:'200px' }}
              />
            <img
                src="./AbuLabLogoFooter.png"
                alt="Abulab"
                style={{ maxWidth: '100%', maxHeight: '150px', width:'200px' }}
              />
          </Box>
        </div>
        </Box>
        <Box sx={{display:'flex'}}>
        <div style={{ padding: 20, borderRadius: 5, backgroundColor: 'white', maxWidth: 400 }}> {/* Added padding, rounded corners, and max-width for form container */}
          <Typography variant="h5" style={{ marginBottom: 20 }}>Login</Typography>
          <form onSubmit={this.handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={username}
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
              required
              style={{ borderColor: '#ccc', borderRadius: 4 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : 'password'}
              name="password"
              value={password}
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
              required
              InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                    aria-label="Toggle password visibility"
                    onClick={()=>this.setShowPassword(!showPassword)}
                    edge="end"
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                )
            }}
              style={{ borderColor: '#ccc', borderRadius: 4 }}
            />
            <Button variant="contained" type="submit" color="primary" style={{ marginTop: 15 }}>
              Login
            </Button>
          </form>
          {error && <Alert severity="error">{error}</Alert>}
        </div>
        </Box>
      </div>
    );
  }
}

const mapStateToProps = (props)=>{
  return {

  }
}

export default connect(mapStateToProps,{
  setUser
})(LoginPage);
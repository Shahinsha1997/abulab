import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData } from '../dispatcher/action';
class DashboardLayout extends Component {
  constructor(props){
    super(props)
    this.state={
      formType: ''
    }
    this.toggleForm = this.toggleForm.bind(this)
  }
  toggleForm(formType=''){
    this.setState({
      formType
    })
  }
  render() {
    const { logoutUser } = this.props
    const { formType } = this.state;
    return (
        <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr', // Left: 1 fraction, Right: 3 fractions
          minHeight: '100vh'
        }}
      >
       
        <LeftPanel toggleForm={this.toggleForm} logoutUser={logoutUser}/>
        <RightPanel 
          addData={addData} 
          toggleForm={this.toggleForm} 
          formType={formType}
        />
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  return {
    
  }
}

export default connect(mapStateToProps,{
  logoutUser,
  addData
})(DashboardLayout);


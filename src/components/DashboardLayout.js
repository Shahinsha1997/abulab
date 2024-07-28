import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import '../css/dashboardstyles.css'
import { Box, LinearProgress } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData,multiAdd,multiTestAdd, getDatas, closeAlert, showAlert, multiAppointmentAdd, deleteData } from '../dispatcher/action';
import { getDataIds } from '../selectors/incomeselectors';
import { bind, getCurrentMonth, getErrorMessage } from '../utils/utils';
import FormContainer from './FormContainer';
import { getDepartmentsAPI, getOrgAPI, getProfilesAPI, getUsersAPI, logout } from '../actions/APIActions';
class DashboardLayout extends Component {
  constructor(props){
    super(props)
    this.state={
      isLoading:false,
      formObj: {
        type:'',
        id:''
      },
      isFormLoading: false
    }
    this.dueWithMobile = {};
    this.patientIdObj = {}
    this.previousID = '';
    this.isSyncInProgress = false;
    const methods = [
      'logout',
      'handleFormType'
    ]
    bind.apply(this, methods);
  }
  handleFormType(type, id){
    this.setState({
      formObj:{
        type,
        id
    }
    })
  }
  componentDidMount(){
    const { userObj, getDatas } = this.props;
    const { orgId } = userObj;
    getOrgAPI(orgId).then(res=>{
      console.log(res);
      this.setState({isFormLoading:false})
      getDatas({module:'org', res})
    }).catch(err=>{
      this.setState({isFormLoading:false})
      showAlert({type:'error','message':getErrorMessage(err)})
    }) 
  }
  componentDidUpdate(prevProps, prevState){
    const { getDatas } = this.props;
    const { formObj:prevFormObj } = prevState;
    const { formObj } = this.state;
    const { type:formType } = formObj;
    if(prevFormObj.type != formObj.type && formObj.type){
      this.setState({isFormLoading: true});
      let getModuleAPI = '';
      if(formType == 'departments'){
        getModuleAPI = getDepartmentsAPI
      }else if(formType == 'users'){
        getModuleAPI = getUsersAPI;
      }else if(formType == 'profiles'){
        getModuleAPI = getProfilesAPI;
      }
      getModuleAPI && getModuleAPI(1).then(res=>{
        console.log(res);
        this.setState({isFormLoading:false})
        getDatas({module:formObj.type, res})
      }).catch(err=>{
        this.setState({isFormLoading:false})
        showAlert({type:'error','message':getErrorMessage(err)})
      })
    }
  }
  logout(){
    const { logoutUser, showAlert } = this.props;
    return logout(logoutUser).then(res=>{}).catch(err=>showAlert({type:'error','message':'Logout failed...'}))
  }
  render() {
    const { 
      isMobile
    } = this.props
    const { 
      isLoading,
      formObj,
      isFormLoading
    } = this.state;
    return (
      <Box sx={{display:'flex',flexDirection:'column'}}>
        {isLoading ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        ): null}
        <Box
          sx={{
            display: isMobile ? 'block': 'flex',
            height: '100vh',
            alignItems: 'stretch'
          }}
      >
        
        { false ? (
          this.getAlertContent()
        ) : null }
        {isMobile ? (
          <Box sx={{display:'flex', flexDirection:'column', overflow:'hidden'}}>
          {/* //   <Box sx={{display:'flex'}}>
          //     {this.getRightPanel()}
          //   </Box>
          //   <Box sx={{display:'flex',height:'10vh', background:'#252b38', color:'white', border:'1px solid white', borderRadius:'10px'}}>
          //     {this.getBottomPanel()}
          //   </Box> */}
           </Box>
        ) : (
          <>
            <LeftPanel
              logoutUser={this.logout} 
              handleFormType={this.handleFormType}
            />
          {/* {this.getRightPanel()} */}
          </>
        )}
        {formObj.type ? (
          <FormContainer isFormLoading={isFormLoading} formObj={formObj} handleFormType={this.handleFormType}/>
        ) : null}
      </Box>
      </Box>
    );
  }
}


const mapStateToProps = (state,props)=>{
  const { 
    module,
    user
  } = state;
  const { isMobile } = props;
  return {
    userObj:user,
      isMobile
  }
}

export default connect(mapStateToProps,{
  logoutUser,
  addData,
  multiAdd,
  getDatas,
  closeAlert,
  showAlert,
  multiTestAdd,
  multiAppointmentAdd,
  deleteData
})(DashboardLayout);


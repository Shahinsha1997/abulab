import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData,multiAdd, getDatas } from '../dispatcher/action';
import { bind, getAsObj, getLocalStorageData } from '../utils/utils';
import { getDataAPI } from '../actions/APIActions';
class DashboardLayout extends Component {
  constructor(props){
    super(props)
    this.state={
      formType: '',
      from: 1,
      limit: 50
    }
    const methods = [
      'toggleForm',
      'getAllDatas'
    ]
    bind.apply(this, methods);
  }
  toggleForm(formType=''){
    this.setState({
      formType
    })
  }
  componentDidMount(){
    const { multiAdd } = this.props;
    const pendingDatas = getLocalStorageData('addPendingDatas');
    this.getAllDatas();
    multiAdd({data:getAsObj(pendingDatas)})
  }
  getAllDatas(){
    const { from , limit } = this.state;
    const { getDatas } = this.props;
    getDataAPI(from, limit).then(res=>{
      getDatas({data: res, from})
    })
  }
  render() {
    const { logoutUser, data, dataIds, addData, multiAdd } = this.props
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
          data={data}
          dataIds={dataIds}
          multiAdd={multiAdd}
        />
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  const { data, dataIds } = state;
  return {
    data,
    dataIds
  }
}

export default connect(mapStateToProps,{
  logoutUser,
  addData,
  multiAdd,
  getDatas
})(DashboardLayout);


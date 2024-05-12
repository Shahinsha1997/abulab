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
      limit: 50,
      previousId: '',
    }
    const methods = [
      'toggleForm',
      'getAllDatas',
      'setPreviousId'
    ]
    bind.apply(this, methods);
  }
  setPreviousId(id){
    this.setState({previousId: id})
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
    const { logoutUser, data, dataIds, addData, multiAdd, filteredIds } = this.props
    const { formType, previousId } = this.state;

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
          filteredIds={filteredIds}
          multiAdd={multiAdd}
          previousId={previousId}
          setPreviousId={this.setPreviousId}
        />
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  const { data, dataIds,filteredIds } = state;
  return {
    data,
    dataIds,
    filteredIds
  }
}

export default connect(mapStateToProps,{
  logoutUser,
  addData,
  multiAdd,
  getDatas
})(DashboardLayout);


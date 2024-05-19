import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData,multiAdd, getDatas } from '../dispatcher/action';
import { EXPENSE_LABEL, bind, getAsObj, getDatasByProfit, getFormFields, getLocalStorageData, getTimeFilter } from '../utils/utils';
import { getDataAPI } from '../actions/APIActions';
class DashboardLayout extends Component {
  constructor(props){
    super(props)
    this.state={
      formType: '',
      from: 1,
      limit: 50,
      previousId: '',
      filteredDataIds:props.dataIds,
      filterObj:{},
      tableColumns: Object.values(getFormFields('allFields'))
    }
    this.previousID = ''
    const methods = [
      'toggleForm',
      'getAllDatas',
      'setPreviousId',
      'applyFilters',
      'getFilteredDataIds'
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
    const pendingDatas = getLocalStorageData('addPendingDatas', '[]');
    this.getAllDatas();
    multiAdd({data:getAsObj(pendingDatas)})
  }
  componentDidUpdate(prevProps){
    const { dataIds } = this.props;
    if(prevProps.dataIds.length != dataIds.length ){
      this.getFilteredDataIds();
    }
  }
  getFilteredDataIds(){
    let { previousId, filterObj, tableColumns } = this.state;
    const {
      timeFilter='All', 
      typeFilter='', 
      timeInput, 
      docInput=''
    } = filterObj
    let { dataIds, filteredIds, filteredByDrName, data } = this.props;
    dataIds = docInput ? filteredByDrName[docInput.toLowerCase()] : filteredIds[typeFilter.toLowerCase()] || dataIds;
    dataIds = getTimeFilter(dataIds, timeFilter, timeInput);
    if(['profit','profitByDoc'].includes(typeFilter) && timeFilter != 'All'){
      dataIds = getDatasByProfit(dataIds, data, typeFilter, timeFilter)
      tableColumns = Object.values(getFormFields(typeFilter))
   }else{
    dataIds = dataIds.map(dataId=>{
       if(data[dataId].status != EXPENSE_LABEL && !previousId && !this.previousID){
        this.previousID = data[dataId].patientId
         this.setPreviousId(this.previousID)
       }
       return data[dataId]
     })
    tableColumns = Object.values(getFormFields('allFields'))
   }
    this.setState({
      filteredDataIds: dataIds,
      tableColumns
    })
  }
  getAllDatas(){
    const { from , limit } = this.state;
    const { getDatas } = this.props;
    getDataAPI(from, limit).then(res=>{
      getDatas({data: res, from})
    })
  }
  applyFilters(filters){
    this.setState({
      filterObj : filters
    }, this.getFilteredDataIds)
  }
  render() {
    const { logoutUser, data, dataIds, addData, multiAdd, isAdmin } = this.props
    const { formType, previousId, filteredDataIds, tableColumns, filterObj } = this.state;

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
          dataIds={filteredDataIds}
          multiAdd={multiAdd}
          previousId={previousId}
          setPreviousId={this.setPreviousId}
          applyFilters={this.applyFilters}
          isAdmin={isAdmin}
          tableColumns={tableColumns}
          filterObj={filterObj}
        />
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  const { data, dataIds,filteredIds, filteredByDrName, user } = state;
  const { isAdmin } = user;
  return {
    data,
    dataIds,
    filteredIds,
    filteredByDrName, 
    isAdmin
  }
}

export default connect(mapStateToProps,{
  logoutUser,
  addData,
  multiAdd,
  getDatas
})(DashboardLayout);


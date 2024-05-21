import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData,multiAdd, getDatas, closeAlert, showAlert } from '../dispatcher/action';
import { EXPENSE_LABEL, bind, getAsObj, getDatasByProfit, getFormFields, getLocalStorageData, getTimeFilter } from '../utils/utils';
import { getDataAPI } from '../actions/APIActions';
import { Alert, Snackbar } from '@mui/material';

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
      tableColumns: Object.values(getFormFields('allFields')),
      syncStatus: true
    }
    this.previousID = ''
    const methods = [
      'toggleForm',
      'getAllDatas',
      'setPreviousId',
      'applyFilters',
      'getFilteredDataIds',
      'getAlertContent',
      'setSyncStatus'
    ]
    bind.apply(this, methods);
  }
  setPreviousId(id){
    this.setState({previousId: id})
  }
  setSyncStatus(status){
    this.setState({
      syncStatus: status
    })
  }
  getAlertContent(){
    const { appConfig, closeAlert } = this.props;
    const { alertOptions } = appConfig
    const { type, message } = alertOptions;
    return (
      <Snackbar
      open={true}
      autoHideDuration={type == 'success' ? 5000 : undefined} // Duration in milliseconds (here, 6 seconds)
      onClose={() => type == 'success' && closeAlert()} // Function to handle closing
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Position
    >
     <Alert severity={type} onClose={closeAlert}>{message}</Alert>
    </Snackbar>
    )
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
  componentDidUpdate(prevProps, prevState){
    const { dataIds } = this.props;
    if(prevProps.dataIds.length != dataIds.length || prevState.syncStatus != this.state.syncStatus ){
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
    const isProfitFilter = ['profit','profitByDoc'].includes(typeFilter);
    let { dataIds, filteredIds, filteredByDrName, data, showAlert } = this.props;
    dataIds = docInput ? filteredByDrName[docInput.toLowerCase()] : filteredIds[typeFilter.toLowerCase()] || dataIds;
    dataIds = getTimeFilter(dataIds, timeFilter, timeInput);
    if(isProfitFilter){
      showAlert({'type': 'info', 'message':'Profit Values will be shown except All in Time Filter'})
    }
    if(isProfitFilter && timeFilter != 'All'){
      dataIds = getDatasByProfit(dataIds, data, typeFilter, timeFilter)
      tableColumns = Object.values(getFormFields(typeFilter))``
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
    const { getDatas, showAlert, logoutUser } = this.props;
    getDataAPI(from, limit).then(res=>{
      getDatas({data: res, from})
    }).catch(err=>{
      console.log(err)
      if(err == 404){
        return logoutUser();
      }
      
      showAlert({type: 'error', 'message': "Internal Server Error"})
    })
  }
  applyFilters(filters){
    this.setState({
      filterObj : filters
    }, this.getFilteredDataIds)
  }
  render() {
    const { logoutUser, data, dataIds, addData, multiAdd, isAdmin, appConfig, closeAlert, showAlert } = this.props
    const { formType, previousId, filteredDataIds, tableColumns, filterObj } = this.state;
    const { alertOptions={} } = appConfig
    return (
        <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr', // Left: 1 fraction, Right: 3 fractions
          minHeight: '100vh'
        }}
      >
        { alertOptions.type ? (
          this.getAlertContent()
        ) : null}
       
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
          showAlert={showAlert}
          setSyncStatus={this.setSyncStatus}
        />
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  const { data, dataIds,filteredIds, filteredByDrName, user, appConfig } = state;
  const { isAdmin } = user;
  console.log(data)
  return {
    data,
    dataIds,
    filteredIds,
    filteredByDrName, 
    isAdmin,
    appConfig
  }
}

export default connect(mapStateToProps,{
  logoutUser,
  addData,
  multiAdd,
  getDatas,
  closeAlert,
  showAlert
})(DashboardLayout);


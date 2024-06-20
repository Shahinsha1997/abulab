import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData,multiAdd,multiTestAdd, getDatas, closeAlert, showAlert, multiAppointmentAdd } from '../dispatcher/action';
import { APPOINTMENTS_VIEW, EXPENSE_LABEL, LAB_VIEW, bind, getAppoinmentsData, getAsObj, getCurrentMonth, getDatasByProfit, getDrNameList, getFormFields, getLocalStorageData, getMessages, getTimeFilter, isSyncNowNeeded, scheduleSync, setCacheDatas, setLocalStorageData } from '../utils/utils';
import { addDataAPI, addTestDataAPI, getAppointmentDatasAPI, getDataAPI, getTestDataAPI } from '../actions/APIActions';
import { Alert, Snackbar } from '@mui/material';
class DashboardLayout extends Component {
  constructor(props){
    super(props)
    this.state={
      formType: '',
      from: 1,
      limit: 50,
      previousId: '',
      filteredDataIds:[],
      isFetching: false,
      filterObj:{
        timeFilter:'MonthWise', 
        typeFilter:'All',
        timeInput: getCurrentMonth(), 
        docInput:''
      },
      page:LAB_VIEW,
      tableColumns: Object.values(getFormFields('allFields')),
      syncStatus: true,
      addTry: 0,
      updateTry: 0,
      adminSection: false
    }
    this.dueWithMobile = {};
    this.previousID = '';
    this.isSyncInProgress = false;
    const methods = [
      'toggleForm',
      'getAllDatas',
      'setPreviousId',
      'applyFilters',
      'getFilteredDataIds',
      'getAlertContent',
      'setSyncStatus',
      'syncNowDatas',
      'toggleAdminSection',
      'setPage',
      'getAppoinmentDatas',
      'setIsFetching'
    ]
    bind.apply(this, methods);
  }
  setIsFetching(status){
    this.setState({
      isFetching: status
    })
  }
  setPreviousId(id){
    this.setState({previousId: id})
  }
  setPage(page){
    this.setState({
      page
    })
    if(page == APPOINTMENTS_VIEW){
      this.getAppoinmentDatas();
    }
  }
  toggleAdminSection(){
    const { adminSection } = this.state;
    this.setState({
      adminSection : !adminSection
    })
  }
  setSyncStatus(status){
    this.setState({
      syncStatus: status
    })
  }
  getAppoinmentDatas(){
    const { showAlert, multiAppointmentAdd } = this.props;
    this.setIsFetching(true)
    getAppointmentDatasAPI().then(res=>{
      this.setIsFetching(false)
      multiAppointmentAdd({data:res})
    }).catch(err=>{
      if(err == 404){
        return logoutUser();
      }
      this.setIsFetching(false)
      showAlert({type: 'error', 'message': "Internal Server Error"})
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
  syncNowDatas(){
    const { multiAdd, showAlert, multiTestAdd } = this.props;
    const { addTry=0, updateTry=0, addTestTry=0 } = this.state;
    const addPendingDatas = getLocalStorageData('addPendingDatas','[]');
    const updatePendingDatas = getLocalStorageData('updatePendingDatas','[]');
    const addTestDatas = getLocalStorageData('addTestDatas','[]');
    const type = addPendingDatas.length > 0 ? 'add' : updatePendingDatas.length > 0 ? 'update' : 'addTest'
    const apiMethod = type == 'addTest' ? addTestDataAPI : addDataAPI 
    const reducerMethod = type == 'addTest' ? multiTestAdd : multiAdd
    setLocalStorageData('lastSyncTime', Date.now());
    if((addPendingDatas.length > 0 || updatePendingDatas.length > 0  || addTestDatas.length > 0) && !this.isSyncInProgress){
      this.isSyncInProgress = true;
      this.setSyncStatus(false)
      return apiMethod(type).then((res)=>{
        reducerMethod({data:res})
        showAlert({type: 'success', message: getMessages(type).success})
        this.setSyncStatus(true)
        this.isSyncInProgress = false;
        scheduleSync(this.syncNowDatas, showAlert)
        this.setState({
          addTry: 0,
          updateTry : 0,
          addTestTry: 0
        }, ()=>this.syncNowDatas())
      }).catch(err=>{
        this.setSyncStatus(false)
        this.isSyncInProgress = false;
        if(addTry > 5 || updateTry > 5 || addTestTry > 5){
          return showAlert({type: 'error', message:'Please Contact Shahinsha...'})
        }
        this.setState({
          addTry: type == 'add' ? addTry + 1 : addTry,
          updateTry : type == 'update' ? updateTry + 1 : updateTry,
          addTestTry: type == 'addTest' ? addTestTry + 1 : addTestTry
        },()=>this.syncNowDatas(type))
        showAlert({type: 'error', message:getMessages(type).fail})
      })
    }
  }

  toggleForm(formType=''){
    this.setState({
      formType
    })
  }
  componentDidMount(){
    const { multiAdd, showAlert, getDatas } = this.props;
    scheduleSync(this.syncNowDatas, showAlert)
    const pendingDatas = getLocalStorageData('addPendingDatas', '[]');
    const updatePendingDatas = getLocalStorageData('updatePendingDatas','[]')
    getDatas({data: setCacheDatas({})})
    this.getAllDatas(()=>multiAdd({data:getAsObj([...pendingDatas, ...updatePendingDatas])}));
    
  }
  componentDidUpdate(prevProps, prevState){
    const { dataIds } = this.props;
    const { filteredDataIds, filterObj, syncStatus, page, isFetching } = this.state;
    const {
      timeFilter, 
      typeFilter
    } = filterObj
    const isIntialLoad =  dataIds.length != filteredDataIds.length && timeFilter == 'All' && typeFilter == 'All'
    if(prevState.page != page || isFetching != prevState.isFetching || prevProps.dataIds.length != dataIds.length || isIntialLoad || prevState.syncStatus != syncStatus ){
      this.getFilteredDataIds();
    }
  }
  getFilteredDataIds(){
    let { previousId, filterObj, tableColumns, page } = this.state;
    const {
      timeFilter='All', 
      typeFilter='', 
      timeInput, 
      docInput=''
    } = filterObj
    const isProfitFilter = ['profit','profitByDoc'].includes(typeFilter);
    let { 
      dataIds, 
      filteredIds, 
      filteredByDrName, 
      data, 
      showAlert, 
      appointmentObj 
    } = this.props;
    const dueWithMobile = {};
    dataIds.map(dataId=>{
      const { mobileNumber, dueAmount=0 } = data[dataId];
      if(dueAmount > 0 && mobileNumber.toString().length == 10){
        dueWithMobile[mobileNumber] = (dueWithMobile[mobileNumber] || 0) + dueAmount;
       }
    })
    console.log(dueWithMobile)
    this.dueWithMobile = dueWithMobile;
    dataIds = (docInput ? filteredByDrName[docInput.toLowerCase()] : filteredIds[typeFilter.toLowerCase()] || dataIds) || [];
    dataIds = getTimeFilter(dataIds, timeFilter, timeInput);
    if(isProfitFilter && timeFilter == 'All'){
      showAlert({'type': 'info', 'message':'Profit Values will be shown except All in Time Frame'})
    }
    if(page == APPOINTMENTS_VIEW){
      tableColumns = Object.values(getFormFields(APPOINTMENTS_VIEW));
      dataIds = getAppoinmentsData(Object.values(appointmentObj))
    }
    else if(isProfitFilter && timeFilter != 'All'){
      let profitObj = getDatasByProfit(dataIds, data, typeFilter, timeFilter)
      dataIds = profitObj['dataIds']
      tableColumns = Object.values(getFormFields(typeFilter));
   }else{
    dataIds = dataIds.map(dataId=>{
      const { status } = data[dataId];
       if(status != EXPENSE_LABEL && !previousId && !this.previousID){
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
  getAllDatas(callbk){
    const { from , limit } = this.state;
    const { getDatas, showAlert, logoutUser, multiTestAdd } = this.props;
    const promises = [getDataAPI(),getTestDataAPI()]
    Promise.all(promises).then(res=>{
      const datas = res[0];
      const testDatas = res[1];
      getDatas({data: datas, from})
      multiTestAdd({data:testDatas})
      callbk && callbk();
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
    const { 
      logoutUser, 
      data, 
      addData, 
      multiAdd, 
      isAdmin, 
      appConfig, 
      closeAlert, 
      showAlert, 
      isLogoutDisabled, 
      drNamesList,
      testObj,
      multiTestAdd,
      testArr,
      dataIds,
      appointmentObj
    } = this.props
    const { 
      formType,
      previousId, 
      filteredDataIds, 
      tableColumns, 
      filterObj ,
      adminSection,
      page,
      isFetching
    } = this.state;
    const { alertOptions={} } = appConfig
    return (
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            alignItems: 'stretch'
          }}
      >
        { alertOptions.type ? (
          this.getAlertContent()
        ) : null}
       <Box sx={{width: { xs: '50px', sm: '100px', md: '200px' }, flexShrink: 0 }}>
        <LeftPanel 
          isAdmin={isAdmin} 
          isLogoutDisabled={isLogoutDisabled} 
          toggleForm={this.toggleForm} 
          logoutUser={logoutUser} 
          patientCount={filteredDataIds.length}
          toggleAdminSection={this.toggleAdminSection}
          adminSection={adminSection}
          syncNow={isSyncNowNeeded() && this.syncNowDatas}
          setPage={this.setPage}
          page={page}
        />
        </Box>
        <Box sx={{flexGrow:1, overflow: 'hidden' }}>
        <RightPanel 
          addData={addData} 
          toggleForm={this.toggleForm} 
          formType={formType}
          data={page == APPOINTMENTS_VIEW ? appointmentObj : data}
          allDataIds={dataIds}
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
          drNamesList={drNamesList}
          testArr={testArr}
          testObj={testObj}
          multiTestAdd={multiTestAdd}
          adminSection={adminSection}
          page={page}
          isFetching={isFetching}
          dueWithMobile={this.dueWithMobile}
        />
        </Box>
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  const { 
    data, 
    dataIds,
    filteredIds, 
    filteredByDrName, 
    user, 
    appConfig, 
    testObj:testArr,
    appointmentObj
  } = state;
  const { isAdmin, id } = user;
  return {
    data,
    dataIds,
    filteredIds,
    filteredByDrName, 
    isAdmin,
    appConfig,
    isLogoutDisabled: id  == '1714472861155',
    drNamesList: getDrNameList(data,dataIds),
    testArr: Object.values(testArr),
    testObj: getAsObj(Object.values(testArr),'testName').obj,
    appointmentObj
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
  multiAppointmentAdd
})(DashboardLayout);


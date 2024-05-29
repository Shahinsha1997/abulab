import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData,multiAdd,multiTestAdd, getDatas, closeAlert, showAlert } from '../dispatcher/action';
import { EXPENSE_LABEL, bind, getAsObj, getDatasByProfit, getDrNameList, getFormFields, getLocalStorageData, getTimeFilter, isSyncNowNeeded, setLocalStorageData } from '../utils/utils';
import { addDataAPI, addTestDataAPI, getDataAPI, getTestDataAPI } from '../actions/APIActions';
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
      filterObj:{},
      tableColumns: Object.values(getFormFields('allFields')),
      syncStatus: true,
      addTry: 0,
      updateTry: 0,
      totalExpense: 0,
      totalIncome: 0,
      totalOutstanding: 0
    }
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
      'syncTestDatas'
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
  syncTestDatas(){
    const { multiTestAdd } = this.props;
    const addTestDatas = getLocalStorageData('addTestDatas','[]');
    if(addTestDatas.length > 0){
      return addTestDataAPI().then(res=>{
        multiTestAdd({data:res})
      })
    }
  }
  syncNowDatas(){
    const { multiAdd, showAlert } = this.props;
    const { addTry, updateTry } = this.state;
    const addPendingDatas = getLocalStorageData('addPendingDatas','[]');
    const updatePendingDatas = getLocalStorageData('updatePendingDatas','[]');
    const type = addPendingDatas.length > 0 ? 'add' : 'update'
    this.syncTestDatas();
    if((addPendingDatas.length > 0 || updatePendingDatas.length > 0 ) && !this.isSyncInProgress){
      this.isSyncInProgress = true;
      this.setSyncStatus(false)
      return addDataAPI(type).then((res)=>{
        multiAdd({data:res})
        showAlert({type: 'success', message: type == 'add' ? "Datas Sync done successfully..." : "Datas Updated Successfully"})
        this.setSyncStatus(true)
        this.isSyncInProgress = false;
        this.setState({
          addTry: type == 'add' ? 0 : addTry,
          updateTry : type != 'add' ? 0 : updateTry
        }, ()=>type == 'add' && updatePendingDatas.length ? this.syncNowDatas() : '')
      }).catch(err=>{
        this.setSyncStatus(true)
        if(addTry > 5 || updateTry > 5){
          return showAlert({type: 'error', message:'Please Contact Shahinsha...'})
        }
        this.setState({
          addTry: type == 'add' ? addTry + 1 : addTry,
          updateTry : type != 'add' ? updateTry + 1 : updateTry
        },()=>this.syncNowDatas(type))
        console.log('Err',err)
        showAlert({type: 'error', message:type == 'add'  ?  "Datas doesn't sync properly..." : "Datas doesn't updated successfully"})
      })
    }
  }

  toggleForm(formType=''){
    this.setState({
      formType
    })
  }
  componentDidMount(){
    const { multiAdd } = this.props;
    const pendingDatas = getLocalStorageData('addPendingDatas', '[]');
    const updatePendingDatas = getLocalStorageData('updatePendingDatas','[]')
    this.getAllDatas(()=>multiAdd({data:getAsObj([...pendingDatas, ...updatePendingDatas])}));
    
  }
  componentDidUpdate(prevProps, prevState){
    const { dataIds } = this.props;
    const { filteredDataIds, filterObj } = this.state;
    const {
      timeFilter='All', 
      typeFilter='All'
    } = filterObj
    const isIntialLoad =  dataIds.length != filteredDataIds.length && timeFilter == 'All' && typeFilter == 'All'
    if(prevProps.dataIds.length != dataIds.length || isIntialLoad || prevState.syncStatus != this.state.syncStatus ){
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
    let totalIncome =0;
    let totalExpense = 0;
    let totalOutstanding = 0;
    const isProfitFilter = ['profit','profitByDoc'].includes(typeFilter);
    let { dataIds, filteredIds, filteredByDrName, data, showAlert } = this.props;
    dataIds = (docInput ? filteredByDrName[docInput.toLowerCase()] : filteredIds[typeFilter.toLowerCase()] || dataIds) || [];
    dataIds = getTimeFilter(dataIds, timeFilter, timeInput);
    if(isProfitFilter && timeFilter == 'All'){
      showAlert({'type': 'info', 'message':'Profit Values will be shown except All in Time Frame'})
    }
    if(isProfitFilter && timeFilter != 'All'){
      let profitObj = getDatasByProfit(dataIds, data, typeFilter, timeFilter)
      totalIncome = profitObj['totalIncome']
      totalExpense = profitObj['totalExpense']
      totalOutstanding = profitObj['totalOutstanding']
      dataIds = profitObj['dataIds']
      tableColumns = Object.values(getFormFields(typeFilter));
   }else{
    dataIds = dataIds.map(dataId=>{
      const { totalAmount=0, dueAmount=0, paidAmount=0, status } = data[dataId];
       if(status != EXPENSE_LABEL && !previousId && !this.previousID){
        this.previousID = data[dataId].patientId
         this.setPreviousId(this.previousID)
       }
       if(status == EXPENSE_LABEL){
        totalExpense += parseInt(totalAmount) 
       }else{
        totalIncome += parseInt(paidAmount)
        if(isNaN(totalIncome)){
          console.log(dataId)
        }
        totalOutstanding += parseInt(dueAmount || 0)
       }
       return data[dataId]
     })
    tableColumns = Object.values(getFormFields('allFields'))
   }
    this.setState({
      filteredDataIds: dataIds,
      tableColumns,
      totalIncome,
      totalExpense,
      totalOutstanding
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
      testArr
    } = this.props
    const { 
      formType,
      previousId, 
      filteredDataIds, 
      tableColumns, 
      filterObj ,
      totalIncome,
      totalExpense,
      totalOutstanding
    } = this.state;
    const { alertOptions={} } = appConfig
    return (
        <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr', 
          minHeight: '100vh'
        }}
      >
        { alertOptions.type ? (
          this.getAlertContent()
        ) : null}
       
        <LeftPanel 
          totalIncome={totalIncome} 
          totalExpense={totalExpense} 
          totalOutstanding={totalOutstanding} 
          isAdmin={isAdmin} 
          isLogoutDisabled={isLogoutDisabled} 
          toggleForm={this.toggleForm} 
          logoutUser={logoutUser} 
          patientCount={filteredDataIds.length}
          syncNow={isSyncNowNeeded() && this.syncNowDatas}
        />
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
          drNamesList={drNamesList}
          testArr={testArr}
          testObj={testObj}
          multiTestAdd={multiTestAdd}
        />
      </Box>
      
    );
  }
}


const mapStateToProps = (state)=>{
  const { data, dataIds,filteredIds, filteredByDrName, user, appConfig, testObj:testArr } = state;
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
    testObj: getAsObj(Object.values(testArr),'testName').obj
  }
}

export default connect(mapStateToProps,{
  logoutUser,
  addData,
  multiAdd,
  getDatas,
  closeAlert,
  showAlert,
  multiTestAdd
})(DashboardLayout);


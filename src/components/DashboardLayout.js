import React, { Component } from 'react';
import LeftPanel from './Leftpanel';
import RightPanel from './RightPanel';
import '../css/dashboardstyles.css'
import { Box, Grid, useMediaQuery, IconButton,Typography, MenuItem, Menu, ListItemIcon, ListItemText, Button, LinearProgress } from '@mui/material';
import { connect } from 'react-redux';
import { logoutUser, addData,multiAdd,multiTestAdd, getDatas, closeAlert, showAlert, multiAppointmentAdd, deleteData } from '../dispatcher/action';
import { APPOINTMENTS_VIEW, PERSONAL_EXPENSE_VIEW, EXPENSE_LABEL, LAB_VIEW, LIST_VIEW, TABLE_VIEW, bind, clearCache, getAppoinmentsData, getAsObj, getCurrentMonth, getDatasByProfit, getDrNameList, getFormFields, getLocalStorageData, getMessages, getTimeFilter, isSyncNowNeeded, scheduleSync, setCacheDatas, setLocalStorageData, DUEALARM_VIEW, getDueAlarmedDatas, getBlockedUserDatas, BLOCKED_USER_VIEW, BLOCKABLE_USER_VIEW, getBlockAbleUserDatas, MULTI_REPORT_ADD, MULTI_TEST_ADD, getReportObj, DUE_ADD } from '../utils/utils';
import { addDataAPI, addReportDataAPI, addTestDataAPI, deleteDataAPI, getAppointmentDatasAPI, getDataAPI, getReportDataAPI, getTestDataAPI } from '../actions/APIActions';
import { Alert, Snackbar } from '@mui/material';
import EventSharpIcon from '@mui/icons-material/EventSharp';
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { CampaignOutlined, CloseOutlined } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import SyncIcon from '@mui/icons-material/Sync';
import TableViewIcon from '@mui/icons-material/TableView';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { getDataIds } from '../selectors/incomeselectors';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteTwoTone';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import BlockIcon from '@mui/icons-material/Block';
import ErrorBoundary from './ErrorBoundary';
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
      isLoading:false,
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
      adminSection: false,
      isListHide: false,
      filterPopup: false,
      addPopup: null,
      popupType: '',
      viewType: LIST_VIEW
    }
    this.dueWithMobile = {};
    this.patientIdObj = {}
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
      'setIsFetching',
      'setListHide',
      'toggleFilterPopup',
      'getRightPanel',
      'getBottomPanel',
      'toggleViewType',
      'deleteData',
      'toggleDueFollowPage',
      'togglePage'
    ]
    bind.apply(this, methods);
  }
  deleteData(id){
    const { showAlert, deleteData } = this.props;
    this.setState({isLoading:true})
    deleteDataAPI(id).then(res=>{
      this.setState({isLoading:false})
      deleteData({'data':{'obj':id}})
      showAlert({type: 'success', message:"Data deleted Successfully."})
    }).catch(err=>{
      this.setState({isLoading:false})
      let message = 'Unable to Process Your request.'
      if(err == '401'){
        message = "You're not authorized to do this action"
      }else if(err == '500'){
        message = 'Internal Server Error'
      }else if(err == '404'){
        message = 'Requested Data was not found'
      }
      showAlert({type: 'error', message})
    })
  }
  toggleFilterPopup(){
    const { filterPopup } = this.state;
    this.setState({
      filterPopup: !filterPopup
    }) 
  }
  setIsFetching(status){
    this.setState({
      isFetching: status
    })
  }
  setPreviousId(id){
    this.setState({previousId: id})
  }
  setListHide(value){
    this.setState({isListHide:value})
  }
  toggleViewType(){
    const { viewType } = this.state;
    this.setState({viewType: viewType == LIST_VIEW ? TABLE_VIEW : LIST_VIEW})
  }
  setPage(page){
    const { adminSection} = this.state
    this.setState({
      page,
      adminSection: page == APPOINTMENTS_VIEW ? false : adminSection
    })
    if(page == APPOINTMENTS_VIEW){
      this.getAppoinmentDatas();
    }
  }
  toggleDueFollowPage(){
    const { page } = this.state;
    this.setPage(page == DUEALARM_VIEW ? LAB_VIEW : DUEALARM_VIEW);
  }
  togglePage(newPage){
    const { page } = this.state;
    this.setPage(page ==  newPage ? LAB_VIEW : newPage);
  }
  toggleAdminSection(){
    const { adminSection, page } = this.state;
    this.setState({
      adminSection : !adminSection,
      page: !adminSection ? LAB_VIEW : page
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
    const { addTry=0, updateTry=0, addTestTry=0, addReportTry=0 } = this.state;
    const addPendingDatas = getLocalStorageData('addPendingDatas','[]');
    const updatePendingDatas = getLocalStorageData('updatePendingDatas','[]');
    const addTestDatas = getLocalStorageData('addTestDatas','[]');
    const addReportDatas = getLocalStorageData('addReportDatas','[]');
    const type = addPendingDatas.length > 0 ? 'add' : updatePendingDatas.length > 0 ? 'update' : addReportDatas.length > 0 ? 'addReportDatas' : 'addTest'
    const apiMethod = type == 'addTest' ? addTestDataAPI : type == 'addReportDatas' ? addReportDataAPI : addDataAPI 
    const reducerMethod = type == 'addTest' ? multiTestAdd : multiAdd
    setLocalStorageData('lastSyncTime', Date.now());
    const handleBeforeunload = (e)=>{e.preventDefault()}
    if((addPendingDatas.length > 0 || updatePendingDatas.length > 0  || addTestDatas.length > 0 || addReportDatas.length > 0) && !this.isSyncInProgress){
      this.isSyncInProgress = true;
      this.setSyncStatus(false);
      window.addEventListener('beforeunload', handleBeforeunload);
      return apiMethod(type).then((res)=>{
        if(['add','update'].includes(type)){
          reducerMethod({data:res.datas})
          multiTestAdd({data:res.dueObj, key: 'dueObj'},DUE_ADD)
        }else{
          reducerMethod({data:res, type: type == 'addReportDatas' ? MULTI_REPORT_ADD : MULTI_TEST_ADD})
        }
        showAlert({type: 'success', message: getMessages(type).success})
        this.setSyncStatus(true)
        this.isSyncInProgress = false;
        scheduleSync(this.syncNowDatas, showAlert)
        window.removeEventListener('beforeunload',handleBeforeunload); 
        this.setState({
          addTry: 0,
          updateTry : 0,
          addTestTry: 0,
          addReportTry: 0
        }, ()=>this.syncNowDatas())
      }).catch(err=>{
        window.removeEventListener('beforeunload',handleBeforeunload); 
        this.setSyncStatus(false)
        this.isSyncInProgress = false;
        if(addTry > 5 || updateTry > 5 || addTestTry > 5 || addReportTry > 5){
          return showAlert({type: 'error', message:'Please Contact Shahinsha...'})
        }
        this.setState({
          addTry: type == 'add' ? addTry + 1 : addTry,
          updateTry : type == 'update' ? updateTry + 1 : updateTry,
          addTestTry: type == 'addTest' ? addTestTry + 1 : addTestTry,
          addReportTry: type == 'addReportDatas' ? addReportTry + 1 : addReportTry
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
    const { multiAdd, showAlert,multiTestAdd, getDatas } = this.props;
    scheduleSync(this.syncNowDatas, showAlert)
    const pendingDatas = getLocalStorageData('addPendingDatas', '[]');
    const updatePendingDatas = getLocalStorageData('updatePendingDatas','[]')
    getDatas({data: setCacheDatas({})})
    this.getAllDatas(()=>{
      multiAdd({data:getAsObj([...pendingDatas, ...updatePendingDatas])})
      multiTestAdd({data:getAsObj([...getLocalStorageData('addTestDatas', '[]')])}, MULTI_TEST_ADD)
      multiTestAdd({data:getAsObj([...getLocalStorageData('addReportDatas', '[]')])}, MULTI_REPORT_ADD)
    });
    
  }
  componentDidUpdate(prevProps, prevState){
    const { dataIds, data } = this.props;
    const { filteredDataIds, filterObj, syncStatus, page, isFetching, previousId } = this.state;
    const {
      timeFilter, 
      typeFilter
    } = filterObj
    const isIntialLoad =  dataIds.length != filteredDataIds.length && timeFilter == 'All' && typeFilter == 'All'
    if(prevProps.dataIds.length != dataIds.length){
      this.setState({previousId:''})
      this.previousID = ''
    }
    if(
        prevState.page != page || 
        previousId != prevState.previousId ||
        isFetching != prevState.isFetching ||
        prevProps.dataIds.length != dataIds.length ||
        isIntialLoad || 
        prevState.syncStatus != syncStatus 
      ){
      this.getFilteredDataIds();
    };
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
      personalExpenseIds,
      filteredByStatus, 
      filteredByDrName, 
      data, 
      showAlert, 
      appointmentObj,
      filteredByBlocked
    } = this.props;
    const dueWithMobile = {};
    const patientIdObj = {};
    filteredByStatus.outstanding.map(dataId=>{
      const { mobileNumber, dueAmount=0, patientId, isBlockedUser,time  } = data[dataId];
      if(dueAmount > 0 && mobileNumber.toString().length == 10){
        const {
          dueAmount: existDueAmount=0,
          isBlockedUser: existBlocked=false, 
          added_time: existTime=0  
        } = dueWithMobile[mobileNumber] || {};
        dueWithMobile[mobileNumber] = {
          dueAmount:existDueAmount + dueAmount,
          isBlockedUser: existBlocked || isBlockedUser,
          added_time: existTime == 0 ? time : (existTime > time) ? time : existTime
        };
       }
       patientIdObj[patientId] = dataId;
    })
    this.dueWithMobile = dueWithMobile;
    this.patientIdObj = patientIdObj
    dataIds = (page == PERSONAL_EXPENSE_VIEW ? personalExpenseIds : (docInput ? filteredByDrName[docInput.toLowerCase()] : filteredByStatus[typeFilter.toLowerCase()] || dataIds || []).filter(id=>!personalExpenseIds.includes(id)));
    dataIds = getTimeFilter({dataIds, timeFilter, timeInput, data});
    if(isProfitFilter && timeFilter == 'All'){
      showAlert({'type': 'info', 'message':'Profit Values will be shown except All in Time Frame'})
    }
    if(page == APPOINTMENTS_VIEW){
      tableColumns = Object.values(getFormFields(APPOINTMENTS_VIEW));
      dataIds = getAppoinmentsData(Object.values(appointmentObj))
    }else if(page == DUEALARM_VIEW){
      tableColumns = Object.values(getFormFields(DUEALARM_VIEW));
      dataIds = getDueAlarmedDatas(filteredByStatus.outstanding, data)
    }else if(page == BLOCKED_USER_VIEW){
      tableColumns = Object.values(getFormFields(BLOCKED_USER_VIEW));
      dataIds = getBlockedUserDatas(filteredByBlocked, data, dueWithMobile);
    }else if(page == BLOCKABLE_USER_VIEW){
      tableColumns = Object.values(getFormFields(BLOCKED_USER_VIEW));
      dataIds = getBlockAbleUserDatas(filteredByStatus.outstanding, data, dueWithMobile);
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
      tableColumns,
      isListHide: false
    })
  }
  getAllDatas(callbk){
    const { from , limit } = this.state;
    const { getDatas, showAlert, logoutUser, multiTestAdd } = this.props;
    const promises = [getDataAPI(),getTestDataAPI(),getReportDataAPI()]
    this.setState({isLoading:true})
    Promise.all(promises).then(res=>{
    this.setState({isLoading:false})
      const {datas, dueObj} = res[0];
      const testDatas = res[1];
      const reportDatas = res[2];
      getDatas({data: datas, from})
      multiTestAdd({data:testDatas})
      multiTestAdd({data:reportDatas},MULTI_REPORT_ADD)
      multiTestAdd({data:dueObj, key: 'dueObj'},DUE_ADD)
      callbk && callbk();
    }).catch(err=>{
      this.setState({isLoading:false})
      console.log(err)
      if(err == 404){
        return logoutUser();
      }
      showAlert({type: 'error', 'message': "Internal Server Error"})
    })
  }
  applyFilters(filters){
    this.setState({
      filterObj : filters,
      page: LAB_VIEW,
      filterPopup: false
    }, this.getFilteredDataIds)
  }
  getBottomPanel = ()=>{
    const { 
      logoutUser, 
      isAdmin, 
      appConfig, 
      isLogoutDisabled, 
      isMobile,
      isDueAlarmNeeded
    } = this.props
    const { 
      filteredDataIds, 
      adminSection,
      page,
      addPopup,
      popupType,
      viewType
    } = this.state;

  const handleClick = (event,type) => {
    this.setState({addPopup: event.currentTarget, popupType: type});
  };
  const handleClose = () => {
    this.setState({addPopup: null});
  };
    let options = [
      { label: 'Due Followup', icon: <CampaignOutlined sx={{fontSize:'25px', color:isDueAlarmNeeded ? 'yellow': 'white'}} />, handleClick:this.toggleDueFollowPage },
      { isHidden: !isAdmin, label: 'Admin Panel', icon: adminSection ? <AdminPanelSettingsTwoToneIcon/> : <AdminPanelSettingsIcon />, handleClick:this.toggleAdminSection },
      { label: 'Add', icon: <AddIcon />, handleClick:(e)=>handleClick(e,'addPopup')},
      { isHidden: !isAdmin,label: 'Personal', icon: page == PERSONAL_EXPENSE_VIEW ? <RequestQuoteOutlinedIcon/> : <RequestQuoteIcon />, handleClick: ()=>this.setPage(page != PERSONAL_EXPENSE_VIEW ? PERSONAL_EXPENSE_VIEW : LAB_VIEW)},
      { label: 'More', icon: <MoreVertIcon/>, handleClick: (e)=>handleClick(e,'morePopup') },
    ];
    const addOptions = [
      { label: 'Add Income', icon: <AddIcon />, handleClick:()=>{handleClose();this.toggleForm('addIncome')}},
      { label: 'Add Expense', icon: <AddIcon />, handleClick:()=>{handleClose();this.toggleForm('addExpenses')} },
      { isHidden: !isAdmin, label: 'Add Personal Expenses', icon: <AddIcon />, handleClick:()=>{handleClose();this.toggleForm('addPersonalExpenses')} },
      { label: 'Add/Update Test', icon: <AddIcon />, handleClick:()=>{handleClose();this.toggleForm('addTests')} },
      { label: 'Add/Update Report Details', icon: <AddIcon />, handleClick:()=>{handleClose();this.toggleForm('addReports')} },
      { label: 'Add Appointment', icon: <AddIcon />, handleClick:()=>window.open('/appointments','_self') },
      { label: 'Close', icon: <CloseOutlined />, handleClick:handleClose},
    ];
    let moreOptions = [
      { isHidden: !isAdmin, label: 'Blockable User List', icon: <BlockIcon />, handleClick:()=>{this.togglePage(BLOCKABLE_USER_VIEW),handleClose()} },
      { isHidden: !isAdmin, label: 'Blocked User List', icon: <BlockIcon />, handleClick:()=>{this.togglePage(BLOCKED_USER_VIEW),handleClose()} },
      { label: 'Filter', icon: <FilterAltIcon />, handleClick:this.toggleFilterPopup },
      { label: 'Appointments', icon: page == APPOINTMENTS_VIEW ? <EventTwoToneIcon /> : <EventSharpIcon/>, handleClick: ()=>this.setPage(page != APPOINTMENTS_VIEW ? APPOINTMENTS_VIEW : LAB_VIEW)},
      { isHidden: !isSyncNowNeeded(), label: 'Sync Now', icon: <SyncIcon />, handleClick: this.syncNowDatas },
      { label: 'Clear Cache', icon: <NotInterestedIcon  />, handleClick: clearCache },
      { label: `Switch to ${viewType == LIST_VIEW ? 'Table View' : 'List View'}`, icon: viewType == LIST_VIEW ? <TableViewIcon /> : <ListAltIcon />, handleClick: ()=>{handleClose();this.toggleViewType()} },
      { label: 'Logout', icon: <LogoutIcon disabled={isLogoutDisabled} sx={{color:'red'}} />, sx:{color:'red'}, handleClick: logoutUser },
      { label: 'Close', icon: <CloseOutlined />, handleClick:handleClose},
    ];
    const poupOptions = popupType == 'addPopup' ? addOptions : moreOptions;
      return ( 
        <Box sx={{display:'flex', flexDirection:'row'}}>
           <Grid container sx={{ display: 'flex', flexShrink:0 }} spacing={options.length == 5 ? 1.5 : 15}>
        {options.map((option, index) => (
          <Grid item key={option.label} sx={{visibility: option.isHidden ? 'hidden' : 'visible'}}>
            <IconButton onClick={option.handleClick} sx={{color:'white', ...option.sx, fontSize:['0.7rem','1rem','1.3rem']}}> 
              <Grid container direction="column" alignItems="center"> 
                <Grid item>
                  {option.icon}
                </Grid>
                <Grid item>
                  <Typography variant="body2" noWrap component="div" sx={{ fontSize: ['0.7rem','1rem','1.3rem'] }}>
                    {option.label}
                  </Typography>
                </Grid>
              </Grid>
            </IconButton>
          </Grid>
        ))}
      </Grid>
      <Menu
        id="menu-add-options"
        anchorEl={addPopup}
        open={addPopup}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'menu-add-options' }}
      >
        {poupOptions.map((option, index) => (
        <MenuItem onClick={option.handleClick} sx={{display: option.isHidden ? 'none' : '',...(option.sx || {})}}>
          <ListItemIcon>
            {option.icon}
          </ListItemIcon>
          <ListItemText>{option.label}</ListItemText>
        </MenuItem>
        ))}
      </Menu>
        </Box>
      )
  }
  getRightPanel = ()=>{
    const { 
      data, 
      addData, 
      multiAdd, 
      isAdmin, 
      showAlert, 
      drNamesList,
      testObj,
      multiTestAdd,
      testArr,
      dataIds,
      appointmentObj,
      reportObj,
      reportDetails,
      otherConfig
    } = this.props
    const { 
      formType,
      previousId, 
      filteredDataIds, 
      tableColumns, 
      filterObj ,
      adminSection,
      page,
      isFetching,
      isListHide,
      filterPopup,
      viewType
    } = this.state;
    return (
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
        reportObj={reportObj}
        reportDetails={reportDetails}
        multiTestAdd={multiTestAdd}
        adminSection={adminSection}
        page={page}
        isFetching={isFetching}
        dueWithMobile={this.dueWithMobile}
        patientIdObj={this.patientIdObj}
        isListHide={isListHide}
        setListHide={this.setListHide}
        toggleFilterPopup={this.toggleFilterPopup}
        filterPopup={filterPopup}
        viewType={viewType}
        deleteData={this.deleteData}
        otherConfig={otherConfig}
      />
    )
  }
  render() {
    const { 
      logoutUser, 
      isAdmin, 
      appConfig, 
      isLogoutDisabled, 
      isMobile,
      isDueAlarmNeeded
    } = this.props
    const { 
      filteredDataIds, 
      adminSection,
      page,
      isLoading
    } = this.state;
    const { alertOptions={} } = appConfig
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
        
        { alertOptions.type ? (
          this.getAlertContent()
        ) : null }
        {isMobile ? (
          <Box sx={{display:'flex', flexDirection:'column', overflow:'hidden'}}>
            <Box sx={{display:'flex'}}>
              <ErrorBoundary from="rightpanel">
                {this.getRightPanel()}
              </ErrorBoundary>
            </Box>
            <Box sx={{display:'flex',height:'10vh', background:'#252b38', color:'white', border:'1px solid white', borderRadius:'10px'}}>
              {this.getBottomPanel()}
            </Box>
          </Box>
        ) : (
          <>
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
              toggleFilterPopup={this.toggleFilterPopup}
              isDueAlarmNeeded={isDueAlarmNeeded}
            />
             <ErrorBoundary from="rightpanel">
              {this.getRightPanel()}
              </ErrorBoundary>
          </>
        )}
      </Box>
      </Box>
    );
  }
}


const mapStateToProps = (state,props)=>{
  const { 
    user, 
    appConfig, 
    testObj:testArr,
    reportObj,
    appointmentObj,
    otherConfig
  } = state;
  const { isMobile } = props;
  const { isAdmin, id } = user;
  const { 
    dataIds, 
    personalExpenseIds,
    filteredByDrName, 
    filteredByStatus, 
    filteredByBlocked,
    datas:data, 
    drNamesList,
    isDueAlarmNeeded
  } = getDataIds(state);
  return {
    data,
    dataIds,
    personalExpenseIds,
    filteredByStatus,
    filteredByDrName, 
    isAdmin,
    appConfig,
    isLogoutDisabled: id  == '1714472861155',
    drNamesList,
    testArr: Object.values(testArr),
    testObj: getAsObj(Object.values(testArr),'testName').obj,
    reportObj,
    reportDetails: getReportObj(reportObj),
    appointmentObj,
    isMobile,
    isDueAlarmNeeded,
    filteredByBlocked,
    otherConfig
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


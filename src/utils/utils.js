import { showAlert } from "../dispatcher/action";

export const EXPENSE_LABEL = 'Expense'
export const INCOME_LABEL = 'Income'
export const OUTSTANDING_LABEL = 'Outstanding';
export const PREFIX_NAMES_LIST = ['Mrs.','Mr.','Baby.','Miss.','Mast.'];
export const ONE_DAY_IN_MS = 24*60*60*1000
export const APPOINTMENTS_VIEW = 'Appointments_View';
export const LAB_VIEW = 'Lab_View'
export const TABLE_VIEW = 'TABLE_VIEW';
export const LIST_VIEW = 'LIST_VIEW'
export const changePathName = (pathName)=>{
    window.history.pushState({},'page',pathName);
}

export const getLocalStorageData = (key, defaultValue='{}',isParseNeeded=true)=>{
    if(isParseNeeded){
        return JSON.parse(localStorage[key] || defaultValue)
    }
    return localStorage[key] || defaultValue
    
}
export const setLocalStorageData =(key,obj={}, isParseNeeded=true)=>{
    localStorage[key] = !isParseNeeded ? obj : JSON.stringify(obj)
}

export const clearLocalStorage = ()=> localStorage.clear();
export const getProperId = (id) =>{
    id = parseInt(id);
    return id < 10 ? `00${id}` : id < 99 ? `0${id}` : id;
}
export const getStatus = (isIncomeForm, dueAmount)=>{
    return isIncomeForm ? (dueAmount > 0 ? OUTSTANDING_LABEL : INCOME_LABEL) : EXPENSE_LABEL;
}
export const getTimeWithDate = (ms)=>{
  const date = new Date(ms);
  const now = new Date();
  if (date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()) {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${amPm}`;
  }

  // Check if it's this year
  if (date.getFullYear() === now.getFullYear()) {
    const options = {hour: 'numeric', minute: 'numeric', hour12: true };
    return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}, ${date.toLocaleTimeString('en-US', options)}`;
  }

  // Otherwise, format for previous years
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}, ${date.toLocaleTimeString('en-US', options)}`
}
export const getIdPrefix = (value)=>{
    value = value && (getProperId(value)) || ''
    return value? `AL-${value}` : 'AL-'
}
export const getFormFields = (fieldType)=>{
    return {
        'allFields' : {
            'isScheduled' : {
                id: 'isScheduled',
                label: 'More Options',
                'maxWidth': '50px'
            },
            'time' : {
                id: 'time',
                label: 'Date & Time',
                'maxWidth': '120px'
            },
            'patientId' : {
                id: 'patientId',
                label: 'Patient ID',
                'maxWidth': '75px'
            },
            'name' : {
                id: 'name',
                label: 'Name',
                'maxWidth': '120px'
            },
            'mobileNumber' : {
                id: 'mobileNumber',
                label: 'Mobile Number',
                'maxWidth': '75px'
            },
            'drName' : {
                id: 'drName',
                label: 'Doctor Name',
                'maxWidth': '120px'
            },
            'status' : {
                id: 'status',
                label: 'Status',
                'maxWidth': '75px'
            },
            'description' : {
                id: 'description',
                label: 'Test List',
                'maxWidth': '150px'
            },
            'totalAmount' : {
                id: 'totalAmount',
                label: 'Total Amount',
                'maxWidth': '100px'
            },
            'discount' : {
                id: 'discount',
                label: 'Discount',
                'maxWidth': '80px'
            },
            'paidAmount' : {
                id: 'paidAmount',
                label: 'Paid Amount',
                'maxWidth': '80px'
            },
            'dueAmount' : {
                id: 'dueAmount',
                label: 'Due Amount',
                'maxWidth': '80px'
            },
            'comments' : {
                id: 'comments',
                label: 'Comments / Remarks',
                'maxWidth': '150px'
            }
        },
        'profit' : {
            'time' : {
                id: 'time',
                label: 'Date & Time',
                'maxWidth': '150px'
            },
            'profit' : {
                id: 'profit',
                label: 'Profit',
                'maxWidth': '150px'
            },
            'income' : {
                id: 'income',
                label: 'Income',
                'maxWidth': '150px'
            },
            'discount' : {
                id: 'discount',
                label: 'Discount',
                'maxWidth': '150px'
            },
            'outstanding' : {
                id: 'outstanding',
                label: 'Outstanding',
                'maxWidth': '150px'
            },
            'expense' : {
                id: 'expense',
                label: 'Expense',
                'maxWidth': '150px'
            }
        },
        'profitByDoc' : {
            'drName' : {
                id: 'drName',
                label: 'Doctor Name',
                'maxWidth': '150px'
            },
            'profit' : {
                id: 'profit',
                label: 'Profit',
                'maxWidth': '150px'
            },
            'income' : {
                id: 'income',
                label: 'Income',
                'maxWidth': '150px'
            },
            'discount' : {
                id: 'discount',
                label: 'Discount',
                'maxWidth': '150px'
            },
            'outstanding' : {
                id: 'outstanding',
                label: 'Outstanding',
                'maxWidth': '150px'
            },
            'expense' : {
                id: 'expense',
                label: 'Expense',
                'maxWidth': '150px'
            }
        },
        [APPOINTMENTS_VIEW] : {
            'otherOptions' : {
                id:'otherOptions',
                label: 'More Options',
                'maxWidth': '100px'
            },
            'id' : {
                id: 'id',
                label: 'ID',
                'maxWidth': '80px'
            },
            'name' : {
                id: 'name',
                label: 'name',
                'maxWidth': '150px'
            },
            'age' : {
                id: 'age',
                label: 'Age',
                'maxWidth': '150px'
            },
            'mobileNumber' : {
                id: 'mobileNumber',
                label: 'Mobile Number',
                'maxWidth': '150px'
            },
            'address' : {
                id: 'address',
                label: 'Address',
                'maxWidth': '200px'
            },
            'appointmentDate' : {
                id: 'appointmentDate',
                label: 'Appointment Date',
                'maxWidth': '150px'
            },
            'drName': {
                id: 'drName',
                label: 'Doctor Name',
                'maxWidth': '150px'
            }
        }
    }[fieldType]
}
export const getCellFormattedVal = (cellName, value='', statusType, filterType)=>{
    if(['profit','profitByDoc'].includes(filterType)){
        return value == '' ? '-' : value;
    }
    if(cellName == 'time'){
        return getTimeWithDate(value)
    }else if(cellName == 'patientId' && statusType != EXPENSE_LABEL){
        return getIdPrefix(value)
    }else if(cellName == 'appointmentDate'){
        const isToday = new Date().setHours(0,0,0,0);
        const isTomorrow = isToday + ONE_DAY_IN_MS;
        if(value == isToday){
            return 'Today'
        }else if(value == isTomorrow){
            return 'Tomorrow'
        }else{
            return new Date(value).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
                })
        }
    }
    return value == '' ? '-' : value;
}
export const ADD_DATA = 'ADD_DATA';
export const MODIFY_DATA = 'MODIFY_DATA';
export const MULTI_ADD = 'MULTI_ADD';
export const DATA_DELETE = 'DELETE_DATA';
export const GET_DATA = 'GET_DATA'
export const MULTI_TEST_ADD = 'MULTI_TEST_ADD'
export const MULTI_APPOINTMENT_ADD = 'MULTI_APPOINTMENT_ADD'

export function bind(...handlers) {
    handlers.forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
}

export const getAsObj = (arr, key='uuid', isScheduled)=>{
    const outputObj = {}
    const ids = []
    arr.map(obj=>{
        if(typeof isScheduled != 'undefined'){
            obj['isScheduled'] = isScheduled
        }
        outputObj[obj[key]] = obj;
        ids.push(obj[key])
    })
    return {obj: outputObj, ids}
}
export const selectn = (key,obj={}) =>{
    var keyArr = key.split(".");
    var returnVal = obj
    for(let i=0;i<keyArr.length;i++){
      returnVal = returnVal[keyArr[i]]
      if(typeof returnVal == 'undefined'){
        break;
      }
    }
    return returnVal;
}
export const sortIds = (ids,obj,key)=>ids.sort(function(a, b){return obj[b][key]-obj[a][key]})

export const fieldFilterArr = (ids, obj, field)=>{
    const categorizedIds = {}
    ids.forEach(id => {
        const { [field]:fieldName } = obj[id]; 
      
        if (!categorizedIds[fieldName.toLowerCase()]) {
          categorizedIds[fieldName.toLowerCase()] = []; 
        }
        categorizedIds[fieldName.toLowerCase()].push(id); 
      });
    return categorizedIds;
}

export const getUniQueIds = (ids) =>{
    const uniqueIds = [];
    const seen = new Set();

    ids.forEach(item => {
        if (!seen.has(item)) {
            uniqueIds.push(item);
            seen.add(item);
        }
    });
    return uniqueIds
}
function parseDate(dateString, isPrevious) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
    const startDate = new Date(parts[2], parts[1] - 1, parts[0]).getTime() - (isPrevious ? 24*60*60*1000 : 0);
    const endDate = new Date(startDate).setHours(23, 59, 59, 999);
    return {startDate, endDate}
    } else if (parts.length === 2) {
        
        let year = parseInt(parts[1], 10);
        let month = parseInt(parts[0], 10) - 1;
        if(isPrevious){
            year = month == 0 ? year-1 : year;
            month = month == 0 ? 11 : month-1;
        }
        const startDate = new Date(year, month, 1).getTime();
        const endDate = new Date(year, month + 1, 0).setHours(23, 59, 59, 999); // Get last day of next month (0-indexed)
        return { startDate, endDate };
    } else if (parts.length === 1) {
        const year = parseInt(parts[0], 10) - (isPrevious ? 1 : 0);
        const startDate = new Date(year, 0, 1).getTime();  // Start of the year
        const endDate = new Date(year + 1, 0, 1).getTime()-1; // Start of next year (0-indexed)
        return { startDate, endDate };
    } else {
        throw new Error(`Invalid date format: ${dateString}`);
    }
}
export const getTimeFilter = ({dataIds, timeFilter, timeInput, isPrevious, data})=>{
    if(timeFilter == 'All'){
        return dataIds;
    }
    
    const filteredIds = [];
    const { startDate, endDate } = parseDate(timeInput,isPrevious)
    for (const id of dataIds) {
        const { time } = data[id];
        if (time >= startDate && time <= endDate) {
            filteredIds.push(id);
        }
    }
    return filteredIds;
}

export const getDatasByProfit = (ids, object, typeFilter, timeFilter)=>{ 
    const resultObj = {}
    let totalIncome = 0;
    let totalExpense = 0;
    let totalOutstanding = 0;
    let totalDiscount = 0;
    let patientCount = 0;
    let externalLabAmount = 0 ;
    const getByTime = (id, type) =>{
            if(typeof resultObj[type] == 'undefined'){
                resultObj[type] = {
                    income: 0,
                    expense: 0,
                    outstanding: 0,
                    discount: 0,
                    patientCount:0
                }
            }
            const { totalAmount=0, dueAmount=0, paidAmount=0, status, discount=0, name='' } = object[id];
           
            if(status == EXPENSE_LABEL){
                totalExpense += parseInt(totalAmount) 
                resultObj[type].expense = resultObj[type].expense + parseInt(totalAmount)
                if(['endocare','micro lab'].includes(name.toLowerCase().trim()) || name.toLowerCase().includes('|external lab')){
                    externalLabAmount += parseInt(totalAmount);
                }
            }else{
                const {income, expense, outstanding, discount:resDiscount=0 } = resultObj[type];
                totalIncome += parseInt(paidAmount)
                totalDiscount += parseInt(discount || 0)
                totalOutstanding += parseInt(dueAmount || 0)
                patientCount += 1;
                resultObj[type] = {
                    income: income+parseInt(paidAmount),
                    expense,
                    outstanding: outstanding + parseInt(dueAmount || 0),
                    discount: resDiscount + parseInt(discount || 0),
                    patientCount
                }
            }
    }
    ids.map((id)=>{
        const date = new Date(id);
        if(typeFilter == 'profitByDoc'){
            if(object[id].drName){
                getByTime(id, object[id].drName)
            }
        }
        else if(timeFilter == 'DayWise'){ 
            const hour = date.getHours()+1; // 0-based (0-23)
            getByTime(id, hour)
        }else if(timeFilter == 'MonthWise'){
            const day = date.getDate(); // 0-based (0-23)
            getByTime(id, day)
        }else{
            const month = date.getMonth()+1; // 0-based (0-23)
            getByTime(id, month)
        }
    })
    const response = []
    let time;
    let keyName = 'time'
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    Object.keys(resultObj).map(key=>{
        if(typeFilter == 'profitByDoc'){
            keyName = 'drName';
            time = key;
        }
        else if(timeFilter == 'DayWise'){
            const timeArr = ['12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM'];
            time = timeArr[key]
        }else if(timeFilter == 'MonthWise'){
            const date = new Date(ids[0]);
            const month = date.getMonth();
            time = (key == 1 ? `${key}st` : key == 2 ? `${key}nd` : key == 3 ? `${key}rd` : `${key}th`) + ' ' + monthList[month];
        }else{
            time = monthList[key-1]
        }
        const { income, expense } = resultObj[key]
        response.push({...resultObj[key], profit:income-expense,[keyName] : time})
    })
    return { 
        dataIds: response, 
        totalExpense, 
        totalIncome, 
        totalOutstanding, 
        totalDiscount, 
        patientCount,
        externalLabAmount
    };
}

export const getDrNameList = (data,ids=[])=>{
    const drNameList = [];
    ids.map(id=>{
        if(!drNameList.includes(data[id].drName)){
            drNameList.push(data[id].drName)
        }
    })
    return drNameList
}

export const setCacheDatas = ({ids=[], obj={}, type}) =>{
    let datas = getLocalStorageData('datas','{}');
    let dataIds = getLocalStorageData('dataIds','[]');
    if(type == 'DELETE'){
        delete datas[obj];
    }else{
        datas = {...datas, ...obj}
        dataIds = [...dataIds,...(ids.filter(id=>!dataIds.includes(id)))].sort(function(a, b){return b-a});
    }
    setLocalStorageData('datas',datas);
    setLocalStorageData('dataIds',dataIds);
    return { ids: dataIds, obj: datas}
}
export const setCacheTestDatas = ({obj={}},key='testDatas')=>{
    let datas = getLocalStorageData(key,'{}');
    datas = {...datas, ...obj}
    setLocalStorageData(key,datas);
    return { obj: obj}
}
export const clearCache = ()=>{
    delete localStorage['datas']
    delete localStorage['dataIds']
    delete localStorage['lastCallTime']
    delete localStorage['testDatas']
    window.location.reload();
}

export const getEditedFormProperties = (properties={}, testObj={})=>{
    const updatedProperties = {...properties}
    const { name, description } = updatedProperties;
    const testsArr = [];
    if(name){
        for(let i=0;i<PREFIX_NAMES_LIST.length;i++){
            if(name.includes(PREFIX_NAMES_LIST[i])){
                updatedProperties['name'] = name.replace(PREFIX_NAMES_LIST[i],'');
                updatedProperties['namePrefix'] = PREFIX_NAMES_LIST[i];
                break;
            }
        }
        if(name.toLowerCase().includes('|admin only')){
            updatedProperties['name'] = name.replace('|Admin Only','');
            updatedProperties['adminVisibilty'] = true;
        }
        if(name.toLowerCase().includes('|external lab')){
            updatedProperties['name'] = updatedProperties['name'].replace('|External Lab','');
            updatedProperties['isExternalLab'] = true;
        }
    }
    if(description){
        description.split("|").map(test=>{
            test && testObj[test] && testsArr.push(testObj[test]);
        })
    }
    updatedProperties['testsArr'] = testsArr;
    return updatedProperties
}

export const isSyncNowNeeded = ()=>{
   var pendingDatas = ['addTestDatas','addPendingDatas','updatePendingDatas'];
   for(let i=0;i<pendingDatas.length;i++){
    if(getLocalStorageData(pendingDatas[i],'[]').length > 0){
        return true;
    }
   }
   return false;
}

export const printPage = () =>{
        var mywindow = window.open('', 'print page', 'height=700,width=900');
        let data = jQuery('[id="tableContainer"]').html();
        let head = jQuery('head').html();
        mywindow.document.write('<html><head><title>my div</title>');
        mywindow.document.write(head);
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        return true;
}

export const scheduleSync = (syncNow,showAlert)=>{
    const lastSyncTime = getLocalStorageData('lastSyncTime',Date.now(),false)
    const lastTimeOut = getLocalStorageData('timeout','',false)
    const currentTime = Date.now()
    const oneHrMs = 60*60*1000
    const remainingTime = oneHrMs-(currentTime-parseInt(lastSyncTime))
    const fn = ()=>{
        showAlert({type: 'info', message: `Auto Sync Intiated...`})
        syncNow();
    }
    if(remainingTime < 0){
        fn();
    }else{
        clearTimeout(lastTimeOut);
        const timeout = setTimeout(fn,remainingTime)
        setLocalStorageData('timeout',timeout)
        showAlert({type: 'success', message: `Auto Sync Scheduled. Datas will be sync automatically in ${parseInt(remainingTime/(60*1000))} Minutes...`})
    }
    
}

export const copyToClipboard = (content)=>{
    navigator.clipboard.writeText(content)
        .then(() => {
        console.log('Content copied to clipboard!');
        })
        .catch((err) => {
        console.error('Failed to copy content:', err);
        });
  }

  export const getMessages = (type) =>{
    return {
        'add' : {
            'success' : 'Datas Sync done successfully...',
            'fail' : "Datas doesn't sync properly..."
        },
        'update' : {
            'success' : 'Datas Updated Successfully...',
            'fail' : "Datas doesn't updated successfully"
        },
        'addTest' : {
            'success' : 'Test Datas  added/updated Successfully...',
            'fail' : "Test Datas doesn't added/updated successfully"
        }
    }[type]
  }

  export const getCurrentMonth = ()=>{
    const date = new Date();
    const month = date.getMonth()+1
    const year = date.getFullYear();
    return `${month > 9 ? month : '0'+month}/${year}`
  }

export const getAppoinmentsData = (appoinmentData)=>{
    return appoinmentData.sort((a, b) => a.appointmentDate - b.appointmentDate);
}

export const getAmountVal = (value)=> value || 0



export const isFormErrorFound = (fieldKey, statusType,state)=>{
    const labelObj = {
        patientId: "Patiend ID",
        name: 'Name',
        mobileNumber: 'Mobile Number',
        description:'Test List',
        drName:'Dr Name',
        totalAmount: 'Total Amount',
        paidAmount: 'Paid Amount',
        comments: 'Comments / Remarks'
      }
    const keys = Object.keys(state);
    const errObj = {};
    let isError = false;
    const checkError = (key)=>{
        let emptyValFields = ["patientId","name","mobileNumber","description","drName"];
        let amountFields = ["totalAmount","paidAmount"]
        if(statusType == EXPENSE_LABEL){
        emptyValFields = ["name","description"];
        amountFields = ["totalAmount"]
        }
        if(emptyValFields.includes(key)
        && state[key] == ''){
        errObj[key] = `${labelObj[key]} can't be Empty`;
        isError = true;
        }
        if(amountFields.includes(key) && (isNaN(state[key]) || parseInt(state[key])<0)){
        errObj[key] = `${labelObj[key]} can't be less then 0`;
        isError = true;
        }
    }
    if(fieldKey){
        checkError(fieldKey)
    }else{
        keys.map(key=>checkError(key))
    }
    return {isError, errObj};
}
export const sendWhatsappMessage = (type,rowDetails)=>{
    const { mobileNumber, name, dueAmount } = rowDetails
    let message = 'Hi Sir/Madam,\n\n';
    if(type === 'sendReport'){
        message += `${name} அவர்களது பரிசோதனை முடிவுகள் தயாராக உள்ளது.தாங்கள் அதனை எங்கள் ABU lab இல் வந்து பெற்றுக் கொள்ளவும்.\n`;
        message += `${dueAmount > 0 ? '\nதாங்கள் செலுத்த வேண்டிய மீதித் தொகை ₹ '+dueAmount: ''}`
        message += `\n\nவிரைவில் நலம் பெற வேண்டுகிறோம்`
    }else if(type == 'delayReport'){
      message += `${name}-ன் பரிசோதனை முடிவுகள் ஓரிரு நாட்கள் தாமதமாக கிடைக்கும். தாமதத்திற்கு மன்னிக்கவும்.\n`
    }else{
        return ''
    }
    message += `\n\nமிக்க நன்றி.,\n\n*அபு லேப்,*\nமேலப்பாளையம்.\n\n*Online Booking For Home Collection :*\nhttps://tinyurl.com/abulabappointments,\nhttps://abulab-79efc.web.app/appointments`
    window.open(`https://wa.me/+91${mobileNumber}?text=`+encodeURIComponent(message), '_blank');
  }

  export const getFormTitle = ({formType, isIncomeForm, isAddForm})=>{
    let title = isIncomeForm ? 'Income Form' : 'Expenses';
    if(isAddForm){
        title = `Add ${title}`
    }else{
        title = `Edit ${title}`
    }
    if(formType == 'addTests'){
        title = 'Add Test Form'
    }
    return title;
  }

 export const getDetailViewIds = ({id,dataIds, type})=>{
    let newId = ''
    if(type == 'next'){
        for(let i=id+1;i<dataIds.length;i++){
            if(dataIds[i].status != EXPENSE_LABEL){
                newId = i;
                break;
            }
        }
    }else{
        for(let i=id-1;i>=0;i--){
            if(dataIds[i].status != EXPENSE_LABEL){
                newId = i;
                break;
            }
        }
    }
    return newId  
}
export const getErrorMessage = (error)=>{
       const errObj = {
        '401' : "You're not authorized to access this",
        '500' : "Internal server error",
        '404' : "You're requested thing was not found"
       };
       return errObj[error] || errObj['500'];
}

export const getPermissionObj = (isValuesOnly=true)=>{
    const commonPermissions = ['View','Add','Edit','Delete']
    const permissionObj = {
        'adminPanelPermissions' : {
            id: 'adminPanelPermissions',
            name: 'Admin Panel',
            permissions:['viewAdminPanel'],
            permissionNames:['View']
        },
        'orgPermissions' : {
            id:'orgPermissions',
            name: 'Organization',
            permissions:['viewOrg','addOrg','editOrg','deleteOrg'],
            permissionNames:commonPermissions
        },
        'profilePermissions' : {
            id:'profilePermissions',
            name: 'Profile',
            permissions:['viewProfile','addProfile','editProfile','deleteProfile'],
            permissionNames:commonPermissions
        },
        'deptPermissions' : {
            id:'deptPermissions',
            name: 'Department',
            permissions:['viewDept','addDept','editDept','deleteDept'],
            permissionNames:commonPermissions
        },
        'userPermissions' : {
            id:'userPermissions',
            name: 'Users',
            permissions:['viewUser','addUser','editUser','deleteUser'],
            permissionNames:commonPermissions
        },
        'stockPermissions' : {
            id:'stockPermissions',
            name: 'Stocks',
            permissions:['viewStock','addStock','editStock','deleteStock'],
            permissionNames:commonPermissions
        },
        'salePermissions' : {
            id:'salePermissions',
            name: 'Sales',
            permissions:['viewSale','addSale','editSale','deleteSale'],
            permissionNames:commonPermissions
        }
    }
    return isValuesOnly ? Object.values(permissionObj) : permissionObj
}

export const getInitials = (name)=>{
    if (!name) return '';
    const names = name.split(' ');
    return names.reduce((acc, curr) => acc + curr.charAt(0), '').toUpperCase();
}

export const getAccessSystemType = (userAgent)=>{
    userAgent = userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) {
        return 'Windows';
      } else if (userAgent.indexOf('mac') !== -1) {
        return 'Mac OS';
      } else if (userAgent.indexOf('linux') !== -1) {
        return 'Linux';
      } else if (userAgent.indexOf('android')   
     !== -1 || userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1) {
        return 'Mobile';
      } else {
        return 'unknown';
      }
}

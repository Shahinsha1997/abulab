export const EXPENSE_LABEL = 'Expense'
export const INCOME_LABEL = 'Income'
export const OUTSTANDING_LABEL = 'Outstanding'
export const changePathName = (pathName)=>{
    window.history.pushState({},'page',pathName);
}

export const getLocalStorageData = (key, defaultValue='{}')=>{
    return JSON.parse(localStorage[key] || defaultValue)
}
export const setLocalStorageData =(key,obj={})=>{
    localStorage[key] = JSON.stringify(obj)
}
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
            'time' : {
                id: 'time',
                label: 'Date & Time'
            },
            'patientId' : {
                id: 'patientId',
                label: 'Patient ID'
            },
            'name' : {
                id: 'name',
                label: 'Name'
            },
            'mobileNumber' : {
                id: 'mobileNumber',
                label: 'Mobile Number'
            },
            'drName' : {
                id: 'drName',
                label: 'Doctor Name'
            },
            'status' : {
                id: 'status',
                label: 'Status'
            },
            'description' : {
                id: 'description',
                label: 'Description'
            },
            'totalAmount' : {
                id: 'totalAmount',
                label: 'Total Amount'
            },
            'paidAmount' : {
                id: 'paidAmount',
                label: 'Paid Amount'
            },
            'dueAmount' : {
                id: 'dueAmount',
                label: 'Due Amount'
            },
            'isScheduled' : {
                id: 'isScheduled',
                label: ''
            }
        },
        'profit' : {
            'time' : {
                id: 'time',
                label: 'Date & Time'
            },
            'profit' : {
                id: 'profit',
                label: 'Profit'
            },
            'income' : {
                id: 'income',
                label: 'Income'
            },
            'outstanding' : {
                id: 'outstanding',
                label: 'Outstanding'
            },
            'expense' : {
                id: 'expense',
                label: 'Expense'
            }
        },
        'profitByDoc' : {
            'drName' : {
                id: 'drName',
                label: 'Doctor Name'
            },
            'profit' : {
                id: 'profit',
                label: 'Profit'
            },
            'income' : {
                id: 'income',
                label: 'Income'
            },
            'outstanding' : {
                id: 'outstanding',
                label: 'Outstanding'
            },
            'expense' : {
                id: 'expense',
                label: 'Expense'
            }
        }
    }[fieldType]
}
export const getCellFormattedVal = (cellName, value, statusType, filterType)=>{
    if(['profit','profitByDoc'].includes(filterType)){
        return value == '' ? '-' : value;
    }
    if(cellName == 'time'){
        return getTimeWithDate(value)
    }else if(cellName == 'patientId' && statusType != EXPENSE_LABEL){
        return getIdPrefix(value)
    }
    return value == '' ? '-' : value;
}
export const ADD_DATA = 'ADD_DATA';
export const MODIFY_DATA = 'MODIFY_DATA';
export const MULTI_ADD = 'MULTI_ADD'
export const GET_DATA = 'GET_DATA'

export function bind(...handlers) {
    handlers.forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
}

export const getAsObj = (arr, key='time', isScheduled)=>{
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
function parseDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
    // dd/mm/yyyy format
    const startDate = new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    const endDate = new Date(startDate).setHours(23, 59, 59, 999);
    return {startDate, endDate}
    } else if (parts.length === 2) {
        const year = parseInt(parts[1], 10);
        const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
        const startDate = new Date(year, month, 1).getTime();
        const endDate = new Date(year, month + 1, 0).setHours(23, 59, 59, 999); // Get last day of next month (0-indexed)
        return { startDate, endDate };
    } else if (parts.length === 1) {
        const year = parseInt(parts[0], 10);
        const startDate = new Date(year, 0, 1).getTime();  // Start of the year
        const endDate = new Date(year + 1, 0, 1).getTime()-1; // Start of next year (0-indexed)
        return { startDate, endDate };
    } else {
        throw new Error(`Invalid date format: ${dateString}`);
    }
}
export const getTimeFilter = (idsWithTime, timeFilter, givenDate)=>{
    if(timeFilter == 'All'){
        return idsWithTime;
    }
    
    const filteredIds = [];
    const { startDate, endDate } = parseDate(givenDate)
    for (const id of idsWithTime) {
        if (id >= startDate && id <= endDate) {
            filteredIds.push(id);
        }
    }
    return filteredIds;
}

export const getDatasByProfit = (ids, object, typeFilter, timeFilter)=>{ 
    const resultObj = {}
    const getByTime = (id, type) =>{
            if(typeof resultObj[type] == 'undefined'){
                resultObj[type] = {
                    income: 0,
                    expense: 0,
                    outstanding: 0
                }
            }
            const { totalAmount=0, dueAmount=0, paidAmount=0, status } = object[id];
           
            if(status == EXPENSE_LABEL){
                resultObj[type].expense = resultObj[type].expense + parseInt(totalAmount)
            }else{
                const {income, expense, outstanding } = resultObj[type];
                resultObj[type] = {
                    income: income+parseInt(paidAmount),
                    expense,
                    outstanding: outstanding + parseInt(dueAmount || 0)
                }
            }
    }
    ids.map((id)=>{
        const date = new Date(id);
        if(typeFilter == 'profitByDoc'){
            getByTime(id, object[id].drName)
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
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul','Aug','Sep','Oct','Nov','Dec']
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
    return response;
}
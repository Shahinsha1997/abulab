export const changePathName = (pathName)=>{
    window.history.pushState({},'page',pathName);
}

export const getLocalStorageData = (key, defaultValue='{}')=>{
    return JSON.parse(localStorage[key] || defaultValue)
}
export const setLocalStorageData =(key,obj={})=>{
    localStorage[key] = JSON.stringify(obj)
}

export const getIdPrefix = (value)=>{
    return value? `AL-${value}` : 'AL-'
}
export const getFormFields = (fieldType)=>{
    return {
        'allFields' : {
            'time' : {
                id: 'time',
                label: 'Date & Time'
            },
            'name' : {
                id: 'name',
                label: 'Name'
            },
            'mobileNumber' : {
                id: 'mobileNumber',
                label: 'Mobile Number'
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
        }
    }[fieldType]
}
export const ADD_DATA = 'ADD_DATA';
export const MODIFY_DATA = 'MODIFY_DATA';
export const MULTI_ADD = 'MULTI_ADD'
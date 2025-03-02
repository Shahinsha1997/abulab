import { getAsObj, getLocalStorageData, setCacheDatas, setCacheTestDatas, setLocalStorageData, sortIds } from "../utils/utils"

const getDataUrl = ()=>{
    if(location.hostname == 'localhost'){
        return 'https://script.google.com/macros/s/AKfycbwBfrxj9IOQ9S88mILQwbcdtg-b5Qin2hOHvfxeWzgjUU3y6Z0DUhFvX0Q2Q-KjZueheg/exec'
    }
    return 'https://script.google.com/macros/s/AKfycbwbNDC1LYxev7eMsI2PbpzgujMj1P79TI6izD0uqPHXNfHqwfl77hh1wvw6Yv_c4-Tceg/exec'
}
const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbyzv_FekWZBKuK7gw2m-jqVdVtXAG_IJLRw9RTEFOvy2RDMYFZD2nwqN4WGvJidxYLG/exec'
const DATA_URL = getDataUrl();

export const authenticate = (userName, password) =>{
    return new Promise((resolve, reject)=>{
        return fetch(AUTHENTICATE_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify({name:userName, password}), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(data=>resolve(data))
        .catch(err=>reject(err))
    })
}

export const addDataAPI = (type) =>{
    const pendingKey = type == 'add' ? 'addPendingDatas' : 'updatePendingDatas'
    const inProgressKey = type == 'add' ? 'addInProgressDatas' : 'updateInProgressDatas'
    const data = getLocalStorageData(pendingKey, '[]');
    const inProgressData = getLocalStorageData(inProgressKey, '[]');
    setLocalStorageData(inProgressKey,[...inProgressData, ...data])
    setLocalStorageData(pendingKey,[]);
    return new Promise((resolve, reject)=>{
        return fetch(DATA_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify({"payload": [...inProgressData, ...data], "type": type}), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            if(response.status == 200){
                setLocalStorageData(inProgressKey,[]);
                // return resolve(setCacheDatas(getAsObj(response.data,'uuid',false)))
                return getDataAPI().then((res)=>{
                    return resolve(res)
                })
            }
            setLocalStorageData(pendingKey,[...inProgressData, ...data])
            setLocalStorageData(inProgressKey,[]);
            throw response.status
            
        })
        .catch(err=>{
            setLocalStorageData(pendingKey,[...inProgressData, ...data])
            setLocalStorageData(inProgressKey,[]);
            reject(err)
        })
    })
}
export const deleteDataAPI = (uuid)=>{
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}`, {
            redirect: "follow",
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({"payload": {uuid,userId:userObj.id},type:'delete'}), 
          })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            if(response.data || response.status == 200){
                resolve(setCacheDatas({obj:uuid, type:'DELETE'}))
            }
            throw response.status;
            
        })
        .catch(err=>reject(err))
    })
}
export const getDataAPI = ()=>{
    const lastRowId = getLocalStorageData('lastCallTime','', false);
    setLocalStorageData('lastCallTime',Date.now())
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?type=AbuLabReport&userId=${userObj.id}${lastRowId ? '&lastRowId='+lastRowId : ''}`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            if(response.data || response.status == 200){
                const { data, dueObj={} } = response;
                const { obj, ids } = getAsObj(data,'uuid',false)
                const duedObj = getAsObj(dueObj,'date',false);
                setCacheTestDatas(dueObj, 'dueObj')
                resolve({datas: setCacheDatas({obj, ids:sortIds(ids, obj,'time')}), dueObj: duedObj })
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const getTestDataAPI = ()=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?type=TestData`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            if(response.data || response.status == 200){
                const { data } = response;
                resolve(setCacheTestDatas(getAsObj(data,'testId')))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}


export const addTestDataAPI = () =>{
    const pendingKey = 'addTestDatas'
    const inProgressKey = 'addInProgressTestDatas'
    const data = getLocalStorageData(pendingKey, '[]');
    const inProgressData = getLocalStorageData(inProgressKey, '[]');
    setLocalStorageData(inProgressKey,[...inProgressData, ...data])
    setLocalStorageData(pendingKey,[]);
    return new Promise((resolve, reject)=>{
        return fetch(DATA_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify({"payload": [...inProgressData, ...data], "type": 'TestData'}), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            if(response.status == 200){
                setLocalStorageData(inProgressKey,[]);
                return resolve(setCacheTestDatas(getAsObj(data,'testId')))
            }
            setLocalStorageData(pendingKey,[...inProgressData, ...data])
            setLocalStorageData(inProgressKey,[]);
            throw response.status
            
        })
        .catch(err=>{
            setLocalStorageData(pendingKey,[...inProgressData, ...data])
            setLocalStorageData(inProgressKey,[]);
            reject(err)
        })
    })
}

export const getReportDataAPI = ()=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?type=ReportDatas`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            if(response.data || response.status == 200){
                const { data } = response;
                resolve(setCacheTestDatas(getAsObj(data,'testId'), 'reportDatas'))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}


export const addReportDataAPI = () =>{
    const pendingKey = 'addReportDatas'
    const inProgressKey = 'addInProgressReportDatas'
    const data = getLocalStorageData(pendingKey, '[]');
    const inProgressData = getLocalStorageData(inProgressKey, '[]');
    setLocalStorageData(inProgressKey,[...inProgressData, ...data])
    setLocalStorageData(pendingKey,[]);
    return new Promise((resolve, reject)=>{
        return fetch(DATA_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify({"payload": [...inProgressData, ...data], "type": 'ReportDatas'}), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            if(response.status == 200){
                setLocalStorageData(inProgressKey,[]);
                return resolve(setCacheTestDatas(getAsObj(data,'testId'),'reportDatas'))
            }
            setLocalStorageData(pendingKey,[...inProgressData, ...data])
            setLocalStorageData(inProgressKey,[]);
            throw response.status
            
        })
        .catch(err=>{
            setLocalStorageData(pendingKey,[...inProgressData, ...data])
            setLocalStorageData(inProgressKey,[]);
            reject(err)
        })
    })
}
export const addAppointmentAPI = (payload) =>{
    return new Promise((resolve, reject)=>{
        return fetch(DATA_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify({"payload": [payload], "type": 'AppointmentDatas'}), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            if(response.status == 200){
                return resolve(response)
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
export const getAppointmentDatasAPI = ()=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?type=AppointmentDatas`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            if(response.data || response.status == 200){
                const { data } = response;
                resolve(getAsObj(data,'uuid'))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

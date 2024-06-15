import { getAsObj, getLocalStorageData, setCacheDatas, setCacheTestDatas, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbyzv_FekWZBKuK7gw2m-jqVdVtXAG_IJLRw9RTEFOvy2RDMYFZD2nwqN4WGvJidxYLG/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbz0pCi98WMzi013pODkDAAMh1RaJl9mW2tYaoiaEeqmqKeqbW44Yzi4o712341huL04zw/exec'
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
                return resolve(setCacheDatas(getAsObj(data,'time',false)))
            }
            setLocalStorageData(pendingKey,[...inProgressData, ...data])
            setLocalStorageData(inProgressKey,[]);
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const getDataAPI = ()=>{
    const lastRowId = getLocalStorageData('lastCallTime','', false);
    setLocalStorageData('lastCallTime',Date.now())
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?userId=${userObj.id}${lastRowId ? '&lastRowId='+lastRowId : ''}`, {
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
                resolve(setCacheDatas(getAsObj(data)))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const getTestDataAPI = ()=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?type=testData`, {
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
            body: JSON.stringify({"payload": [...inProgressData, ...data], "type": 'testData'}), 
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
        .catch(err=>reject(err))
    })
}
import { getAsObj, getLocalStorageData, setCacheDatas, setCacheTestDatas, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbzQwiDTC1cUes9q6MrOHEqu7W0OIxQlaeDB4CxUUcaCQ5dwjzTdMLu6ZzuGKjpJvYMu/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbz8PPbpNg7iunG7cTEf0nCPjoQi_rIr1SKcMyfr7mBwvsmrAdcsExxCRCUPFulWaQuzCg/exec'
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
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const getDataAPI = ()=>{
    const lastRowId = getLocalStorageData('lastCallTime','', false);
    setLocalStorageData('lastCallTime',Date.now())
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?${lastRowId ? 'lastRowId='+lastRowId : ''}`, {
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
    const data = getLocalStorageData('addTestDatas', '[]');
    return new Promise((resolve, reject)=>{
        return fetch(DATA_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify({"payload": data, "type": 'testData'}), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            if(response.status == 200){
                setLocalStorageData('addTestDatas',[]);
                return resolve(setCacheTestDatas(getAsObj(data,'testId')))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
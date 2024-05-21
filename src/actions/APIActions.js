import { getAsObj, getLocalStorageData, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbwg5EOmVNFN8LpK-yiMFJyCWbD8ThjSLVizgadqywRVxKTlJWUuuV9Hk2mWjRX_yGSI/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbz1xux_aNUjbWuNfaXpDnAuvEnzT_m7Thco9yxecFZLZsSR1jBvwlQ1z67Nbk6-kHkiiA/exec'
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

export const addDataAPI = () =>{
    const data = getLocalStorageData('addPendingDatas', '[]');
    const inProgressData = getLocalStorageData('addInProgressDatas', '[]');
    setLocalStorageData('addInProgressDatas',[...inProgressData, ...data])
    setLocalStorageData('addPendingDatas',[]);
    console.log(inProgressData, data)
    return new Promise((resolve, reject)=>{
        return fetch(DATA_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify([...inProgressData, ...data]), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            if(response.status == 200){
                setLocalStorageData('addInProgressDatas',[]);
                return resolve(getAsObj(data,'time',false))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const getDataAPI = (from=1, limit=50)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}?from=${from}&limit=${limit}`, {
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
                resolve(getAsObj(data))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
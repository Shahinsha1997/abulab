import { getAsObj, getLocalStorageData, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbxXapidw6G0vqmZi-e1QYrGH2vumQKDzKiWxrG7HkaCuSWXuI8XI1ZLtXVSQ_29V0wh/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbwhOJBvlWnM24vlUXCtzH336FnArC-8t2EgDefvAErnhtSGV4mpXDyNGycuXIV7dvoOFw/exec'
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
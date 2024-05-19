import { getAsObj, getLocalStorageData, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbw03nX0b0UFWWJDBbet84sLrnzrLSuebp4kVvUX9Yv8bATWGMY8JINFFm3hJBIUz9hf/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbwKZfx-T01WIxWx10NWZT9Hh27N8ppcJqDVjhd80RjfeVjiKYvA8Joxc4TMkvsdnU-Vaw/exec'
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
            setLocalStorageData('addInProgressDatas',[]);
            resolve(getAsObj(data,'time',false))
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
            const { data } = response;
            resolve(getAsObj(data))
        })
        .catch(err=>reject(err))
    })
}
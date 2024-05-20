import { getAsObj, getLocalStorageData, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbwc0L43FbVRdYih46WxJclRA7altG-pfujaJBq2bcvF45Pg9VlLF5cSu6zkmw5Q9zjD/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbzGMod9YcqCpFHvok6YojQFaUfRk5mLDZokwSJTZaEqF-sA0U3a_-sX1JUpA36JoGEtAg/exec'
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
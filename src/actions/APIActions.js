import { getAsObj, getLocalStorageData, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbwJveukVFNrfLLZaJ4FlTEm7yIVIHMK_0Vw2hUirjoOWsUJs2tr6K0SCHki-ibZ-M7E/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbwFJBP3_OPuk_m7DvP2iZ_UyIwZqptd8KY6YzCSYo333JtY3n8dLO6VcN9hOOn9I1onPg/exec'
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
    const data = getLocalStorageData('addPendingDatas');
    setLocalStorageData('addInProgressDatas',data)
    setLocalStorageData('addPendingDatas',[]);
    return new Promise((resolve, reject)=>{
        return fetch(DATA_URL, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify(data), 
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(response=>{
            resolve(getAsObj(data,'time','isScheduled'))
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
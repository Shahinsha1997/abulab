import { getLocalStorageData, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbwJveukVFNrfLLZaJ4FlTEm7yIVIHMK_0Vw2hUirjoOWsUJs2tr6K0SCHki-ibZ-M7E/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbzzOuSTFljkPFF57fcMHbOvg6lUOEmYtF2rl49ticU_4GatBqoRUEyAiVWy94z2lAWf8A/exec'
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

export const addData = () =>{
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
        .then(response=>resolve(response))
        .catch(err=>reject(err))
    })
}
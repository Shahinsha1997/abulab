import { getAsObj, getLocalStorageData, setLocalStorageData } from "../utils/utils"

const AUTHENTICATE_URL = 'https://script.google.com/macros/s/AKfycbybeN2OKALOFlppTJTLy5OzRiX_Hu7c_wI4QOSoP-IRsylyjPPKHy1ZN2E32i9JMeVC/exec'
const DATA_URL = 'https://script.google.com/macros/s/AKfycbwrBsz_PEqsr2ops0oKGjkNSrITiqAhCsie0swakUDlR3wGV8C8wakRBQBiPpoDCSqq9Q/exec'
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
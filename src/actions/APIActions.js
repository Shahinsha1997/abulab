import { getAsObj, getLocalStorageData, setCacheDatas, setCacheTestDatas, setLocalStorageData, sortIds } from "../utils/utils"

const getDataUrl = ()=>{
    if(location.hostname == 'localhost'){
        // return 'http://localhost:8443'
        return 'https://shahinshaas-2642.zcodeusers.com';
    }
    return 'https://script.google.com/macros/s/AKfycbxi9ArTgNgvKTXr62Yfyb4n-jONbnuzIu7QKi_vY9447nqIGGQMDRxGKLzuZsitMlYFQw/exec'
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

export const addDataAPI = (data) =>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/labRecord`, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify(data), 
            headers: {
                "Content-Type": "application/json",
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { id, status } = res;
            if(status == 200){
                resolve(id)
            }
            throw status
            
        })
        .catch(err=>{
            reject(err)
        })
    })
}
export const updateDataAPI = (data) =>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/labRecord/${data.uuid}`, {
            redirect: "follow",
            method: 'PUT',
            body: JSON.stringify(data), 
            headers: {
                "Content-Type": "application/json",
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { id, status } = res;
            if(status == 200){
                resolve(id)
            }
            throw status
            
        })
        .catch(err=>{
            reject(err)
        })
    })
}
export const deleteDataAPI = (uuid)=>{
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/labRecord/${uuid}?userId=${userObj.id}`, {
            redirect: "follow",
            method: 'DELETE' 
          })
        .then(res=>res.json())
        .then(response=>{
            console.log(response)
            if(response.data || response.status == 200){
                resolve(uuid)
            }
            throw response.status;
            
        })
        .catch(err=>reject(err))
    })
}
export const getDataAPI = ({from, searchField, sortField, sortOrder, searchStr, timeFrom, timeTo})=>{
//     const lastRowId = getLocalStorageData('lastCallTime','', false);
//     setLocalStorageData('lastCallTime',Date.now())
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/labRecord?userId=${userObj.id}&from=${from}&searchField=${searchField}&sortField=${sortField}&sortOrder=${sortOrder}&searchStr=${searchStr}&timeFrom=${timeFrom}&timeTo=${timeTo}`, {
            redirect: "follow",
            method: 'GET'
          })
        .then(res=>res.json())
        .then(res=>{
            const { response=[], status } = res;
            if(response || status == 200){
                console.log("Data", response)
                resolve(getAsObj(response,'uuid',false))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const getDueDataAPI = ({from})=>{
    //     const lastRowId = getLocalStorageData('lastCallTime','', false);
    //     setLocalStorageData('lastCallTime',Date.now())
        const userObj = getLocalStorageData('userObj',{})
        return new Promise((resolve, reject)=>{
            return fetch(`${DATA_URL}/api/v1/dueDatas?userId=${userObj.id}&from=${from}`, {
                redirect: "follow",
                method: 'GET'
              })
            .then(res=>res.json())
            .then(res=>{
                const { response=[], status } = res;
                if(response || status == 200){
                    console.log("Data", response)
                    resolve(getAsObj(response,'uuid',false))
                }
                throw response.status
                
            })
            .catch(err=>reject(err))
        })
    }


export const getTestDataAPI = ()=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/testRecord`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { response, status } = res;
            if(response || status == 200){
                resolve(getAsObj(response,'testId'))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
export const getDocDataAPI = () =>{
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/doctor`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { response, status } = res;
            if(response || status == 200){
                resolve(response)
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const addTestDataAPI = (data) =>{
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/testRecord?userId=${userObj.id}`, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify(data), 
            headers: {
                "Content-Type": "application/json"
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { id, status } = res;
            if(status == 200){
                return resolve(id)
            }
            throw status
            
        })
        .catch(err=>{
            reject(err)
        })
    })
}
export const updateTestDataAPI = (data,id) =>{
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/testRecord/${id}?userId=${userObj.id}`, {
            redirect: "follow",
            method: 'PUT',
            body: JSON.stringify(data), 
            headers: {
                "Content-Type": "application/json"
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { response, status } = res;
            if(status == 200){
                return resolve(response)
            }
            throw status
            
        })
        .catch(err=>{
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

export const getDashboardAPI = ({timeFrom, timeTo})=>{
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/dashboard?userId=${userObj.id}&timeFrom=${timeFrom}&timeTo=${timeTo}`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { response, status } = res;
            if(response || status == 200){
                resolve(response)
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
export const getAPILimitDatas = ()=>{
    const userObj = getLocalStorageData('userObj',{})
    return new Promise((resolve, reject)=>{
        return fetch(`${DATA_URL}/api/v1/lab/apiusage?userId=${userObj.id}`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            }
          })
        .then(res=>res.json())
        .then(res=>{
            const { response, status } = res;
            if(response || status == 200){
                resolve(response)
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

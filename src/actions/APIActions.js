import { getAsObj, getLocalStorageData, setCacheDatas, setCacheTestDatas, setLocalStorageData, sortIds } from "../utils/utils"
let sessionCookie = '';

const SERVER_URL = window.location.host.includes('localhost') ? 'http://localhost:8443' : 'https://shahinshaas-2642.zcodeusers.com'
export const authenticate = (userName, password) =>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/login`, {
            redirect: "follow",
            method: 'POST',
            body: JSON.stringify({userName, password}), 
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
          })
        .then(res=>res.json())
        .then(data=>{
            const { sessionId } = data;
            sessionCookie = sessionId
            setLocalStorageData('sessionId',sessionId, false)
            delete data['sessionId'];
            setLocalStorageData('userObj',data);
            resolve(data)
        })
        .catch(err=>reject(err))
    })
}
export const logout = (logoutUser) =>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/logout`, {
            redirect: "follow",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            credentials:'include'
          })
        .then(res=>res.json())
        .then(data=>{
            logoutUser();
            resolve(data)
        })
        .catch(err=>reject(err))
    })
}
export const getDepartmentsAPI = (from)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/departments?from=${from}`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            if(res.status == 200){
                const { response } = res;
                resolve(getAsObj(response,'id'))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
export const getOrgAPI = (orgId)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/organization/${orgId}`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            if(res.status == 200){
                const { response } = res;
                resolve(getAsObj(response,'id'))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
export const getUsersAPI = (from)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/users?from=${from}`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            if(res.status == 200){
                const { response } = res;
                resolve(getAsObj(response,'id'))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}

export const getProfilesAPI = (from)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/profiles?from=${from}`, {
            redirect: "follow",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            if(res.status == 200){
                const { response } = res;
                resolve(getAsObj(response,'id'))
            }
            throw response.status
            
        })
        .catch(err=>reject(err))
    })
}
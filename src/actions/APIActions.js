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
            const { status, response } = res;
            if(status == 200){
                resolve(getAsObj(response,'id'))
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}

export const addDepartmentAPI = (payload)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/departments`, {
            redirect: "follow",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            body:JSON.stringify(payload),
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            const { id, status } = res;
            if(status == 200){
                resolve({id, ...getAsObj([{id,...payload}],'id')})
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}
export const updateDepartmentAPI = (payload)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/departments/${payload.id}`, {
            redirect: "follow",
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            body:JSON.stringify(payload),
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            const { status } = res;
            if(status == 200){
                resolve({id:payload.id, ...getAsObj([payload],'id')})
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}
export const getSessionsAPI = (from)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/sessions?from=${from}`, {
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
            const { status, response } = res;
            if(status == 200){
                resolve(getAsObj(response,'id'))
            }
            throw res
            
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
            const { status, response } = res;
            if(status == 200){
                resolve(getAsObj(response,'id'))
            }
            throw res
            
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
            const { status, response } = res;
            if(status == 200){
                resolve(getAsObj(response,'id'))
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}
export const addUsersAPI = (payload)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/users`, {
            redirect: "follow",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            body:JSON.stringify(payload),
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            const { status, id } = res;
            if(status == 200){
                resolve({id, ...getAsObj([{id,...payload}],'id')})
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}
export const updateUsersAPI = (payload)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/users/${payload.id}`, {
            redirect: "follow",
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            body:JSON.stringify(payload),
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            const { status } = res;
            if(status == 200){
                resolve({id:payload.id, ...getAsObj([payload],'id')})
            }
            throw res
            
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
            const { status, response } = res;
            if(status == 200){
                resolve(getAsObj(response,'id'))
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}

export const addProfileAPI = (payload)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/profiles`, {
            redirect: "follow",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            body:JSON.stringify(payload),
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            const { status, id } = res;
            if(status == 200){
                resolve({id, ...getAsObj([{id,...payload}],'id')})
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}

export const updateProfileAPI = (payload)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/profiles/${payload.id}`, {
            redirect: "follow",
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            body:JSON.stringify(payload),
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            const { status } = res;
            if(status == 200){
                resolve({id:payload.id, ...getAsObj([payload],'id')})
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}
export const deleteSessionAPI = (id)=>{
    return new Promise((resolve, reject)=>{
        return fetch(`${SERVER_URL}/sessions/${id}`, {
            redirect: "follow",
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'session': getLocalStorageData('sessionId','',false)
            },
            credentials:'include'
          })
        .then(res=>res.json())
        .then(res=>{
            const { status } = res;
            if(status == 200){
                resolve(res)
            }
            throw res
            
        })
        .catch(err=>reject(err))
    })
}
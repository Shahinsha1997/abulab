export const changePathName = (pathName)=>{
    window.history.pushState({},'page',pathName);
}

export const getLocalStorageData = (key, defaultValue='{}')=>{
    return JSON.parse(localStorage[key] || defaultValue)
}
export const setLocalStorageData =(key,obj={})=>{
    localStorage[key] = JSON.stringify(obj)
}

export const getIdPrefix = (value)=>{
    return value? `AL-${value}` : 'AL-'
}

export const ADD_DATA = 'ADD_DATA';
export const MODIFY_DATA = 'MODIFY_DATA';
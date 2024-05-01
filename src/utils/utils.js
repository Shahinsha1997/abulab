export const changePathName = (pathName)=>{
    window.history.pushState({},'page',pathName);
}

export const getLocalStorageData = (key)=>{
    return JSON.parse(localStorage[key] || '{}')
}
export const setLocalStorageData =(key,obj={})=>{
    localStorage[key] = JSON.stringify(obj)
}
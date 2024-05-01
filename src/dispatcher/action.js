export const setUser = (datas={}) => {
    return {
        type: 'SET_USER',
        datas
    }
};

export const logoutUser = ()=>{
    delete localStorage['userObj']
    return {
        type: 'LOGOUT'
    }
}
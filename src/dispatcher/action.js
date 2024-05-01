import { ADD_DATA, MODIFY_DATA } from "../utils/utils";

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
export const addData = (data) => ({
    type: ADD_DATA,
    payload: data, // data object to be added
  });
  
export const modifyData = (id, newData) => ({
    type: MODIFY_DATA,
    payload: { id, newData }, // id of the data to modify and the new data
});
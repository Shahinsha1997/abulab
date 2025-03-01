import { ADD_DATA, MODIFY_DATA, MULTI_ADD, GET_DATA, MULTI_TEST_ADD, MULTI_APPOINTMENT_ADD, DATA_DELETE, MULTI_REPORT_ADD } from "../utils/utils";

export const setUser = (datas={}) => {
    return {
        type: 'SET_USER',
        datas
    }
};

export const logoutUser = ()=>{
    localStorage.clear();
    window.location.href = '/login';
}
export const getDatas = (data) => ({
    type: GET_DATA,
    payload: data, // data object to be added
});
export const addData = (data) => ({
    type: ADD_DATA,
    payload: data, // data object to be added
  });
  
export const modifyData = (id, newData) => ({
    type: MODIFY_DATA,
    payload: { id, newData }, // id of the data to modify and the new data
});

export const multiAdd = (data) =>({
    type: MULTI_ADD,
    payload: data
})

export const deleteData = (data) =>({
    type: DATA_DELETE,
    payload: data
})

export const showAlert = (datas) =>({
    type: 'SHOW_ALERT',
    datas
})
export const closeAlert = () =>({
    type: 'CLOSE_ALERT'
})


export const multiTestAdd = (data,type=MULTI_TEST_ADD) =>({
    type: type,
    payload: data
})

export const multiAppointmentAdd = (data) =>({
    type: MULTI_APPOINTMENT_ADD,
    payload: data
})
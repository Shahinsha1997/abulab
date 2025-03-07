import { ADD_DATA, GET_DATA, MODIFY_DATA, MULTI_ADD, getUniQueIds, fieldFilterArr, MULTI_TEST_ADD, MULTI_APPOINTMENT_ADD, DATA_DELETE, MULTI_REPORT_ADD, DUE_ADD } from "../utils/utils";

const initialState = {
    isLoggedIn: false
};

// const filteredByDrName = (state=[],action={})=>{
//   const { from, data={} } = action.payload || {};
//   const { ids=[], obj } = data;
//   switch (action.type) {
//     case GET_DATA:
//       return fieldFilterArr(ids,obj,'drName')
//     case ADD_DATA:
//     case MULTI_ADD:
//       const newValue = fieldFilterArr(ids,obj,'drName');
//       const newState = {...state};
//       Object.keys(newValue).map(status=>{
//         newState[status] = getUniQueIds([...(state[status] || []),...(newValue[status] || [])]).sort(function(a, b){return b-a});
//       })
//       return newState;
//     default:
//       return state;
//     }
// }


// const filteredDataIdReducers = (state=[],action={})=>{
//   const { from, data={} } = action.payload || {};
//   const { ids=[], obj } = data;
//   switch (action.type) {
//     case GET_DATA:
//       return fieldFilterArr(ids,obj,'status')
//     case ADD_DATA:
//     case MULTI_ADD:
//       const newValue = fieldFilterArr(ids,obj,'status');
//       const newState = {...state};
//       Object.keys(newValue).map(status=>{
//         newState[status] = getUniQueIds([...(state[status] || []),...(newValue[status] || [])]).sort(function(a, b){return b-a});
//       })
//       return newState;
//     default:
//       return state;
//     }
// }
// const dataIdsReducers = (state=[], action={}) =>{
//   const { from, data={} } = action.payload || {};
//   const { ids=[] } = data;
//   switch (action.type) {
//     case GET_DATA:
//       return [...ids.filter(id=>!state.includes(id)), ...state ];
//     case ADD_DATA:
//     case MULTI_ADD:
//       return getUniQueIds([
//         ...ids,
//         ...state,
//       ]);
//     default:
//       return state;
//     }
// }

const testDataReducer = (state = {}, action={}) => {
  const { data={} } = action.payload || {}
  const { obj } = data;
    switch (action.type) {
      case MULTI_TEST_ADD:
        return {...state, ...obj}
      default:
        return state;
    }
  };
const mergeObj = (prevObj, newObj, key)=>{
  const { [key]: prevValue={}, ...prevRest } = prevObj;
  console.log({...prevRest,[key]: {...prevValue, ...newObj}})
  return {...prevRest, [key]: {...prevValue, ...newObj}}
}
const otherConfig = (state={}, action={})=>{
  const { data={}, key } = action.payload || {}
  const { obj } = data;
  switch (action.type){
    case DUE_ADD:
      return mergeObj(state, obj, key)
    default:
      return state;
  }
}
const reportDataReducer = (state={}, action={})=>{
  const { data={} } = action.payload || {}
  const { obj } = data;
  switch (action.type){
    case MULTI_REPORT_ADD:
      return {...state, ...obj}
    default:
      return state;
  }
}
const appointmentReducer = (state = {}, action={}) => {
  const { data={} } = action.payload || {}
  const { obj } = data;
    switch (action.type) {
      case MULTI_APPOINTMENT_ADD:
        return {...state, ...obj}
      default:
        return state;
    }
  };
const dataReducer = (state = {}, action={}) => {
  const { data={} } = action.payload || {}
  const { obj } = data;
    switch (action.type) {
      case GET_DATA:
        return {...state, ...obj}
      case ADD_DATA:
        return {
          ...state,
          // Use the ID of the data object as the key
         ...obj
        };
      case MODIFY_DATA:
        const { id, newData } = action.payload;
        // Check if the data with the given ID exists
        return state[id]
          ? {
              ...state,
              [id]: {
                ...state[id],
                ...newData,
              },
            }
          : state;
      case MULTI_ADD:
        return {...state, ...obj}
      case DATA_DELETE:
        const newState = {...state};
        delete newState[obj];
        return {...newState};
      default:
        return state;
    }
  };
function userReducer(state = initialState, action) {
const { datas={} } = action;
switch (action.type) {
    case 'SET_USER':
    return {
        ...state,
        ...datas,
        isLoggedIn: true
    };
    case 'LOGOUT':
    return {
        ...initialState,
    };
    default:
    return state;
  }
}
const appReducerInitialState = {
  'alertOptions' : {}
}
function appReducer(state=appReducerInitialState,action){
  const { datas={}} = action;
  const newState = {...state};
  switch (action.type){
    case 'SHOW_ALERT':
      newState['alertOptions'] = datas;
      return newState
    case 'CLOSE_ALERT':
      newState['alertOptions'] = {};
      return newState
    default:
      return state;
  }
}

export const getAllReducers = () =>{
    return {
        user: userReducer,
        data: dataReducer,
        // dataIds: dataIdsReducers,
        // filteredIds: filteredDataIdReducers,
        // filteredByDrName: filteredByDrName,
        appConfig: appReducer,
        testObj: testDataReducer,
        reportObj: reportDataReducer,
        appointmentObj: appointmentReducer,
        otherConfig: otherConfig
    }
}
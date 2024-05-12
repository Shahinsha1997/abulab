import { ADD_DATA, GET_DATA, MODIFY_DATA, MULTI_ADD, getUniQueIds, statusFilterArr } from "../utils/utils";

const initialState = {
    isLoggedIn: false
};

const filteredDataIdReducers = (state=[],action={})=>{
  const { from, data={} } = action.payload || {};
  const { ids, obj } = data;
  switch (action.type) {
    case GET_DATA:
      return statusFilterArr(ids,obj)
    case ADD_DATA:
    case MULTI_ADD:
      const newValue = statusFilterArr(ids,obj);
      const newState = {};
      Object.keys(state).map(status=>{
        newState[status] = getUniQueIds([...state[status],...newValue[status]]).sort(function(a, b){return b-a});
      })
      return newState;
    default:
      return state;
    }
}
const dataIdsReducers = (state=[], action={}) =>{
  const { from, data={} } = action.payload || {};
  const { ids } = data;
  switch (action.type) {
    case GET_DATA:
      return [...ids.filter(id=>!state.includes(id)), ...state ].sort(function(a, b){return b-a});
    case ADD_DATA:
    case MULTI_ADD:
      return getUniQueIds([
        ...ids,
        ...state,
      ]).sort(function(a, b){return b-a});
    default:
      return state;
    }
}

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

export const getAllReducers = () =>{
    return {
            user: userReducer,
            data: dataReducer,
            dataIds: dataIdsReducers,
            filteredIds: filteredDataIdReducers
    }
}
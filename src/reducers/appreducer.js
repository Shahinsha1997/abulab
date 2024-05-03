import { ADD_DATA, GET_DATA, MODIFY_DATA, MULTI_ADD } from "../utils/utils";

const initialState = {
    isLoggedIn: false
};

const dataIdsReducers = (state=[], action={}) =>{
  const { from, data={} } = action.payload || {};
  const { ids } = data;
  switch (action.type) {
    case GET_DATA:
      return [...state, ...ids.filter(id=>!state.includes(id))];
    case ADD_DATA:
      return [
        ...state,
        action.payload.id,
      ];
    case MULTI_ADD:
    return [...state, ...ids.filter(id=>!state.includes(id))];
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
          [action.payload.id]: action.payload,
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
            dataIds: dataIdsReducers
    }
}
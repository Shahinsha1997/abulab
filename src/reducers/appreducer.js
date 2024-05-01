import { ADD_DATA, MODIFY_DATA } from "../utils/utils";

const initialState = {
    isLoggedIn: false
};

const dataReducer = (state = {}, action) => {
    switch (action.type) {
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
            data: dataReducer
    }
}
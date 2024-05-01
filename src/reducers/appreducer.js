const initialState = {
    isLoggedIn: false
};
  
function userReducer(state = initialState, action) {
    console.log("Actiong",action)
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
            user: userReducer
    }
}
import { useDispatch } from "react-redux";
import { getLocalStorageData } from "./utils";
export const configSocket = ({socket, logoutUser })=>{
    // setSocketInstance(socket);
    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });
    socket.on('loggedIn', ({name}) => {
      console.log("Coming",name)
    });
    socket.on('revokeSession', ({sessionId}) => {
        console.log(sessionId)
        if(getLocalStorageData('sessionId','',false) == sessionId){
            logoutUser();
        }
      });
    
    return () => {
      socket.disconnect();
    };
}
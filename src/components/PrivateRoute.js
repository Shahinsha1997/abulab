import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getLocalStorageData } from '../utils/utils';
import { setUser } from '../dispatcher/action';

const allowedPaths = ['/dashboard', '/reports/'];

const PrivateRoute = (props) => {
    const dispatch = useDispatch();

    const setUsers = (userObj) => {
        dispatch(setUser(userObj));
    }
    const isLoggedIn = getLocalStorageData('userObj', '{}');
    const location = useLocation();

    const isPathAllowed = allowedPaths.some(path=>location.pathname.includes(path));

    if (isLoggedIn.userName) {
        setUsers(isLoggedIn);
        if (isPathAllowed) {
            return <Outlet />; // Render the child component (nested route)
        } else {
            return <Navigate to="/dashboard" replace />; // Redirect to /dashboard if path is not allowed
        }
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />; // Redirect to login if not logged in
    }
};

export default PrivateRoute;
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getLocalStorageData } from '../utils/utils';

const PrivateRoute = () => {
    const isLoggedIn = getLocalStorageData('userObj','{}');
    const location = useLocation();

    if (isLoggedIn.userName) {
        return <Outlet />; // Render the child component (nested route)
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />; // Redirect to login if not logged in
    }
};

export default PrivateRoute;
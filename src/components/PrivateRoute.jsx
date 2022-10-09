/* import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth"; */
import { Navigate, Outlet } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

/* Outlet is children of PrivateRoute Component used in react-router-dom v6 */
const PrivateRoute = () => {
	/* using 2 methods to get current User */

	/* 1. Using react-firebase-hooks package */
	// const [user, loading] = useAuthState(getAuth());

	/* 2. Using a custom hook */
	const [user, loading] = useAuthStatus();

	if (loading) return <Spinner />;
	return Object.keys(user).length ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

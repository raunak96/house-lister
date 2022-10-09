import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";

const useAuthStatus = () => {
	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(true);
	const isMounted = useRef(true);

	useEffect(() => {
		if (isMounted.current) {
			const auth = getAuth();
			onAuthStateChanged(auth, authUser => {
				if (authUser) setUser(authUser);
				setLoading(false);
			});
		}
		return () => (isMounted.current = false);
	}, []);

	return [user, loading];
};
export default useAuthStatus;

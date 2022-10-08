import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";
import db from "../firebase.config";

const OAuth = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const onGoogleClick = async () => {
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const { user } = await signInWithPopup(auth, provider);

			/* Check if this user exists in db, if not first add it to db  */
			const userRef = doc(db, "users", user.uid);
			const userSnapshot = await getDoc(userRef);
			if (!userSnapshot.exists()) {
				await setDoc(userRef, {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				});
			}
			navigate("/");
		} catch (error) {
			toast.error("Could not authorize with Google");
		}
	};

	return (
		<div className="socialLogin">
			<p>Sign {pathname === "/sign-in" ? "In" : "Up"} with </p>
			<button className="socialIconDiv" onClick={onGoogleClick}>
				<img
					className="socialIconImg"
					src={googleIcon}
					alt="Google SignIn/Up"
				/>
			</button>
		</div>
	);
};

export default OAuth;

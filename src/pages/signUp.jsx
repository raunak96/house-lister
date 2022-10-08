import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import visibilityIconOff from "../assets/svg/visibilityIconOff.svg";
import {
	createUserWithEmailAndPassword,
	getAuth,
	updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import db from "../firebase.config";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignUp = () => {
	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		const email = emailRef.current.value,
			password = passwordRef.current.value,
			name = nameRef.current.value;
		try {
			const auth = getAuth();
			const userCredentials = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredentials.user;
			await updateProfile(user, {
				displayName: name,
			});
			const userData = { name, email, timestamp: serverTimestamp() };
			await setDoc(doc(db, "users", user.uid), userData);
			navigate("/");
		} catch (error) {
			toast.error("Something went wrong with registration");
		}
	};
	return (
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Welcome!</p>
				</header>
				<main>
					<form onSubmit={handleSubmit}>
						<input
							placeholder="Name"
							type="text"
							ref={nameRef}
							className="nameInput"
						/>
						<input
							placeholder="Email"
							type="email"
							ref={emailRef}
							className="emailInput"
						/>
						<div className="passwordInputDiv">
							<input
								type={showPassword ? "text" : "password"}
								ref={passwordRef}
								className="passwordInput"
							/>
							<img
								src={
									showPassword
										? visibilityIcon
										: visibilityIconOff
								}
								alt="Show Password"
								className="showPassword"
								onClick={() => setShowPassword(prev => !prev)}
							/>
						</div>
						<div className="signUpBar">
							<p className="signUpText">Sign Up</p>
							<button className="signUpButton">
								<ArrowRightIcon
									fill="#fff"
									width="34px"
									height="34px"
								/>
							</button>
						</div>
					</form>
					<OAuth />
					<Link to="/sign-in" className="registerLink">
						Already have an account? Sign in instead
					</Link>
				</main>
			</div>
		</>
	);
};

export default SignUp;

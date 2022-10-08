import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import visibilityIconOff from "../assets/svg/visibilityIconOff.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

const SignIn = () => {
	const emailRef = useRef();
	const passwordRef = useRef();

	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		const email = emailRef.current.value,
			password = passwordRef.current.value;
		try {
			const auth = getAuth();
			const { user } = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			if (user) navigate("/");
		} catch (error) {
			toast.error("Bad User Credentials");
		}
	};
	return (
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Welcome Back!</p>
				</header>
				<main>
					<form onSubmit={handleSubmit}>
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
						<Link
							to="/forgot-password"
							className="forgotPasswordLink">
							Forgot Password?
						</Link>
						<div className="signInBar">
							<p className="signInText">Sign In</p>
							<button className="signInButton">
								<ArrowRightIcon
									fill="#fff"
									width="34px"
									height="34px"
								/>
							</button>
						</div>
					</form>
					<OAuth />
					<Link to="/sign-up" className="registerLink">
						Sign Up Instead
					</Link>
				</main>
			</div>
		</>
	);
};

export default SignIn;

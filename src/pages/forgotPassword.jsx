import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

const ForgotPassword = () => {
	const emailRef = useRef();
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, emailRef.current.value);
			toast.success(
				"Reset Link sent successfully to your email address."
			);
			e.target.reset();
			navigate("/sign-in");
		} catch (error) {
			toast.error("Could not send password reset email!");
		}
	};
	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Forgot Password</p>
			</header>
			<main>
				<form onSubmit={handleSubmit}>
					<input
						type="email"
						ref={emailRef}
						className="emailInput"
						placeholder="email"
					/>
					<Link className="forgotPasswordLink" to="/sign-in">
						Sign In
					</Link>
					<div className="signInBar">
						<div className="signInText">Send Reset Link</div>
						<button className="signInButton">
							<ArrowRightIcon
								fill="#fff"
								width="34px"
								height="34px"
							/>
						</button>
					</div>
				</form>
			</main>
		</div>
	);
};

export default ForgotPassword;

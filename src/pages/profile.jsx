import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import db from "../firebase.config";

const Profile = () => {
	const auth = getAuth();
	const [user] = useAuthState(getAuth());
	const nameRef = useRef();
	const [changeDetails, setChangeDetails] = useState(false);
	const navigate = useNavigate();

	const { displayName, email } = user;
	const logOut = () => {
		auth.signOut();
		navigate("/");
	};

	const handleSubmit = async () => {
		try {
			const name = nameRef.current.value;
			if (name !== displayName) {
				await updateProfile(user, { displayName: name });
				const userRef = doc(db, "users", user.uid);
				await updateDoc(userRef, {
					name,
				});
			}
		} catch (error) {
			toast.error("Could not update profile Details");
		}
	};

	return (
		<div className="profile">
			<header className="profileHeader">
				<p className="pageHeader">Profile</p>
				<button type="button" className="logOut" onClick={logOut}>
					LogOut
				</button>
			</header>
			<main>
				<div className="profileDetailsHeader">
					<p className="personalDetailsText">Personal Details</p>
					<p
						className="changePersonalDetails"
						onClick={() => {
							changeDetails && handleSubmit();
							setChangeDetails(prev => !prev);
						}}>
						{changeDetails ? "done" : "change"}
					</p>
				</div>
				<div className="profileCard">
					<form>
						<input
							type="text"
							className={
								!changeDetails
									? "profileName"
									: "profileNameActive"
							}
							disabled={!changeDetails}
							defaultValue={displayName}
							ref={nameRef}
						/>
						<input
							type="text"
							className="profileEmail"
							disabled
							defaultValue={email}
						/>
					</form>
				</div>
			</main>
		</div>
	);
};

export default Profile;

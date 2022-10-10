import { getAuth, updateProfile } from "firebase/auth";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import db from "../firebase.config";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";

const Profile = () => {
	const [changeDetails, setChangeDetails] = useState(false);
	const [listings, setListings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const auth = getAuth();
	const { currentUser: user } = auth;
	const { displayName, email } = user;
	const nameRef = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			try {
				const q = query(
					collection(db, "listings"),
					where("userRef", "==", user.uid),
					orderBy("timestamp", "desc")
				);
				const querySnapshot = await getDocs(q);
				const list = [];
				querySnapshot.forEach(doc =>
					list.push({ id: doc.id, ...doc.data() })
				);
				setListings(list);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserListings();
	}, [user?.uid]);

	const handleDelete = async listingId => {
		if (window.confirm("Are you sure you want to delete?")) {
			await deleteDoc(doc(db, "listings", listingId));
			setListings(listings =>
				listings.filter(({ id }) => id !== listingId)
			);
			toast.success("Successfully deleted the listing.");
		}
	};

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

				<Link to="/create-listing" className="createListing">
					<img src={homeIcon} alt="home" />
					<p>Sell or rent your property</p>
					<img src={arrowRight} alt="ArrowRight" />
				</Link>
				{!isLoading && listings.length > 0 && (
					<>
						<p className="listingText">Your Listings</p>
						<ul className="listingsList">
							{listings.map(listing => (
								<ListingItem
									key={listing.id}
									listing={listing}
									handleDelete={handleDelete}
									id={listing.id}
								/>
							))}
						</ul>
					</>
				)}
			</main>
		</div>
	);
};

export default Profile;

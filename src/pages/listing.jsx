import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import shareIcon from "../assets/svg/shareIcon.svg";
import Spinner from "../components/Spinner";
import db from "../firebase.config";

const numToIndianCurr = price =>
	price.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");

const Listing = () => {
	const [listing, setListing] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);
	const { listingId } = useParams();
	const navigate = useNavigate();
	const auth = getAuth();

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", listingId);
			const docSnapshot = await getDoc(docRef);
			if (docSnapshot.exists()) {
				setListing(docSnapshot.data());
				setIsLoading(false);
			} else navigate("/");
		};
		fetchListing();
	}, [listingId, navigate]);

	if (isLoading) return <Spinner />;
	return (
		<main>
			{!shareLinkCopied ? (
				<div
					className="shareIconDiv"
					onClick={() => {
						navigator.clipboard.writeText(window.location.href);
						setShareLinkCopied(true);
						setTimeout(() => setShareLinkCopied(false), 2000);
					}}>
					<img src={shareIcon} alt="share-listing" />
				</div>
			) : (
				<p className="linkCopied">Link Copied</p>
			)}
			<div className="listingDetails">
				<p className="listingName">
					{listing.name} - ₹
					{listing.offer
						? numToIndianCurr(listing.discountedPrice)
						: numToIndianCurr(listing.regularPrice)}
					{listing.type === "rent" && " / month"}
				</p>
				<p className="listingLocation">{listing.location}</p>
				<p className="listingType">
					For {listing.type === "rent" ? "Rent" : "Sale"}
				</p>
				{listing.offer && (
					<p className="discountPrice">
						{(
							((listing.regularPrice - listing.discountedPrice) /
								listing.regularPrice) *
							100
						).toFixed(0)}
						% off
					</p>
				)}
				<ul className="listingDetailsList">
					<li>
						{listing.bedrooms > 1
							? `${listing.bedrooms} Bedrooms`
							: "1 Bedroom"}
					</li>
					<li>
						{listing.bathrooms > 1
							? `${listing.bathrooms} Bathrooms`
							: "1 Bathroom"}
					</li>
					<li>{listing.parking && "Parking Spot"}</li>
					<li>{listing.furnished && "Furnished"}</li>
				</ul>
				<p className="listingLocationTitle">Location</p>

				{auth.currentUser?.uid !== listing.userRef && (
					<Link
						to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						className="primaryButton">
						Contact {listing.type === "rent" ? "Landlord" : "Owner"}
					</Link>
				)}
			</div>
		</main>
	);
};

export default Listing;

import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";
import db from "../firebase.config";

const Offers = () => {
	const [listings, setListings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	/* This stores the last fetched List,used to get next Listings for Infinite Pagination  */
	const [lastListing, setLastListing] = useState(null);

	useEffect(() => {
		const getListings = async () => {
			try {
				const listingsRef = collection(db, "listings");

				const q = query(
					listingsRef,
					where("offer", "==", true),
					orderBy("timestamp", "desc"),
					limit(10)
				);
				const listingsSnapshot = await getDocs(q);
				setLastListing(
					listingsSnapshot.docs[listingsSnapshot.docs.length - 1]
				);

				const list = [];
				listingsSnapshot.forEach(doc => {
					list.push({
						id: doc.id,
						...doc.data(),
					});
				});
				setListings(list);
				setIsLoading(false);
			} catch (error) {
				toast.error("Could not fetch listings");
			}
		};
		getListings();
	}, []);
	/* Get More Listings as We click Load More button */
	const fetchMoreListings = async () => {
		try {
			const listingsRef = collection(db, "listings");

			const q = query(
				listingsRef,
				where("offer", "==", true),
				orderBy("timestamp", "desc"),
				startAfter(lastListing),
				limit(10)
			);
			const listingsSnapshot = await getDocs(q);
			setLastListing(
				listingsSnapshot.docs[listingsSnapshot.docs.length - 1]
			);
			const list = [];
			listingsSnapshot.forEach(doc => {
				list.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setListings(prev => [...prev, ...list]);
		} catch (error) {
			toast.error("Could not fetch more listings");
		}
	};

	return (
		<div className="category">
			<header>
				<p className="pageHeader">Offers</p>
			</header>
			{isLoading ? (
				<Spinner />
			) : listings.length ? (
				<>
					<main>
						<ul className="categoryListings">
							{listings.map(listing => (
								<ListingItem
									key={listing.id}
									listing={listing}
								/>
							))}
						</ul>
					</main>
					{lastListing && !isLoading ? (
						<p className="loadMore" onClick={fetchMoreListings}>
							Load More
						</p>
					) : (
						!isLoading && (
							<p className="paginationMessage">
								All listings have been fetched
							</p>
						)
					)}
				</>
			) : (
				<p>Currently there are no offers.</p>
			)}
		</div>
	);
};

export default Offers;

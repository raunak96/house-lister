import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import useAuthStatus from "../hooks/useAuthStatus";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import db from "../firebase.config";

const CreateListing = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [geolocationEnabled, setGeolocationEnabled] = useState(true);
	const navigate = useNavigate();
	const [user, isLoadingUser] = useAuthStatus();
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: "",
		offer: true,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		_lat: 0,
		_long: 0,
	});
	useEffect(() => {
		if (!user?.uid && !isLoadingUser) navigate("/sign-in");
		else setFormData(prev => ({ ...prev, userRef: user.uid }));
	}, [user?.uid, navigate, isLoadingUser]);

	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		_lat,
		_long,
	} = formData;

	const handleChange = e => {
		let value = null,
			formInput = e.target.value;
		if (e.target.files) value = e.target.files;
		else
			value =
				formInput === "true"
					? true
					: formInput === "false"
					? false
					: formInput;
		setFormData(prev => ({ ...prev, [e.target.id]: value }));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setIsLoading(true);

		if (offer && discountedPrice >= regularPrice) {
			setIsLoading(false);
			toast.error("Discount price needs to be less than regular price");
			return;
		}
		if (images.length > 6) {
			setIsLoading(false);
			toast.error("You can upload max 6 images for your listing.");
			return;
		}

		/* GEOCODING PART */

		let geolocation = {};
		let location = address;
		if (geolocationEnabled) {
			try {
				const encodedAddress = encodeURI(
					location.replace("#", "").replace(";", "")
				);
				const res = await fetch(
					`${process.env.REACT_APP_MAPBOX_URI}/${encodedAddress}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
				);
				const data = await res.json();
				if (!data.features.length) {
					toast.error("Please enter a valid address and try again.");
					setIsLoading(false);
					return;
				}
				const coords = data.features[0].center;
				geolocation._lat = coords[1];
				geolocation._long = coords[0];
			} catch (error) {
				toast.error(
					"Could not get geolocation, enter Latitude, Longitude Manually"
				);
				setGeolocationEnabled(false);
				return;
			}
		} else geolocation = { _lat, _long };

		/* Function to - IMAGE UPLOAD TO FIREBASE STORAGE */
		const storeImage = async image =>
			new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${user.uid}-${image.name}-${uuidv4()}`;
				const storageRef = ref(storage, `images/${fileName}`);
				const uploadTask = uploadBytesResumable(storageRef, image);

				/* This monitors the progress of file upload - 3 stages -> State_Change(i.e pause/resume/progress), error, success */
				uploadTask.on(
					"state_changed",
					snapshot => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) *
							100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
							default:
								console.log("Upload is running");
								break;
						}
					},
					error => {
						reject(error);
					},
					() => {
						// On Success, we are returning downloadURL generated from firebase storage
						getDownloadURL(uploadTask.snapshot.ref).then(
							downloadURL => resolve(downloadURL)
						);
					}
				);
			});
		let imageUrls = [];
		try {
			imageUrls = await Promise.all(
				[...images].map(image => storeImage(image))
			);
		} catch (error) {
			setIsLoading(false);
			toast.error("Images could not be uploaded");
			return;
		}

		/* Prepare data to be sent for listing to firestore(db) */
		const listingData = {
			...formData,
			geolocation,
			location,
			imageUrls,
			timestamp: serverTimestamp(),
		};
		delete listingData.address;
		delete listingData._lat;
		delete listingData._long;
		delete listingData.images;
		!listingData.offer && delete listingData.discountedPrice;
		try {
			const docRef = await addDoc(
				collection(db, "listings"),
				listingData
			);
			setIsLoading(false);
			toast.success("Listing Added successfully");
			navigate(`/category/${listingData.type}/${docRef.id}`);
		} catch (error) {
			setIsLoading(false);
			toast.error("Could not add listing. Pls try again.");
		}
	};

	return isLoading || isLoadingUser ? (
		<Spinner />
	) : (
		<div className="profile">
			<header>
				<p className="pageHeader">List your property</p>
			</header>
			<main>
				<form onSubmit={handleSubmit}>
					<label htmlFor="" className="formLabel">
						Sell / Rent
					</label>
					<div className="formButtons">
						<button
							type="button"
							className={
								type === "sale"
									? "formButtonActive"
									: "formButton"
							}
							id="type"
							value="sale"
							onClick={handleChange}>
							Sell
						</button>
						<button
							type="button"
							className={
								type === "rent"
									? "formButtonActive"
									: "formButton"
							}
							id="type"
							value="rent"
							onClick={handleChange}>
							Rent
						</button>
					</div>
					<label htmlFor="name" className="formLabel">
						Name
					</label>
					<input
						className="formInputName"
						type="text"
						id="name"
						value={name}
						onChange={handleChange}
						minLength="10"
						maxLength="32"
						required
					/>
					<div className="formRooms flex">
						<div>
							<label className="formLabel">Bedrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bedrooms"
								value={bedrooms}
								onChange={handleChange}
								min="1"
								max="50"
								required
							/>
						</div>
						<div>
							<label className="formLabel">Bathrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bathrooms"
								value={bathrooms}
								onChange={handleChange}
								min="1"
								max="50"
								required
							/>
						</div>
					</div>
					<label className="formLabel">Parking spot</label>
					<div className="formButtons">
						<button
							className={
								parking ? "formButtonActive" : "formButton"
							}
							type="button"
							id="parking"
							value={true}
							onClick={handleChange}>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="parking"
							value={false}
							onClick={handleChange}>
							No
						</button>
					</div>
					<label className="formLabel">Furnished</label>
					<div className="formButtons">
						<button
							className={
								furnished ? "formButtonActive" : "formButton"
							}
							type="button"
							id="furnished"
							value={true}
							onClick={handleChange}>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="furnished"
							value={false}
							onClick={handleChange}>
							No
						</button>
					</div>
					<label className="formLabel">Address</label>
					<textarea
						className="formInputAddress"
						type="text"
						id="address"
						value={address}
						onChange={handleChange}
						rows="3"
						required
					/>
					{!geolocationEnabled && (
						<div className="formLatLng flex">
							<div>
								<label className="formLabel">Latitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="_lat"
									value={_lat}
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<label className="formLabel">Longitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="_long"
									value={_long}
									onChange={handleChange}
									required
								/>
							</div>
						</div>
					)}
					<label className="formLabel">Offer</label>
					<div className="formButtons">
						<button
							className={
								offer ? "formButtonActive" : "formButton"
							}
							type="button"
							id="offer"
							value={true}
							onClick={handleChange}>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="offer"
							value={false}
							onClick={handleChange}>
							No
						</button>
					</div>
					<label className="formLabel">Regular Price</label>
					<div className="formPriceDiv">
						<input
							className="formInputSmall"
							type="number"
							id="regularPrice"
							value={regularPrice}
							onChange={handleChange}
							min="15000"
							max="750000000"
							required
						/>
						{type === "rent" && (
							<p className="formPriceText">??? / Month</p>
						)}
					</div>

					{offer && (
						<>
							<label className="formLabel">
								Discounted Price
							</label>
							<div className="formPriceDiv">
								<input
									className="formInputSmall"
									type="number"
									id="discountedPrice"
									value={discountedPrice}
									onChange={handleChange}
									min="10000"
									max="700000000"
									required={offer}
								/>
								{type === "rent" && (
									<p className="formPriceText">??? / Month</p>
								)}
							</div>
						</>
					)}
					<label className="formLabel">Images</label>
					<p className="imagesInfo">
						The first image will be the cover (max 6).
					</p>
					<input
						className="formInputFile"
						type="file"
						id="images"
						onChange={handleChange}
						max="6"
						accept=".jpg,.png,.jpeg"
						multiple
						required
					/>
					<button
						type="submit"
						className="primaryButton createListingButton">
						Create Listing
					</button>
				</form>
			</main>
		</div>
	);
};

export default CreateListing;

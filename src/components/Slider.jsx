import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import db from "../firebase.config";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

const numToIndianCurr = price =>
	price.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");

const Slider = () => {
	const [listings, setListings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchListings = async () => {
			try {
				const q = query(
					collection(db, "listings"),
					orderBy("timestamp", "desc"),
					limit(6)
				);
				const querySnapshot = await getDocs(q);
				const list = [];
				querySnapshot.forEach(doc =>
					list.push({
						id: doc.id,
						...doc.data(),
					})
				);
				setListings(list);
			} finally {
				setIsLoading(false);
			}
		};
		fetchListings();
	}, []);

	return isLoading ? (
		<Spinner />
	) : (
		<>
			<p className="exploreHeading">Recommendations</p>
			<Swiper
				className="swiper-container"
				modules={[Pagination]}
				slidesPerView={1}
				pagination={{ clickable: true }}>
				{listings.map(
					(
						{
							type,
							id,
							imageUrls: [url],
							name,
							discountedPrice,
							regularPrice,
						},
						index
					) => (
						<SwiperSlide
							key={id}
							onClick={() => navigate(`/category/${type}/${id}`)}>
							<div
								style={{
									background: `url(${url}) center no-repeat`,
									backgroundSize: "cover",
								}}
								className="swiperSlideDiv">
								<p className="swiperSlideText">{name}</p>
								<p className="swiperSlidePrice">
									₹
									{numToIndianCurr(
										discountedPrice ?? regularPrice
									)}
									{type === "rent" && " / month"}
								</p>
							</div>
						</SwiperSlide>
					)
				)}
			</Swiper>
		</>
	);
};

export default Slider;

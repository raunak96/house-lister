import PropTypes from "prop-types";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
// import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { Link } from "react-router-dom";

const ListingItem = ({ listing, handleDelete }) => {
	return (
		<li className="categoryListing">
			<Link
				to={`/category/${listing.type}/${listing.id}`}
				className="categoryListingLink">
				<img
					src={listing.imageUrls?.[0] ?? bedIcon}
					alt={listing.name}
					className="categoryListingImg"
				/>
				<div className="categoryListingDetails">
					<p className="categoryListingLocation">
						{listing.location}
					</p>
					<p className="categoryListingName">{listing.name}</p>
					<p className="categoryListingPrice">
						₹
						{listing.offer
							? listing.discountedPrice
									.toString()
									.replace(
										/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g,
										","
									)
							: listing.regularPrice
									.toString()
									.replace(
										/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g,
										","
									)}
						{listing.type === "rent" && " / month"}
					</p>
					<div className="categoryListingInfoDiv">
						<img src={bedIcon} alt="bed" />
						<p className="categoryListingInfoText">
							{listing.bedrooms}
							{listing.bedrooms > 1 ? " Bedrooms" : "Bedroom"}
						</p>
						<img src={bathtubIcon} alt="bath" />
						<p className="categoryListingInfoText">
							{listing.bathrooms > 1
								? `${listing.bathrooms} Bathrooms`
								: "1 Bathroom"}
						</p>
					</div>
				</div>
			</Link>

			{handleDelete && (
				<DeleteIcon
					className="removeIcon"
					fill="rgb(231,76,50)"
					onClick={() => handleDelete(listing.id, listing.name)}
				/>
			)}
		</li>
	);
};
ListingItem.propTypes = {
	listing: PropTypes.object.isRequired,
	handleDelete: PropTypes.func,
};
export default ListingItem;

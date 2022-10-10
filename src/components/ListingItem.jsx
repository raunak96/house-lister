import PropTypes from "prop-types";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { Link } from "react-router-dom";

const numToIndianCurr = price =>
	price.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");

const ListingItem = ({ listing, handleDelete, handleEdit, id }) => {
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
							? numToIndianCurr(listing.discountedPrice)
							: numToIndianCurr(listing.regularPrice)}
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
					onClick={() => handleDelete(id)}
				/>
			)}
			{handleEdit && (
				<EditIcon className="editIcon" onClick={() => handleEdit(id)} />
			)}
		</li>
	);
};
ListingItem.propTypes = {
	listing: PropTypes.object.isRequired,
	handleDelete: PropTypes.func,
	handleEdit: PropTypes.func,
	id: PropTypes.string,
};
export default ListingItem;

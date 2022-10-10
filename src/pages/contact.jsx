import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import db from "../firebase.config";

const Contact = () => {
	const [owner, setOwner] = useState(null);
	const [message, setMessage] = useState("");
	const { ownerId } = useParams();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const getOwner = async () => {
			const userRef = doc(db, "users", ownerId);
			const userSnapshot = await getDoc(userRef);
			if (userSnapshot.exists()) setOwner(userSnapshot.data());
			else toast.error("This owner does not exist!");
		};
		getOwner();
	}, [ownerId]);

	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Get in Touch with the Owner</p>
				{owner && (
					<main>
						<div className="contactLandlord">
							<p className="landlordName">
								Contact {owner?.name}
							</p>
						</div>
						<div className="messageDiv">
							<label htmlFor="message" className="messageLabel">
								Message
							</label>
							<textarea
								placeholder="Message"
								type="text"
								className="textarea"
								required
								value={message}
								onChange={e =>
									setMessage(e.target.value)
								}></textarea>
						</div>
						<a
							href={`mailto:${
								owner.email
							}?Subject=${searchParams.get(
								"listingName"
							)}&body=${message}`}>
							<button
								type="button"
								className={
									message === ""
										? "disabledButton"
										: "primaryButton"
								}
								disabled={message === ""}>
								Send Message
							</button>
						</a>
					</main>
				)}
			</header>
		</div>
	);
};

export default Contact;

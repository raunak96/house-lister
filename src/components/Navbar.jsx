import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useId } from "react";

const navItems = [
	{ path: "/", tag: "Explore", Icon: ExploreIcon, key: "exp" },
	{ path: "/offers", tag: "Offers", Icon: OfferIcon, key: "off" },
	{
		path: "/profile",
		tag: "Profile",
		Icon: PersonOutlineIcon,
		key: "prof",
	},
];
const Navbar = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const id = useId();

	return (
		<>
			{/* This first div added just to take space at the end of page (visibility 0 makes sure space is taken but content is not visible) so that footer which is fixed doesn't cover content at page end */}
			<div style={{ height: "50px", visibility: "hidden" }}></div>
			<footer className="navbar">
				<nav className="navbarNav">
					<ul className="navbarListItems">
						{navItems.map(({ path, tag, Icon, key }) => (
							<li
								key={`${id}-${key}`}
								className="navbarListItem"
								onClick={() => navigate(path)}>
								<Icon
									fill={
										path === pathname
											? "#2c2c2c"
											: "#8f8f8f"
									}
									width="36px"
									height="36px"
								/>
								<p
									className={
										path === pathname
											? "navbarListItemNameActive"
											: "navbarListItemName"
									}>
									{tag}
								</p>
							</li>
						))}
					</ul>
				</nav>
			</footer>
		</>
	);
};

export default Navbar;

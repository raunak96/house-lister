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
		<footer className="navbar">
			<nav className="navbarNav">
				<ul className="navbarListItems">
					{navItems.map(({ path, tag, Icon, key }) => (
						<li
							key={`${id}-${key}`}
							className="navbarListItem"
							onClick={() => navigate(path)}>
							<Icon
								fill={path === pathname ? "#2c2c2c" : "#8f8f8f"}
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
	);
};

export default Navbar;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/category";
import Contact from "./pages/contact";
import CreateListing from "./pages/createListing";
import EditListing from "./pages/editListing";
import Explore from "./pages/explore";
import ForgotPassword from "./pages/forgotPassword";
import Listing from "./pages/listing";
import Offers from "./pages/offers";
import Profile from "./pages/profile";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

const App = () => {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Explore />} />
					<Route path="/offers" element={<Offers />} />
					<Route
						path="/category/:categoryName"
						element={<Category />}
					/>
					<Route path="/contact/:ownerId" element={<Contact />} />
					<Route path="/profile" element={<PrivateRoute />}>
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route
						path="/forgot-password"
						element={<ForgotPassword />}
					/>
					<Route
						path="/category/:categoryName/:listingId"
						element={<Listing />}
					/>
					<Route path="/create-listing" element={<CreateListing />} />
					<Route
						path="/edit-listing/:listingId"
						element={<EditListing />}
					/>
				</Routes>
				<Navbar />
			</Router>
			<ToastContainer />
		</>
	);
};

export default App;

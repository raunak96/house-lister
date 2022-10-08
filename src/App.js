import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/explore";
import ForgotPassword from "./pages/forgotPassword";
import Offers from "./pages/offers";
import Profile from "./pages/profile";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Explore />} />
				<Route path="/offers" element={<Offers />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
			</Routes>
			<Navbar />
		</Router>
	);
};

export default App;

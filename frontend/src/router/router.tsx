import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Background from "src/pages/Background";
import Signup from "src/pages/Signup/Signup";
import Layout from "src/pages/Layout";
import { AuthLoader } from "./loader";
import NotFound from "src/pages/NotFound/NotFound";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Background,
		children: [
			{ Component: Layout, loader: AuthLoader, children: [{ index: true, Component: Home }] },
			{ path: "/login", Component: Login },
			{ path: "/signup", Component: Signup },
			{ path: "*", Component: NotFound },
		],
	},
]);

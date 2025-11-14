import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Background from "src/pages/Background";
import Signup from "src/pages/Signup/Signup";
import Layout from "src/pages/Layout";
import { AuthLoader, AnimationLoader } from "./loader";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Background,
		children: [
			{ Component: Layout, loader: AuthLoader, children: [{ index: true, loader: AnimationLoader, Component: Home }] },
			{ path: "/login", loader: AnimationLoader, Component: Login },
			{ path: "/signup", loader: AnimationLoader, Component: Signup },
		],
	},
]);

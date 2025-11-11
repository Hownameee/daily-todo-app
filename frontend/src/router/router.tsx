import { createBrowserRouter } from "react-router";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Background from "src/pages/Background";
import Signup from "src/pages/Signup/Signup";
import Layout from "src/pages/Layout";
import { AuthLoader, BackgroundLoader } from "./loader";

export const router = createBrowserRouter([
	{ path: "/", Component: Background, loader: BackgroundLoader, children: [{ Component: Layout, loader: AuthLoader, children: [{ index: true, Component: Home }] }] },
	{ path: "/login", Component: Background, loader: BackgroundLoader, children: [{ index: true, Component: Login }] },
	{ path: "/signup", Component: Background, loader: BackgroundLoader, children: [{ index: true, Component: Signup }] },
]);

import React from "react";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, {persistor} from "./store";

function InnerApp() {
	return (
		<Routes>
			{/* Public Route */}
			<Route path="/" element={<Login />} />

			{/* Private Routes wrapped with Layout */}
			<Route
				element={
					<PrivateRoute>
						<Layout />
					</PrivateRoute>
				}>
				<Route path="/dashboard" element={<Dashboard />} />
			</Route>

			{/* 404 Route */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
				<React.Suspense fallback={<div>Loading...</div>}>
					<Router>
						<InnerApp />
					</Router>
				</React.Suspense>
			</PersistGate>
		</Provider>
	);
}

export default App;

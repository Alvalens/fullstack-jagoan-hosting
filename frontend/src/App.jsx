import React from "react";
import Layout from "./components/Layout/Layout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { Chart as ChartJS, registerables } from "chart.js";
import { logout } from "@/store/authSlice";

import Login from "./pages/Auth/Login";
import PenghuniIndex from "./pages/Penghuni/Index";
import PenghuniCreate from "./pages/Penghuni/Create";
import PenghuniEdit from "./pages/Penghuni/Edit";

import RumahIndex from "./pages/Rumah/Index";
import RumahCreate from "./pages/Rumah/Create";
import RumahEdit from "./pages/Rumah/Edit";
import RumahShow from "./pages/Rumah/Show/Show";
import RumahAddPenghuni from "./pages/Rumah/Show/AddPenghuni";
import PaymentHistory from "./pages/Rumah/Show/PaymentHistory";

import PenghuniHistory from "./pages/Rumah/Show/PenghuniHistory";
import PembayaranIndex from "./pages/Pembayaran/Index";
import PembayaranCreate from "./pages/Pembayaran/Create";
import PembayaranEdit from "./pages/Pembayaran/Edit";
import PembayaranShow from "./pages/Pembayaran/Show";

import LaporanIndex from "./pages/Laporan/Index";

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

				{/* Nested Routes */}
				<Route path="/penghuni" element={<PenghuniIndex />} />
				<Route path="/penghuni/create" element={<PenghuniCreate />} />
				<Route path="/penghuni/:id/edit" element={<PenghuniEdit />} />

				<Route path="/rumah" element={<RumahIndex />} />
				<Route path="/rumah/create" element={<RumahCreate />} />
				<Route path="/rumah/:id/edit" element={<RumahEdit />} />
				<Route path="/rumah/:id" element={<RumahShow />} />
        <Route path="/rumah/:id/add-penghuni" element={<RumahAddPenghuni />} />
				<Route path="/rumah/:id/history-pembayaran" element={<PaymentHistory />} />
				<Route path="/rumah/:id/history-penghuni" element={<PenghuniHistory />} />

				<Route path="/pembayaran" element={<PembayaranIndex />} />
				<Route path="/pembayaran/create" element={<PembayaranCreate />} />
				<Route path="/pembayaran/:id/edit" element={<PembayaranEdit />} />
				<Route path="/pembayaran/:id" element={<PembayaranShow />} />

				<Route path="/laporan" element={<LaporanIndex />} />

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
ChartJS.register(...registerables);


window.addEventListener("unauthorized", () => {
	store.dispatch(logout());
});

export default App;

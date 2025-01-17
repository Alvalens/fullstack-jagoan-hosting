import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
	const { user, status } = useSelector((state) => state.auth);

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}

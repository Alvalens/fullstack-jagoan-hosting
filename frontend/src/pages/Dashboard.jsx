import { useSelector } from "react-redux";

export default function Dashboard() {
	const { user } = useSelector((state) => state.auth);

	return (
		<div>
			<h1 className="text-4xl mt-8 mb-5">
				Welcome {user.username}, to the Dashboard 👋
			</h1>
			<p className="text-lg">What would you like to do today?</p>
		</div>
	);
}

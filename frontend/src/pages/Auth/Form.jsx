import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/store/authSlice";

// ShadCN components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
	username: z
		.string()
		.min(3, "Username must be at least 3 characters long")
		.max(50, "Username must be at most 50 characters long"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.max(100, "Password must be at most 100 characters long"),
});

export default function FormComponent() {
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (data) => {
		try {
			const result = await dispatch(loginUser(data));
			if (loginUser.fulfilled.match(result)) {
				navigate("/dashboard");
			} else {
				console.error("Login failed:", result.payload);
			}
		} catch (error) {
			console.error("An unexpected error occurred", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<label className="text-sm font-medium text-gray-700">
								Username
							</label>
							<FormControl>
								<Input
									placeholder="Enter your username"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<label className="text-sm font-medium text-gray-700">
								Password
							</label>
							<FormControl>
								<Input
									type="password"
									placeholder="Enter your password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{auth.status === "failed" && (
					<p className="text-red-500 text-sm">{auth.error}</p>
				)}
				<Button type="submit" className="w-full">
					Login
				</Button>
			</form>
		</Form>
	);
}

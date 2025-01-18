import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

export const loginUser = createAsyncThunk(
	"auth/login",
	async ({ username, password }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post("/login", {
				username,
				password,
			});
			localStorage.setItem("token", response.data.data.token);
			return response.data.data.user;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Login failed"
			);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		status: "idle",
		error: null,
	},
	reducers: {
		logout: (state) => {
			state.user = null;
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dummy data 
const dummyUsers = [
	{ id: 1, username: "admin", password: "admin123", role: "admin" },
	{ id: 2, username: "user", password: "user123", role: "user" },
];

export const loginUser = createAsyncThunk(
	"auth/login",
	async ({ username, password }, { rejectWithValue }) => {
		const user = dummyUsers.find(
			(u) => u.username === username && u.password === password
		);
		if (user) {
			return { id: user.id, username: user.username, role: user.role };
		} else {
			return rejectWithValue("Invalid username or password");
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

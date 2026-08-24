import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  detectedRole: string;
  detectedDivision: string;
  selectedRole: string;
}

const initialState: AuthState = {
  user: null,
  detectedRole: "Project Manager",
  detectedDivision: "PMO Division",
  selectedRole: "Project Manager",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setSelectedRole(state, action: PayloadAction<string>) {
      state.selectedRole = action.payload;
    },
  },
});

export const { setUser, setSelectedRole } = authSlice.actions;
export default authSlice.reducer;

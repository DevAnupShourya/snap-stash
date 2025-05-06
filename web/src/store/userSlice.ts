import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/index';
import { UserState } from '@/types/data'

// * initial state
const initialState: UserState = {
    name: null,
    email: null,
    profile_image: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },

        // Set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Update all user data
        update: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },

        // Update individual properties
        updateName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },

        updateEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },

        updateProfileImage: (state, action: PayloadAction<string>) => {
            state.profile_image = action.payload;
        },

        // Login success
        loginSuccess: (state, action: PayloadAction<{
            name: string;
            email: string;
            profile_image: string | null;
        }>) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.profile_image = action.payload.profile_image;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },

        // Logout
        logout: () => {
            return { ...initialState };
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setLoading,
    setError,
    update,
    updateName,
    updateEmail,
    updateProfileImage,
    loginSuccess,
    logout,
    clearError,
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user;
export const selectUserName = (state: RootState) => state.user.name;
export const selectUserEmail = (state: RootState) => state.user.email;
export const selectUserProfileImage = (state: RootState) => state.user.profile_image;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// More complex selectors with memoization
export const selectUserInitials = createSelector(
    [selectUserName],
    (name) => {
        if (!name) return '';

        const nameParts = name.split(' ');
        if (nameParts.length === 1) return name.charAt(0).toUpperCase();

        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
);

export default userSlice.reducer;
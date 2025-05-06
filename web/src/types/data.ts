export interface UserState {
    name: string | null;
    email: string | null;
    profile_image: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
};

export type TaskLayoutView = 'card' | 'table' | 'list';
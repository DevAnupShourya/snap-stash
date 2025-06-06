import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    sessionId: string | null;
    expiresAt: string | null;
    login: (sessionData: { sessionId: string; expiresAt: string }) => void;
    logout: () => void;
    checkExpiration: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<string | null>(null);


    const login = (sessionData: { sessionId: string; expiresAt: string }) => {
        setIsAuthenticated(true);
        setSessionId(sessionData.sessionId);
        setExpiresAt(sessionData.expiresAt);

        // Store in localStorage for persistence
        localStorage.setItem('auth_session_id', sessionData.sessionId);
        localStorage.setItem('auth_expires_at', sessionData.expiresAt);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setSessionId(null);
        setExpiresAt(null);

        // * Clear localStorage
        localStorage.removeItem('auth_session_id');
        localStorage.removeItem('auth_expires_at');
    };

    const checkExpiration = () => {
        if (!expiresAt) return false;
        return new Date(expiresAt) > new Date();
    };

    // ? Check localStorage on mount
    useEffect(() => {
        const storedSessionId = localStorage.getItem('auth_session_id');
        const storedExpiresAt = localStorage.getItem('auth_expires_at');

        if (storedSessionId && storedExpiresAt) {
            const isValid = new Date(storedExpiresAt) > new Date();
            if (isValid) {
                setIsAuthenticated(true);
                setSessionId(storedSessionId);
                setExpiresAt(storedExpiresAt);
            } else {
                // Expired, clear storage
                localStorage.removeItem('auth_session_id');
                localStorage.removeItem('auth_expires_at');
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            sessionId,
            expiresAt,
            login,
            logout,
            checkExpiration
        }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}

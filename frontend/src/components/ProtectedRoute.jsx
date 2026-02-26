import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects routes that require authentication.
 */
export function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

/**
 * Protects admin-only routes.
 */
export function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg">
                <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
}

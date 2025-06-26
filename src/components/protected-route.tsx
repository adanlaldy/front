// components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
    const location = useLocation();
    const userJSON = localStorage.getItem("user");

    if (!userJSON) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    try {
        const user = JSON.parse(userJSON);
        if (user?.role !== "admin") {
            return <Navigate to="/login" replace state={{ from: location }} />;
        }
        return <Outlet />; // ⬅️ ici on affiche les sous-routes
    } catch {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
}

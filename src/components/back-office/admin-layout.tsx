// components/AdminLayout.tsx
import Sidebar from "./sidebar.tsx";
import { Outlet } from "react-router-dom";
import {Toaster} from "sonner";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                <Outlet />
                <Toaster />
            </main>
        </div>
    );
}

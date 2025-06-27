// components/AdminLayout.tsx
import SidebarBackOffice from "./sidebar-back-office.tsx";
import { Outlet } from "react-router-dom";
import {Toaster} from "sonner";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen">
            <SidebarBackOffice />
            <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                <Outlet />
                <Toaster />
            </main>
        </div>
    );
}

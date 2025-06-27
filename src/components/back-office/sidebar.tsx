import {NavLink, useNavigate} from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";
import {useLogoutMutation} from "@/api/authApi.ts";
import { toast } from "sonner";

const navItems = [
    { label: "Users", path: "/back-office/users" },
    { label: "Purchases", path: "/back-office/purchases" },
    { label: "Auctions", path: "/back-office/auctions" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const [logoutApi] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();

            // Clear local storage
            localStorage.removeItem("user");

            // Show toast
            toast.success("Successfully logged out.");

            // Redirect to login
            navigate("/login");
        } catch (error) {
            toast.error("Logout failed. Please try again.");
            console.error("Logout failed", error);
        }
    };

    return (
        <aside className="flex h-screen w-72 flex-col border-r pr-6 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-10 items-center justify-center border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">
                    Valorium
                </h1>
            </div>

            {/* Scrollable menu, limite la hauteur */}
            <ScrollArea
                className="flex-grow px-4 py-6"
                style={{
                    maxHeight: "calc(100vh - 4rem - 72px)", // 4rem = 64px header, 72px pour bouton + padding (ajuster si besoin)
                }}
            >
                <nav>
                    <ul className="space-y-1">
                        {navItems.map(({ label, path }) => (
                            <li key={path}>
                                <NavLink
                                    to={path}
                                    className={({ isActive }) =>
                                        cn(
                                            "block rounded-md px-4 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        )
                                    }
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </ScrollArea>

            {/* Logout button */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}

import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area"; // shadcn scroll-area
import { cn } from "@/lib/utils"; // helper pour classes conditionnelles (optionnel)

const navItems = [
    { label: "Users", path: "/back-office/users" },
    { label: "Purchases", path: "/back-office/purchases" },
    { label: "Conversations", path: "/back-office/conversations" },
    { label: "Messages", path: "/back-office/messages" },
    { label: "Auctions", path: "/back-office/auctions" },
];

export default function SidebarBackOffice() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-700">
                <h1 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">
                    Valorium
                </h1>
            </div>
            <ScrollArea className="flex-1 px-4 py-6">
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
        </aside>
    );
}

import { useState, useRef, useEffect, Key } from "react";
import { Bell } from "lucide-react";
import { useGetNotificationsByUserIdQuery } from "../api/notificationsApi.ts";
import { useGetCurrentUserQuery } from "../api/authApi.ts";
import { IUser } from "../types/user.type.ts";
import { INotification } from "../types/notification.type.ts";

export default function Notifications() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: user } = useGetCurrentUserQuery() as { data: IUser | undefined };
    const userId = user?.id;

    const { data: notifications = [] } = useGetNotificationsByUserIdQuery(userId ?? 0, {
        skip: userId === undefined,
    });

    const notifCount = notifications.length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("pointerdown", handleClickOutside);
        } else {
            document.removeEventListener("pointerdown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="fixed top-5 right-5 z-50" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative rounded-full hover:bg-gray-100 active:bg-gray-200 transition p-2"
            >
                <Bell className="w-6 h-6 text-blue-700 hover:text-blue-600 active:text-blue-800" />
                {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
            {notifCount}
          </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                    <div className="p-4 border-b text-gray-700 font-semibold">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">Aucune notification</div>
                    ) : (
                        <ul className="max-h-60 overflow-auto">
                            {(notifications as INotification[]).map((notif, index: Key) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b last:border-b-0"
                                >
                                    <p>{notif.content}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(notif.created_at).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

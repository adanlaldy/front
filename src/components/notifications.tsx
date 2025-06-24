import {Bell} from "lucide-react";

export default function Notifications() {
    return (
        <button className="fixed right-6 top-6 rounded-full hover:bg-gray-100 active:bg-gray-200 transition">
            <Bell className="w-6 h-6 text-blue-700 hover:text-blue-600 active:text-blue-800"/>
            {/* Badge de notification (ex: pour indiquer 3 nouvelles notifications) */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
        3
      </span>
        </button>
    );
}

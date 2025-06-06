"use client";

import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {Menu, X, House, Scale, Sparkles, Settings, CircleHelp, LogOut} from "lucide-react";
import Profile from "./profile.tsx";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const links = [
        {to: "/home", label: "Home", icon: <House/>},
        {to: "/auctions", label: "Auction House", icon: <Scale/>},
        {to: "/winners", label: "Bid Winners", icon: <Sparkles/>},
    ];

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 text-blue-700 hover:text-blue-600 active:text-blue-800"
            >
                {isOpen ? <X size={28}/> : <Menu size={28}/>}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-full flex flex-col justify-between p-4">
                    {/* Haut : profil + liens principaux */}
                    <div>
                        {/* Profil */}
                        <div className="bg-blue-500 mb-4">
                            <Profile />
                        </div>

                        {/* Liens principaux */}
                        <nav className="flex flex-col gap-2">
                            {links.map(({to, label, icon}) => {
                                const isActive = location.pathname === to;
                                return (
                                    <Link key={to} to={to} onClick={toggleSidebar} className="group">
                                        <div className="flex items-center">
                                            <div
                                                className={`w-1 h-10 rounded-r-full mr-3 transition-all ${
                                                    isActive ? "bg-blue-600" : "bg-transparent"
                                                }`}
                                            />
                                            <div
                                                className={`flex items-center gap-4 ${
                                                    isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                                                } group-hover:text-blue-700`}
                                            >
                                                {icon}
                                                <span className="text-lg font-semibold">{label}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bas : settings, FAQ, logout */}
                    <nav className="flex flex-col gap-2 pl-4">
                        <Link to="/settings" onClick={toggleSidebar}
                              className="hover:text-blue-700 active:text-blue-700">
                            <div className="flex items-center text-gray-500">
                                <Settings/>
                                <span className="pl-4 text-sm">Settings</span>
                            </div>
                        </Link>
                        <Link to="/faq" onClick={toggleSidebar} className="hover:text-blue-700 active:text-blue-700">
                            <div className="flex items-center text-gray-500">
                                <CircleHelp/>
                                <span className="pl-4 text-sm">FAQ</span>
                            </div>
                        </Link>
                        <Link to="/logout" onClick={toggleSidebar} className="hover:text-blue-700 active:text-blue-700">
                            <div className="flex items-center text-gray-500">
                                <LogOut/>
                                <span className="pl-4 text-sm">Logout</span>
                            </div>
                        </Link>
                    </nav>
                </div>
            </aside>

        </>
    );
}

"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Bouton hamburger */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 text-blue-700 hover:text-blue-600 active:text-blue-800"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-6">Menu</h2>
                    <nav className="flex flex-col gap-4">
                        <Link to="/home" onClick={toggleSidebar} className="hover:text-blue-700">
                            Home
                        </Link>
                        <Link to="/auctions" onClick={toggleSidebar} className="hover:text-blue-700">
                            Auction House
                        </Link>
                        <Link to="/winners" onClick={toggleSidebar} className="hover:text-blue-700">
                            Bid Winners
                        </Link>
                    </nav>
                </div>
            </aside>
        </>
    );
}

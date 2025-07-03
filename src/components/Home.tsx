import "../Home.css";
import { IUser } from "../types/user.type.ts";
import { useGetCurrentUserQuery } from "../api/authApi.ts";
import { useUpdateUserByIdMutation } from "../api/userApi.ts";
import Footer from "./footer.tsx";
import Header from "@/components/header.tsx";
import { useState } from "react";

function Home() {
    const {
        data: user,
        isLoading,
        isError,
        refetch, // 👈 ici
    } = useGetCurrentUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
    }) as {
        data: IUser | undefined;
        isLoading: boolean;
        isError: boolean;
        refetch: () => void; // 👈 typé ici
    };

    const [updateUser] = useUpdateUserByIdMutation();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState<number>(0);

    const handleConfirmAdd = async () => {
        if (!user || amountToAdd <= 0) return;
        setIsUpdating(true);
        try {
            const newBalance = user.balance + amountToAdd;
            await updateUser({ id: user.id, data: { balance: newBalance } }).unwrap();

            // 👇 refetch les données après update
            await refetch();

            setIsModalOpen(false);
            setAmountToAdd(0);
        } catch (err) {
            console.error("Erreur lors de l'ajout de fonds :", err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError || !user) return <div>Error fetching user data</div>;

    return (
        <div className="home-container min-h-screen bg-gray-50">
            <Header pageName="Home" />

            {/* Balance Section */}
            <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mx-4 mt-8 border border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Account Balance</h3>
                    <p className="text-2xl font-bold text-green-600">
                        ${user.balance.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        As of {new Date().toLocaleDateString()}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                    Add Funds
                </button>
            </div>

            {/* Main Content */}
            <div className="mt-6 text-center">
                <img
                    src="/assets/HomeIllustration.png"
                    alt="Illustration"
                    className="w-64 h-auto mx-auto"
                />
                <h4 className="text-lg mt-4">
                    Welcome {user.firstName} {user.lastName}!
                </h4>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-80 shadow-lg relative">
                        <h2 className="text-lg font-semibold mb-4 text-center">Add Funds via Card</h2>

                        <label className="block text-sm text-gray-600 mb-1 text-center">Amount ($)</label>
                        <div className="flex justify-center mb-4">
                            <input
                                type="number"
                                min="1"
                                value={amountToAdd}
                                onChange={(e) => setAmountToAdd(parseFloat(e.target.value))}
                                className="w-48 p-2 border border-gray-300 rounded-md"
                                placeholder="Enter amount"
                            />
                        </div>

                        <div className="flex flex-col items-center">
                            {/* Fake card display */}
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg mb-4 shadow-inner flex flex-col items-center">
                                <p className="text-sm">**** **** **** 4242</p>
                                <p className="text-xs mt-1">Visa - Exp 12/28</p>
                            </div>

                            <div className="flex justify-between gap-4 w-full">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAdd}
                                    disabled={isUpdating || amountToAdd <= 0}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                >
                                    {isUpdating ? "Processing..." : "Confirm Payment"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <Footer
                active="home"
                onSelect={(section) => {
                    console.log(`Selected section: ${section}`);
                }}
            />
        </div>
    );
}

export default Home;

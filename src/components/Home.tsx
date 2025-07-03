import "../Home.css";
import {IUser} from "../types/user.type.ts";
import {useGetCurrentUserQuery} from "../api/authApi.ts";
import {useUpdateUserByIdMutation} from "../api/userApi.ts";
import Footer from "./footer.tsx";
import Header from "@/components/header.tsx";
import {useState} from "react";
import {useGetPurchasesByUserIdQuery} from "../api/purchasesApi.ts"; // Assure-toi que c’est bien le bon chemin
import {IPurchase} from "../types/purchase.type.ts"; // Typage achats
import {useGetAllAuctionsQuery, useGetAuctionByIdQuery} from "../api/auctionsApi.ts";
import {useGetFileByIdQuery} from "@/api/fileApi.ts";
import {skipToken} from "@reduxjs/toolkit/query"; // importer le hook


function SellerAuctions() {
    const storedUser = localStorage.getItem("user");
    const localUserId = storedUser ? JSON.parse(storedUser).id : undefined;

    const { data: auctions = [], isLoading, isError } = useGetAllAuctionsQuery();

    const sellerAuctions = auctions.filter(auction => auction.sellerId === localUserId);

    if (isLoading) return <p>Loading seller auctions...</p>;
    if (isError) return <p>Error loading seller auctions.</p>;
    if (sellerAuctions.length === 0) return <p>No auctions found for this seller.</p>;

    return (
        <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Auctions</h3>
            <ul>
                {sellerAuctions.map((auction) => (
                    <li
                        key={auction.id}
                        className="mb-2 p-2 border border-gray-300 rounded min-h-[100px]"
                    >
                        <p className="mb-1">
                            <strong>Title:</strong> {auction.title}
                        </p>
                        <p className="mb-1">
                            <strong>Starting Price:</strong> ${auction.initialPrice.toFixed(2)}
                        </p>
                        <p className="mb-1">
                            <strong>Ending Price:</strong> ${auction.actualBidPrice.toFixed(2)}
                        </p>
                        <p>
                            <strong>Ends on:</strong>{" "}
                            {new Date(auction.endBidDate).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </>
    );
}


function PurchaseItem({purchase}: { purchase: IPurchase }) {
    const {
        data: auction,
        isLoading: loadingAuction,
        isError: errorAuction
    } = useGetAuctionByIdQuery(purchase.auctionId);

    // Récupérer le fichier dès que l'enchère est chargée
    const {data: file, isLoading: loadingFile, isError: errorFile} = useGetFileByIdQuery(
        auction ? auction.fileId : skipToken,
        {skip: !auction}
    );

    if (loadingAuction) return <p>Loading auction title...</p>;
    if (errorAuction || !auction) return <p>Auction title not available</p>;

    const handleDownloadFile = () => {
        if (!file?.file?.content || !file.file.contentType) return;

        const base64Data = file.file.content;
        const contentType = file.file.contentType;

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {type: contentType});

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);

        const extension = contentType.split("/")[1] || "bin";
        link.download = `file_${file.file.id}.${extension}`;

        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="mb-3 p-2 border-b border-gray-200">
            <p><strong>Auction title:</strong> {auction.title}</p>
            <p><strong>Price paid:</strong> ${purchase.finalPrice.toFixed(2)}</p>
            <p><strong>Purchase date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>

            {loadingFile && <p>Chargement du fichier...</p>}
            {errorFile && <p>Erreur lors du chargement du fichier.</p>}
            {file && file.file && (
                <button
                    onClick={handleDownloadFile}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Générer le fichier
                </button>
            )}
        </div>
    );
}



function Home() {
    const {
        data: user,
        isLoading,
        isError,
        refetch,
    } = useGetCurrentUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
    }) as {
        data: IUser | undefined;
        isLoading: boolean;
        isError: boolean;
        refetch: () => void;
    };

    // Récupérer l'id utilisateur dans le localStorage
    const storedUser = localStorage.getItem("user");
    const localUserId = storedUser ? JSON.parse(storedUser).id : undefined;

    // Hook pour récupérer les achats de l'utilisateur
    const {
        data: purchases = [],
        isLoading: purchasesLoading,
        isError: purchasesError,
        refetch: refetchPurchases,
    } = useGetPurchasesByUserIdQuery(localUserId ?? 0, {
        skip: !localUserId,
        refetchOnMountOrArgChange: true,
    });

    const [updateUser] = useUpdateUserByIdMutation();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState<number>(0);

    const handleConfirmAdd = async () => {
        if (!user || amountToAdd <= 0) return;
        setIsUpdating(true);
        try {
            const newBalance = user.balance + amountToAdd;
            await updateUser({id: user.id, data: {balance: newBalance}}).unwrap();

            // Refetch user and purchases after update
            await refetch();
            await refetchPurchases();

            // 🟢 Mettre à jour le localStorage avec le nouveau solde
            const storedUserStr = localStorage.getItem("user");
            if (storedUserStr) {
                const storedUser = JSON.parse(storedUserStr);
                storedUser.balance = newBalance;
                localStorage.setItem("user", JSON.stringify(storedUser));
            }

            setIsModalOpen(false);
            setAmountToAdd(0);
        } catch (err) {
            console.error("Erreur lors de l'ajout de fonds :", err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div>Loading user data...</div>;
    if (isError || !user) return <div>Error fetching user data</div>;

    return (
        <div
            className="home-container min-h-screen bg-gray-50 overflow-y-auto"
            style={{ maxHeight: '100vh' }}
        >
            <Header pageName="Home"/>

            {/* Deux colonnes: Balance et Achats */}
            <div className="flex flex-col gap-6 mx-4 mt-8">
                <div className="bg-white shadow-md rounded-xl p-4 w-full border border-gray-200">
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
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md self-start mt-4"
                    >
                        Add Funds
                    </button>
                </div>

                {/* Colonne Achats */}
                <div
                    className="bg-white shadow-md rounded-xl p-4 max-w-3xl mx-auto w-full border border-gray-200 overflow-y-auto max-h-80"
                >
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Purchases</h3>

                    {purchasesLoading && <p>Loading purchases...</p>}
                    {purchasesError && <p>Error loading purchases.</p>}

                    {!purchasesLoading && purchases.length === 0 && (
                        <p className="text-gray-500">No purchases found.</p>
                    )}

                    <ul>
                        {purchases.map((purchase: IPurchase) => (
                            <PurchaseItem key={purchase.id} purchase={purchase} />
                        ))}
                    </ul>
                </div>
            </div>

            {/* Wrapper pour limiter la largeur et centrer la dernière Card */}
            <div className="bg-white shadow-md rounded-xl p-4 max-w-3xl mx-auto w-full border border-gray-200 overflow-y-auto max-h-80 mt-6">
                <SellerAuctions />
            </div>

            {/* Modal Add Funds */}
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
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg mb-4 shadow-inner flex flex-col items-center">
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

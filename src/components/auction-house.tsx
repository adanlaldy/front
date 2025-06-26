import { useState } from "react";
import Header from "./header.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGetAllAuctionsQuery } from "../api/auctionsApi.ts";
//import { IAuction } from "../types/auction.type.ts";
import { useGetPicturesByAuctionIdQuery } from "../api/picturesApi.ts";

export default function AuctionHouse() {
    const { data: auctions = [], isLoading, error } = useGetAllAuctionsQuery();
    const [openAuctionId, setOpenAuctionId] = useState<number | null>(null);

    const toggleDropdown = (auctionId: number) => {
        setOpenAuctionId(openAuctionId === auctionId ? null : auctionId);
    };

    const { data: pictures = [], isLoading: loadingPictures } =
        useGetPicturesByAuctionIdQuery(openAuctionId!, {
            skip: openAuctionId === null,
        });

    if (isLoading) return <p className="p-4">Chargement...</p>;
    if (error) return <p className="p-4 text-red-500">Erreur lors du chargement des enchères.</p>;

    return (
        <>
            <Header pageName={"Auction House"} />
            <div className="p-4">
                {auctions.map((auction) => {
                    const isOpen = openAuctionId === auction.id;

                    return (
                        <div
                            key={auction.id}
                            className="mb-4 bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer"
                                onClick={() => toggleDropdown(auction.id)}
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{auction.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Starts at ~{auction.initial_price} dBC
                                    </p>
                                </div>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                            </div>

                            {isOpen && (
                                <div className="px-4 pb-4">
                                    {loadingPictures ? (
                                        <p className="text-sm text-gray-400">Chargement des images...</p>
                                    ) : pictures.length > 0 ? (
                                        <img
                                            src={pictures[0].path}
                                            alt={auction.title}
                                            className="w-full h-48 object-cover rounded-xl mb-3"
                                        />
                                    ) : (
                                        <div className="text-sm text-gray-400 italic mb-3">
                                            Aucune image disponible
                                        </div>
                                    )}

                                    <p className="text-gray-700 text-sm mb-2">
                                        {auction.description}
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        <p>Prix de départ : {auction.initial_price} dBC</p>
                                        <p>Prix actuel : {auction.actual_bid_price} dBC</p>
                                        <p>
                                            Débute le :{" "}
                                            {new Date(auction.start_bid_date).toLocaleString()}
                                        </p>
                                        {auction.end_bid_date && (
                                            <p>
                                                Se termine le :{" "}
                                                {new Date(auction.end_bid_date).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

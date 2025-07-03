import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./footer.tsx";

type AuctionStatus = "IN PROGRESS" | "FINISHED";

type Auction = {
    id: number;
    title: string;
    description: string;
    fileId: number | null;
    initialPrice: number;
    actualBidPrice: number;
    startBidDate: string;
    endBidDate: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    tagId: number;
    sellerId: number;
    buyerId: number | null;
    stateId: number;
};

type User = {
    id: number;
    firstname: string;
    lastname: string;
};

export default function AuctionCard() {
    const { id } = useParams<{ id: string }>();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [seller, setSeller] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    // const [tags, setTags] = useState<{ id: number; label: string }[]>([]);
    const [states, setStates] = useState<{ id: number; stateType: string }[]>([]);


    useEffect(() => {
        async function fetchAuction() {
            try {
                const res = await fetch(`http://localhost:3000/v1/auction/${id}`);
                if (!res.ok) throw new Error("Failed to fetch auction.");
                const data = await res.json();
                setAuction(data.auction);

                // // Récupère les tags
                // const tagRes = await fetch(`http://localhost:3000/v1/tags`);
                // const tagData = await tagRes.json();
                // setTags(tagData.tags);

                // Récupère les états
                const stateRes = await fetch(`http://localhost:3000/v1/states`);
                const stateData = await stateRes.json();
                setStates(stateData.states);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        fetchAuction();
    }, [id]);


    if (loading) return <div>Chargement de l'enchère...</div>;
    if (error) return <div>Erreur : {error}</div>;
    if (!auction) return <div>Aucune enchère trouvée.</div>;

    const {
        title,
        description,
        fileId,
        initialPrice,
        actualBidPrice,
        buyerId,
        startBidDate,
        endBidDate,
    } = auction;

    const now = new Date();
    const start = new Date(startBidDate);
    const end = endBidDate ? new Date(endBidDate) : null;

    const dateDisplay = start > now
        ? `Début : ${start.toLocaleString()}`
        : end
            ? `Fin : ${end.toLocaleString()}`
            : "En cours";

    const imageUrl = fileId
        ? `http://localhost:3000/v1/picture/byFileId/${fileId}`
        : "https://via.placeholder.com/600x300?text=Aucune+image";

    return (
        <div style={{ fontFamily: "sans-serif", paddingBottom: 110 }}>
            {/* Image */}
            <div style={{ position: "relative" }}>
                {/* <img src={imageUrl} alt={title} style={{ width: "100%", height: "auto" }} /> */}
                <div style={{ position: "absolute", bottom: 10, width: "100%", textAlign: "center" }}>
                    {[...Array(6)].map((_, i) => (
                        <span
                            key={i}
                            style={{
                                display: "inline-block",
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#fff",
                                opacity: i === 0 ? 1 : 0.4,
                                margin: "0 3px",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Infos */}
            <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
                    <button
                        onClick={() => setLiked(!liked)}
                        style={{
                            fontSize: 20,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: liked ? "red" : "#ccc",
                        }}
                        aria-label="Like"
                    >
                        {liked ? "❤️" : "🤍"}
                    </button>
                </div>

                <p style={{ margin: "4px 0", color: "#555" }}>
                    <strong>~{initialPrice} dBC</strong>{" "}
                    <span
                        style={{
                            backgroundColor: status === "Closed" ? "#ff5f5f" : "#27c193",
                            color: "#fff",
                            padding: "2px 6px",
                            fontSize: 12,
                            borderRadius: 4,
                        }}
                    >

                        {states.map((state) => (
                            state.id === auction.stateId ? state.stateType : ""
                        ))} {/* Affiche l'état de l'enchère */}
                        <br />
                        {/* <span style={{ color: "#888" }}>ÉTAT</span> */}


                    </span>
                </p>

                {/* Stats */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        margin: "12px 0",
                        gap: 16,
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        📈 {actualBidPrice} dBC
                        <br />
                        <span style={{ color: "#888" }}>PRIX ACTUEL</span>
                    </div>
                    <div>
                        ⏰ {dateDisplay}
                        <br />
                        <span style={{ color: "#888" }}>
                            {start > now ? "DÉBUT DE L'ENCHÈRE" : "FIN DE L'ENCHÈRE"}
                        </span>
                    </div>
                    <div>
                        🧑 {buyerId ?? "Aucun"}
                        <br />
                        <span style={{ color: "#888" }}>ACHETEUR ACTUEL</span>
                    </div>
                    {/* <div>
                        👤 {seller ? `${seller.firstname} ${seller.lastname}` : "Chargement..."}
                        <br />
                        <span style={{ color: "#888" }}>VENDEUR</span>
                    </div> */}
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.5, color: "#444" }}>{description}</p>
            </div>

            {/* Bouton ENCHÉRIR Fixe */}
            <div
                style={{
                    position: "fixed",
                    bottom: 70,
                    left: 0,
                    width: "100%",
                    backgroundColor: "#2b49ff",
                    color: "#fff",
                    textAlign: "center",
                    padding: 16,
                    fontWeight: "bold",
                    fontSize: 16,
                    cursor: "pointer",
                    zIndex: 1000,
                }}
            >
                ENCHÉRIR
            </div>

            <Footer
                active=""
                onSelect={(section) => {
                    console.log(`Section sélectionnée : ${section}`);
                }}
            />
        </div>
    );
}

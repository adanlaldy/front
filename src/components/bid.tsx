import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

type UserBalanceResponse = {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    email: string;
    picture: string | null;
    balance: number;
    role: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export default function Bid() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liked, setLiked] = useState(false);
    const [states, setStates] = useState<{ id: number; stateType: string }[]>([]);
    const [bidInput, setBidInput] = useState<string>(""); // état pour l'input enchère

    // Récupérer l'id utilisateur dans le localStorage
    const storedUser = localStorage.getItem("user");
    const localUserBalance = storedUser ? JSON.parse(storedUser).balance : undefined;


    useEffect(() => {
        async function fetchAuction() {
            try {
                const res = await fetch(`http://localhost:3000/v1/auction/${id}`);
                if (!res.ok) throw new Error("Failed to fetch auction.");
                const data = await res.json();
                setAuction(data.auction);

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
        stateId,
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

    // Fonction appelée au clic sur le bouton ENCHÉRIR
    async function handleBid() {
        if (!bidInput) {
            alert("Veuillez entrer une valeur d'enchère valide.");
            return;
        }

        const bidValue = Number(bidInput);
        if (isNaN(bidValue) || bidValue <= 0) {
            alert("Veuillez entrer un nombre valide supérieur à 0.");
            return;
        }

        try {
            // Récupérer l'utilisateur et sa balance
            // const resUser = await fetch("http://localhost:3001/v1/users/me");
            // if (!resUser.ok) throw new Error("Impossible de récupérer les informations utilisateur.");
            // const userData: UserBalanceResponse = await resUser.json();

            const totalBid = actualBidPrice + bidValue;

            if (totalBid > localUserBalance) {
                alert(`Solde insuffisant. Votre balance est de ${localUserBalance} dBC, mais votre enchère totale est de ${totalBid} dBC.`);
                return;
            }

            // Requête PUT pour mettre à jour l'enchère
            const resPut = await fetch(`http://localhost:3000/v1/auction/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ actualBidPrice: totalBid }),
            });

            if (!resPut.ok) {
                const errMsg = await resPut.text();
                throw new Error(`Erreur lors de la mise à jour de l'enchère: ${errMsg}`);
            }

            // Met à jour localement le prix d'enchère pour refléter le changement sans recharger
            setAuction(prev => prev ? { ...prev, actualBidPrice: totalBid } : prev);

            alert(`Enchère acceptée ! Vous avez misé ${bidValue} dBC, nouveau prix actuel : ${totalBid} dBC.`);

            // Réinitialise l'input
            setBidInput("");

            navigate("/home");
        } catch (error: any) {
            alert("Erreur lors de l'enchère : " + (error.message || error));
        }
    }

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
                            backgroundColor: stateId === 2 /* exemple d’état fermé ? */ ? "#ff5f5f" : "#27c193",
                            color: "#fff",
                            padding: "2px 6px",
                            fontSize: 12,
                            borderRadius: 4,
                        }}
                    >
                        {states.map((state) => (
                            state.id === auction.stateId ? state.stateType : ""
                        ))}
                        <br />
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
                </div>

                <input
                    type="number"
                    value={bidInput}
                    onChange={(e) => setBidInput(e.target.value)}
                    placeholder="Entrez votre enchère, exemple: 4, 5..."
                    style={{
                        width: "100%",
                        padding: 8,
                        fontSize: 16,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        marginBottom: 16,
                    }}
                />
            </div>

            {/* Bouton ENCHÉRIR Fixe */}
            <div
                onClick={handleBid}  // déclenche la vérification et mise à jour au clic
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
                ENCHÉRIR MAINTENANT
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

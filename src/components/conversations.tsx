import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./footer.tsx";
import { IUser } from "../types/user.type.ts";
import { useGetCurrentUserQuery } from "../api/authApi.ts";
import { useNavigate } from "react-router-dom"; // ← ajoute ça

type Conversation = {
    id: number;
    last_message_at: string | null;
    created_at: string;
    user1_id: number;
    user2_id: number;
};

const ConversationsPage: React.FC = () => {
    const navigate = useNavigate(); // ← hook pour redirection

    const {
        data: user,
        isLoading: userLoading,
        isError: userError,
    } = useGetCurrentUserQuery() as {
        data: IUser | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = "http://localhost:3001/v1";
    const userId = user?.id;

    useEffect(() => {
        if (!userId) return;

        const fetchConversations = async () => {
            try {
                const response = await axios.get<Conversation[]>(
                    `${baseUrl}/conversations/user/${userId}`
                );
                setConversations(response.data);
            } catch (err: any) {
                setError("Erreur lors du chargement des conversations.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [userId]);

    const handleNewConversation = async () => {
        if (!userId) return;

        const newConversation = {
            user1Id: userId,
            user2Id: 2, // ← à rendre dynamique si besoin
        };

        try {
            const response = await axios.post(`${baseUrl}/conversations/`, newConversation);
            setConversations((prev) => [...prev, response.data]);
        } catch (err) {
            console.error("Erreur lors de la création de la conversation :", err);
            alert("Impossible de créer une nouvelle conversation.");
        }
    };

    if (userLoading || loading) return <p>Chargement...</p>;
    if (userError || !user || error) return <p>{error ?? "Erreur lors du chargement."}</p>;

    return (
        <div className="p-6 relative">
            <h1 className="text-2xl font-bold mb-4">Mes Conversations</h1>
            {conversations.length === 0 ? (
                <p>Aucune conversation trouvée.</p>
            ) : (
                <ul className="space-y-4">
                    {conversations.map((conv) => {
                        const otherUserId =
                            conv.user1_id === user.id ? conv.user2_id : conv.user1_id;

                        return (
                            <li
                                key={conv.id}
                                className="p-4 border rounded-lg shadow hover:bg-gray-50 transition"
                            >
                                <button
                                    onClick={() => navigate(`/messages/conversation/${conv.id}`)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Utilisateur : {otherUserId}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            <Footer
                active="messages"
                onSelect={(section) => {
                    console.log(`Selected section: ${section}`);
                }}
            />

            {/* Bouton + flottant */}
            <button
                onClick={handleNewConversation}
                className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                aria-label="Nouvelle conversation"
            >
                +
            </button>
        </div>
    );
};

export default ConversationsPage;

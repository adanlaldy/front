// src/pages/Conversations.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/footer.tsx";
import { IUser } from "../types/user.type.ts";
import { useGetCurrentUserQuery } from "../api/authApi.ts";


type Conversation = {
    id: number;
    last_message_at: string | null;
    created_at: string;
    user1_id: number;
    user2_id: number;
};

const ConversationsPage: React.FC = () => {
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

    const userId = user?.id; // 👈 attention à ne pas l’utiliser si user est undefined

    useEffect(() => {
        if (!userId) return; // 👈 on attend que user soit défini

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

    // 👉 tout ce bloc en dessous des hooks
    if (userLoading || loading) return <p>Chargement...</p>;
    if (userError || !user || error) return <p>{error ?? "Erreur lors du chargement."}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Mes Conversations</h1>
            {conversations.length === 0 ? (
                <p>Aucune conversation trouvée.</p>
            ) : (
                <ul className="space-y-4">
                    {conversations.map((conv) => {
                        const otherUserId =
                            conv.user1_id === user.id ? conv.user2_id : conv.user1_id;

                        return (
                            <li key={conv.id} className="p-4 border rounded-lg shadow">
                                <p>
                                    Utilisateur : {otherUserId}
                                </p>
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
        </div>
    );
};

export default ConversationsPage;
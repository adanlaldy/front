import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useGetCurrentUserQuery } from "../api/authApi";
import { IUser } from "../types/user.type";
import Footer from "./footer.tsx";
import "../messages.css"
type Message = {
    id: number;
    message: string;
    conversation_id: number;
    created_at: string;
    is_read: boolean;
    sender_id?: number;
};

const ConversationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const baseUrl = "http://localhost:3001/v1";

    const {
        data: user,
        isLoading: userLoading,
        isError: userError,
    } = useGetCurrentUserQuery() as {
        data: IUser | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get<Message[]>(
                `${baseUrl}/messages/conversation/${id}`
            );
            setMessages(response.data);
        } catch (err: any) {
            setError("Erreur lors du chargement des messages.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchMessages();
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !id) return;

        try {
            await axios.post(`${baseUrl}/messages/send/`, {
                content: newMessage,
                conversationId: Number(id),
            });

            setNewMessage("");
            await fetchMessages();
        } catch (err) {
            console.error("Erreur lors de l'envoi du message :", err);
        }
    };

    if (loading || userLoading) return <p>Chargement...</p>;
    if (error || userError || !user) return <p>{error ?? "Erreur de chargement."}</p>;

    return (
        <div className="h-screen w-full bg-white flex flex-col relative overflow-hidden">
            {/* Zone de messages */}
            <div className="flex-1 overflow-y-auto px-4 pt-6 pb-40 bg-gray-100 custom-scrollbar">
                <div className="h-6" />
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Aucun message pour cette conversation.
                    </p>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-2`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2 rounded-2xl shadow break-words relative ${isMe
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                >
                                    <p>{msg.message}</p>
                                    <p className="text-[10px] mt-1 text-right opacity-70">
                                        {new Date(msg.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input message FIXED en bas */}
            <div className="fixed bottom-16 left-0 w-full bg-white border-t px-4 py-2 flex items-center gap-2 z-20">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                >
                    Envoyer
                </button>
            </div>

            {/* Footer FIXED encore plus bas */}
            <div className="fixed bottom-0 left-0 w-full z-10">
                <Footer
                    active="messages"
                    onSelect={(section) => {
                        console.log(`Selected section: ${section}`);
                    }}
                />
            </div>
        </div>
    );
};

export default ConversationDetail;

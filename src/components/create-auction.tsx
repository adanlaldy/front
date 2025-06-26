import React, { useEffect, useState } from "react";
import Header from "./header.tsx";
import Footer from "./footer.tsx";
import { useCreateFileMutation } from "../api/fileApi.ts";
import {useCreateAuctionMutation} from "../api/auctionsApi.ts";

export default function CreateAuction() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        file_id: 0,
        initial_price: 0,
        start_bid_date: "",
        end_bid_date: null as string | null,
        tag_id: 0,
        seller_id: 0,
        state_id: 0,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [createFile] = useCreateFileMutation();
    const [createAuction] = useCreateAuctionMutation();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const parsed = JSON.parse(user);
                if (parsed?.id) {
                    setForm(prev => ({ ...prev, seller_id: parsed.id }));
                }
            } catch (e) {
                console.error("Erreur localStorage user:", e);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "end_bid_date" && value === "" ? null : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.seller_id) {
            alert("Erreur : utilisateur non identifié.");
            return;
        }

        if (form.end_bid_date && form.start_bid_date >= form.end_bid_date) {
            alert("La date de fin doit être après la date de début.");
            return;
        }

        try {
            let fileId = form.file_id;

            if (selectedFile) {
                const reader = new FileReader();
                const fileReadPromise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve((reader.result as string).split(",")[1]);
                    reader.onerror = reject;
                });

                reader.readAsDataURL(selectedFile);
                const base64 = await fileReadPromise;

                const uploadedFile = await createFile({
                    content: base64,
                    content_type: selectedFile.type,
                }).unwrap();

                fileId = uploadedFile.id;
            }

            const auctionToCreate = {
                ...form,
                file_id: fileId,
                actual_bid_price: form.initial_price,
                tag_id: 1,
                seller_id: form.seller_id,
                state_id: 3,
            };

            const createdAuction = await createAuction(auctionToCreate).unwrap();
            console.log("Auction créée :", createdAuction);
            alert("Enchère créée avec succès !");
        } catch (error) {
            console.error("Erreur lors de la création :", error);
            alert("Erreur lors de la création de l'enchère.");
        }
    };


    return (
        <>
            <Header pageName={"Create Auction"} />
            <main style={{ padding: "1rem", maxWidth: 600, margin: "auto" }}>
                <h1>Create Auction</h1>
                <form onSubmit={handleSubmit}>

                    <label>
                        Title
                        <input type="text" name="title" value={form.title} onChange={handleChange} required />
                    </label>

                    <label>
                        Description
                        <textarea name="description" value={form.description} onChange={handleChange} rows={4} required />
                    </label>

                    <label>
                        Select File
                        <input type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
                    </label>

                    {selectedFile && (
                        <p>Fichier sélectionné : <strong>{selectedFile.name}</strong></p>
                    )}

                    <label>
                        Initial Price
                        <input type="number" name="initial_price" value={form.initial_price} onChange={handleChange} min={0} step="0.01" required />
                    </label>

                    <label>
                        Start Bid Date
                        <input type="datetime-local" name="start_bid_date" value={form.start_bid_date} onChange={handleChange} required />
                    </label>

                    <label>
                        End Bid Date
                        <input type="datetime-local" name="end_bid_date" value={form.end_bid_date ?? ""} onChange={handleChange} />
                    </label>

                    <button type="submit" style={{ marginTop: "1rem" }}>
                        Create Auction
                    </button>
                </form>
            </main>

            <Footer
                active="auction-create"
                onSelect={(section) => {
                    console.log(`Selected section: ${section}`);
                }}
            />
        </>
    );
}

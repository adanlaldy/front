import React, { useEffect, useState } from "react";
import Header from "./header.tsx";
import Footer from "./footer.tsx";
import { useCreateFileMutation } from "../api/fileApi.ts";
import { useCreateAuctionMutation } from "../api/auctionsApi.ts";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { format, isValid } from "date-fns";

export default function CreateAuction() {
    const [form, setForm] = useState({
        title: "",
        description: "",
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

    // Date state + popover open control
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                const parsed = JSON.parse(user);
                if (parsed?.id) {
                    setForm((prev) => ({ ...prev, seller_id: parsed.id }));
                }
            } catch (e) {
                console.error("Erreur localStorage user:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (startDate && isValid(startDate)) {
            setForm((prev) => ({
                ...prev,
                start_bid_date: startDate.toISOString(),
            }));
        }
    }, [startDate]);

    useEffect(() => {
        if (endDate && isValid(endDate)) {
            setForm((prev) => ({
                ...prev,
                end_bid_date: endDate.toISOString(),
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                end_bid_date: null,
            }));
        }
    }, [endDate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
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
            alert("Error: user not identified.");
            return;
        }

        if (form.end_bid_date && form.start_bid_date >= form.end_bid_date) {
            alert("End date must be after start date.");
            return;
        }

        try {
            let fileId: number | undefined = undefined;

            if (selectedFile) {
                const reader = new FileReader();
                const fileReadPromise = new Promise<string>((resolve, reject) => {
                    reader.onload = () =>
                        resolve((reader.result as string).split(",")[1]);
                    reader.onerror = reject;
                });
                reader.readAsDataURL(selectedFile);
                const base64 = await fileReadPromise;

                const uploadedFile = await createFile({
                    content: base64,
                    contentType: selectedFile.type,
                }).unwrap();

                fileId = uploadedFile.file?.id;
            }

            const auctionToCreate = {
                title: form.title,
                description: form.description,
                initialPrice: form.initial_price,
                startBidDate: form.start_bid_date,
                endBidDate: form.end_bid_date,
                sellerId: form.seller_id,
                tagName: "Art",
                pictures: [],
                ...(fileId !== undefined ? { fileId } : {}),
            };

            console.log("Data sent:", auctionToCreate);

            const createdAuction = await createAuction(auctionToCreate).unwrap();
            console.log("Auction created:", createdAuction);
            alert("Auction created successfully!");
        } catch (error) {
            console.error("Creation error:", error);
            alert("Error creating auction.");
        }
    };

    const formatDateDisplay = (date?: Date) =>
        date ? format(date, "PP") : "Select a date";

    return (
        <>
            <Header pageName={"Create Auction"} />
            <main className="mx-auto p-4 max-h-[90vh] flex flex-col w-full max-w-lg sm:max-w-xl">
                <Card className="shadow-lg flex flex-col flex-1 min-h-0 w-full">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle className="text-lg sm:text-xl">Create Auction</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-auto flex-1 min-h-0 space-y-4 sm:space-y-6">
                        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:space-y-6">
                            <div className="space-y-1">
                                <Label htmlFor="title" className="text-sm sm:text-base">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter auction title"
                                    className="text-sm sm:text-base py-2"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="description" className="text-sm sm:text-base">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                    placeholder="Describe your item"
                                    className="text-sm sm:text-base py-2"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="file" className="text-sm sm:text-base">Select File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={handleFileChange}
                                    className="text-sm sm:text-base py-2"
                                />
                                {selectedFile && (
                                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                                        Selected file: <strong>{selectedFile.name}</strong>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="initial_price" className="text-sm sm:text-base">Initial Price</Label>
                                <Input
                                    id="initial_price"
                                    name="initial_price"
                                    type="number"
                                    value={form.initial_price}
                                    onChange={handleChange}
                                    min={0}
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    className="text-sm sm:text-base py-2"
                                />
                            </div>

                            {/* Start Bid Date */}
                            <div className="space-y-1">
                                <Label className="text-sm sm:text-base">Start Bid Date</Label>
                                <Popover open={startOpen} onOpenChange={setStartOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between text-sm sm:text-base py-2"
                                            aria-label="Select start bid date"
                                        >
                                            {startDate ? formatDateDisplay(startDate) : "Select start date"}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-2 h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date);
                                                setStartOpen(false);
                                            }}
                                            initialFocus
                                            className="rounded-md border"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* End Bid Date */}
                            <div className="space-y-1">
                                <Label className="text-sm sm:text-base">End Bid Date</Label>
                                <Popover open={endOpen} onOpenChange={setEndOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between text-sm sm:text-base py-2"
                                            aria-label="Select end bid date"
                                        >
                                            {endDate ? formatDateDisplay(endDate) : "Select end date"}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-2 h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => {
                                                setEndDate(date);
                                                setEndOpen(false);
                                            }}
                                            initialFocus
                                            className="rounded-md border"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button type="submit" className="w-full mt-4 py-2 text-sm sm:text-base">
                                Create Auction
                            </Button>
                        </form>
                    </CardContent>
                </Card>
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

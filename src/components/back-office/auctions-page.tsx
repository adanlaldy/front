import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { IAuction } from "@/types/auction.type.ts";
import { format } from "date-fns";
import { useState } from "react";
import { useGetAllAuctionsQuery, useUpdateAuctionByIdMutation } from "@/api/auctionsApi.ts";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";

export default function AuctionsPage() {
    const { data: auctions, error, isLoading, refetch } = useGetAllAuctionsQuery();
    const [updateAuctionById] = useUpdateAuctionByIdMutation();

    const [openDatePickerId, setOpenDatePickerId] = useState<number | null>(null);
    const [localDeletedAtUpdates, setLocalDeletedAtUpdates] = useState<Record<number, Date | null>>({});
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

    // Filtrage par checkbox
    const [filterActive, setFilterActive] = useState(true);
    const [filterEnded, setFilterEnded] = useState(true);
    const [filterOngoing, setFilterOngoing] = useState(true);

    const handleDeletedAtChange = async (id: number, date: Date | null) => {
        setLocalDeletedAtUpdates((prev) => ({
            ...prev,
            [id]: date,
        }));

        try {
            await updateAuctionById({
                id,
                data: { deletedAt: date ? date.toISOString() : null },
            }).unwrap();
            toast.success(date ? `Auction ${id} deactivated` : `Auction ${id} reactivated`);
            refetch();
        } catch (err) {
            toast.error("Failed to update auction status");
            console.error("Failed to update deletedAt", err);
            setLocalDeletedAtUpdates((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        } finally {
            setOpenDatePickerId(null);
        }
    };

    if (isLoading) return <div>Loading auctions...</div>;
    if (error) return <div>Error loading auctions.</div>;

    // Filtrer les enchères selon les checkbox
    const filteredAuctions = auctions?.filter((auction) => {
        const deletedAt = localDeletedAtUpdates[auction.id] ?? (auction.deletedAt ? new Date(auction.deletedAt) : null);
        const isActive = deletedAt === null;
        const now = new Date();
        const endDate = auction.endBidDate ? new Date(auction.endBidDate) : null;
        const isEnded = endDate ? endDate < now : false;
        const isOngoing = !isEnded;

        return (
            (filterActive && isActive) ||
            (filterEnded && isEnded) ||
            (filterOngoing && isOngoing)
        );
    });

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Auctions</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">

                {/* Checkbox filter */}
                <div className="mb-4 flex gap-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filterActive}
                            onChange={() => setFilterActive(!filterActive)}
                        />
                        <span>Active</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filterEnded}
                            onChange={() => setFilterEnded(!filterEnded)}
                        />
                        <span>Ended</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filterOngoing}
                            onChange={() => setFilterOngoing(!filterOngoing)}
                        />
                        <span>Ongoing</span>
                    </label>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">ID</TableHead>
                            <TableHead className="text-left">Title</TableHead>
                            <TableHead className="text-left">Description</TableHead>
                            <TableHead className="text-center">Initial Price</TableHead>
                            <TableHead className="text-center">Current Bid</TableHead>
                            <TableHead className="text-center">Start Date</TableHead>
                            <TableHead className="text-center">End Date</TableHead>
                            <TableHead className="text-center">Created At</TableHead>
                            <TableHead className="text-center">Updated At</TableHead>
                            <TableHead className="text-center">Deleted At</TableHead>
                            <TableHead className="text-center">Seller ID</TableHead>
                            <TableHead className="text-center">Buyer ID</TableHead>
                            <TableHead className="text-center">State Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAuctions?.map((auction: IAuction) => {
                            const deletedAt = localDeletedAtUpdates[auction.id] ?? (auction.deletedAt ? new Date(auction.deletedAt) : null);

                            return (
                                <TableRow key={auction.id}>
                                    <TableCell className="text-center">{auction.id}</TableCell>
                                    <TableCell className="text-left">{auction.title}</TableCell>
                                    <TableCell className="text-left max-w-[200px]">
                                        <div className="inline-flex flex-col text-sm">
                                            <span>
                                                {expandedDescriptions[auction.id]
                                                    ? auction.description
                                                    : `${auction.description.slice(0, 50)}${auction.description.length > 50 ? "..." : ""}`}
                                            </span>
                                            {auction.description.length > 50 && (
                                                <button
                                                    onClick={() =>
                                                        setExpandedDescriptions((prev) => ({
                                                            ...prev,
                                                            [auction.id]: !prev[auction.id],
                                                        }))
                                                    }
                                                    className="mt-1 inline-flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                                >
                                                    {expandedDescriptions[auction.id] ? (
                                                        <>
                                                            Show less <ChevronUp className="w-4 h-4" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Show more <ChevronDown className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">{auction.initialPrice}€</TableCell>
                                    <TableCell className="text-center">{auction.actualBidPrice}€</TableCell>
                                    <TableCell className="text-center">
                                        {format(new Date(auction.startBidDate), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {auction.endBidDate
                                            ? format(new Date(auction.endBidDate), "dd/MM/yyyy")
                                            : "Ongoing"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {format(new Date(auction.createdAt), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {format(new Date(auction.updatedAt), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    {deletedAt
                                                        ? format(deletedAt, "dd/MM/yyyy")
                                                        : "Active"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeletedAtChange(auction.id, null)}
                                                >
                                                    Reactivate Auction
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setOpenDatePickerId(
                                                            openDatePickerId === auction.id ? null : auction.id
                                                        )
                                                    }
                                                >
                                                    Pick Deactivation Date
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {openDatePickerId === auction.id && (
                                            <Popover open={true}>
                                                <PopoverTrigger asChild>
                                                    <span className="sr-only">Pick a date</span>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" sideOffset={8}>
                                                    <Calendar
                                                        mode="single"
                                                        selected={deletedAt ?? undefined}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                handleDeletedAtChange(auction.id, date);
                                                            }
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">{auction.sellerId}</TableCell>
                                    <TableCell className="text-center">{auction.buyerId ?? "—"}</TableCell>
                                    <TableCell className="text-center">
                                        {{
                                            1: "Pending",
                                            2: "Closed",
                                            3: "Open",
                                        }[auction.stateId] ?? "Unknown"}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

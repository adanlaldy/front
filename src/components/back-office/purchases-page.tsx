import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useGetAllPurchasesQuery } from "@/api/purchasesApi.ts";
import { IPurchase } from "@/types/purchase.type.ts";
import { format } from "date-fns";

export default function PurchasesPage() {
    const { data: purchases, error, isLoading } = useGetAllPurchasesQuery();

    if (isLoading) return <div>Loading purchases...</div>;
    if (error) return <div>Error loading purchases.</div>;

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Purchases</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">ID</TableHead>
                            <TableHead className="text-center">User ID</TableHead>
                            <TableHead className="text-center">Auction ID</TableHead>
                            <TableHead className="text-center">Final Price</TableHead>
                            <TableHead className="text-center">Purchase Date</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {purchases?.map((purchase: IPurchase) => (
                            <TableRow key={purchase.id}>
                                <TableCell className="text-center">{purchase.id}</TableCell>
                                <TableCell className="text-center">{purchase.userId}</TableCell>
                                <TableCell className="text-center">{purchase.auctionId}</TableCell>
                                <TableCell className="text-center">
                                    {purchase.finalPrice ? purchase.finalPrice.toFixed(2) + " €" : "N/A"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {purchase.purchaseDate
                                        ? format(new Date(purchase.purchaseDate), "dd/MM/yyyy")
                                        : "N/A"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

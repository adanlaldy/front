import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { IUser } from "../../types/user.type.ts";
import { useGetAllUsersQuery, useUpdateUserByIdMutation } from "@/api/userApi.ts";
import { toast } from "sonner";

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
import { format } from "date-fns";
import { useState } from "react";

export default function UsersPage() {
    const { data: users, error, isLoading, refetch } = useGetAllUsersQuery();
    const [updateUserById] = useUpdateUserByIdMutation();
    const [openDatePickerId, setOpenDatePickerId] = useState<number | null>(null);

    // New state: track locally updated deleted_at per user id
    const [localDeletedAtUpdates, setLocalDeletedAtUpdates] = useState<Record<number, Date | null>>({});

    const handleRoleChange = async (id: number, newRole: string) => {
        try {
            await updateUserById({ id, data: { role: newRole } }).unwrap();
            toast.success(`User ${id}'s role has been updated to ${newRole}`);
            refetch();
        } catch (err) {
            toast.error("Failed to update role");
            console.error("Failed to update role", err);
        }
    };

    const handleDeletedAtChange = async (id: number, date: Date | null) => {
        // Optimistically update UI immediately
        setLocalDeletedAtUpdates((prev) => ({
            ...prev,
            [id]: date,
        }));

        try {
            await updateUserById({
                id,
                data: { deletedAt: date ? date.toISOString() : null },
            }).unwrap();
            toast.success(
                date
                    ? `User ${id} deactivated`
                    : `User ${id} reactivated`
            );
            refetch();
        } catch (err) {
            toast.error("Failed to update account status");
            console.error("Failed to update deletedAt", err);

            // Rollback optimistic update on error
            setLocalDeletedAtUpdates((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        } finally {
            setOpenDatePickerId(null);
        }
    };

    if (isLoading) return <div>Loading users...</div>;
    if (error) return <div>Error loading users.</div>;

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center align-middle">ID</TableHead>
                            <TableHead className="text-center align-middle">Name</TableHead>
                            <TableHead className="text-center align-middle">Email</TableHead>
                            <TableHead className="text-center align-middle">Role</TableHead>
                            <TableHead className="text-center align-middle">Created At</TableHead>
                            <TableHead className="text-center align-middle">Last Updated</TableHead>
                            <TableHead className="text-center align-middle">Deleted At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user: IUser) => {
                            const deletedAt = localDeletedAtUpdates[user.id] ?? (user.deletedAt ? new Date(user.deletedAt) : null);

                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="text-center align-middle">{user.id}</TableCell>
                                    <TableCell className="text-center align-middle">{`${user.firstName} ${user.lastName}`}</TableCell>
                                    <TableCell className="text-center align-middle">{user.email}</TableCell>
                                    <TableCell className="text-center align-middle capitalize">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    {user.role}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                                {["admin", "user"].map((role) => (
                                                    <DropdownMenuItem
                                                        key={role}
                                                        onClick={() => handleRoleChange(user.id, role)}
                                                    >
                                                        {role}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell className="text-center align-middle">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-center align-middle">
                                        {new Date(user.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-center align-middle">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    {deletedAt
                                                        ? format(deletedAt, "dd/MM/yyyy")
                                                        : "Active"}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Account Status</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeletedAtChange(user.id, null)}
                                                >
                                                    Reactivate Account
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setOpenDatePickerId(
                                                            openDatePickerId === user.id ? null : user.id
                                                        )
                                                    }
                                                >
                                                    Pick a Deactivation Date
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {openDatePickerId === user.id && (
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
                                                                handleDeletedAtChange(user.id, date);
                                                            }
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
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
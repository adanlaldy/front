import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IUser } from "../types/user.type";
import { useGetAllUsersQuery } from "@/api/userApi.ts";

export default function UsersPageBackOffice() {
    const { data: users, error, isLoading } = useGetAllUsersQuery();

    if (isLoading) {
        return <div>Loading users...</div>;
    }

    if (error) {
        return <div>Error loading users.</div>;
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead>Deleted At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user: IUser) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(user.updated_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {user.deleted_at
                                        ? new Date(user.deleted_at).toLocaleDateString()
                                        : "—"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

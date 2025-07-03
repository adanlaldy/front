import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header.tsx";
import Footer from "@/components/footer.tsx";
import {useDeleteUserByIdMutation, useGetUserByIdQuery, useUpdateUserByIdMutation} from "@/api/userApi.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<number | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [updateUser] = useUpdateUserByIdMutation();
    const [deleteUser] = useDeleteUserByIdMutation();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserId(parsed.id);
            } catch (err) {
                console.error("Failed to parse user from localStorage", err);
            }
        }
    }, []);

    const { data: user, isLoading } = useGetUserByIdQuery(userId!, {
        skip: userId === null,
    });

    useEffect(() => {
        if (user && email === "") {
            setEmail(user.email);
        }
    }, [user]);

    const handleSave = async () => {
        if (!userId) return;

        try {
            await updateUser({
                id: userId,
                data: {
                    email,
                    ...(password && { password }),
                },
            });
            toast.success("Profile updated successfully!", { duration: 3000 });
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating your profile.", { duration: 3000 });
        }
    };

    const handleDelete = async () => {
        if (!userId) return;

        try {
            await deleteUser(userId);
            toast.success("Account deleted.", { duration: 3000 });
            localStorage.removeItem("user");
            navigate("/login");
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while deleting your account.", { duration: 3000 });
        }
    };


    if (userId === null || isLoading) return <p className="text-center mt-8">Loading...</p>;

    return (
        <>
            <Header pageName="Settings" />

            <div className="max-w-md mx-auto px-4 py-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Edit Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <Button
                                onClick={handleSave}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Save Changes
                            </Button>

                            {/* Delete account confirmation */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                        Delete Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-sm"> {/* Réduit la largeur */}
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Yes, delete my account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </CardContent>
                </Card>
            </div>

            <Footer
                active="home"
                onSelect={(section) => {
                    console.log(`Selected section: ${section}`);
                }}
            />
        </>
    );
}
export type IUser = {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    picture: string | null;
    balance: number;
    role: "admin" | "user" | string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

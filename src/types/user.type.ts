export type IUser = {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    email: string;
    picture: string | null;
    balance: number;
    role: "admin" | "user" | string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

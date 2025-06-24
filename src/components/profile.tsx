import {IUser} from "../types/user.type.ts";
import {useGetCurrentUserQuery} from "../api/authApi.ts";

export default function Profile() {
    const {
        data: user,
        isLoading,
        isError,
    } = useGetCurrentUserQuery() as {
        data: IUser | undefined;
        isLoading: boolean;
        isError: boolean;
    };

    if (isLoading) return <p>Chargement...</p>;
    if (isError || !user) return <p>Erreur lors du chargement du profil.</p>;

    return (
        <>
            <p className={'text-white text-2xl'}>{user.first_name} {user.last_name}</p>
            <p className={'text-stone-400'}>{user.email}</p>
        </>
    );
}

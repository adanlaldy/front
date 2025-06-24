import Sidebar from "./sidebar.tsx";
import Notifications from "./notifications.tsx";

type HeaderProps = {
    pageName: string;
};

export default function Header({ pageName }: HeaderProps) {
    return (
        <>
            <Sidebar />
            <Notifications />

            {/* Header fixé en haut, centré entre Sidebar et Notifications */}
            <div className="fixed top-5 left-0 w-full flex justify-center">
                <h1 className="text-2xl font-semibold italic text-blue-700">
                    {pageName}
                </h1>
            </div>
        </>
    );
}


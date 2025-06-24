import "../Home.css";
// import Header from "./Header";
// import React from "react";
import { IUser } from "../types/user.type.ts";
import { useGetCurrentUserQuery } from "../api/authApi.ts";
import Footer from "./footer.tsx";
function Home() {
    // This component serves as the home page of the application.
    const {
        data: user,
        isLoading,
        isError,
    } = useGetCurrentUserQuery() as {
        data: IUser | undefined;
        isLoading: boolean;
        isError: boolean;
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error fetching user data</div>;
    }
    return (
        <div className="home-container">
            <h3>Available Gift Points</h3>
            <p>{user ? user.balance : -1} dBC</p>
            <h6 className="text-xs text-gray-500 mt-1">AS OF TODAY, {new Date().toLocaleDateString()}</h6>
            <img src="/assets/HomeIllustration.png" alt="Illustration" className="w-64 h-auto mx-auto" />
            <h4>
                Welcome {user ? `${user.first_name}, ${user.last_name}` : "Guest"}!
            </h4>
            <Footer
                active="home"
                onSelect={(section) => {
                    // Handle footer section selection if needed
                    console.log(`Selected section: ${section}`);
                }}
            />
        </div>

    );
}

export default Home;

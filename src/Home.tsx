import "./Home.css";
import Header from "./Header";
import React from "react";

function Home() {
    // This component serves as the home page of the application.
    let points = 999;

    return (
        <div className="home-container">
            <h3>Available Gift Points</h3>
            <p>{points} dBC</p>
            <h5>AS OF TODAY, {new Date().toLocaleString()}</h5>
        </div>
    );
}

export default Home;

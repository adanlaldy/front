"use client";

import { useState } from "react";
import TutorialButton from "./tutorial-button.tsx";
import {Link} from "react-router-dom";

const tutorialSteps = [
    {
        image: "/src/assets/search-tuto.png",
        title: "Search",
        description: "Discover rarest finds that you might like and join the Auction for a chance to acquire it.",
    },
    {
        image: "/src/assets/bid-tuto.png",
        title: "Bid",
        description: "Compete with other bidders to be the Top Bidder to win the Auction!",
    },
    {
        image: "/src/assets/win-tuto.png",
        title: "Win!",
        description: "After the Auction, only the Top Bidder will win the specific item placed. It will be delivered to the winner. Congrats!",
    },
];


export default function Tutorial() {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    if (step === 0) {
        // Écran d'accueil
        return (
            <div className="h-screen flex flex-col overflow-hidden py-10">
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col gap-2 text-center">
                        <span>Welcome to</span>
                        <p className="text-xl italic pb-10">Valorium Auctions</p>
                        <span>Let's take a tour! Shall we?</span>
                    </div>
                </div>
                <div>
                    <TutorialButton input="Get Started" onClick={handleNext} />
                </div>
            </div>
        );
    }

    const { image, title, description } = tutorialSteps[step - 1] || {};

    return (
        <div className="h-screen flex flex-col overflow-hidden py-10 px-4 text-center">
            <div className="flex-grow flex flex-col items-center justify-center gap-6">
                <img
                    src={image}
                    alt={`Tutorial step ${step}`}
                    className="max-h-[100%] object-contain"
                />
                <div className="text-sm">
                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
            <div className="flex justify-center gap-2 mb-4">
                {tutorialSteps.map((_, index) => (
                    <span
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            step - 1 === index ? "bg-yellow-400" : "bg-gray-300"
                        }`}
                    />
                ))}
            </div>
            <div>
                {step < tutorialSteps.length ? (
                    <TutorialButton input="Continue" onClick={handleNext} />
                ) : (
                    <Link to="/login">
                        <TutorialButton input="Finish" onClick={handleNext} />
                    </Link>
                )}
            </div>
        </div>
    );

}

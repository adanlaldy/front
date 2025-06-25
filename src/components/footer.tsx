import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
    Home,
    Scale,
    Sparkles,
    PlusCircle,
    MessageCircle,
} from "lucide-react";

interface FooterProps {
    active: "home" | "auction" | "winners" | "auction-create" | "messages";
    onSelect: (
        section:
            | "home"
            | "auction"
            | "winners"
            | "auction-create"
            | "messages"
    ) => void;
}

const Footer: FC<FooterProps> = ({ active, onSelect }) => {
    const navigate = useNavigate();
    const baseStyle = "flex flex-col items-center justify-center flex-1 py-2";
    const iconSize = 20;

    const handleClick = (
        section:
            | "home"
            | "auction"
            | "winners"
            | "auction-create"
            | "messages"
    ) => {
        onSelect(section);

        switch (section) {
            case "home":
                navigate("/home");
                break;
            case "auction":
                navigate("/auction-house");
                break;
            case "winners":
                navigate("/bid-winners");
                break;
            case "auction-create":
                navigate("/create-auction");
                break;
            case "messages":
                navigate("/messages");
                break;
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 shadow-md bg-white rounded-t-2xl border-t flex text-xs font-medium text-gray-500">
            <button
                onClick={() => handleClick("home")}
                className={`${baseStyle} ${active === "home" ? "text-blue-600" : ""}`}
            >
                <Home size={iconSize} fill={active === "home" ? "#2563EB" : "none"} />
                <span className="mt-1">HOME</span>
            </button>
            <button
                onClick={() => handleClick("auction")}
                className={`${baseStyle} ${active === "auction" ? "text-blue-600" : ""}`}
            >
                <Scale size={iconSize} />
                <span className="mt-1">AUCTION HOUSE</span>
            </button>
            <button
                onClick={() => handleClick("auction-create")}
                className={`${baseStyle} ${active === "auction-create" ? "text-blue-600" : ""}`}
            >
                <PlusCircle size={iconSize} />
                <span className="mt-1">CREATE AUCTION</span>
            </button>
            <button
                onClick={() => handleClick("messages")}
                className={`${baseStyle} ${active === "messages" ? "text-blue-600" : ""}`}
            >
                <MessageCircle size={iconSize} />
                <span className="mt-1">MESSAGES</span>
            </button>
            <button
                onClick={() => handleClick("winners")}
                className={`${baseStyle} ${active === "winners" ? "text-blue-600" : ""}`}
            >
                <Sparkles size={iconSize} />
                <span className="mt-1">BID WINNERS</span>
            </button>
        </div>
    );
};

export default Footer;

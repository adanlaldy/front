import { Link } from "react-router-dom";

type TutorialButtonProps = {
    input: string;
    onClick?: () => void;
};

export default function TutorialButton({ input, onClick }: TutorialButtonProps) {
    return (
        <div className="flex flex-col w-full">
            <button
                onClick={onClick}
                className="text-white bg-blue-800 hover:bg-blue-700 active:bg-blue-900 rounded-2xl py-2"
            >
                {input}
            </button>
            <span className="text-xs pt-1">
                Already have an account?
                <Link to="/login">
                    <span className="text-green-500 hover:text-green-400 active:text-green-600"> LOGIN</span>
                </Link>
            </span>
        </div>
    );
}

import React from "react";
import "./Login.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login: React.FC = () => {
    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="app-title">
                    <i>Valorium</i> Auctions
                </h1>

                <h2 className="login-title">Valorium Login</h2>

                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input type="text" placeholder="  Username" />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input type="password" placeholder="  Password" />
                </div>

                <button className="login-button">Login</button>

                <p className="signup-text">
                    Not yet registered? <a href="/register">SIGN UP</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

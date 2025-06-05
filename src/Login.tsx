"use client"

import React, {useState} from "react";
import "./Login.css";
import {FaUser, FaLock} from "react-icons/fa";
import {useLoginMutation} from "./api/authApi.ts";
import {useNavigate} from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [login, {isLoading, error}] = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({email, password}).unwrap();
            console.log("Login successful:", res.message);

            navigate("/home");
        } catch (err: any) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="app-title">
                    <i>Valorium</i> Auctions
                </h1>

                <h2 className="login-title">Valorium Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaUser className="input-icon"/>
                        <input type="text"
                               placeholder="  Username"
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon"/>
                        <input type="password"
                               placeholder="  Password"
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {error && (
                    <p className="error-message">
                        {(error as any)?.data?.message || "Login failed"}
                    </p>
                )}

                <p className="signup-text">
                    Not yet registered? <a href="/register">SIGN UP</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

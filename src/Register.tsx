import React from "react";
import "./Register.css";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const Register: React.FC = () => {
    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="app-title">
                    <i>Valorium</i> Auctions
                </h1>

                <h2 className="register-title">Create an Account</h2>

                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input type="text" placeholder="  Full Name" />
                </div>

                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input type="email" placeholder="  Email Address" />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input type="password" placeholder="  Password" />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input type="password" placeholder="  Retype Passcode" />
                </div>

                <button className="login-button">Create an account</button>

                <p className="signup-text">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;

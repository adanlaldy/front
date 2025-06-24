import React, { useState } from "react";
import "../Register.css";
import { useRegisterMutation } from "../api/authApi"; // adapte le chemin selon ta structure
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        birthdate: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [registerUser] = useRegisterMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";

        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address.";

        if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.birthdate)) {
            newErrors.birthdate = "Birthdate must be in format YYYY-MM-DD.";
        }

        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else if (!/\d/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one special character.";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await registerUser({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    birthDate: new Date(formData.birthdate),
                    password: formData.password,
                    role: "user",
                }).unwrap();
                console.log("Registration successful:", response);
                // Redirection ou message de succès ici
            } catch (err: any) {
                console.error("Registration failed:", err?.data || err);
                // Gérer l'erreur (ex: afficher un message dans l'UI)
            }
        }
    };


    return (
        <div className="register-container">
            <form className="register-card" onSubmit={handleSubmit}>
                <h1 className="app-title">
                    <i>Valorium</i> Auctions
                </h1>

                <h2 className="register-title">Create an Account</h2>

                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        name="firstName"
                        placeholder="  First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}

                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="  Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}

                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        name="email"
                        placeholder="  Email Address"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                {errors.email && <p className="error-text">{errors.email}</p>}

                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        name="birthdate"
                        placeholder="  Birthdate (YYYY-MM-DD)"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </div>
                {errors.birthdate && <p className="error-text">{errors.birthdate}</p>}

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        name="password"
                        placeholder="  Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                {errors.password && <p className="error-text">{errors.password}</p>}

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="  Retype Passcode"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

                <button className="login-button" type="submit">
                    Create an account
                </button>

                <p className="signup-text">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default Register;

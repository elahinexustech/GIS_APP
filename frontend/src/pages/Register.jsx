import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, email, password, confirmPassword, termsAccepted } = formData;

        if (password !== confirmPassword) return toast.error("Passwords do not match!");
        if (!termsAccepted) return toast.error("You must accept the terms and conditions!");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/users/", {
                full_name: fullName,
                email,
                password,
            });
            if (response.status === 201) {
                toast.success("Registration successful!");
                setFormData({ fullName: "", email: "", password: "", confirmPassword: "", termsAccepted: false });
                navigate("/login")
            }
        } catch (error) {
            const errorMsg = error.response?.data?.email?.[0] || "Registration failed. Please try again.";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="container my-5 py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h3 className="mb-4 text-center">Create an Account</h3>
                    <form onSubmit={handleSubmit}>
                        {[
                            { label: "Email Address", name: "email", type: "email" },
                            { label: "Password", name: "password", type: "password" },
                            { label: "Confirm Password", name: "confirmPassword", type: "password" },
                        ].map(({ label, name, type }) => (
                            <div className="form-group mb-3" key={name}>
                                <label>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        ))}
                        <div className="form-check mb-4">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                className="form-check-input"
                                id="terms"
                            />
                            <label className="form-check-label" htmlFor="terms">
                                I agree to the terms and conditions
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100">
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-3 text-center">
                        Already have an account? <Link to="/login">Sign In here</Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;

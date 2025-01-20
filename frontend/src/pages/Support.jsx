import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const Support = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [pageState, setPageState] = useState(1)

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/send-email/", data);
            alert(response.data.message);
            setPageState(2);
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send your message. Please try again later.");
        }
    };

    return (
        <div className="container my-5 d-flex justify-content-center">
            {(pageState == 1) ? (
                <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
                    <h2 className="text-center mb-4">Contact Mappex</h2>
                    <p className="text-center mb-4">Please send us a message if you have any questions.</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name:
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <small className="text-danger">{errors.name.message}</small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                            />
                            {errors.email && (
                                <small className="text-danger">{errors.email.message}</small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="question" className="form-label">
                                Question:
                            </label>
                            <textarea
                                id="question"
                                className="form-control"
                                rows="4"
                                {...register("question", { required: "Question is required" })}
                            ></textarea>
                            {errors.question && (
                                <small className="text-danger">{errors.question.message}</small>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%", 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'justifyContent': 'center' }}>
                    <h2 className="text-center mb-4">Message Sent Successfully</h2>
                    <i className="bi bi-check-circle text-success" style={{fontSize: '2rem'}}></i>

                </div>
            )}
        </div>
    );
};

export default Support;

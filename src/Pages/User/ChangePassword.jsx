import { useState } from "react";
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [passwordValidity, setPasswordValidity] = useState(false);
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handelSubmit(e) {
        e.preventDefault();
        setError(false);
        
        if (!passwordValidity) {
            setError(true);
            setMessage("Please enter valid Password");
            return;
        }

        if (formData.password !== formData["confirm-password"]) {
            setError(true);
            setMessage("Password does not matched!");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/update-password`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include"
            });

            const result = await res.json();
            setError(result.hasError);
            setMessage(result.message);
            navigate('/dashboard');
        } catch (error) {
            setError(true);
            setMessage("Something went wrong!");
            console.log("Error: ", error);
        }
    }

    function validatePassword(e) {
        // Regular expressions for validation
        const password = e.target.value;
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;

        // Check if password meets all criteria
        const isValid = (
            password.length >= 6 &&
            uppercaseRegex.test(password) &&
            lowercaseRegex.test(password) &&
            numberRegex.test(password)
        );

        setPasswordValidity(isValid);

        handleChange(e);
    }

    return (
        <main className="card">
            <h1>Change Password</h1>

            <div className="form-card">
                <div className="form-container">
                    {message !== "" ? <Alert severity={hasError ? "error" : "success"}> {message} </Alert> : ""}

                    <form onSubmit={handelSubmit}>
                        <div className="form-control">
                            <label htmlFor="current-password">Current Password: </label>
                            <input type="password" name="current-password" id="current-password" onChange={handleChange} />
                        </div>

                        <div className="form-control">
                            <label htmlFor="password">New Password: </label>
                            <input type="password" name="password" id="password" onChange={validatePassword} />
                        </div>

                        <div className="form-control">
                            {passwordValidity ? <span><i className="fa-solid fa-check" style={{ color: "green" }}></i> Password is secure</span> :
                                <span><i className="fa-solid fa-xmark" style={{ color: "red" }}></i> Password is too weak</span>}
                        </div>

                        <div className="form-control">
                            <label htmlFor="confirm-password">Confirm Password: </label>
                            <input type="password" name="confirm-password" id="confirm-password" onChange={handleChange} />
                        </div>

                        <button className="btn">Change Password</button>
                    </form>
                </div>
            </div>
        </main>
    );
}
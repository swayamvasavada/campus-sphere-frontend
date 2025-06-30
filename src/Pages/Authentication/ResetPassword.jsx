import { useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import resetImg from "../../assets/images/forgotpassword_img.jpg"
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";

export default function ResetPassword() {
    const { resetToken } = useParams();
    let [passwordData, setPasswordData] = useState({});
    const [passwordValidity, setPasswordValidity] = useState(false);
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value })
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

    async function updatePassword(e) {
        e.preventDefault();
        setError(false);

        try {

            if (!passwordValidity) {
                setError(true);
                setMessage("Please enter valid password");
                return;
            }

            if (passwordData.password !== passwordData.confirmPassword) {
                setError(true);
                setMessage("Password does not match!");
                return;
            }

            const res = await fetch(`${process.env.REACT_APP_API_URL}/reset-password/${resetToken}`, {
                method: 'POST',
                body: JSON.stringify({ password: passwordData.password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setError(false);

            if (result.hasError) setError(true);
            console.log(result);
            setMessage(result.message);
            return;
        } catch (error) {
            setError(true);
            setMessage('Something went wrong');
        }
    }

    return (
        <main id="reset-form-card">
            <div className="form-card">

                <div className="image-container">
                    <img src={resetImg} alt="" />
                </div>

                <div className="form-container">
                    <h1>Update your Password</h1>
                    {message !== '' ? <Alert severity={hasError ? "error" : "success"}>{message}</Alert> : ''}
                    <form onSubmit={updatePassword}>
                        <div className="form-control">
                            <label htmlFor="password">New Password</label>
                            <input type="password" name="password" id="password" onChange={validatePassword} />
                        </div>

                        <div className="form-control">
                            {passwordValidity ? <span><i className="fa-solid fa-check" style={{ color: "green" }}></i> Password is secure</span> :
                                <span><i className="fa-solid fa-xmark" style={{ color: "red" }}></i> Password is too weak</span>}
                        </div>

                        <div className="form-control">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input type="password" name="confirmPassword" id="confirmPassword" onChange={handleChange} />
                        </div>

                        <button className="btn" type="submit">Change Password!</button>
                    </form>
                </div>

            </div>
        </main>
    )
}
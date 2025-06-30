import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import loginImage from "../../assets/images/login_img.jpg";
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";

export default function Login() {
    const navigate = useNavigate();
    var [formData, setFormData] = useState({});
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function login(e) {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const result = await res.json();

                console.log(result);
                if (result.hasError) {
                    setError(result.message);
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error(error);
            setError("Something went wrong!");
        }
    }

    return (
        <main>
            <div className="form-card">
                <div className="form-container">
                    <h1>Login</h1>

                    {error !== '' ? <Alert severity="error">{error}</Alert> : ''}
                    <form onSubmit={login}>
                        <div className="form-control">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" onChange={handleChange} />
                        </div>

                        <div className="form-control">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" minLength={6} maxLength={16} required onChange={handleChange} />
                        </div>

                        <div className="form-control">
                            <a href="/reset-password" className="btn-alt">Forgot password</a>
                        </div>

                        <button className="btn" type="submit">Login</button>
                    </form>
                </div>
                <div className="image-container">
                    <img loading="lazy" src={loginImage} alt="" />
                </div>
            </div>
        </main>
    )
}
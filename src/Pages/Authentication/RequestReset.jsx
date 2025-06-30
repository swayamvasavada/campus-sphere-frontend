import { useState } from "react";
import { Alert } from "@mui/material";
import resetImg from "../../assets/images/forgotpassword_img.jpg"
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";

export default function RequesReset() {
    const [email, setEmail] = useState('');
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');

    function handleChange(e) {
        setEmail(e.target.value);
    }

    async function requestReset(e) {
        e.preventDefault();

        try {

            const res = await fetch(`${process.env.REACT_APP_API_URL}/request-reset`, {
                method: 'POST',
                body: JSON.stringify({ email: email }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setError(false);
            if (result.hasError) setError(true);
            return setMessage(result.message);
        } catch (error) {
            setError(true);
            setMessage('Something went wrong');
        }
    }

    return (
        <main id="reset-form-card">
            <div className="form-card">

                <div className="image-containter">
                    <img src={resetImg} alt="" />
                </div>
                <div className="form-container">
                    <h1>Find your account</h1>

                    {message !== '' ? <Alert severity={hasError ? "error" : "success"}> {message} </Alert> : ''}

                    <form onSubmit={requestReset}>
                        <div className="form-control">
                            <label htmlFor="email">Email address</label>
                            <input type="email" name="email" id="email" onChange={handleChange} />
                        </div>
                        <button className="btn" type="submit">Next</button>
                    </form>
                </div>

            </div>
        </main>
    )
}
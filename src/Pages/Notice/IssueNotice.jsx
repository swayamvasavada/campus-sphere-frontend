import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

import noticeImage from "../../assets/images/notice_image.jpg";
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";


export default function IssueNotice() {
    const [formData, setFormData] = useState({});
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function validate() {
        const { noticeTitle, noticeMessage, noticeLevel } = formData;
        console.log(noticeTitle, noticeMessage, noticeLevel);
        
        if (!noticeTitle || !noticeMessage || !noticeLevel) {
            return false;
        }

        if (![1, 2, 3].includes(Number(noticeLevel))) {
            return false;
        }

        return true;
    }


    async function handleIssue(e) {
        e.preventDefault();
        setError(false);

        if (!validate()) {
            setError(true);
            setMessage("Please fill details properly!");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/notice/issue-notice`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!res) {
                setError(true);
                setMessage("Something went wrong!");
                return;
            }

            const result = await res.json();

            if (result.hasError) {
                setError(true);
                setMessage(result.message);
                return;
            }

            navigate('/notice');
        } catch (error) {
            console.log("Error: ", error);
            setError(true);
            setMessage("Something went wrong!");
        }
    }
    return (
        <main>
            <div className="form-card">
                <div className="form-container">
                    <h1>Issue Notice</h1>

                    {hasError ? <Alert severity="error">{message}</Alert> : ""}
                    <form onSubmit={handleIssue}>
                        <div className="form-control">
                            <label htmlFor="noticeTitle">Notice Title</label>
                            <input type="text" name="noticeTitle" id="noticeTitle" onChange={handleChange} />
                        </div>

                        <div className="form-control">
                            <label htmlFor="noticeMessage">Notice message</label>
                            <textarea name="noticeMessage" id="noticeMessage" onChange={handleChange}></textarea>
                        </div>

                        <div className="form-control">
                            <label htmlFor="noticeLevel">Notice Type: </label>
                            <select name="noticeLevel" id="noticeLevel" onChange={handleChange}>
                                <option hidden>Select Type</option>
                                <option value="1"> For all </option>
                                <option value="2"> For Faculties </option>
                                <option value="3"> For Students </option>
                            </select>
                        </div>

                        <button className="btn" type="submit">Issue Notice</button>
                    </form>

                </div>
                <div className="image-container">
                    <img src={noticeImage} alt="" />
                </div>
            </div>
        </main>
    )
}
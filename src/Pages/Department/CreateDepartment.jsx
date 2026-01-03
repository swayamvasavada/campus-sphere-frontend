import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

import loginImage from "../../assets/images/login_img.jpg";
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";


export default function CreateDepartment() {
    const [deptName, setDeptName] = useState('');
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    function handleChange(e) {
        setDeptName(e.target.value);
    }

    function validate() {
        return deptName !== ""
    }

    async function CreateDept(e) {
        e.preventDefault();
        setError(false);

        if (!validate()) {
            setError(true);
            setMessage("Please enter Department name");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/create-dept`, {
                method: 'POST',
                body: JSON.stringify({ deptName: deptName }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
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

            navigate('/departments');
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
                    <h1>Create Department</h1>

                    {hasError ? <Alert severity="error">{message}</Alert> : ""}
                    <form onSubmit={CreateDept}>
                        <div className="form-control">
                            <label htmlFor="deptName">Department name</label>
                            <input type="text" name="deptName" id="deptName" onChange={handleChange} />
                        </div>
                        <button className="btn" type="submit">Add Department</button>
                    </form>

                </div>
                <div className="image-container">
                    <img src={loginImage} alt="" />
                </div>
            </div>
        </main>
    )
}
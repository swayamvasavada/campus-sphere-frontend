import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";

import loginImage from "../../assets/images/login_img.jpg";
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";


export default function UpdateDepartment() {
    const { deptId } = useParams();
    const [deptName, setDeptName] = useState('');
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(function () {
        async function fetchDeptDetails() {

            setError(false);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/${deptId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${localStorage.getItem("authToken")}`
                    },
                    credentials: 'include'
                });

                const result = await res.json();
                if (result.hasError) {
                    setError(true);
                    setMessage(result.message);
                }
                
                setDeptName(result.data.deptName);
            } catch (error) {
                console.log("Error: ", error);
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchDeptDetails();
    }, [deptId]);

    function handleChange(e) {
        setDeptName(e.target.value);
    }

    function validate() {
        return deptName !== ""
    }

    async function updateDept(e) {
        e.preventDefault();
        setError(false);

        if (!validate()) {
            setError(true);
            setMessage("Please enter Department name");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/update-dept/${deptId}`, {
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
                    <h1>Update Department</h1>

                    {hasError ? <Alert severity="error">{message}</Alert> : ""}
                    <form onSubmit={updateDept}>
                        <div className="form-control">
                            <label htmlFor="deptName">Department name</label>
                            <input type="text" name="deptName" id="deptName" value={deptName} onChange={handleChange} />
                        </div>
                        <button className="btn" type="submit">Update Department</button>
                    </form>

                </div>
                <div className="image-container">
                    <img src={loginImage} alt="" />
                </div>
            </div>
        </main>
    )
}
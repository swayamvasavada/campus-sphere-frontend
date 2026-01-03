import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import signupImage from "../../assets/images/signup_img.jpg";
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";

import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";

export default function CreateUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [currentSection, setCurrentSection] = useState(1);
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function validateSection(sectionNumber) {
        switch (sectionNumber) {
            case 1:
                return (
                    formData.firstName?.length >= 2 &&
                    formData.firstName?.length <= 8 &&
                    formData.lastName?.length >= 2 &&
                    formData.lastName?.length <= 8 &&
                    formData.gender &&
                    formData.primaryNo?.toString().length === 10 &&
                    formData.dob
                );
            case 2:
                return (
                    formData.colonyName &&
                    formData.landmark &&
                    formData.area &&
                    formData.city &&
                    formData.pincode?.toString().length === 6
                );
            case 3:
                return (
                    formData.email &&
                    formData.password &&
                    /[A-Z]/.test(formData.password) &&
                    /[a-z]/.test(formData.password) &&
                    /[0-9]/.test(formData.password) &&
                    formData.password.length >= 6
                );
            case 4:
                if (formData.desg === "Student") return formData.dept && formData.desg && formData.batch;
                if (formData.desg !== "") return true;
                break;
            default:
                return false;
        }
    }

    function handlePrevious() {
        setError(false);
        setCurrentSection(currentSection - 1);
    }

    function handleNext() {
        if (validateSection(currentSection)) {
            setError(false);
            setCurrentSection(currentSection + 1);
        } else {
            setError(true);
            setMessage("Please fill all details properly!");
        }
    }

    async function submitData(e) {
        e.preventDefault();

        if (!validateSection(4)) {
            setError(true);
            setMessage("Please fill all details properly!");
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (result.userExist) {
                setError(true);
                setMessage(result.message);
                return;
            }

            navigate('/');
        } catch (error) {
            console.log("Error: ", error);
            setError(true);
            setMessage("Something went wrong!");
        }
    }

    return (
        <main>
            <h1>Register User</h1>
            <div className="form-card">

                <div className="image-container">
                    <img loading="lazy" src={signupImage} alt="Signup" />
                </div>

                <div className="form-container">
                    <form id="create-user-form" onSubmit={submitData}>
                        {currentSection === 1 && <Section1 formData={formData} handleChange={handleChange} />}
                        {currentSection === 2 && <Section2 formData={formData} handleChange={handleChange} />}
                        {currentSection === 3 && <Section3 formData={formData} handleChange={handleChange} isCreating={true} />}
                        {currentSection === 4 && <Section4 formData={formData} handleChange={handleChange} />}
                    </form>

                    {hasError ? <Alert severity="error">{message}</Alert> : ''}

                    {/* Form actions button */}
                    <div className="form-actions">
                        {currentSection > 1 && (
                            <button type="button" className="btn" onClick={handlePrevious}>
                                Previous
                            </button>
                        )}
                        {currentSection < 4 && (
                            <button type="button" className="btn" onClick={handleNext}>
                                Next
                            </button>
                        )}
                        {currentSection === 4 && (
                            <button type="submit" form="create-user-form" className="btn">
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

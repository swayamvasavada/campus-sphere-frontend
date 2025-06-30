import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import signupImage from "../../assets/images/signup_img.jpg";
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";

import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";
import Section4 from "./Section4";

export default function UpdateUser() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [formData, setFormData] = useState({});
    const [currentSection, setCurrentSection] = useState(1);
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchUserData() {
            setError(false);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                let result = await res.json();

                if (result.hasError) {
                    setError(true);
                    setMessage(result.message);
                }

                result = result.data;

                const initialState = {
                    firstName: result.name.firstName,
                    middleName: result.middleName || '',
                    lastName: result.name.lastName,
                    gender: result.gender,
                    primaryNo: result.contact.primaryNo,
                    alternativeNo: result.contact.alternativeNo || '',
                    dob: new Date(result.dob).toISOString().split('T')[0],
                    colonyName: result.address.colonyName,
                    landmark: result.address.landmark,
                    area: result.address.area,
                    city: result.address.city,
                    pincode: result.address.pincode,
                    email: result.email,
                    dept: result.deptId,
                    batch: result.batch,
                    desg: result.desg,
                }

                console.log('Initial state: ', initialState);
                setFormData(initialState);
            } catch (error) {
                console.log("Error: ", error);
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchUserData();
    }, [userId]);

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
                if (formData.email) return true;
                break;
            case 4:
                if (formData.desg === "Student") return formData.dept && formData.desg && formData.batch
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
            setMessage('Please fill all details properly!');
        }
    }

    async function submitData(e) {
        e.preventDefault();

        if (!validateSection(4)) {
            setError(true);
            setMessage('Please fill all details properly!');
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/update-user/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (result.hasError) {
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
            <h1>Update User</h1>
            <div className="form-card">

                <div className="image-container">
                    <img loading="lazy" src={signupImage} alt="Signup" />
                </div>

                <div className="form-container">
                    <form id="create-user-form" onSubmit={submitData}>
                        {currentSection === 1 && <Section1 formData={formData} handleChange={handleChange} />}
                        {currentSection === 2 && <Section2 formData={formData} handleChange={handleChange} />}
                        {currentSection === 3 && <Section3 formData={formData} handleChange={handleChange} isCreating={false} />}
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

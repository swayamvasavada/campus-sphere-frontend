import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";

import batchImage from "../../assets/images/batch_img.jpg";
import "../../assets/styles/base.css"
import "../../assets/styles/forms.css"

function Section1({ formData, handleChange }) {
    return (
        <div>
            <div className="section-title">
                Batch Info
            </div>

            <div className="form-control">
                <label htmlFor="year">Batch year</label>
                <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} />
            </div>

            <div className="form-control">
                <label htmlFor="noOfSemester">No of Semester</label>
                <input type="number" name="noOfSemester" id="noOfSemester" value={formData.noOfSemester} onChange={handleChange} />
            </div>
        </div>
    )
}

function Section2({ formData, handleChange }) {    
    return (
        <div>
            <div className="section-title">
                Fees Info
            </div>

            {Array.from({ length: formData.noOfSemester }, (_, index) => (
                <div className="form-control multi-input">
                    <div>
                        <label htmlFor={`semester${index + 1}Fees`}>Fees of sem {index + 1}</label>
                        <input type="number" name={`semester${index + 1}Fees`} id={`semester${index + 1}Fees`} value={+formData[`semester${index + 1}Fees`]} onChange={handleChange} />
                    </div>

                    <div>
                        <label htmlFor={`fees${index + 1}Due`}>Due Date of sem {index + 1}</label>
                        <input type="date" name={`fees${index + 1}Due`} id={`fees${index + 1}Due`} value={formData[`fees${index + 1}Due`]} onChange={handleChange} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function UpdateBatch() {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [currentSection, setCurrentSection] = useState(1);
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchBatchDetails() {
            setError(false);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/batch/${batchId}`, {
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
                    return;
                }
                result = result.data;

                const initialState = {
                    year: result.year,
                    noOfSemester: result.noOfSemester,
                };

                for (let i = 0; i < result.noOfSemester; i++) {
                    initialState[`semester${i+1}Fees`] = result.fees[i][`fees`];
                    initialState[`fees${i+1}Due`] = result.fees[i][`dueDate`];
                }

                setFormData(initialState);
            } catch (error) {
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchBatchDetails();
    }, [batchId]);

    function handlePrevious() {
        setCurrentSection(currentSection - 1);
    }

    function handleNext() {
        if (validateSection(currentSection)) {
            setCurrentSection(currentSection + 1);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function validateSection(section) {
        if (section === 1) {
            const year = parseInt(formData.year);
            const noOfSemester = parseInt(formData.noOfSemester);
            const currentYear = new Date().getFullYear();

            if (!year || year < 2000 || year > currentYear + 1) {
                setError(true);
                setMessage(`Batch year must be between 2000 and ${currentYear + 1}.`);
                return false;
            }

            if (!noOfSemester || noOfSemester < 1 || noOfSemester > 12) {
                setError(true);
                setMessage("Please enter a valid number of semesters (1 - 12).");
                return false;
            }

            setError(false);
            return true;
        } else {
            for (let i = 1; i <= formData.noOfSemester; i++) {
                const fee = formData[`semester${i}Fees`];
                const due = formData[`fees${i}Due`];

                if (!fee || fee < 0) {
                    setError(true);
                    setMessage(`Please enter a valid fee for semester ${i}.`);
                    return false;
                }

                if (!due) {
                    setError(true);
                    setMessage(`Please enter a due date for semester ${i}.`);
                    return false;
                }
            }
            return true;
        }
    }

    async function submitData(e) {
        e.preventDefault();
        setError(false);

        if (!validateSection(2)) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/batch/update-batch/${batchId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const result = await res.json();

            if (result.hasError) {
                setError(true);
                setMessage(result.message);
                return;
            }

            navigate('/batch');
        } catch (error) {
            console.log("Error: ", error);
            setError(true);
            setMessage("Something went wrong!");
        }
    }

    return (
        <main>
            <h1>Update Batch</h1>
            <div className="form-card">
                <div className="image-container">
                    <img src={batchImage} alt="" />
                </div>

                <div className="form-container">
                    {hasError ? <Alert severity="error">{message}</Alert> : ""}
                    <form id="create-user-form" onSubmit={submitData}>
                        {currentSection === 1 && <Section1 formData={formData} handleChange={handleChange} />}
                        {currentSection === 2 && <Section2 formData={formData} handleChange={handleChange} />}

                        {/* Navigation buttons */}
                    </form>
                    <div className="form-actions">
                        {currentSection > 1 && <button className="btn" onClick={handlePrevious}>Previous</button>}
                        {currentSection < 2 && <button className="btn" onClick={handleNext}>Next</button>}
                        {currentSection === 2 && <button type="submit" form="create-user-form" className="btn">Submit</button>}
                    </div>
                </div>
            </div>
        </main>
    );
}
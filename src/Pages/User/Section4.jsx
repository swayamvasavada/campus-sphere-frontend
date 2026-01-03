import { useEffect, useState } from "react";

export default function Section4({ formData, handleChange }) {
    const [deptInfo, setDeptInfo] = useState([]);
    const [batch, setBatch] = useState([]);

    useEffect(() => {
        async function fetchInfo() {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
                },
                credentials: 'include'
            });

            if (res.ok) {
                const result = await res.json();
                setDeptInfo(result.data);
            }
        }

        fetchInfo();
    }, []);

    useEffect(() => {
        async function fetchBatch() {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/batch/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
                },
                credentials: 'include'
            });

            if (res.ok) {
                const result = await res.json();
                setBatch(result.data);
            }
        }

        fetchBatch();
    }, []);

    return (
        <div>
            <div className="section-title">
                Academic Info
            </div>

            <div className="form-control multi-input">

                <div>
                    <label htmlFor="dept">Select department <span className="mandatory-field">*</span> </label>
                    <select name="dept" id="dept" value={formData.dept} onChange={handleChange} >
                        <option hidden>Select your department</option>
                        {
                            deptInfo.length ? deptInfo.map((dept) => (
                                <option value={dept._id}>{dept.deptName}</option>
                            ))
                                : <option disabled>No department created</option>
                        }
                    </select>
                </div>

                <div>
                    <label htmlFor="batch">Select batch {formData.desg === "Student" ? <span className="mandatory-field">*</span> : ''} </label>
                    <select name="batch" id="batch" value={formData.batch} onChange={handleChange} >
                        {/* It should be rendered dynamically */}
                        <option hidden>Select batch</option>
                        {
                            batch.length ? batch.map((singleBatch) => (
                                <option value={singleBatch._id}>{singleBatch.year}</option>
                            ))
                                : <option disabled>No batch created</option>
                        }
                    </select>
                </div>
            </div>

            <div className="form-control">
                <label htmlFor="desg">Select Designation <span className="mandatory-field">*</span> </label>
                <select name="desg" id="desg" value={formData.desg} onChange={handleChange} >
                    <option hidden>Select Designation</option>
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>
        </div>
    )
}
import { useState } from "react";

export default function Section3({ formData, handleChange, isCreating }) {

    const [passwordValidity, setPasswordValidity] = useState(false);
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

    return (
        <div>
            <div className="section-title">
                Login Info
            </div>

            <div className="form-control">
                <label htmlFor="email">Enter email <span className="mandatory-field">*</span> </label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
            </div>

            {isCreating ?
                <>
                    <div className="form-control">
                        <label htmlFor="password">Enter password <span className="mandatory-field">*</span> </label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={validatePassword} />
                    </div>

                    <div className="form-control">
                        {passwordValidity ? <span><i className="fa-solid fa-check" style={{ color: "green" }}></i> Password is secure</span> :
                            <span><i className="fa-solid fa-xmark" style={{ color: "red" }}></i> Password is too weak</span>}
                    </div>
                </> : ''
            }
            {/* <span>The provided info will be used for Login your ERP</span> */}
        </div>
    )
}
export default function Section1({ formData, handleChange }) {    
    return (
        <div>
            <div className="section-title">
                Personal Info
            </div>

            <div className="form-control multi-input">
                <div>
                    <label htmlFor="firstName">First Name <span className="mandatory-field">*</span> </label>
                    <input type="text" name="firstName" id="firstName" value={formData.firstName} minLength={2} maxLength={8} onChange={handleChange} required />
                </div>

                <div>
                    <label htmlFor="middleName">Middle Name</label>
                    <input type="text" name="middleName" id="middleName" value={formData.middleName} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="lastName">Last Name <span className="mandatory-field">*</span> </label>
                    <input type="text" name="lastName" id="lastName" value={formData.lastName} minLength={2} maxLength={8} onChange={handleChange} />
                </div>

            </div>

            <div className="form-control">
                <label htmlFor="gender">Select Gender <span className="mandatory-field">*</span> </label>
                <select name="gender" id="gender" value={formData.gender} onChange={handleChange}>
                    <option hidden>Select your Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>
            </div>

            <div className="form-control multi-input">

                <div>
                    <label htmlFor="primaryNo">Primary number <span className="mandatory-field">*</span> </label>
                    <input type="tel" name="primaryNo" id="primaryNo" length={10} value={formData.primaryNo} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="alternativeNo">Alternative number</label>
                    <input type="tel" name="alternativeNo" id="alternativeNo" value={formData.alternativeNo} onChange={handleChange} />
                </div>
            </div>

            <div className="form-control">
                <label htmlFor="dob">Date of Birth <span className="mandatory-field">*</span> </label>
                <input type="date" name="dob" id="dob" value={formData.dob} max={new Date().toISOString().split("T")[0]} onChange={handleChange} />
            </div>
        </div>
    )
}
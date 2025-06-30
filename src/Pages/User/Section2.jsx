export default function Section2({ formData, handleChange }) {
    return (
        <div>
            <div className="section-title">
                Residential info
            </div>

            <div className="form-control">
                <label htmlFor="colonyName">Enter Colony name <span className="mandatory-field">*</span> </label>
                <input type="text" name="colonyName" id="colonyName" placeholder="House no, Flat name/Society Name" value={formData.colonyName} onChange={handleChange} />
            </div>

            <div className="form-control">
                <label htmlFor="landmark">Enter landmark <span className="mandatory-field">*</span> </label>
                <input type="text" name="landmark" id="landmark" placeholder="Opp XYZ, Near ABC" value={formData.landmark} onChange={handleChange} />
            </div>

            <div className="form-control">
                <label htmlFor="area">Enter Area <span className="mandatory-field">*</span> </label>
                <input type="text" name="area" id="area" placeholder="Ex Wagodia Road" value={formData.area} onChange={handleChange} />
            </div>

            <div className="form-control multi-input">
                <div>
                    <label htmlFor="city">Enter City <span className="mandatory-field">*</span> </label>
                    <input type="text" name="city" id="city" placeholder="Ex Vadodara" value={formData.city} onChange={handleChange} />
                </div>

                <div>

                    <label htmlFor="pincode">Enter Pincode <span className="mandatory-field">*</span> </label>
                    <input type="number" name="pincode" id="pincode" placeholder="Ex 390019" length={6} value={formData.pincode} onChange={handleChange} />
                </div>
            </div>
        </div>
    )
}
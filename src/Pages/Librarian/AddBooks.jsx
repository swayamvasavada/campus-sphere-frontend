import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";

import LibraryImage from "../../assets/images/Library_image.jpeg"
import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";

export default function AddBooks() {
    const [bookData, setBookData] = useState({});
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function validate() {
        const { bookName, author, totalBooks } = bookData;

        if (!bookName || !bookName.trim()) {
            setError(true);
            setMessage("Book name is required.");
            return false;
        }

        if (!author || !author.trim()) {
            setError(true);
            setMessage("Author name is required.");
            return false;
        }

        if (!totalBooks || isNaN(totalBooks) || Number(totalBooks) <= 0) {
            setError(true);
            setMessage("Please enter a valid number of books.");
            return false;
        }

        setError(false);
        setMessage("");
        return true;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    }

    async function insertBook(e) {
        e.preventDefault();
        setError(false);

        if (!validate()) {
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/add-book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify(bookData),
                credentials: 'include'
            });

            const result = await res.json();

            if (result.hasError) {
                setMessage(result.message);
                setError(true);
                return;
            }

            navigate('/library');
            return;
        } catch (error) {
            setMessage("Something went wrong!");
            setError(true);
            console.log("Error: ", error);
        }
    }
    return (
        <main>
            <div className="form-card">
                <div className="form-container">
                    <h1>Add new book</h1>
                    {hasError && <Alert severity="error"> {message} </Alert>}
                    <form onSubmit={insertBook}>
                        <div className="form-control">
                            <label htmlFor="bookName">Book name</label>
                            <input type="text" name="bookName" id="bookName" onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="author">Author</label>
                            <input type="text" name="author" id="author" onChange={handleChange} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="totalBooks">No of Books</label>
                            <input type="number" name="totalBooks" id="totalBooks" onChange={handleChange} />
                        </div>
                        <button className="btn" type="submit">Add books</button>
                    </form>

                </div>
                <div className="image-container">
                    <img src={LibraryImage} alt="" />
                </div>
            </div>
        </main>
    )
}
import { useEffect, useState } from 'react';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';

export default function IssuerDetail() {
    const navigate = useNavigate();
    const { issueId } = useParams();
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [popup, setPopup] = useState(false);

    const [userData, setUserData] = useState({});
    const [issuerData, setIssuerData] = useState({});
    const [bookData, setBookData] = useState({});

    useEffect(function () {
        async function getIssuerData() {
            if (!issueId) return;

            setError(false);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/library/issuer-detail/${issueId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${localStorage.getItem("authToken")}`
                    }
                });

                const result = await res.json();

                if (result.hasError) {
                    setMessage(result.message);
                    setError(true);
                    return;
                }

                setUserData(result.userDetails);
                setIssuerData(result.issuerDetails);
                setBookData(result.bookDetails);
            } catch (error) {
                console.log("Error: ", error);
                setMessage("Something went wrong!");
                setError(true);
            }
        }

        getIssuerData();
    }, [issueId]);

    async function sendReminder(event) {
        const issuerId = event.target.dataset.id;
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/reminder/${issuerId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
                }
            });

            const result = await res.json();
            setMessage(result.message);
            setError(result.hasError);
            setPopup(true);
        } catch (error) {
            console.log("Error: ", error);
            setMessage("Something went wrong!");
            setError(true);
            setPopup(true);
        }
    }

    async function returnBook(event) {
        setPopup(false);
        setError(false);

        const issuerId = event.target.dataset.id;
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/return-book/${issuerId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
                }
            });

            const result = await res.json();
            setMessage(result.message);
            setError(result.hasError);
            setPopup(true);

            if (!result.hasError) navigate('/library/issued');
        } catch (error) {
            console.log("Error: ", error);
            setMessage("Something went wrong!");
            setError(true);
        }
    }

    function handleClosePopup(event, reason) {
        if (reason === 'clickaway') return;
        setPopup(false);
        setError(false);
    }

    return (
        <main className='card-container'>
            {hasError && <Alert severity='error'>{message}</Alert>}
            <h1>Issuer Details</h1>
            <div className="card">
                <div className="info-container">
                    <h3 className='info-title'>Name: </h3>
                    <span className='info'>{`${userData?.name?.firstName} ${userData?.middleName || ""} ${userData?.name?.lastName}`}</span>
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Email: </h3>
                    <span className='info'><a href={`mailto:${userData?.email}`}> {userData?.email} </a></span>
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Phone: </h3>
                    <span className='info'><a href={`tel:${userData?.contact?.primaryNo}`}> {userData?.contact?.primaryNo} </a></span>
                    {userData?.contact?.alternativeNo &&
                        <span className='info'> | <a href={`tel:${userData?.contact?.alternativeNo}`}>{userData?.contact?.alternativeNo} </a></span>
                    }
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Dept: </h3>
                    <span className='info'>{userData.dept?.deptName} </span>
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Batch: </h3>
                    <span className='info'>{userData.batch?.year} </span>
                </div>
            </div>

            <h1>Book Details</h1>
            <div className="card">
                <div className="info-container">
                    <h3 className="info-title">Book name: </h3>
                    <span className="info">{bookData?.bookName}</span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Author name: </h3>
                    <span className="info"> {bookData?.author} </span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Issue date: </h3>
                    <span className="info"> {new Date(issuerData.issuedOn).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                    })} </span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Due date: </h3>
                    <span className="info"> {new Date(issuerData.returnDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                    })} </span>
                </div>
            </div>

            <button className="btn update-btn" onClick={sendReminder} data-id={issuerData._id}> <i className="fa-solid fa-paper-plane" style={{ color: "white" }}></i> Send reminder</button>
            <button className="btn update-btn" onClick={returnBook} data-id={issuerData._id}> <i className="fa-solid fa-box-open" style={{ color: "white" }}></i> Return book</button>

            <Snackbar open={popup} autoHideDuration={2000} onClose={handleClosePopup} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
                <Alert
                    severity={hasError ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </main >
    );
}
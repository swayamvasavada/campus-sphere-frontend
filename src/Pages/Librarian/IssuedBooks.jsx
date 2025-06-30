import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Snackbar } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function IssuedBook() {
    const [issuerList, setList] = useState([]);
    const [hasError, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [popup, setPopup] = useState(false);

    useEffect(function () {
        async function fetchIssuersList() {
            try {
                setError(false);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/library/issued-books`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await res.json();

                if (result.hasError) {
                    setError(true);
                    setMessage(result.message);
                    return;
                }

                console.log("Issuers list: ", result);
                setList(result.data);
            } catch (error) {
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchIssuersList();
    }, []);

    async function sendReminder(event) {
        const issuerId = event.target.dataset.id;
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/reminder/${issuerId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
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
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setMessage(result.message);
            setError(result.hasError);
            setPopup(true);

            if (!result.hasError) setList(issuerList.filter((issuer) => issuer._id !== issuerId));
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
        <main className="card">
            <h1>Book view</h1>
            {hasError && !popup ? <Alert severity='error'> {message} </Alert> : ""}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Typography variant="h6" fontWeight="bold"> Name  </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold"> Book  </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Due Date </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Detail </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Reminder </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Return </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issuerList.map((issuer) => (
                            <TableRow
                                key={issuer._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"> {issuer.username} </TableCell>
                                <TableCell component="th" scope="row"> {issuer.bookName} </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-calendar update-btn" style={{ backgroundColor: "#000000" }}></i> {new Date(issuer.returnDate).toLocaleDateString("en-US", { dateStyle: 'medium' })} </TableCell>
                                <TableCell align="right"> <a href={`/library/view-detail/issuer/${issuer._id}`}> <i className="fa-solid fa-info info-btn" title='View Detail'></i> </a> </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-paper-plane update-btn" title='Send Reminder' onClick={sendReminder} data-id={issuer._id}></i> </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-box-open update-btn" title='Return Book' onClick={returnBook} data-id={issuer._id}></i> </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={popup} autoHideDuration={2000} onClose={handleClosePopup} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
                <Alert
                    severity={hasError ? "error" : "success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </main>
    )
}
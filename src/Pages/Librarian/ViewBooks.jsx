import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function ViewBooks() {
    const [bookList, setList] = useState([]);
    const [hasError, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchBookList() {
            try {
                setError(false);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/library/`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${localStorage.getItem("authToken")}`
                    }
                });

                const result = await res.json();

                if (result.hasError) {
                    setError(true);
                    setMessage(result.message);
                    return;
                }

                setList(result.data);
            } catch (error) {
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchBookList();
    }, []);

    async function handleDelete(e) {
        const bookId = e.target.dataset.id;
        setError(false);

        try {
            setError(false);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/delete-book/${bookId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
                }
            });

            const result = await res.json();

            if (result.hasError) {
                setError(true);
                setMessage(result.message);
                return;
            }

            setList(bookList.filter(book => book._id !== bookId));
        } catch (error) {
            setError(true);
            setMessage("Something went wrong!");
        }
    }

    function verifyAvailablity(e, book) {
        if (book.issuedBooks === book.totalBooks) {
            setError(true);
            setMessage("This book is not available to issue")
            return e.preventDefault();
        }
    }


    return (
        <main className="card">
            <h1>Book view</h1>
            {hasError ? <Alert severity='error'> {message} </Alert> : ""}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  Book  </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  Author  </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  Issued books  </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  Total books  </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Issue </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Update </Typography></TableCell>
                            <TableCell align="right"> <Typography variant="h6" fontWeight="bold"> Delete </Typography></TableCell>
                        </TableRow>
                    </TableHead>

                    {
                        bookList.length === 0 &&
                        <>
                            <i className="fa-solid fa-ban fa-2xl"></i>
                            <p>Seems like there is no content to display</p>
                        </>
                    }

                    <TableBody>
                        {bookList.map((book) => (
                            <TableRow
                                key={book._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"> {book.bookName} </TableCell>
                                <TableCell component="th" scope="row"> {book.author} </TableCell>
                                <TableCell component="th" scope="row"> {book.issuedBooks} </TableCell>
                                <TableCell component="th" scope="row"> {book.totalBooks} </TableCell>
                                <TableCell align="right"> <a href={`/library/issue-book/${book._id}`} onClick={(e) => verifyAvailablity(e, book)}> <i className="fa-solid fa-book-open-reader info-btn" title='Issue Book'></i> </a> </TableCell>
                                <TableCell align="right"> <a href={`/library/update-book/${book._id}`}> <i className="fa-solid fa-pen update-btn" title='Update Book'></i> </a> </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-trash delete-btn" title='Delete Book' data-id={book._id} onClick={handleDelete}></i> </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}
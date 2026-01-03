import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function ViewNotice() {
    const [noticeList, setList] = useState([]);
    const [hasError, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchNoticeList() {
            try {
                setError(false);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/notice/`, {
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

        fetchNoticeList();
    }, []);

    return (
        <main className="card">
            <h1>Book view</h1>
            {hasError ? <Alert severity='error'> {message} </Alert> : ""}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  Notice Title  </Typography></TableCell>
                            {/* <TableCell> <Typography variant="h6" fontWeight="bold">  Issued by  </Typography></TableCell> */}
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Issued on </Typography></TableCell>
                            <TableCell align="right"> <Typography variant="h6" fontWeight="bold"> View </Typography></TableCell>
                        </TableRow>
                    </TableHead>

                    {
                        noticeList.length === 0 &&
                        <>
                            <i className="fa-solid fa-ban fa-2xl"></i>
                            <p>Seems like there is no content to display</p>
                        </>
                    }

                    <TableBody>
                        {noticeList.map((notice) => (
                            <TableRow
                                key={notice._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"> {notice.noticeTitle} </TableCell>
                                {/* <TableCell component="th" scope="row"> {notice.author} </TableCell> */}
                                <TableCell align="right">
                                    <i className="fa-solid fa-calendar" style={{backgroundColor: "#000000"}}></i>
                                    {new Date(notice.issuedOn).toLocaleDateString("en-US", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: '2-digit',
                                        weekday: 'short',
                                    })}
                                </TableCell>
                                <TableCell align="right"> <a href={`/notice/view/${notice._id}`}> <i className="fa-solid fa-eye info-btn" title='View Book'></i> </a> </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}
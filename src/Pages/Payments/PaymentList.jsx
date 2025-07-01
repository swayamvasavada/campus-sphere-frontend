import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert } from '@mui/material';
import Cookies from 'js-cookie';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function ViewPayments() {
    const [paymentList, setList] = useState([]);
    const [hasError, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchPaymentList() {
            try {
                setError(false);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/fees/pending-fees`, {
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

                setList(result.data.fees);
            } catch (error) {
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchPaymentList();
    }, []);

    return (
        <main className="card">
            <h1>Payment view</h1>
            {hasError ? <Alert severity='error'> {message} </Alert> : ""}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Payments List">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Typography variant="h5" fontWeight="bold">  Payment Title  </Typography></TableCell>
                            <TableCell> <Typography variant="h5" fontWeight="bold">  Payment Amount  </Typography></TableCell>
                            <TableCell align="right"> <Typography variant="h5" fontWeight="bold"> Due Date </Typography></TableCell>
                            <TableCell align="right"> <Typography variant="h5" fontWeight="bold"> Pay </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(paymentList || []).map((feeData, index) => {
                            return (
                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row"> <Typography variant='h6' fontWeight="bold"> {`Tuition Fees - Sem ${feeData?.semesterNo}`} </Typography> </TableCell>
                                    <TableCell> <Typography variant='h6' fontWeight="bold"> ₹{feeData?.fees} </Typography> </TableCell>
                                    <TableCell align="right"> {new Date(feeData?.dueDate).toLocaleDateString("en-US", {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: '2-digit'
                                    })} </TableCell>
                                    <TableCell align="right">
                                        <form style={{margin: 0}} action={`${process.env.REACT_APP_API_URL}/fees/pay-now/${feeData?.semesterNo}`} method="post">
                                            <input type="hidden" name="authToken" value={Cookies.get("authToken")} />
                                            <button className="info-btn" title={`Pay Semester ${feeData?.semesterNo} Fees`}>
                                                <i className="fa-solid fa-money-check"></i> Pay now
                                            </button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}
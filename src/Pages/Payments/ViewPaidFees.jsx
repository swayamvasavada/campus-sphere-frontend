import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FeeReceipt from './GenerateReceipt';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function PaidFees() {
    const [paymentList, setList] = useState([]);
    const [hasError, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchPaymentsList() {
            try {
                setError(false);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/fees/paid-fees`, {
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

                console.log("Payment list: ", result);
                setList(result.data);
            } catch (error) {
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchPaymentsList();
    }, []);

    return (
        <main className="card">
            <h1>Paid Fees</h1>
            {hasError && <Alert severity='error'> {message} </Alert>}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Typography variant="h6" fontWeight="bold"> Title  </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold"> Amount  </Typography></TableCell>
                            <TableCell><Typography variant="h6" fontWeight="bold"> Penalty Charged </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Payment Date </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Receipt </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentList.map((paymentData) => (
                            <TableRow
                                key={paymentData._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"><Typography variant='h6' fontWeight="bold"> {paymentData.title} </Typography></TableCell>
                                <TableCell component="th" scope="row"> ₹ {paymentData.amount} </TableCell>
                                <TableCell> {paymentData?.penalty ? `₹ ${paymentData.penalty}` : "NA"} </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-calendar" style={{ backgroundColor: "#000000" }}></i> {new Date(paymentData.paidOn).toLocaleDateString("en-US", { dateStyle: 'medium' })} </TableCell>
                                <TableCell align="right">
                                    <PDFDownloadLink document={<FeeReceipt paymentData={paymentData} />}
                                        fileName={`${paymentData?.title} receipt`}
                                    >
                                        <i className="fa-solid fa-receipt info-btn" title='Download Receipt'></i>
                                    </PDFDownloadLink>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert, Divider } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function ViewAllPayments() {
    const [paymentList, setList] = useState([]);
    const [paymentSummary, setSummary] = useState({});
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

                const now = new Date();
                const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
                let totalAmount = 0;
                let totalPenalty = 0;

                result.data.forEach(item => {
                    const paidDate = new Date(item.paidOn);
                    if (now - paidDate <= THIRTY_DAYS_MS) {
                        totalAmount += item.amount || 0;
                        totalPenalty += item.penalty || 0;
                    }
                });

                setSummary({
                    totalAmount: totalAmount,
                    totalPenalty: totalPenalty
                });

            } catch (error) {
                setError(true);
                setMessage("Something went wrong!");
            }
        }

        fetchPaymentsList();
    }, []);

    return (
        <main className="card">
            {hasError && <Alert severity='error'> {message} </Alert>}
            {paymentSummary &&
                <>
                    <h1>Transaction summary</h1>
                    <div className="card-alt-container">
                        <div className="card-alt">
                            <h4 className="card-title">Amount collected in last 30 days</h4>
                            <p>
                                {`₹ ${paymentSummary?.totalAmount}`}
                            </p>

                        </div>

                        <div className="card-alt">
                            <h4 className="card-title">Penalty charged in last 30 days</h4>
                            <p>
                                {`₹ ${paymentSummary.totalPenalty}`}
                            </p>
                        </div>
                    </div>
                </>
            }
            <Divider />

            <h1>Transaction details</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="h6" fontWeight="bold"> Paid By </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold"> Title  </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold"> Amount  </Typography></TableCell>
                            <TableCell><Typography variant="h6" fontWeight="bold"> Penalty Charged </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Payment Date </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentList.map((paymentData) => (
                            <TableRow
                                key={paymentData._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell> <Typography variant='h6' fontWeight="bold"> <a href={`/users/view/${paymentData?.userData?._id}`}> {`${paymentData?.userData?.name?.firstName} ${paymentData?.userData?.name?.lastName}`} </a> </Typography> </TableCell>
                                <TableCell component="th" scope="row"><Typography variant='h6' fontWeight="bold"> {paymentData.title} </Typography></TableCell>
                                <TableCell component="th" scope="row"> ₹ {paymentData.amount} </TableCell>
                                <TableCell> {paymentData?.penalty ? `₹ ${paymentData.penalty}` : "NA"} </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-calendar" style={{ backgroundColor: "#000000" }}></i> {new Date(paymentData.paidOn).toLocaleDateString("en-US", { dateStyle: 'medium' })} </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}
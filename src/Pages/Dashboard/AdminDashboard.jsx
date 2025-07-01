import { useEffect, useState } from "react";
import { Alert, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import PaymentStats from "../Payments/PaymentStats";

export default function AdminDashboard() {
    const [deptSummary, setDeptSummary] = useState({});
    const [batchSummary, setBatchSummary] = useState({});
    const [userSummary, setUserSummary] = useState({});
    const [librarySummary, setLibrarySummary] = useState({});
    const [paymentSummary, setPaymentSummary] = useState({});
    const [noticeSummary, setNoticeSummary] = useState([]);

    async function getDeptSummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/summary`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setDeptSummary(result);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setDeptSummary({ hasError: true, message: "Something went wrong!" });
        }
    }

    async function getBatchSummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/batch/summary`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setBatchSummary(result);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setBatchSummary({ hasError: true, message: "Something went wrong!" });
        }
    }

    async function getUserSummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/user-summary`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setUserSummary(result);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setUserSummary({ hasError: true, message: "Something went wrong!" });
        }
    }

    async function getLibrarySummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/summary`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setLibrarySummary(result.data);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setLibrarySummary({ hasError: true, message: "Something went wrong!" });
        }
    }

    async function getPaymentSummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/fees/payment-summary`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setPaymentSummary(result.data);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setPaymentSummary({ hasError: true, message: "Something went wrong!" });
        }
    }

    async function getNoticeSummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/notice/summary`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            setNoticeSummary(result.data);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setNoticeSummary({ hasError: true, message: "Something went wrong!" });
        }
    }

    useEffect(function () {
        getDeptSummary();
        getBatchSummary();
        getUserSummary();
        getLibrarySummary();
        getPaymentSummary();
        getNoticeSummary();
    }, []);

    return (
        <main className="">
            <div className="card-alt-container">
                <div className="card-alt">
                    <a href="/departments" className="card-btn">
                        <h4 className="card-title">Departments</h4>
                        <p>
                            {deptSummary?.hasError ? <Alert severity="error">{deptSummary.message}</Alert> : deptSummary.result}
                        </p>
                    </a>
                </div>

                <div className="card-alt">
                    <a href="/batch" className="card-btn">
                        <h4 className="card-title">Batches</h4>
                        <p>
                            {batchSummary?.hasError ? <Alert severity="error">{batchSummary.message}</Alert> : batchSummary.result}
                        </p>
                    </a>
                </div>

                <div className="card-alt">
                    <a href="/users" className="card-btn">
                        <h4 className="card-title">Students</h4>
                        <p>
                            {userSummary?.hasError ? <Alert severity="error">{userSummary.message}</Alert> : userSummary?.result?.studentCount}
                        </p>
                    </a>
                </div>

                <div className="card-alt">
                    <a href="/users" className="card-btn">
                        <h4 className="card-title">Faculties</h4>
                        <p>
                            {userSummary?.hasError ? <Alert severity="error">{userSummary.message}</Alert> : userSummary?.result?.facultyCount}
                        </p>
                    </a>
                </div>

                <div className="card-alt">
                    <a href="/users" className="card-btn">
                        <h4 className="card-title">Non Teaching Staff</h4>
                        <p>
                            {userSummary?.hasError ? <Alert severity="error">{userSummary.message}</Alert> : userSummary?.result?.nonTeachingCount}
                        </p>
                    </a>
                </div>

                <div className="card-alt">
                    <a href="/library" className="card-btn">
                        <h4 className="card-title">Books in Library</h4>
                        <p>
                            {librarySummary?.hasError ? <Alert severity="error">{librarySummary.message}</Alert> : librarySummary?.totalBooks}
                        </p>
                    </a>
                </div>
            </div>

            <div className="card-alt">
                <h4 className="card-title">Payment Summary</h4>
                {!paymentSummary || paymentSummary.hasError ?
                    <p>
                        {<Alert severity="error">{paymentSummary?.message || "Something went wrong!"}</Alert>}
                    </p> : <PaymentStats data={paymentSummary || []} />
                }
            </div>

            <div className="card-alt">
                <h4 className="card-title">Recent Notices</h4>
                {!noticeSummary || noticeSummary.hasError ?
                    <Alert severity="error"> {noticeSummary?.message || "Something went wrong!"} </Alert>
                    :
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell> <Typography variant="h6" fontWeight="bold"> Notice Title </Typography> </TableCell>
                                <TableCell> <Typography variant="h6" fontWeight="bold"> Description </Typography> </TableCell>
                                <TableCell align="right"> <Typography variant="h6" fontWeight="bold"> Issued For </Typography> </TableCell>
                                <TableCell align="right"> <Typography variant="h6" fontWeight="bold"> View </Typography> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {noticeSummary.map((notice) => (
                                <TableRow key={notice._id}>
                                    <TableCell>{notice.noticeTitle}</TableCell>
                                    <TableCell style={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {notice.noticeMessage}
                                    </TableCell>
                                    <TableCell align="right">
                                        {notice.noticeLevel === 1 && "For all"}
                                        {notice.noticeLevel === 2 && "For Staff"}
                                        {notice.noticeLevel === 3 && "For Students"}
                                    </TableCell>
                                    <TableCell align="right">
                                        <a href={`/notice/view/${notice._id}`}> <i className="fa-solid fa-info info-btn" data-id={notice._id} title='View Notice'></i> </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </div>
        </main>
    );
}
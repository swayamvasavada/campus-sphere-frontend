import { Alert, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
    const [userSummary, setUserSummary] = useState({});
    const [noticeSummary, setNoticeSummary] = useState([]);

    async function getUserSummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/user-info`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();

            if (result.hasError) {
                setUserSummary({ hasError: true, message: result.message });
                return;
            }

            setUserSummary(result.data);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setUserSummary({ hasError: true, message: "Something went wrong!" });
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
            
            if (result.hasError) {
                setNoticeSummary({hasError: true, message: result.message})
                return;
            }

            setNoticeSummary(result.data);
            return;
        } catch (error) {
            console.log("Error: ", error);
            setNoticeSummary({ hasError: true, message: "Something went wrong!" });
        }
    }

    useEffect(function () {
        getUserSummary();
        getNoticeSummary();
    }, []);
    return (
        <main className="">
            <div className="card-alt-container">
                <div className="card-alt">
                    <h4 className="card-title">Department</h4>
                    <p>
                        {userSummary?.hasError ? <Alert severity="error">{userSummary.message}</Alert> : userSummary?.dept?.deptName}
                    </p>
                </div>

                <div className="card-alt">
                    <h4 className="card-title">Batch</h4>
                    <p>
                        {userSummary?.hasError ? <Alert severity="error">{userSummary.message}</Alert> : userSummary?.batch?.year}
                    </p>
                </div>
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
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function ViewDepartment() {
    const [deptList, setList] = useState([]);
    const [hasError, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchDeptList() {
            try {
                setError(false);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/`, {
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

        fetchDeptList();
    }, []);

    async function handleDelete(e) {
        const deptId = e.target.dataset.id;
        setError(false);

        try {
            setError(false);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/delete-dept/${deptId}`, {
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

            setList(deptList.filter(dept => dept._id !== deptId));
        } catch (error) {
            setError(true);
            setMessage("Something went wrong!");
        }
    }


    return (
        <main className="card">
            <h1>Department view</h1>
            {hasError ? <Alert severity='error'> {message} </Alert> : ""}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  Department  </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Update </Typography></TableCell>
                            <TableCell align="right"> <Typography variant="h6" fontWeight="bold"> Delete </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deptList.map((dept) => (
                            <TableRow
                                key={dept.deptName}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {dept.deptName}
                                </TableCell>
                                <TableCell align="right"> <a href={`/departments/update-dept/${dept._id}`}> <i className="fa-solid fa-pen update-btn" title='Update User'></i> </a> </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-trash delete-btn" title='Delete User' data-id={dept._id} onClick={handleDelete}></i> </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}
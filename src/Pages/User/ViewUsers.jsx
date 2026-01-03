import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Alert } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function ViewUsers() {
    const [userList, setList] = useState([]);
    const [hasError, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(function () {
        async function fetchUserList() {
            try {
                setError(false);

                const res = await fetch(`${process.env.REACT_APP_API_URL}/users/`, {
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

        fetchUserList();
    }, []);

    async function handleDelete(e) {
        const userId = e.target.dataset.id;
        setError(false);

        try {
            setError(false);

            const res = await fetch(`${process.env.REACT_APP_API_URL}/delete-user/${userId}`, {
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
            
            setList(userList.filter(user => user._id !== userId));
        } catch (error) {
            setError(true);
            setMessage("Something went wrong!");
        }
    }


    return (
        <main className="card">
            <h1>User view</h1>
            {hasError ? <Alert severity='error'> {message} </Alert> : ""}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  User  </Typography></TableCell>
                            <TableCell> <Typography variant="h6" fontWeight="bold">  Desg  </Typography></TableCell>
                            <TableCell align="right"> <Typography variant="h6" fontWeight="bold"> Detailed View </Typography></TableCell>
                            <TableCell align="right"><Typography variant="h6" fontWeight="bold"> Update </Typography></TableCell>
                            <TableCell align="right"> <Typography variant="h6" fontWeight="bold"> Delete </Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user) => (
                            <TableRow
                                key={user._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row"> {`${user.name.firstName} ${user.name.lastName}`} </TableCell>
                                <TableCell component="th" scope="row"> {user.desg} </TableCell>
                                <TableCell align="right"> <a href={`/users/view/${user._id}`}> <i className="fa-solid fa-info info-btn" data-id={user._id} title='View Details'></i> </a> </TableCell>
                                <TableCell align="right"> <a href={`/update-user/${user._id}`}> <i className="fa-solid fa-pen update-btn" title='Update User'></i> </a> </TableCell>
                                <TableCell align="right"> <i className="fa-solid fa-trash delete-btn" title='Delete User' data-id={user._id} onClick={handleDelete}></i> </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )
}
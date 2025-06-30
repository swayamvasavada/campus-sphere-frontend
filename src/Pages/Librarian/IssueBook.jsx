import { useEffect, useState } from 'react';
import { Alert, Autocomplete, TextField } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";
import { useNavigate, useParams } from 'react-router-dom';

export default function IssueBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [deptList, setDeptList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [issuerData, setIssuerData] = useState({});
    const [bookData, setBookData] = useState({});

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    useEffect(function () {
        async function fetchBookData() {
            setError(false);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/library/${bookId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await res.json();
                if (result.hasError) {
                    setMessage(result.message);
                    setError(true);
                    return;
                }

                console.log(result.data);
                setBookData(result.data);
            } catch (error) {
                console.log("Error: ", error);
                setMessage("Something went wrong!");
                setError(true);
            }
        }

        fetchBookData();
    }, [bookId]);

    useEffect(function () {
        async function getDeptList() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/dept/`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await res.json();

                if (result.hasError) {
                    setMessage(result.message);
                    setError(true);
                    return;
                }

                console.log(result.data);
                setDeptList(result.data);
                return;
            } catch (error) {
                console.log("Error: ", error);
                setMessage("Something went wrong!");
                setError(true);
            }
        }

        getDeptList();
    }, [issuerData.dept]);

    useEffect(function () {
        async function getStudentList() {
            if (!issuerData.dept) return;

            setError(false);
            console.log("Form data: ", issuerData);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/users/dept/${issuerData.dept._id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await res.json();

                if (result.hasError) {
                    setMessage(result.message);
                    setError(true);
                    return;
                }

                setUserList(result.data);
            } catch (error) {
                console.log("Error: ", error);
                setMessage("Something went wrong!");
                setError(true);
            }
        }

        getStudentList();
    }, [issuerData]);

    async function issueBook() {
        setError(false);

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/issue-book/${bookId}`, {
                method: 'POST',
                body: JSON.stringify({userId: issuerData.user._id}),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await res.json();
            
            if (result.hasError) {
                setMessage(result.message);
                setError(true);
                return;
            }

            navigate('/library');
        } catch (error) {
            console.log("Error: ", error);
            setMessage("Something went wrong!");
            setError(true);
        }
    }

    function handleDept(event, deptData) {
        if (!deptData) {
            setUserList([]);
            return;
        }
        console.log("Dept data: ", deptData);

        setIssuerData({ ...issuerData, 'dept': deptData });
    }

    function handleUser(event, userData) {
        if (!userData) return;
        setIssuerData({ ...issuerData, 'user': userData });
    }

    return (
        <main className='card-container'>
            <h1>Issue Book</h1>

            <div className='card'>
                {hasError && <Alert severity='error'> {message} </Alert>}
                <Autocomplete
                    options={deptList.sort((a, b) => -b.title.localeCompare(a.title))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.deptName}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Select Department" />}
                    onChange={handleDept}
                />

                <Autocomplete
                    options={userList.sort((a, b) => -b.title.localeCompare(a.title))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => `${option.name.firstName} ${option.middleName} ${option.name.lastName} | ${option.email}`}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Select User" />}
                    onChange={handleUser}
                    disabled={!userList.length ? true : false}
                />
            </div>

            <h1>Book Details</h1>
            <div className="card">
                <div className="info-container">
                    <h3 className="info-title">Book name: </h3>
                    <span className="info">{bookData.bookName}</span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Author name: </h3>
                    <span className="info"> {bookData.author} </span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Due date: </h3>
                    <span className="info"> {dueDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                    })} </span>
                </div>
            </div>

            {issuerData.user &&
                <>
                    <h1>Issuer Details</h1>
                    <div className="card">
                        <div className="info-container">
                            <h3 className='info-title'>Name: </h3>
                            <span className='info'>{`${issuerData.user?.name?.firstName} ${issuerData.user?.middleName || ""} ${issuerData.user?.name.lastName}`}</span>
                        </div>

                        <div className="info-container">
                            <h3 className='info-title'>Email: </h3>
                            <span className='info'><a href={`mailto:${issuerData.user?.email}`}> {issuerData.user?.email} </a></span>
                        </div>

                        <div className="info-container">
                            <h3 className='info-title'>Phone: </h3>
                            <span className='info'><a href={`tel:${issuerData?.user.contact?.primaryNo}`}> {issuerData.user?.contact?.primaryNo} </a></span>
                            {issuerData.user.contact.alternativeNo &&
                                <span className='info'> | <a href={`tel:${issuerData.user?.contact?.alternativeNo}`}>{issuerData.user?.contact?.alternativeNo} </a></span>
                            }
                        </div>

                        <div className="info-container">
                            <h3 className='info-title'>Dept: </h3>
                            <span className='info'>{issuerData.dept?.deptName} </span>
                        </div>
                    </div>

                    <button className="btn" onClick={issueBook}>Issue book</button>
                </>
            }
        </main >
    );
}
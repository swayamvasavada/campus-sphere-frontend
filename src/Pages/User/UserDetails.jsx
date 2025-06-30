import { useEffect, useState } from 'react';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";
import { useParams } from 'react-router-dom';
import { Alert } from '@mui/material';

export default function UserDetails() {
    const { userId } = useParams();
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');

    const [userData, setUserData] = useState({});

    useEffect(function () {
        async function getUserData() {
            if (!userId) return;

            setError(false);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
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

                console.log("Data: ", result);
                setUserData(result.data);
            } catch (error) {
                console.log("Error: ", error);
                setMessage("Something went wrong!");
                setError(true);
            }
        }

        getUserData();
    }, [userId]);

    return (
        <main className='card-container'>
            {hasError && <Alert severity='error'>{message}</Alert>}
            <h1>User Details</h1>
            <div className="card">
                <div className="info-container">
                    <h3 className='info-title'>Name: </h3>
                    <span className='info'>{`${userData?.name?.firstName} ${userData?.middleName || ""} ${userData?.name?.lastName}`}</span>
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Gender: </h3>
                    <span className='info'>{`${userData?.gender?.charAt(0)?.toUpperCase() + userData?.gender?.slice(1)}`}</span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Date of Birth: </h3>
                    <span className="info"> {new Date(userData.dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit"
                    })} </span>
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Email: </h3>
                    <span className='info'><a href={`mailto:${userData?.email}`}> {userData?.email} </a></span>
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Phone: </h3>
                    <span className='info'><a href={`tel:${userData?.contact?.primaryNo}`}> {userData?.contact?.primaryNo} </a></span>
                    {userData?.contact?.alternativeNo &&
                        <span className='info'> | <a href={`tel:${userData?.contact?.alternativeNo}`}>{userData?.contact?.alternativeNo} </a></span>
                    }
                </div>

                {
                    userData.dept &&
                    <div className="info-container">
                        <h3 className='info-title'>Dept: </h3>
                        <span className='info'>{userData.dept?.deptName} </span>
                    </div>
                }

                {
                    userData.batch &&
                    <div className="info-container">
                        <h3 className='info-title'>Batch: </h3>
                        <span className='info'>{userData.batch?.year} </span>
                    </div>
                }
            </div>

            <h1>Residential information</h1>
            <div className="card">
                <div className="info-container">
                    <h3 className="info-title">Colony Name: </h3>
                    <span className="info">{userData?.address?.colonyName}</span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Landmark: </h3>
                    <span className="info"> {userData?.address?.landmark} </span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Area: </h3>
                    <span className="info"> {userData?.address?.area} </span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">City: </h3>
                    <span className="info"> {userData?.address?.city} </span>
                </div>
            </div>
        </main >
    );
}
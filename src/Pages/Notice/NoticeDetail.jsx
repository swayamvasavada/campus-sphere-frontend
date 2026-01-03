import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from '@mui/material';

import "../../assets/styles/base.css";
import "../../assets/styles/forms.css";
import "../../assets/styles/view.css";

export default function NoticeDetail() {
    const { noticeId } = useParams();
    const [hasError, setError] = useState(false);
    const [message, setMessage] = useState('');

    const [noticeData, setNoticeData] = useState({});
    const [userData, setUserData] = useState({});

    useEffect(function () {
        async function getNoticeData() {
            if (!noticeId) return;

            setError(false);

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/notice/view/${noticeId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${localStorage.getItem("authToken")}`
                    }
                });

                const result = await res.json();

                if (result.hasError) {
                    setMessage(result.message);
                    setError(true);
                    return;
                }

                setNoticeData(result.noticeData);
                setUserData(result.userData);
            } catch (error) {
                console.log("Error: ", error);
                setMessage("Something went wrong!");
                setError(true);
            }
        }

        getNoticeData();
    }, [noticeId]);

    return (
        <main className='card-container'>
            {hasError && <Alert severity='error'>{message}</Alert>}
            <h1>Notice</h1>
            <div className="card">
                <div className="info-container">
                    <h3 className='info-title'>Notice Title: </h3>
                    <span className='info'>{`${noticeData.noticeTitle}`}</span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Issued by: </h3>
                    <span className='info'><a href={`mailto:${userData?.email}`}> {`${userData?.name?.firstName} ${userData?.middleName} ${userData?.name?.lastName}`} </a></span>
                </div>

                <div className="info-container">
                    <h3 className="info-title">Issued on: </h3>
                    <span className="info">
                        <i className="fa-solid fa-calendar"></i>
                        {new Date(noticeData?.issuedOn).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "2-digit"
                        })}
                    </span>
                </div>

                <div className="info-container">
                    <h3 className='info-title'>Notice message: </h3>
                    <span className='info'>{noticeData?.noticeMessage}</span>
                </div>
            </div>
        </main >
    );
}
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";

export default function LibrarianDashboard() {
    const [librarySummary, setLibrarySummary] = useState({});

    async function getLibrarySummary() {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/library/summary`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${localStorage.getItem("authToken")}`
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

    useEffect(function () {
        getLibrarySummary();
    }, []);

    return (
        <main className="">
            <div className="card-alt-container">
                <div className="card-alt">
                    <a href="/library" className="card-btn">
                        <h4 className="card-title">Total Books</h4>
                        <p>
                            {librarySummary.hasError ? <Alert severity="error">{librarySummary.message}</Alert> : librarySummary?.totalBooks}
                        </p>
                    </a>
                </div>

                <div className="card-alt">
                    <a href="/library" className="card-btn">
                        <h4 className="card-title">Total No of Books</h4>
                        <p>
                            {librarySummary.hasError ? <Alert severity="error">{librarySummary.message}</Alert> : librarySummary?.totalNoBooks}
                        </p>
                    </a>
                </div>

                <div className="card-alt">
                    <a href="/library/issued" className="card-btn">
                        <h4 className="card-title">Total Books Issued</h4>
                        <p>
                            {librarySummary.hasError ? <Alert severity="error">{librarySummary.message}</Alert> : librarySummary?.totalIssued}
                        </p>
                    </a>
                </div>
            </div>
        </main>
    );
}
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";
import "../assets/styles/header.css";

export default function Header() {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdown] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [userInfo, setInfo] = useState(null);    

    useEffect(function () {
        async function fetchUserInfo() {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/user-info`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `${localStorage.getItem("authToken")}`
                    }
                });

                const result = await res.json();
                if (!result.hasError) {
                    setInfo(result.data);
                    return;
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        }

        fetchUserInfo();
    }, []);

    function toggleDropdown() {
        setDropdown(!isDropdownOpen);
        return;
    }

    function handleClose(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdown(false);
        }
    }

    function handleLogout() {
        Cookies.remove("authToken");
        return navigate("/login");
    }

    function toggleDrawer(newOpen) {
        return function () {
            setOpen(newOpen);
        };
    }

    useEffect(function () {
        document.addEventListener('mousedown', handleClose);

        return function () {
            document.removeEventListener('mousedown', handleClose);
        }
    }, []);

    return (
        <>
            <Sidebar open={open} toggleDrawer={toggleDrawer} />
            <header>
                <div className="menu-btn" onClick={toggleDrawer(true)}>
                    <i className="fa-solid fa-bars" title="Menu"></i>
                </div>

                <nav>
                    <div className="nav-item" onClick={toggleDropdown} ref={dropdownRef}>
                        <i className="fa-solid fa-circle-user"></i>
                        {userInfo && <span> {`${userInfo?.name?.firstName} ${userInfo?.name?.lastName}`} </span>}
                        <span><i className="fa-solid fa-angle-down" style={{ fontSize: "1rem" }}></i></span>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <a href="/change-password"><div className="dropdown-item"><i className="fa-solid fa-key"></i> Change Password </div></a>
                                <div className="dropdown-item" onClick={handleLogout}> <i className="fa-solid fa-right-from-bracket"></i> Logout</div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
        </>
    )
}
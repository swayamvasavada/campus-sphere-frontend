import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Auth({ children }) {
    const cookies = Cookies.get("authToken");
    console.log("Cookies: ", cookies);
    
    if (!cookies) {
        console.log("Returning to Login page");
        return <Navigate to="/login" replace />
    }

    return children;
}
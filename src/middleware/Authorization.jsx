import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Authorization({ allowedRoles, children }) {
    let cookies = Cookies.get("authToken");
    cookies = JSON.parse(cookies);    
    
    if (!cookies || !cookies.desg) return <Navigate to="/login" replace />

    if (!allowedRoles.includes(cookies.desg)) return <Navigate to="/" replace />

    return children;
}
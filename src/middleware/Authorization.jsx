import { Navigate } from "react-router-dom";

export default function Authorization({ allowedRoles, children }) {
    let desg = localStorage.getItem("desg");    
    
    if (!desg) return <Navigate to="/login" replace />

    if (!allowedRoles.includes(desg)) return <Navigate to="/" replace />

    return children;
}
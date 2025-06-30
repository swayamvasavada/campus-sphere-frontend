import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Auth({ children }) {
    const cookies = Cookies.get("authToken");
    if (!cookies) {
        return <Navigate to="/login" replace />
    }

    return children;
}
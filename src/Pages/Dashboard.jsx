import Cookies from "js-cookie";
import AdminDashboard from "./Dashboard/AdminDashboard";
import LibrarianDashboard from "./Dashboard/LibrarianDashboard";
import StudentDashboard from "./Dashboard/StudentDashboard";

export default function Dashboard() {
    let cookies = Cookies.get("authToken");
    cookies = JSON.parse(cookies);

    return (
        <>
            {cookies.desg === "Admin" && <AdminDashboard />}
            {cookies.desg === "Librarian" && <LibrarianDashboard />}
            {cookies.desg === "Student" && <StudentDashboard />}
        </>
    );
}
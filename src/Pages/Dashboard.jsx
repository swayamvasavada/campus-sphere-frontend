import AdminDashboard from "./Dashboard/AdminDashboard";
import LibrarianDashboard from "./Dashboard/LibrarianDashboard";
import StudentDashboard from "./Dashboard/StudentDashboard";

export default function Dashboard() {
    let desg = localStorage.getItem("desg");

    return (
        <>
            {desg === "Admin" && <AdminDashboard />}
            {desg === "Librarian" && <LibrarianDashboard />}
            {desg === "Student" && <StudentDashboard />}
        </>
    );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Authentication from "./middleware/Authentication";
import Authorization from "./middleware/Authorization";

import Layout from "./Pages/Layout";

import Login from "./Pages/Authentication/Login";
import RequesReset from "./Pages/Authentication/RequestReset";
import ResetPassword from "./Pages/Authentication/ResetPassword";

import ViewUsers from "./Pages/User/ViewUsers";
import UserDetails from "./Pages/User/UserDetails";
import CreateUser from "./Pages/User/CreateUser";
import UpdateUser from "./Pages/User/UpdateUser";
import ChangePassword from "./Pages/User/ChangePassword";

import Dashboard from "./Pages/Dashboard";

import ViewDepartment from "./Pages/Department/ViewDepartment";
import CreateDepartment from "./Pages/Department/CreateDepartment";
import UpdateDepartment from "./Pages/Department/UpdateDepartment";

import ViewBatch from "./Pages/Batch/ViewBatch";
import CreateBatch from "./Pages/Batch/CreateBatch";
import UpdateBatch from "./Pages/Batch/UpdateBatch";

import NoticeDetail from "./Pages/Notice/NoticeDetail";
import ViewNotice from "./Pages/Notice/NoticeView";
import IssueNotice from "./Pages/Notice/IssueNotice";

import ViewBooks from "./Pages/Librarian/ViewBooks";
import AddBooks from "./Pages/Librarian/AddBooks";
import UpdateBooks from "./Pages/Librarian/UpdateBook";
import IssueBook from "./Pages/Librarian/IssueBook";
import IssuedBook from "./Pages/Librarian/IssuedBooks";
import IssuerDetail from "./Pages/Librarian/IssuerDetail";

import ViewPayments from "./Pages/Payments/PaymentList";
import PaidFees from "./Pages/Payments/ViewPaidFees";
import ViewAllPayments from "./Pages/Payments/ViewAllPayments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<RequesReset />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route element={<Layout />}>
          <Route path="/users" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <ViewUsers /> </Authorization> </Authentication>} />
          <Route path="/users/view/:userId" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <UserDetails /> </Authorization> </Authentication>} />
          <Route path="/create-user" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <CreateUser /> </Authorization> </Authentication>} />
          <Route path="/update-user/:userId" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <UpdateUser /> </Authorization> </Authentication>} />
          <Route path="/change-password" element={<Authentication> <Authorization allowedRoles={["Student", "Faculty", "Librarian", "Admin"]}> <ChangePassword /> </Authorization> </Authentication>} />

          <Route path="/dashboard" element={<Authentication> <Authorization allowedRoles={["Student", "Faculty", "Librarian", "Admin"]}> <Dashboard /> </Authorization> </Authentication>} />

          <Route path="/departments" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <ViewDepartment /> </Authorization> </Authentication>} />
          <Route path="/departments/create-dept" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <CreateDepartment /> </Authorization> </Authentication>} />
          <Route path="/departments/update-dept/:deptId" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <UpdateDepartment /> </Authorization> </Authentication>} />


          <Route path="/batch" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <ViewBatch /> </Authorization> </Authentication>} />
          <Route path="/batch/create-batch" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <CreateBatch /> </Authorization> </Authentication>} />
          <Route path="/batch/update-batch/:batchId" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <UpdateBatch /> </Authorization> </Authentication>} />

          <Route path="/notice" element={<Authentication> <Authorization allowedRoles={["Admin", "Faculty", "Student"]}> <ViewNotice /> </Authorization> </Authentication>} />
          <Route path="/notice/view/:noticeId" element={<Authentication> <Authorization allowedRoles={["Admin", "Faculty", "Student"]}> <NoticeDetail /> </Authorization> </Authentication>} />
          <Route path="/notice/issue-notice" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <IssueNotice /> </Authorization> </Authentication>} />

          <Route path="/library" element={<Authentication> <Authorization allowedRoles={["Librarian"]}> <ViewBooks /> </Authorization> </Authentication>} />
          <Route path="/library/add-book" element={<Authentication> <Authorization allowedRoles={["Admin", "Librarian"]}> <AddBooks /> </Authorization> </Authentication>} />
          <Route path="/library/update-book/:bookId" element={<Authentication> <Authorization allowedRoles={["Librarian"]}> <UpdateBooks /> </Authorization> </Authentication>} />
          <Route path="/library/issue-book/:bookId" element={<Authentication> <Authorization allowedRoles={["Librarian"]}> <IssueBook /> </Authorization> </Authentication>} />
          <Route path="/library/issued" element={<Authentication> <Authorization allowedRoles={["Librarian"]}> <IssuedBook /> </Authorization> </Authentication>} />
          <Route path="/library/view-detail/issuer/:issueId" element={<Authentication> <Authorization allowedRoles={["Librarian"]}> <IssuerDetail /> </Authorization> </Authentication>} />

          <Route path="/payments" element={<Authentication> <Authorization allowedRoles={["Student"]}> <ViewPayments /> </Authorization> </Authentication>} />
          <Route path="/payments/view-payments" element={<Authentication> <Authorization allowedRoles={["Admin"]}> <ViewAllPayments /> </Authorization> </Authentication>} />
          <Route path="/payments/paid-fees" element={<Authentication> <Authorization allowedRoles={["Student"]}> <PaidFees /> </Authorization> </Authentication>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
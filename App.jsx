import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDash";
import AdminLogin from "./AdminLogin";
import InternshipLetter from "./Internship";
import SubmittedDocuments from "./SubmittedDocuments";
import AadharSubmission from "./AadharSubmission";
import NOCRequest from "./NOCRequest";
import AllRequests from "./AllRequest";
import StudentsPage from "./StudentsPage";
import ExamForm from "./ExamForm";
import BonafideForm from "./BonafideForm";
import RequestedDocuments from "./RequestedDocuments";
import LeavingCertificate from "./LeavingCertificate";
import RequestDetails from "./RequestDetails";
import ResubmitRequest from "./ResubmitRequest";
import Profile from "./Profile";
import AdminProfile from "./AdminProfile";
import StudentDownload from "./StudentDownload";
import OtherDocumentRequest from "./OtherDocumentRequest";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/internship-letter" element={<InternshipLetter />} />
        <Route path="/submitted-documents" element={<SubmittedDocuments />} />
        <Route path="/exam-form" element={<ExamForm />} />
        <Route path="/aadhar-submission" element={<AadharSubmission />} />
        <Route path="/noc-request" element={<NOCRequest />} />

        <Route path="/all-requests" element={<AllRequests />} />
        <Route path="/students" element={<StudentsPage />} />
      <Route path="/bonafide" element={<BonafideForm />} />
<Route path="/requested-documents" element={<RequestedDocuments />} />
        <Route path="/leaving-certificate" element={<LeavingCertificate />} />
        <Route path="/request/:id" element={<RequestDetails />} />
      <Route path="/resubmit/:id" element={<ResubmitRequest />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/adminprofile" element={<AdminProfile />} />
<Route path="/downloads" element={<StudentDownload />} />
<Route path="/other-document" element={<OtherDocumentRequest />} />



      </Routes>
    </Router>
  );
}

export default App;

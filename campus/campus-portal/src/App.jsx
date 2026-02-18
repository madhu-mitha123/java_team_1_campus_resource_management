import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClassroomBooking from "./pages/ClassroomBooking";

import LabBooking from "./pages/LabBooking";
import EventHallBooking from "./pages/EventHallBooking";
import LibraryStationBooking from "./pages/LibraryStationBooking";
import CanteenBooking from "./pages/CanteenBooking";
import AdminApproval from "./pages/AdminApproval";
import SplitLogin from "./pages/SplitLogin";
import LibraryBookBorrowing from "./pages/LibraryBookBorrowing";
import MyBookings from "./pages/MyBookings";

import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book-classroom" element={<ClassroomBooking />} />
      <Route path="/book-lab" element={<LabBooking />} />
      <Route path="/book-hall" element={<EventHallBooking />} />
      <Route path="/book-library" element={<LibraryStationBooking />} />
      <Route path="/borrow-books" element={<LibraryBookBorrowing />} />
      <Route path="/book-canteen" element={<CanteenBooking />} />
      <Route path="/admin-approval" element={<AdminApproval />} />
      <Route path="/my-bookings" element={<MyBookings />} />
    </Routes>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateTicket from "./pages/CreateTicket";
import EditTicket from "./pages/EditTicket"; // ✅ NEW IMPORT
import UpdateTicketStatus from "./pages/UpdateTicketStatus";
import Navbar from "./components/Navbar";
import MyTickets from "./pages/MyTickets";
import Home from "./pages/Home";
import AssignedTickets from "./pages/AssignedTickets";
import SolvedTickets from "./pages/SolvedTickets";
import AgentPanel from "./pages/AgentPanel";
import ForgotPassword from "./pages/ForgotPassword";
import Footer from "./components/Footer";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TicketDetails from "./pages/TicketDetails";
import AgentTicketDetails from "./pages/AgentTicketDetails";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route path="/agent-panel" element={<AgentPanel />} />
        <Route path="/agentticketdetails/:ticketId" element={<AgentTicketDetails />} />
        <Route
          path="/solved-tickets"
          element={
            <PrivateRoute role="admin">
              <SolvedTickets />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-ticket"
          element={
            <PrivateRoute>
              <CreateTicket />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-ticket/:id" // ✅ NEW ROUTE
          element={
            <PrivateRoute>
              <EditTicket />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-status"
          element={
            <PrivateRoute>
              <UpdateTicketStatus />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <PrivateRoute>
              <MyTickets />
            </PrivateRoute>
          }
        />
        <Route
          path="/assigned-tickets"
          element={
            <PrivateRoute>
              <AssignedTickets />
            </PrivateRoute>
          }
        />

<Route
          path="/ticket-details/:ticketId"
          element={
            <PrivateRoute>
              <TicketDetails />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

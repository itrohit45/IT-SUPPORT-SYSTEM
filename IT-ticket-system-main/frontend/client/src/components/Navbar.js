import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FiMenu, FiX, FiUser, FiSettings, FiLogOut,
  FiHelpCircle, FiHome, FiTrello, FiUsers, FiCheckCircle
} from "react-icons/fi";
import '../assets/styles/NavbarFooter.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState({ name: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData({ name: decoded.name, role: decoded.role });
      } catch (error) {
        console.error("Invalid token");
      }
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container d-flex justify-content-between align-items-center">

        {/* Left Side: Brand */}
        <div className="navbar-left d-flex align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeMenu}>
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/972/753/original/business-expert-specialist-setting-support-team-icon-free-vector.jpg"
              alt="SupportPro Logo"
              className="logo-img"
            />
            <span className="brand-text">IT Support</span>
          </Link>
        </div>

        {/* Right Side: Navigation & User */}
        <div className={`navbar-right d-flex align-items-center gap-4 ${isOpen ? "active" : ""}`}>
          <div className="main-nav d-flex gap-3 align-items-center">
            <NavItem to="/" icon={<FiHome />} text="Home" onClick={closeMenu} active={location.pathname === "/"} />
            <NavItem to="/features" icon={<FiCheckCircle />} text="Features" onClick={closeMenu} />
            <NavItem to="/how-it-works" icon={<FiHelpCircle />} text="How It Works" onClick={closeMenu} />

            {userData.role === "user" && (
              <NavItem to="/my-tickets" icon={<FiTrello />} text="My Tickets" onClick={closeMenu} />
            )}
            {userData.role === "agent" && (
              <NavItem to="/agent-panel" icon={<FiUsers />} text="Assigned Tickets" onClick={closeMenu} />
            )}
            {userData.role === "admin" && (
              <>
                <NavItem to="/admin" icon={<FiTrello />} text="All Tickets" onClick={closeMenu} />
                <NavItem to="/solved-tickets" icon={<FiCheckCircle />} text="Solved Tickets" onClick={closeMenu} />
              </>
            )}
          </div>

          {/* User Section */}
          <div className="user-section d-flex align-items-center ms-auto">
            {userData.name ? (
              <div className="user-dropdown position-relative">
                <button className="user-button d-flex align-items-center gap-2">
                  <FiUser className="user-icon" />
                  <span className="user-name">{userData.name}</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
                    <FiUser className="menu-icon" /> Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={closeMenu}>
                    <FiSettings className="menu-icon" /> Settings
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <FiLogOut className="menu-icon" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="navbar-toggle btn-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}

const NavItem = ({ to, icon, text, onClick, active }) => (
  <Link to={to} className={`nav-item d-flex align-items-center gap-2 ${active ? "active" : ""}`} onClick={onClick}>
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;

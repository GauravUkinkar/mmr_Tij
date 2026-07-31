import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = ({ setIsLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="parent bg-white shadow-sm fixed top-0 left-0 z-[10] ">
      <div className="container flex justify-between items-center py-[0]" style={{padding:"0px 20px"}}>
        <img src={logo} alt="logo" className="w-[150px]" />
        <div className="nav flex gap-6">
          <Link
            to="/add-invoice"
            className={
              location.pathname === "/add-invoice"
                ? "active txt-link !text-yellow-800"
                : "txt-link !text-yellow-800"
            }
          >
            New Invoice
          </Link>
          <Link to="/" className="!text-yellow-800">
            Table View
          </Link>
          {/* <Link to="/add-suport" className="!text-yellow-800">
            Supporting Data
          </Link> */}

          <Link
            to="/add-client"
            className={
              location.pathname === "/add-client"
                ? "active txt-link !text-yellow-800"
                : "txt-link !text-yellow-800"
            }
          >
            Clients
          </Link>
          <Link to="/add-vendor" className="!text-yellow-800">
            Vendors
          </Link>
          <button
            style={{ cursor: "pointer" }}
            onClick={() => {
              const confirmLogout = window.confirm(
                "Are you sure you want to logout?"
              );
              if (confirmLogout) {
                localStorage.setItem("login", "false");
                setIsLogin(false);
                navigate("/login");
              }
            }}
            className="!text-yellow-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

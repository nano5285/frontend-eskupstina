import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";

export const AdminNavigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    navigate("/");
    logout();
    localStorage.clear();
  };
  const handleHome = () => {
    navigate("/main");
  };
  return (
    <div style={{ display: "flex", alignItems: "center" }} className="m-10">
      <div
        id="logout"
        className="mt-3 mr-3 "
        style={{
          backgroundColor: "rgb(213 213 213 / var(--tw-bg-opacity))",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          marginBottom: "2px",
          cursor: "pointer",
          top: "30px",
          height: "40px",
          width: "100px",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
        onClick={handleHome}
      >
        <button className="btn ml-2">Home</button>
      </div>
      <div>
        <div
          id="logout"
          className="mt-3"
          style={{
            backgroundColor: "rgb(213 213 213 / var(--tw-bg-opacity))",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            marginBottom: "2px",
            cursor: "pointer",
            top: "30px",
            height: "40px",
            width: "150px",
            display: "flex",
            alignItems: "center",
          }}
          onClick={handleLogout}
        >
          <FontAwesomeIcon className="ml-1" icon={faSignOutAlt} />
          <button className="btn ml-2">Logout</button>
        </div>
      </div>
    </div>
  );
};

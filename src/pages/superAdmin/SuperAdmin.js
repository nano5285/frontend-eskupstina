import React, { useState, useEffect } from "react";
import { AdminNavigation } from "../admin/AdminNavigation";
import "../admin/admin.css";
import {
  createUser,
  deleteUserAPI,
  getTvUsers,
  updateUser,
} from "../../services/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import UserDialog from "../../components/UserDialog";

export const SuperAdmin = () => {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState("list");
  const [selectedItem, setSelectedItem] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    party: "",
    role: "",
    city: "",
  });
  const fetchUsers = async () => {
    try {
      const res = await getTvUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const confirmed = window.confirm("Da li želite da obrišete korisnika?");
      if (confirmed) {
        const res = await deleteUserAPI(userId);
        if (res.status == 1) {
          toast("Brisanje korisnika upešno");
          fetchUsers();
        } else {
          toast("Brisanje korisnika neupešno");
        }
      } else {
        toast("Brisanje korisnika odloženo");
      }
    } catch (error) {
      toast("Greška prilikom brisanja korisnika");
      console.error("Error deleting user:", error);
    }
  };
  const cancelAddUser = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      party: "",
      role: "",
      city: "",
    });
    setActive("list");
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSaveUser = async (event) => {
    const form = document.getElementById("userForm");
    if (form.checkValidity()) {
      try {
        const result = await createUser(formData);
        if (result.status == 1) {
          toast("Uspešno kreiran korisnik");
        } else {
          toast("Neuspešno kreiran korisnik");
        }
        setFormData({
          name: "",
          email: "",
          password: "",
          party: "",
          role: "",
          city: "",
        });
        fetchUsers();
        setActive("list");
      } catch (error) {
        toast("Greška pri kreiranju korisnika");
        console.error("Error creating korisnika:", error);
      }
    }
  };

  const handleUpdateUser = async (event) => {
    const form = document.getElementById("userForm");
    if (form.checkValidity()) {
      try {
        const result = await updateUser(formData, selectedItem);
        if (result.status == 1) {
          toast("Uspešno uredjene korisnika");
        } else {
          toast("Neuspešno uredjene korisnika");
        }
        setFormData({
          name: "",
          email: "",
          password: "",
          party: "",
          role: "",
          city: "",
        });
        fetchUsers();
        setActive("list");
      } catch (error) {
        toast("Greška pri uredjenju korisnika");
        console.error("Error editing korisnika:", error);
      }
    }
  };

  const openUpdateUser = (user) => {
    setFormData(user);
    setActive("update_user");
    setSelectedItem(user._id);
  };

  return (
    <div>
      <AdminNavigation />
      {(active == "add_user" || active == "update_user") && (
        <UserDialog
          formData={formData}
          open={active === "add_user" || active === "update_user"}
          cancelSession={cancelAddUser}
          handleInputChange={handleInputChange}
          handleSave={active === "add_user" ? handleSaveUser : handleUpdateUser}
        ></UserDialog>
      )}
      <div className="admin">
        <p className="heading">Super Admin panel</p>
        <div className="admin-content mt-10">
          <div className="admin-content-nav">
            <button
              className={`${active == "list" ? "active-nav" : ""}`}
              onClick={() => setActive("list")}
            >
              PRIKAZ
            </button>
            <button
              className={`${active == "add_user" ? "active-nav" : ""}`}
              onClick={() => setActive("add_user")}
            >
              DODAJ NOVOG USERA
            </button>
          </div>
          <div className="list mt-10">
            {users?.map((user) => {
              return (
                <div key={user.id} className="sessions mb-2">
                  <div className="user-tab">
                    <p>
                      {user.name} <span>{user.party}</span>
                    </p>
                    <div className="action-buttons mt-3 mr-10">
                      <FontAwesomeIcon
                        onClick={() => deleteUser(user._id)}
                        className="mx-2 pointer-cursor"
                        icon={faTrashAlt}
                      />
                      <FontAwesomeIcon
                        onClick={() => openUpdateUser(user)}
                        className="mx-2 pointer-cursor"
                        icon={faEdit}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

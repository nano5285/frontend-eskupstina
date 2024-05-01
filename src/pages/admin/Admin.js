import React, { useEffect, useState } from "react";
import { AdminNavigation } from "./AdminNavigation";
import {
  faSignOutAlt,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import "../admin/admin.css";
import {
  getSessions,
  deleteAgendaAPI,
  deleteSessionAPI,
  createAgenda,
} from "../../services/axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgendaDialog from "../../components/AgendaDialog";

export const Admin = () => {
  const [sessions, setSessions] = useState([]);
  const [active, setActive] = useState("list");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf_path: "",
    agenda_type: "",
    session: "",
  });

  const fetchSessions = async () => {
    try {
      const res = await getSessions();
      setSessions(res.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, []);

  const deleteAgenda = async (agendaId) => {
    try {
      const confirmed = window.confirm("Da li želite da obrišete agendu?");

      if (confirmed) {
        const res = await deleteAgendaAPI(agendaId);
        if (res.status == 1) {
          toast("Brisanje agende upešno");
          fetchSessions();
        } else {
          toast("Brisanje agende neupešno");
        }
      } else {
        toast("Brisanje agende odloženo");
      }
    } catch (error) {
      toast("Greška prilikom brisanja agende");
      console.error("Error deleting agenda:", error);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const confirmed = window.confirm("Da li želite da obrišete sednicu?");

      if (confirmed) {
        const res = await deleteSessionAPI(sessionId);
        if (res.status == 1) {
          toast("Brisanje sednice upešno");
          fetchSessions();
        } else {
          toast("Brisanje sednice neupešno");
        }
      } else {
        toast("Brisanje sesije odloženo");
      }
    } catch (error) {
      toast("Greška prilikom brisanja sesije");
      console.error("Error deleting session:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };
  const handleSave = async () => {
    const form = document.getElementById("agendaForm");
    if (form.checkValidity()) {
      try {
        const result = await createAgenda(formData);
        toast("Uspešno kreirana agenda");
        setFormData({
          title: "",
          description: "",
          pdf_path: "",
          agenda_type: "",
          session: "",
        });
        fetchSessions();
        setActive("list");
      } catch (error) {
        toast("Greška pri kreiranju agende");
        console.error("Error creating agenda:", error);
      }
    }
  };
  const cancelAgenda = () => {
    setFormData({
      title: "",
      description: "",
      pdf_path: "",
      agenda_type: "",
      session: "",
    });
    setActive("list");
  };
  return (
    <div>
      <AdminNavigation />
      <div className="admin">
        <p className="heading">Admin panel</p>
        <div className="admin-content mt-10">
          <div className="admin-content-nav">
            <button
              className={`${active == "list" ? "active-nav" : ""}`}
              onClick={() => setActive("list")}
            >
              PRIKAZ
            </button>{" "}
            <button
              className={`${active == "add_session" ? "active-nav" : ""}`}
              onClick={() => setActive("add_session")}
            >
              DODAJ NOVU SEDNICU
            </button>
            <button
              className={`${active == "add_agenda" ? "active-nav" : ""}`}
              onClick={() => setActive("add_agenda")}
            >
              DODAJ NOVU AGENDU
            </button>
          </div>

          {/* ADD AGGENDA */}
          {active == "add_agenda" && (
            <AgendaDialog
              formData={formData}
              open={active == "add_agenda"}
              cancelAgenda={cancelAgenda}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
              sessions={sessions}
            ></AgendaDialog>
          )}

          {/* ADD SESSION */}
          {active == "add_session" && (
            <div className="add mt-10">
              <p>dodaj sednicu</p>
            </div>
          )}

          {/* LIST */}
          {active == "list" && (
            <div className="list mt-10">
              {sessions.map((session) => {
                return (
                  <div key={session.id} className="sessions mb-5">
                    <div className="sessions-tab">
                      <p>{session.name}</p>
                      <div className="action-buttons mt-3 mr-10">
                        <FontAwesomeIcon
                          onClick={() => deleteSession(session.id)}
                          className="mx-2 pointer-cursor"
                          icon={faTrashAlt}
                        />
                        <FontAwesomeIcon
                          onClick={() => alert(`uredi ${session.id}`)}
                          className="mx-2 pointer-cursor"
                          icon={faEdit}
                        />
                      </div>
                    </div>
                    <div className="agendas mt-5">
                      {session.agendas.map((agenda) => (
                        <div
                          key={agenda._id}
                          className="agendas-tab mb-2 ml-10"
                        >
                          <p>{agenda.name}</p>
                          <div className="action-buttons">
                            <FontAwesomeIcon
                              onClick={() => deleteAgenda(agenda._id)}
                              className="mx-2 pointer-cursor"
                              icon={faTrashAlt}
                            />
                            <FontAwesomeIcon
                              onClick={() => alert(`uredi ${agenda._id}`)}
                              className="mx-2 pointer-cursor"
                              icon={faEdit}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

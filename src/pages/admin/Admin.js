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
  createSession,
  updateSession,
  updateAgenda,
  getAgendas,
} from "../../services/axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AgendaDialog from "../../components/AgendaDialog";
import SessionDialog from "../../components/SessionDialog";
import AgendaList from "../../components/AgendaList";
import SessionsList from "../../components/SessionsList";
import PositionDialog from "../../components/PositionDialog";

export const Admin = () => {
  const [sessions, setSessions] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [active, setActive] = useState("list");
  const [selectedItem, setSelectedItem] = useState("");
  const [sessionId, setSessionId] = useState();
  const [orderNum, setOrderNum] = useState();
  const [currentOrderNum, setCurrentOrderNum] = useState();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf_path: "",
    agenda_type: "",
    session: "",
    position: "",
  });
  const [formDataSession, setFormDataSession] = useState({
    title: "",
    start_time: "",
    end_time: "",
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
  const fetchAgendas = async (type,text) => {
    try {
      const res = await getAgendas(sessionId, type,text);
      setAgendas(res.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };
  const deleteAgenda = async (agendaId) => {
    try {
      const confirmed = window.confirm("Da li želite da obrišete agendu?");

      if (confirmed) {
        const res = await deleteAgendaAPI(agendaId);
        if (res.status == 1) {
          toast("Brisanje agende upešno");
          fetchSessions();
        } else {
          toast.error("Brisanje agende neupešno");
        }
      } else {
        toast.error("Brisanje agende odloženo");
      }
    } catch (error) {
      toast.error("Greška prilikom brisanja agende");
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
          toast.error("Brisanje sednice neupešno");
        }
      } else {
        toast.error("Brisanje sesije odloženo");
      }
    } catch (error) {
      toast.error("Greška prilikom brisanja sesije");
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
  const handleInputChangeSession = (event) => {
    const { name, value, files } = event.target;
    setFormDataSession((prevState) => ({
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
        toast.error("Greška pri kreiranju agende");
        console.error("Error creating agenda:", error);
      }
    }
  };

  const handleSaveSession = async () => {
    const form = document.getElementById("sessionForm");
    if (form.checkValidity()) {
      try {
        const result = await createSession(formDataSession);
        if (result.status == 1) {
          toast("Uspešno kreirana sednice");
        } else {
          toast("Neuspešno kreirana sednice");
        }
        setFormDataSession({
          title: "",
          start_time: "",
          end_time: "",
        });
        fetchSessions();
        setActive("add_agenda");
      } catch (error) {
        toast.error("Greška pri kreiranju sednice");
        console.error("Error creating session:", error);
      }
    }
  };

  const handleUpdateSession = async () => {
    const form = document.getElementById("sessionForm");
    if (form.checkValidity()) {
      try {
        const result = await updateSession(formDataSession, selectedItem);
        if (result.status == 1) {
          toast("Uspešno uredjene sednice");
        } else {
          toast.error("Neuspešno uredjene sednice");
        }
        setFormDataSession({
          title: "",
          start_time: "",
          end_time: "",
        });
        fetchSessions();
        setActive("list");
      } catch (error) {
        toast.error("Greška pri uredjenju sednice");
        console.error("Error editing session:", error);
      }
    }
  };
  // const handleChangeOrder = async (order) => {
  //     if (orderNum) {
  //       try {
  //         const result = await updateAgendaOrder(orderNum, selectedItem);
  //         if (result.status == 1) {
  //           toast("Uspešno uredjene sednice");
  //           setOrderNum("");
  //           setActive("Agenda")
  //           setSelectedItem("");
  //         } else {
  //           toast("Neuspešno uredjene sednice");
  //         }
  //         setFormDataSession({
  //           title: "",
  //           start_time: "",
  //           end_time: "",
  //         });
  //         fetchSessions();
  //         setActive("list");
  //       } catch (error) {
  //         toast("Greška pri uredjenju sednice");
  //         console.error("Error editing session:", error);
  //       }
  //     }
  //   };
  const handleUpdateAgenda = async () => {
    const form = document.getElementById("agendaForm");
    if (form.checkValidity()) {
      try {
        const result = await updateAgenda(formData, selectedItem);
        if (result.status == 1) {
          toast("Uspešno uredjene sednice");
        } else {
          toast.error("Neuspešno uredjene sednice");
        }
        setFormData({
          title: "",
          description: "",
          pdf_path: "",
          agenda_type: "",
          session: "",
          position: "",
        });
        fetchSessions();
        setActive("list");
      } catch (error) {
        toast.error("Greška pri uredjenju sednice");
        console.error("Error editing session:", error);
      }
    }
  };
const handleUpdateOrder = async () => {
    const form = document.getElementById("orderForm");
    if (form.checkValidity()) {
      try {
        const result = await updateAgenda(formData, selectedItem);
        if (result.status == 1) {
          toast("Uspešno uredjene sednice");
        } else {
          toast.error("Neuspešno uredjene sednice");
        }
        setFormData({
          title: "",
          description: "",
          pdf_path: "",
          agenda_type: "",
          session: "",
          position: "",
        });
        fetchAgendas();
        setActive("Agenda");
      } catch (error) {
        toast.error("Greška pri uredjenju sednice");
        console.error("Error editing session:", error);
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
      position: "",
    });
    setActive("Agenda");
  };
  const cancelSession = () => {
    setFormDataSession({
      title: "",
      start_time: "",
      end_time: "",
    });
    setActive("list");
  };

  const openUpdateSession = (session) => {
    setFormDataSession({
      title: session.name,
      start_date: session.start_time,
      end_data: session.end_time,
    });
    setActive("update_session");
    setSelectedItem(session.id);
  };

  const openUpdateAgenda = (agenda) => {
    setFormData({
      title: agenda.name,
      description: agenda.description,
      pdf_path: agenda.pdf_path,
      agenda_type: agenda.agenda_type,
      session_id: agenda.session_id,
    });
    setActive("update_agenda");
    setSelectedItem(agenda._id);
  };
 const openUpdateOrder = (agenda) => {
    setFormData({
      title: agenda.name,
      description: agenda.description,
      pdf_path: agenda.pdf_path,
      agenda_type: agenda.agenda_type,
      session_id: agenda.session_id,
      position: "",
    });
    setCurrentOrderNum(agenda?.position);
    setActive("change_order");
    setSelectedItem(agenda._id);
  };
  console.log(sessions, "sessions");
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
              className={`${
                active == "add_session" || active == "update_session"
                  ? "active-nav"
                  : ""
              }`}
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
          {(active == "add_agenda" || active == "update_agenda") && (
            <AgendaDialog
              formData={formData}
              open={active === "add_agenda" || active === "update_agenda"}
              cancelAgenda={cancelAgenda}
              handleInputChange={handleInputChange}
              handleSave={
                active === "add_agenda" ? handleSave : handleUpdateAgenda
              }
              sessions={sessions}
            ></AgendaDialog>
          )}
          {/* ADD SESSION */}
          {(active == "add_session" || active == "update_session") && (
            <SessionDialog
              formData={formDataSession}
              open={active === "add_session" || active === "update_session"}
              cancelSession={cancelSession}
              handleInputChange={handleInputChangeSession}
              handleSave={
                active === "add_session"
                  ? handleSaveSession
                  : handleUpdateSession
              }
            ></SessionDialog>
          )}
          {active === "change_order" && (
            <PositionDialog
              formData={formData}
              setOrderNum={setOrderNum}
              currentOrderNum={currentOrderNum}
              orderNum={orderNum}
              open={active === "change_order"}
              cancelSession={cancelAgenda}
              handleInputChange={handleInputChange}
              handleSave={handleUpdateOrder}
            ></PositionDialog>
          )}
          {/* LIST */}
          {active == "list" && (
            <div className="list mt-10">
              <SessionsList
                sessions={sessions}
                setSessionId={setSessionId}
                setActive={setActive}
                setAgendas={setAgendas}
                openUpdateSession={openUpdateSession}
                deleteSession={deleteSession}
              />
            </div>
          )}
          {active === "Agenda" && (
            <div className="list mt-10">
              <AgendaList
                agendas={agendas}
                setSelectedItem={setSelectedItem}
                setCurrentOrderNum={setCurrentOrderNum}
                openUpdateAgenda={openUpdateAgenda}
                openUpdateOrder={openUpdateOrder}
                setActive={setActive}
                onFilter={fetchAgendas}
                deleteAgenda={deleteAgenda}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

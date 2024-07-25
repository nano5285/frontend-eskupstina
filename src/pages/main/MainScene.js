import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../../utils/socket";
import VoteAlert from "../../components/VoteAlert";
import {
  closeVote,
  createAgenda,
  getAgenda,
  getAgenda2,
  getSessions,
  getUser,
  handleVote,
  resetVote,
  startVote,
} from "../../services/axios";
import { Button, button } from "@material-tailwind/react";
import CloseAlert from "../../components/CloseAlert";
import CustomButton from "../../components/CustomButton";
import UserComponent from "../../components/UserComponent";
import { toast } from "react-toastify";
import ZoomSvg from "../../assets/Zoom.svg";
import PdfViewer from "../../components/CustomPdfViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AgendaDialog from "../../components/AgendaDialog";
import isEqual from "lodash/isEqual";
import Navbar from "../../components/Navbar";

export default function MainScene(props) {
  const { state } = useLocation();
  const [party, setParty] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [abstrainedNum, setAbstrainedNum] = useState(0);
  const [yesNum, setYesNum] = useState(0);
  const [noNum, setNoNum] = useState(0);
  const [notVotedNum, setNotVotedNum] = useState(0);
  const [selectedAgenda, setSelectedAgenda] = useState([]);
  const [startedVote, setStartedVote] = useState();
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const userName = localStorage.getItem("userName");
  const [selectedAgendaPdf, setSelectedAgendaPdf] = useState();
  const [votingAgenda, setVotingAgenda] = useState();
  const [connected, setConnected] = useState();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userId");
  const [showLogout, setShowLogout] = useState(false);
  const [voteClose, setVoteClose] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [newAgenda, setNewAgenda] = useState(false);
  const [preAgenda, setPreAgenda] = useState([]);
  const [dailyAgenda, setDailyAgenda] = useState([]);
  const [selectedIndexAgenda, setSelectedIndexAgenda] = useState({});
  const [getUpdate, setGetUpdate] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSessions] = useState({
    id: "",
    name: "",
    agendas: [],
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf_path: "",
    agenda_type: "",
  });
  socket.on("user_disconnected", function () {
    setConnected(!connected);
  });

  useEffect(() => {
    socket.on("live_voting_results", async (agendaId) => {
      if (agendaId) {
        const res = await getSessions();

        const currentSessionId = getCookie("currentSessionId")
          ? getCookie("currentSessionId")
          : res?.data[0].id;

        const currentSession = res?.data.find(
          (item) => item.id == currentSessionId
        );

        setCurrentSessions(currentSession);
        setCookie("currentSessionId", currentSessionId, 30);

        const preAgendas = currentSession.agendas.filter(
          (agenda) => agenda.agenda_type === "pre_agenda"
        );
        const dailyAgendas = currentSession.agendas.filter(
          (agenda) => agenda.agenda_type === "daily_agenda"
        );
        setPreAgenda(preAgendas);
        setDailyAgenda(dailyAgendas);

        currentSession.agendas.forEach((item) => {
          if (item?._id === agendaId) {
            const voteState = item.vote_state;
            setVotingAgenda(item);
            if (voteState !== 2) {
              if (item.vote_info) {
                const exists = JSON.parse(item?.vote_info)?.some(
                  (element) =>
                    element?.user_id === localStorage.getItem("userId")
                );
                if (!exists) {
                  setOpen(true);
                }
              }
            }
          }
        });
      }
    });
  }, []);

  socket.on("vote_start", function (agendaId, agenda) {
    setVotingAgenda(agenda);
    setOpen(!open);
    setGetUpdate(!getUpdate);
    setVoteClose(false);
  });

  socket.on("vote_update", function (message, agendaId, agenda) {
    setVotingAgenda(agenda);
    setUpdateFlag(!updateFlag);
    let tmp = null;
    if (agenda?.vote_info && agenda?.vote_info !== "undefined") {
      tmp = JSON.parse(agenda.vote_info);
    }
    setSelectedAgenda(tmp);
    if (tmp == null) {
      setYesNum(0);
      setNoNum(0);
      setAbstrainedNum(0);
      setNotVotedNum(0);
      return;
    }
    // Counting the number of votes for each decision
    const result = tmp?.reduce((acc, obj) => {
      if (obj !== undefined && obj !== null) {
        const key = obj.decision;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }
      return acc;
    }, {});

    // Counting the number of objects for each decision
    if (result) {
      const yes = result["1"] ? result["1"].length : 0;
      const no = result["0"] ? result["0"].length : 0;
      const ab = result["2"] ? result["2"].length : 0;

      // Setting the state variables
      setYesNum(yes);
      setNoNum(no);
      setAbstrainedNum(ab);
      setNotVotedNum(yes + no + ab);
    }
  });

  socket.on("vote_close", function (data) {
    setOpen(false);
    setVoteClose(true);
  });

  socket.on("vote_reset", function (data) {
    setOpen(false);
    setVotingAgenda(null);
    setGetUpdate(!getUpdate);
  });

  const changeVoteView = async (param) => {
    if (state?.role == "admin") {
      setAdminOpen(!adminOpen);
    }

    setOpen(!open);
    const voteData = {
      user_id: currentUser,
      agenda_id: selectedIndexAgenda._id,
      decision: param,
    };

    console.log(
      "🚀 ~ file: MainScene.js:61 ~ changeVoteView ~ voteData:",
      voteData
    );
    socket.emit("vote_update", "message", selectedIndexAgenda._id, voteData);
    if (!connected) {
      await handleVote(voteData);
    }
  };

  const sendVoteStart = async () => {
    if (checkAgendaState() == 2) {
      toast("Voting already closed!");
      return;
    }
    const startVoteData = {
      agenda_item_id: selectedIndexAgenda._id,
    };
    setStartedVote(startVoteData);
    await startVote(startVoteData);
    socket.emit("vote_start", selectedIndexAgenda._id, selectedIndexAgenda);
  };

  const sendVoteClose = async () => {
    await closeVote(startedVote);
    socket.emit("vote_update", "message", selectedIndexAgenda._id);
    socket.emit(
      "vote_close",
      {
        yesNum: yesNum,
        noNum: noNum,
        abstrainedNum: abstrainedNum,
      },
      selectedIndexAgenda._id
    );
    setAdminOpen(false);
  };

  const sendVoteReset = async () => {
    const resetData = {
      agenda_id: selectedIndexAgenda._id,
    };
    await resetVote(resetData);
    setIsReset(!isReset);
    socket.emit("vote_reset", "message", null);
  };

  useEffect(() => {
    let tmp;
    if (votingAgenda?.vote_info && votingAgenda?.vote_info !== "undefined") {
      tmp = JSON.parse(votingAgenda?.vote_info);
    }
    setSelectedAgenda(tmp);
    if (tmp == null) {
      setYesNum(0);
      setNoNum(0);
      setAbstrainedNum(0);
      setNotVotedNum(0);
      return;
    }
    const result = tmp?.reduce((acc, obj) => {
      if (obj !== undefined && obj !== null) {
        const key = obj.decision;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }
      return acc;
    }, {});

    // Counting the number of objects for each decision
    if (result) {
      const yes = result["1"] ? result["1"].length : 0;
      const no = result["0"] ? result["0"].length : 0;
      const ab = result["2"] ? result["2"].length : 0;

      // Setting the state variables
      setYesNum(yes);
      setNoNum(no);
      setAbstrainedNum(ab);
      setNotVotedNum(yes + no + ab);
    }
  }, [votingAgenda]);

  useEffect(() => {
    const getUsers = async () => {
      const userId = localStorage.getItem("userId");
      const resp = await getUser({ id: userId });
      if (userId) {
        const user = resp.data.find((user) => user._id === userId);

        if (user.role === "admin") {
          setAdmin(true);
          setSuperAdmin(true);
        }
        if (user.role === "super-admin") {
          setSuperAdmin(true);
        }
      }
      const partyGroup2 = resp.data?.reduce((acc, obj) => {
        const key = obj.party;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }, {});

      const partyNames = Object.keys(partyGroup2);
      const partyUsers = Object.values(partyGroup2);

      setParty(partyNames);
      setUsers(partyUsers);
    };
    getUsers();
  }, []);
  useEffect(() => {
    const getAgendaById = async () => {
      try {
        // Ensure selectedIndexAgenda is defined and not an empty object
        if (
          !selectedIndexAgenda ||
          !selectedIndexAgenda._id ||
          Object.keys(selectedIndexAgenda).length === 0
        ) {
          return;
        }

        const res = await getAgenda2(selectedIndexAgenda._id);
        let tmp = null;
        if (!isEqual(res.data, selectedIndexAgenda)) {
          setSelectedIndexAgenda(res.data);
        }
        if (res.data?.vote_info && res.data?.vote_info !== "undefined") {
          tmp = JSON.parse(res.data.vote_info);
        }
        setSelectedAgenda(tmp);
        if (tmp == null) {
          setYesNum(0);
          setNoNum(0);
          setAbstrainedNum(0);
          setNotVotedNum(0);
          return;
        }
        // Counting the number of votes for each decision
        const result = tmp?.reduce((acc, obj) => {
          if (obj !== undefined && obj !== null) {
            const key = obj.decision;
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
          }
          return acc;
        }, {});

        // Counting the number of objects for each decision
        if (result) {
          const yes = result["1"] ? result["1"].length : 0;
          const no = result["0"] ? result["0"].length : 0;
          const ab = result["2"] ? result["2"].length : 0;

          // Setting the state variables
          setYesNum(yes);
          setNoNum(no);
          setAbstrainedNum(ab);
          setNotVotedNum(yes + no + ab);
        }
      } catch (error) {
        console.error("Error fetching agenda by ID:", error);
      }
    };
    getAgendaById();
  }, [selectedIndexAgenda, getUpdate, voteClose, connected]);

  useEffect(() => {
    const getAgendasAndUsers = async () => {
      const res = await getSessions();
      setSessions(res?.data);
      const currentSessionId = getCookie("currentSessionId")
        ? getCookie("currentSessionId")
        : res?.data[0].id;

      const currentSession = res?.data.find(
        (item) => item.id == currentSessionId
      );

      setCurrentSessions(currentSession);
      setCookie("currentSessionId", currentSessionId, 30);

      const agendas = currentSession.agendas || [];
      // Separate agendas into preAgendas and dailyAgendas
      const preAgendas = agendas.filter(
        (agenda) => agenda.agenda_type === "pre_agenda"
      );
      const dailyAgendas = agendas.filter(
        (agenda) => agenda.agenda_type === "daily_agenda"
      );
      // Update preAgenda and dailyAgenda states
      setPreAgenda(preAgendas);
      setDailyAgenda(dailyAgendas);
      let updatedAgenda;
      // Select default selectedIndexAgenda if not already set
      if (
        Object.keys(selectedIndexAgenda).length === 0 &&
        preAgendas.length > 0
      ) {
        setSelectedIndexAgenda(preAgendas[0]);
        setSelectedAgendaPdf(preAgendas[0]._id);
        updatedAgenda = preAgendas[0];
      } else {
        // Find selectedIndexAgenda in the updated agendas list
        updatedAgenda = agendas.find(
          (agenda) => agenda._id === selectedIndexAgenda._id
        );
        setSelectedIndexAgenda(updatedAgenda || {});
        setSelectedAgendaPdf(updatedAgenda?._id || "");
      }

      // Parse and update vote statistics
      let tmp = null;
      if (
        updatedAgenda?.vote_info &&
        updatedAgenda?.vote_info !== "undefined"
      ) {
        tmp = JSON.parse(updatedAgenda.vote_info);
      }
      setSelectedAgenda(tmp);
      if (tmp == null) {
        setYesNum(0);
        setNoNum(0);
        setAbstrainedNum(0);
        setNotVotedNum(0);
        return;
      }
      // Counting the number of votes for each decision
      const result = tmp?.reduce((acc, obj) => {
        if (obj !== undefined && obj !== null) {
          const key = obj.decision;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }
        return acc;
      }, {});

      // Counting the number of objects for each decision
      if (result) {
        const yes = result["1"] ? result["1"].length : 0;
        const no = result["0"] ? result["0"].length : 0;
        const ab = result["2"] ? result["2"].length : 0;

        // Setting the state variables
        setYesNum(yes);
        setNoNum(no);
        setAbstrainedNum(ab);
        setNotVotedNum(yes + no + ab);
      }
    };

    getAgendasAndUsers();
  }, [getUpdate, isReset, newAgenda]);

  const checkAgendaState = () => {
    return selectedIndexAgenda.vote_state;
  };

  const getDecisionFromAgenda = (userId, voteInfo) => {
    if (voteInfo == null) return 3;
    else {
      for (var i = 0; i < voteInfo.length; i++) {
        if (voteInfo[i]?.user_id == userId) {
          return voteInfo[i]?.decision;
        }
      }
      return 3;
    }
  };
  const { logout } = useAuth();
  const handleLogout = () => {
    navigate("/");
    logout();
    localStorage.clear();
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const cancelAgenda = () => {
    setFormData({
      title: "",
      description: "",
      pdf_path: "",
      agenda_type: "",
    });
    setShowModal(!showModal); // Show modal when plus icon is clicked
  };

  const sessionChange = (item) => {
    setCurrentSessions(item);
    setCookie("currentSessionId", item.id, 30);

    const preAgendas = item.agendas.filter(
      (agenda) => agenda.agenda_type === "pre_agenda"
    );
    const dailyAgendas = item.agendas.filter(
      (agenda) => agenda.agenda_type === "daily_agenda"
    );

    setPreAgenda(preAgendas);
    setDailyAgenda(dailyAgendas);
    setShowLogout(!showLogout);
  };

  const setCookie = (name, value, minutesToExpire) => {
    var now = new Date();
    var expirationDate = new Date(now.getTime() + minutesToExpire * 60000); // Convert minutes to milliseconds
    document.cookie =
      name +
      "=" +
      value +
      "; expires=" +
      expirationDate.toUTCString() +
      "; path=/";
  };
  function getCookie(name) {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(name + "=") === 0) {
        return cookie.substring(name.length + 1);
      }
    }
    return false;
  }

  return (
    <>
      <Navbar admin={admin} superAdmin={superAdmin} sessions={sessions} sessionChange={sessionChange} />
      <div className="">
        <div
          className={`${isFullScreen ? "p-[20px]" : "p-[0px]"
            }  h-screen  w-full  bg-[#ddd]`}
        >
          <div className="flex flex-col md:flex-row w-full gap-2 justify-between h-full ">
            {isFullScreen && (
              <div className="flex flex-col basis-1/4 bg-[#FFF] border-[2px] border-[#ccc] rounded-[8px] px-[20px] pt-[40px] overflow-y-auto">
                <div
                  style={{
                    position: "relative",
                    display: "block",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    marginBottom: "5px",


                  }}
                >
                  {/* <FontAwesomeIcon
                    icon={faBars}
                    onClick={toggleLogout}
                    className="cursor-pointer side-bars"
                  /> */}

                  {/* <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                      background: "white",
                      borderBottom: "1px solid lightgrey",
                      padding: "5px 10px",
                      width: "fit content",

                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{ marginRight: "5px" }}
                      />
                      <span className="user-id" style={{ marginLeft: "8px" }}>{userName}</span>
                    </div>
                  </div>

                  <div>
                    {(admin || superAdmin) && (
                      <div
                        id="logout"
                        className="panel-btn mt-3 mr-3 "
                        style={{
                          backgroundColor: "mintcream",
                          margin: "30px 30px 2px 0px",
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
                          textAlign: "center",
                        }}
                        onClick={() => navigate("/admin")}
                      >
                        <button className=" btn ml-2">Admin</button>
                      </div>
                    )}
                    {superAdmin && (
                      <div
                        id="logout"
                        className="panel-btn mt-3 mr-3 "
                        style={{
                          backgroundColor: "mintcream",
                          margin: "10px 30px 20px 0px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          marginBottom: "2px",
                          cursor: "pointer",
                          top: "30px",
                          height: "40px",
                          width: "150px",
                          display: "inline-flex",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                        onClick={() => navigate("/super-admin")}
                      >
                        <button className=" btn ml-2">Super Admin</button>
                      </div>
                    )}
                    {(admin || superAdmin) && (
                      <div
                        id="logout"
                        className="panel-btn mt-3 mr-3 "
                        style={{
                          backgroundColor: "mintcream",
                          margin: "10px 30px 20px 0px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          marginBottom: "2px",
                          cursor: "pointer",
                          top: "30px",
                          height: "40px",
                          width: "150px",
                          display: "inline-flex",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                        onClick={() => navigate("/statistics")}
                      >
                        <button className=" btn ml-2">Statistics</button>
                      </div>
                    )}
                  </div> */}
                </div>
                {/* {showLogout && (
                  <div className="mt-2">
                    {sessions.map((item) => (
                      <p
                        key={item.id}
                        className="mt-3 text-lg pointer-cursor"
                        id={item.id}
                        onClick={() => sessionChange(item)}
                      >
                        {item.name}
                      </p>
                    ))}
                    <div
                      id="logout"
                      className="mt-3"
                      style={{
                        backgroundColor:
                          "rgb(213 213 213 / var(--tw-bg-opacity))",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        marginBottom: "2px",
                        cursor: "pointer",
                        top: "30px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={handleLogout}
                    >
                      <FontAwesomeIcon className="ml-1" icon={faSignOutAlt} />
                      <button className="btn ml-2">Logout</button>
                    </div>
                  </div>
                )} */}
                <div>
                  <h1 className="text-xl my-4 font-bold text-center px-5">
                    {currentSession.name}
                  </h1>
                </div>
                <div
                  style={
                    showLogout ? { marginTop: "80px" } : { marginTop: "0px" }
                  }
                >
                  <div>
                    <div
                      style={{
                        borderTop:
                          "3px solid rgb(213 213 213 / var(--tw-bg-opacity))",
                        marginBottom: "5px",
                      }}
                      
                    ></div>
                  </div>
                  {preAgenda.map((item, index) => {
                    return (
                      <CustomButton
                        key={index}
                        selected={item._id == selectedIndexAgenda._id}
                        index={index + 1}
                        locked={item.vote_state == 2}
                        name={item.name}
                        onClick={() => {
                          setGetUpdate(!getUpdate);
                          setSelectedIndexAgenda(preAgenda[index]);
                          setSelectedAgendaPdf(preAgenda[index]?._id);
                        }}
                      ></CustomButton>
                    );
                  })}
                </div>
                <div
                  style={
                    showLogout ? { marginTop: "80px" } : { marginTop: "0px" }
                  }
                >
                  {dailyAgenda.length && (
                    <div>
                      <div> Dnevna Agenda</div>
                      <div
                        style={{
                          borderTop:
                            "3px solid rgb(213 213 213 / var(--tw-bg-opacity))",
                          marginBottom: "5px",
                        }}
                      ></div>
                    </div>
                  )}
                  {dailyAgenda.map((item, index) => {
                    return (
                      <CustomButton
                        key={index}
                        selected={item._id == selectedIndexAgenda._id}
                        index={index + 1}
                        locked={dailyAgenda[index].vote_state == 2}
                        name={item.name}
                        onClick={() => {
                          setSelectedIndexAgenda(dailyAgenda[index]);
                          setSelectedAgendaPdf(dailyAgenda[index]?._id);
                        }}
                      ></CustomButton>
                    );
                  })}
                </div>
              </div>
            )}
            <div
              className={`${isFullScreen ? "md:basis-2/4" : "basis-full"
                } relative w-full h-[500px] md:h-full  bg-[#FFF] border-[2px] border-[#ccc] rounded-[8px]`}
            >
              {/* <PdfViewerComponent className="h-full" document={"http://52.158.47.57:8080/api/pdf?agenda=" + selectedIndex} /> */}
              {selectedAgendaPdf && (
                <PdfViewer
                  url={
                    "https://backend-eskupstina.azurewebsites.net/api/pdf-blob?agenda=" +
                    selectedAgendaPdf
                  }
                  onError={(error) => {
                    console.error("Error fetching PDF:", error);
                    // Handle error (e.g., display an error message to the user)
                  }}
                />
              )}
              <div className="absolute bottom-5 right-10">
                <button
                  onClick={() => {
                    setIsFullScreen(!isFullScreen);
                  }}
                >
                  <img
                    src={ZoomSvg}
                    width={60}
                    height={60}
                    alt="eskupstina zoom"
                  />
                </button>
              </div>
            </div>
            {isFullScreen && (
              <div className="relative flex flex-col items-center basis-1/4  border-[2px] border-[#ccc] rounded-[8px] bg-[#fff]  p-[20px]">
                <div className="flex flex-row w-full justify-between bg-[#f5f5f5] rounded-[20px] p-[10px]">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full bg-[#D9D9D9] border-[2px] border-[#5B5B5B] text-[#5B5B5B]">
                      {notVotedNum}
                    </div>
                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                      Ukupno
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#4AD527] border-[#5B5B5B] ">
                      {yesNum}
                    </div>
                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                      Za
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#377AFC] border-[#5B5B5B] ">
                      {abstrainedNum}
                    </div>
                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                      Suzdržano
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#EF4343] border-[#5B5B5B] ">
                      {noNum}
                    </div>
                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                      Protiv
                    </div>
                  </div>
                </div>

                <div className="w-full overflow-y-auto">
                  {party?.map((item, index) => {
                    return (
                      <div className="w-full" key={index}>
                        <div className="text-[20px] text-[700] text-[#2E2E2E] text-center mt-[20px]">
                          {item}
                        </div>
                        <div className="w-full h-[4px] bg-[#D9D9D9] mt-[10px]"></div>
                        <div className="w-full h-full flex flex-col">
                          {users[index]
                            .filter((item) => item.role != "super-admin")
                            .map((userItem) => {
                              return (
                                <UserComponent
                                  key={userItem._id}
                                  decision={getDecisionFromAgenda(
                                    userItem._id,
                                    selectedAgenda
                                  )}
                                  name={userItem.name}
                                />
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {admin && (
                  <div className="w-full h-[120px]"></div>
                )}
                {admin && (
                  <div className="absolute bottom-0 flex flex-row gap-10 p-[10px] justify-between ">
                    <Button
                      className=" w-[120px] bg-[green] text-[12px]"
                      onClick={sendVoteStart}
                    >
                      Otvori glasanje
                    </Button>
                    <Button
                      className=" w-[120px] bg-[#f00] text-[12px]"
                      onClick={sendVoteReset}
                    >
                      Resetiraj glasanje
                    </Button>
                  </div>
                )}
                <CloseAlert
                  open={adminOpen}
                  handleOpen={sendVoteStart}
                  handleClose={sendVoteClose}
                  data={{
                    yesNum: yesNum,
                    noNum: noNum,
                    notVotedNum: notVotedNum,
                    abstrainedNum: abstrainedNum,
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <VoteAlert
          open={open}
          agenda={votingAgenda}
          handleOpen={changeVoteView}
        />
        {/* <ResultAlert open={resultOpen} resultData={resultData} handleClose={handleResultClose} /> */}
      </div></>
  );
}

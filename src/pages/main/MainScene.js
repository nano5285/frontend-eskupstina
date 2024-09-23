import { useEffect, useState, useRef } from "react";
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
  liveVotes,
  recordLiveVote,
  getSessionOrLatest,
} from "../../services/axios";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  button,
} from "@material-tailwind/react";
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
import { ChevronUpIcon } from "@heroicons/react/24/outline";

export default function MainScene(props) {
  const [party, setParty] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [year, setYear] = useState("");

  const [abstrainedNum, setAbstrainedNum] = useState(0);
  const [yesNum, setYesNum] = useState(0);
  const [noNum, setNoNum] = useState(0);
  const [notVotedNum, setNotVotedNum] = useState(0);

  // const [selectedAgenda, setSelectedAgenda] = useState([]);
  const [startedVote, setStartedVote] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isReset, setIsReset] = useState(false);
  // const [updateFlag, setUpdateFlag] = useState(false);

  const [connected, setConnected] = useState(true);
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [voteClose, setVoteClose] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [openMenuOne, setOpenMenuOne] = useState(false);
  const [openMenuTwo, setOpenMenuTwo] = useState(false);
  const [openMenuThree, setOpenMenuThree] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);

  // const [newAgenda, setNewAgenda] = useState(false);
  const [preAgenda, setPreAgenda] = useState([]);
  const [dailyAgenda, setDailyAgenda] = useState([]);
  const [selectedIndexAgenda, setSelectedIndexAgenda] = useState({});
  const [selectedAgendaPdf, setSelectedAgendaPdf] = useState(null);
  const [agendaVotes, setAgendaVotes] = useState([]);

  const [getUpdate, setGetUpdate] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState({
    _id: "",
    name: "",
    agendas: [],
  });
  // const [currentSession, setCurrentSession] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf_path: "",
    agenda_type: "",
  });

  // Get user data from localStorage using useState
  const [userName] = useState(localStorage.getItem("userName") || "");
  const [currentUserId] = useState(localStorage.getItem("userId") || "");
  const [role] = useState(localStorage.getItem("role") || "");

  const [agendaBeingVoted, setAgendaBeingVoted] = useState(null);
  const [canStartNewVoting, setCanStartNewVoting] = useState(true);


  // Refs to hold the latest state values
  const selectedIndexAgendaRef = useRef(selectedIndexAgenda);

  // Update refs when states change
  useEffect(() => {
    console.log('useEffect: update selectedIndexAgendaRef...');
    selectedIndexAgendaRef.current = selectedIndexAgenda;
  }, [selectedIndexAgenda]);


  const initializeDefaultSession = async () => {
    console.log("useEffect: initializeDefaultSession...");
    const res = await getSessionOrLatest(getCookie("currentSessionId"));
    const currentSessionData = res;
    setYear(new Date(currentSessionData.start_time).getFullYear().toString());
  };

  /**
   * WebSocket Event Handlers
   * These functions handle events received from the WebSocket server.
   */

  // Check voting permission
  const handleCheckUserVotingPermission = (
    currentAgendaId,
    currentAgendaVotes
  ) => {
    currentSession?.agendas.forEach((agenda) => {
      if (agenda?._id === currentAgendaId) {
        const voteState = agenda.vote_state;
        if (voteState !== 2) {
          if (currentAgendaVotes.length !== 0) {
            const exists = currentAgendaVotes.some(
              (element) => element?.user_id === currentUserId
            );
            if (!exists) {
              setOpen(true);
            }
          }
        }
      }
    });
  };

  // Handle live voting results
  const handleLiveVotingResults = (currentAgendaId, currentAgendaVotes) => {
    
    const selectedAgenda = selectedIndexAgendaRef.current;
    console.log(
      "selectedIndexAgenda(handleLiveVotingResults): ",
      selectedAgenda
    );
    console.log("currentAgendaId(handleLiveVotingResults): ", currentAgendaId);
    console.log(selectedIndexAgendaRef.current._id === currentAgendaId);
    console.log("live votes: ", currentAgendaVotes);

    if (!currentAgendaVotes) return;

    // updateVoteCounts(currentAgendaVotes || []);

    if (
      selectedAgenda._id &&
      selectedAgenda._id === currentAgendaId
    ) {
      updateVoteCounts(currentAgendaVotes || []);
    }
  };

  // Handle vote start
  const handleVoteStart = (agendaInfo) => {
    setAgendaBeingVoted(agendaInfo);

    const selectedAgenda = selectedIndexAgendaRef.current;
    // take user to the agenda being voted
    console.log("selectedIndexAgenda: ", selectedAgenda);

    if (selectedAgenda?._id !== agendaInfo?._id) {
      setSelectedIndexAgenda({ _id: agendaInfo._id });
    }

    setOpen(true);
    // setGetUpdate((prev) => !prev);
    // setVoteClose(false);
  };

  // // Handle vote update
  // const handleVoteUpdate = (agendaId, updatedAgendaVotes) => {
  //   // show vote counts for the selected agenda.
  //   updateVoteCounts(updatedAgendaVotes);
  // };

  // Handle vote close
  const handleVoteClose = () => {
    setAgendaBeingVoted(null);
    setOpen(false);
    setVoteClose(true);
    setGetUpdate((prev) => !prev);
  };

  // Handle vote reset
  const handleVoteReset = async (resetData) => {
    setOpen(false);
    // Initiate an update for agenda list for the lock icon update.
    // Admin has already updated it when it clicked reset.
    if (role !== "admin") {
      setGetUpdate((prev) => !prev);
    }
  };

  const handleVotingSaved = () => {
    setCanStartNewVoting(true);
    // toast.success('All votes recorded for previous voting! You can start another voting!')
  };

  const handleVotingNotSaved = () => {};

  // Handle user disconnection
  const handleUserDisconnected = () => {
    setConnected(false);
  };

  // Handle user connection
  const handleUserConnected = () => {
    setConnected(true);
  };

  /**
   * useEffect Hook for Socket Event Listeners
   * Sets up the WebSocket event listeners when the component mounts.
   */
  useEffect(() => {
    initializeDefaultSession();
    // Attach event listeners
    socket.on("user_disconnected", handleUserDisconnected);
    socket.on("check_user_voting_permission", handleCheckUserVotingPermission);
    socket.on("live_voting_results", handleLiveVotingResults);
    socket.on("vote_start", handleVoteStart);
    // socket.on("vote_update", handleVoteUpdate);
    socket.on("vote_close", handleVoteClose);
    socket.on("vote_reset", handleVoteReset);
    socket.on("voting_saved", handleVotingSaved);
    socket.on("voting_not_saved", handleVotingNotSaved);

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      socket.off("user_disconnected", handleUserDisconnected);
      socket.off(
        "check_user_voting_permission",
        handleCheckUserVotingPermission
      );
      socket.off("live_voting_results", handleLiveVotingResults);
      socket.off("vote_start", handleVoteStart);
      // socket.off("vote_update", handleVoteUpdate);
      socket.off("vote_close", handleVoteClose);
      socket.off("vote_reset", handleVoteReset);
      socket.off("voting_saved", handleVotingSaved);
      socket.off("voting_not_saved", handleVotingNotSaved);
    };
  }, []);

  useEffect(() => {
    console.log("useEffect: updates with year: ", year);
    if (year) {
      getAgendasAndUsers({ year: year });
    }
  }, [getUpdate, year]);

  /**
   * Fetch Agenda by ID
   * Retrieves the agenda details based on the selected agenda.
   */
  useEffect(() => {
    console.log(
      "useEffect: updating selectedIndexAgenda:",
      selectedIndexAgenda._id
    );
    const getAgendaById = async () => {
      try {
        // Ensure selectedIndexAgenda is defined and not an empty object
        if (
          !selectedIndexAgenda._id ||
          Object.keys(selectedIndexAgenda).length === 0
        ) {
          return;
        }

        const res = await getAgenda2(selectedIndexAgenda?._id);
        const latestAgenda = res?.data;
        // console.log("latestAgenda: ", latestAgenda);

        if (!isEqual(latestAgenda, selectedIndexAgenda)) {
          setSelectedIndexAgenda(latestAgenda);
        }

        // if agenda's vote is in progress, pull live votes
        if (agendaBeingVoted && agendaBeingVoted._id === latestAgenda._id) {
          const liveVoteResponse = await liveVotes({
            agenda_id: latestAgenda._id,
          });
          updateVoteCounts(liveVoteResponse.votes);
          console.log("updating live votes for selected agenda..");
        } else {
          updateVoteCounts(latestAgenda.votes);
          console.log("updating stored votes for selected agenda..");
        }
      } catch (error) {
        console.error("Error fetching agenda by ID:", error);
      }
    };
    getAgendaById();
  }, [selectedIndexAgenda]);
  // }, [selectedIndexAgenda, getUpdate, voteClose, connected]);

  // useEffect(() => {
  //   updateVoteCounts(agendaVotes);
  // }, [agendaVotes]);

  /**
   * Fetch Users Data
   * Retrieves user information and organizes them by party.
   */
  useEffect(() => {
    console.log("useEffect: fetchUsers...");
    const fetchUsers = async () => {
      try {
        const resp = await getUser({ id: currentUserId });
        const userData = resp?.data?.find(
          (user) => user?._id === currentUserId
        );
        if (userData?.role === "admin") {
          setAdmin(true);
        }
        if (userData?.role === "super-admin") {
          setSuperAdmin(true);
        }
        const partyGroups = resp?.data?.reduce((acc, obj) => {
          const key = obj?.party;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }, {});
        setParty(Object.keys(partyGroups));
        setUsers(Object.values(partyGroups));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const getAgendasAndUsers = async (year) => {
    const res = await getSessions(year);
    setSessions(res?.data);
    const currentSessionId = getCookie("currentSessionId")
      ? getCookie("currentSessionId")
      : res?.data[0]._id;

    const currentSession = res?.data?.find(
      (item) => item._id == currentSessionId
    );

    setCurrentSession(currentSession);
    setCookie("currentSessionId", currentSessionId, 30);

    const agendas = currentSession?.agendas || [];
    // Separate agendas into preAgendas and dailyAgendas
    const preAgendas = agendas?.filter(
      (agenda) => agenda.agenda_type === "pre_agenda"
    );
    const dailyAgendas = agendas?.filter(
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
      updatedAgenda = agendas?.find(
        (agenda) => agenda?._id === selectedIndexAgenda._id
      );
      setSelectedIndexAgenda(updatedAgenda || {});
      setSelectedAgendaPdf(updatedAgenda?._id || "");
    }

    updateVoteCounts(updatedAgenda?.votes);
  };

  /**
   * Update Vote Counts
   * Parses the vote information and updates the vote counts.
   * @param {string} voteInfoString - JSON string containing vote information.
   */
  const updateVoteCounts = (votes = []) => {
    setAgendaVotes(votes);

    if (votes.length === 0) {
      setYesNum(0);
      setNoNum(0);
      setAbstrainedNum(0);
      setNotVotedNum(0);
      return;
    }

    // Counting the number of votes for each decision
    const result = votes.reduce((acc, obj) => {
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

  const getDecisionFromAgenda = (userId, votes = []) => {
    if (votes.length === 0) return 3;
    else {
      for (var i = 0; i < votes.length; i++) {
        if (votes[i]?.user_id == userId) {
          return votes[i]?.decision;
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
    setCurrentSession(item);
    setCookie("currentSessionId", item._id, 30);

    const preAgendas = item?.agendas.filter(
      (agenda) => agenda.agenda_type === "pre_agenda"
    );
    const dailyAgendas = item?.agendas.filter(
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
  const Year = ["2024", "2023", "2022"];

  const changeVoteView = async (decision, votedAgendaId) => {
    setOpen(false);

    if (role === "admin") {
      setAdminOpen(true);
    }

    // if(!selectedIndexAgenda?._id) return;

    const voteData = {
      user_id: currentUserId,
      agenda_id: votedAgendaId,
      decision,
    };

    // console.log('selectedIndexAgenda: ', selectedIndexAgenda);
    console.log(
      "🚀 ~ file: MainScene.js:61 ~ changeVoteView ~ voteData:",
      voteData
    );
    console.log();
    // pull latest live votes
    const res = await liveVotes({
      agenda_id: votedAgendaId,
    });
    console.log("currentVotes: ", res);
    // only if user has not voted already, it should send its vote

    const existingVoteIndex = res.votes.findIndex((vote) => {
      console.log(
        "Have I already voted?",
        vote.user_id,
        typeof vote.user_id,
        currentUserId,
        typeof currentUserId,
        vote.user_id === currentUserId
      );
      return vote.user_id === currentUserId;
    });

    console.log("existingVoteIndex: ", existingVoteIndex);
    if (existingVoteIndex !== -1) return;

    socket.emit("vote_update", voteData);

    // // prefer sending result over sockets
    // if(connected) {
    //   socket.emit("vote_update", voteData);
    // } else {
    //   await recordLiveVote(voteData);
    // }
  };

  const sendVoteStart = async () => {
    if (!canStartNewVoting) {
      toast("Please wait for sometime! Saving earlier votes!");
      return;
    }

    if (!selectedIndexAgenda._id) {
      toast("Select an agenda to start voting for");
      return;
    }

    if (selectedIndexAgenda?.vote_state === 2) {
      toast("Voting already closed!");
      return;
    }

    const startVoteData = {
      agenda_item_id: selectedIndexAgenda._id,
    };
    setStartedVote(startVoteData);
    await startVote(startVoteData);
    socket.emit("vote_start", selectedIndexAgenda);

    // admin cannot start a new voting unless the current one is fully saved
    setCanStartNewVoting(false);
  };

  const sendVoteClose = async () => {
    await closeVote(startedVote);
    // socket.emit("vote_update", "message", selectedIndexAgenda._id);

    socket.emit("vote_close", selectedIndexAgenda._id);
    setAdminOpen(false);
  };

  const sendVoteReset = async () => {
    const resetData = {
      agenda_id: selectedIndexAgenda._id,
    };
    await resetVote(resetData);
    setGetUpdate((prev) => !prev);
    socket.emit("vote_reset", resetData);
  };

  return (
    <>
      {/* <Navbar admin={admin} superAdmin={superAdmin} sessions={sessions} sessionChange={sessionChange} /> */}
      <div className="">
        <div
          className={`${
            isFullScreen ? "p-[20px]" : "p-[0px]"
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
                  <Menu placement="bottom-start">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MenuHandler>
                        <FontAwesomeIcon
                          icon={faBars}
                          className="cursor-pointer "
                        />
                      </MenuHandler>
                      <MenuHandler>
                        <span
                          className="cursor-pointer"
                          style={{ marginLeft: 10 }}
                        >
                          <FontAwesomeIcon icon={faUser} /> {userName}
                        </span>
                      </MenuHandler>
                    </div>
                    <MenuList>
                      {/* {Year?.map((item) => (
                        <MenuItem
                          onClick={() => {
                            setYear(item);
                          }}
                        >
                          {item}
                        </MenuItem>
                      ))} */}
                      <Menu
                        placement="right-start"
                        open={openMenuOne}
                        handler={setOpenMenuOne}
                        allowHover
                        offset={15}
                      >
                        <MenuHandler className="flex items-center justify-between">
                          <MenuItem onMouseEnter={() => setYear("2024")}>
                            2024
                            <ChevronUpIcon
                              strokeWidth={2.5}
                              className={`h-3.5 w-3.5 transition-transform ${
                                openMenuOne ? "rotate-90" : ""
                              }`}
                            />
                          </MenuItem>
                        </MenuHandler>
                        <MenuList>
                          {sessions.length > 0 ? (
                            sessions?.map((item) => (
                              <MenuItem
                                onClick={() => {
                                  sessionChange(item);
                                }}
                              >
                                {item.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem>No Data</MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                      <Menu
                        placement="right-start"
                        open={openMenuTwo}
                        handler={setOpenMenuTwo}
                        allowHover
                        offset={15}
                      >
                        <MenuHandler className="flex items-center justify-between">
                          <MenuItem onMouseEnter={() => setYear("2023")}>
                            2023
                            <ChevronUpIcon
                              strokeWidth={2.5}
                              className={`h-3.5 w-3.5 transition-transform ${
                                openMenuTwo ? "rotate-90" : ""
                              }`}
                            />
                          </MenuItem>
                        </MenuHandler>
                        <MenuList>
                          {sessions.length > 0 ? (
                            sessions?.map((item) => (
                              <MenuItem
                                onClick={() => {
                                  sessionChange(item);
                                }}
                              >
                                {item.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem>No Data</MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                      <Menu
                        placement="right-start"
                        open={openMenuThree}
                        handler={setOpenMenuThree}
                        allowHover
                        offset={15}
                      >
                        <MenuHandler className="flex items-center justify-between">
                          <MenuItem onMouseEnter={() => setYear("2022")}>
                            2022
                            <ChevronUpIcon
                              strokeWidth={2.5}
                              className={`h-3.5 w-3.5 transition-transform ${
                                openMenuThree ? "rotate-90" : ""
                              }`}
                            />
                          </MenuItem>
                        </MenuHandler>
                        <MenuList>
                          {sessions.length > 0 ? (
                            sessions?.map((item) => (
                              <MenuItem
                                onClick={() => {
                                  sessionChange(item);
                                }}
                              >
                                {item.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem>No Data</MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                      {/* {sessions?.length>0 && <div
                        style={{
                          borderTop:
                            "3px solid rgb(213 213 213 / var(--tw-bg-opacity))",
                          marginBottom: "5px",fontWeight:"bold"
                        }}
                      >Sessions</div>}
{sessions?.map((item) => (
                    <MenuItem
                      onClick={() => {
                        sessionChange(item);
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))} */}
                      <div
                        style={{
                          borderTop:
                            "3px solid rgb(213 213 213 / var(--tw-bg-opacity))",
                          marginBottom: "5px",
                        }}
                      ></div>
                      {role === "admin" && (
                        <MenuItem onClick={() => navigate("/admin")}>
                          Admin
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          handleLogout();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  {/* <h1 className="text-xl my-4 font-bold text-center px-5">
                    {currentSession?.name}
                  </h1> */}
                </div>
                <div
                // style={
                //   showLogout ? { marginTop: "80px" } : { marginTop: "0px" }
                // }
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

                  {preAgenda?.length && (
                    <div>
                      <div> Pre Agenda</div>
                      <div
                        style={{
                          borderTop:
                            "3px solid rgb(213 213 213 / var(--tw-bg-opacity))",
                          marginBottom: "5px",
                        }}
                      ></div>
                    </div>
                  )}
                  {preAgenda?.map((item, index) => {
                    return (
                      <CustomButton
                        key={item._id}
                        selected={item._id == selectedIndexAgenda._id}
                        index={index + 1}
                        locked={item.vote_state == 2}
                        name={item.name}
                        onClick={() => {
                          // setGetUpdate(!getUpdate);
                          setSelectedIndexAgenda(preAgenda[index]);
                          setSelectedAgendaPdf(preAgenda[index]?._id);
                        }}
                      ></CustomButton>
                    );
                  })}
                </div>
                <div
                // style={
                //   showLogout ? { marginTop: "80px" } : { marginTop: "0px" }
                // }
                >
                  {dailyAgenda?.length && (
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
                  {dailyAgenda?.map((item, index) => {
                    return (
                      <CustomButton
                        key={item._id}
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
              className={`${
                isFullScreen ? "md:basis-2/4" : "basis-full"
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

            {/* Vote Counts and User List */}
            {isFullScreen && (
              <div className="relative flex flex-col items-center basis-1/4  border-[2px] border-[#ccc] rounded-[8px] bg-[#fff]  p-[20px]">
                {/* Vote Counts */}
                <div className="flex flex-row w-full justify-between bg-[#f5f5f5] rounded-[20px] p-[10px]">
                  <VoteCount
                    key="Ukupno"
                    label="Ukupno"
                    count={notVotedNum}
                    bgColor="#D9D9D9"
                    textColor="#5B5B5B"
                  />
                  <VoteCount
                    key="Za"
                    label="Za"
                    count={yesNum}
                    bgColor="#4AD527"
                    textColor="#FFFFFF"
                  />
                  <VoteCount
                    key="Suzdržano"
                    label="Suzdržano"
                    count={abstrainedNum}
                    bgColor="#377AFC"
                    textColor="#FFFFFF"
                  />
                  <VoteCount
                    key="Protiv"
                    label="Protiv"
                    count={noNum}
                    bgColor="#EF4343"
                    textColor="#FFFFFF"
                  />
                </div>

                {/* User List */}
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
                                    agendaVotes
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
                {admin && <div className="w-full h-[120px]"></div>}
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
        {agendaBeingVoted && (
          <VoteAlert
            open={open}
            agenda={agendaBeingVoted}
            handleOpen={changeVoteView}
          />
        )}
        {/* <ResultAlert open={resultOpen} resultData={resultData} handleClose={handleResultClose} /> */}
      </div>
    </>
  );
}

/**
 * VoteCount Component
 * Displays individual vote counts with labels.
 * @param {Object} props - Component props.
 */
function VoteCount({ label, count, bgColor, textColor }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full border-[2px] border-[#5B5B5B]"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {count}
      </div>
      <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
        {label}
      </div>
    </div>
  );
}

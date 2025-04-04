import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../../utils/socket";
import VoteAlert from "../../components/VoteAlert";
import {
  closeVote,
  createAgenda,
  getAgenda,
  getAgenda2,
  getUser,
  handleVote,
  resetVote,
  startVote,
} from "../../services/axios";
import { Button } from "@material-tailwind/react";
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
export default function MainScene(props) {
  const { state } = useLocation();
  const [agendas, setAgendas] = useState([]);
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
  const [currentVotingAgenda, setCurrentVotingAgenda] = useState("");
  const [changeIndex, setChangeIndex] = useState(false);
  const [votingAgenda, setVotingAgenda] = useState();
  const [connected, setConnected] = useState();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("userId");
  const [showLogout, setShowLogout] = useState(false);
  const [voteClose, setVoteClose] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(false);
  const [newAgenda, setNewAgenda] = useState(false);
  const [preAgenda, setPreAgenda] = useState([]);
  const [dailyAgenda, setDailyAgenda] = useState([]);
  const [selectedIndexAgenda, setSelectedIndexAgenda] = useState({});
  const [getUpdate, setGetUpdate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf_path: "",
    agenda_type: "",
  });
  socket.on("disconnect", function () {
    setConnected(!connected);
  });
  useEffect(() => {
    socket.on("live_voting_results", async (agendaId) => {
      if (agendaId) {
        setCurrentVotingAgenda(agendaId);
        const res = await getAgenda();
        setAgendas(res.data);
        const preAgendas = res?.data.filter(
          (agenda) => agenda.agenda_type === "pre_agenda"
        );
        const dailyAgendas = res?.data.filter(
          (agenda) => agenda.agenda_type === "daily_agenda"
        );
        setPreAgenda(preAgendas);
        setDailyAgenda(dailyAgendas);
        res.data.forEach((item) => {
          if (item._id === agendaId) {
            const exists = JSON.parse(item.vote_info)?.some(
              (element) => element?.user_id === localStorage.getItem("userId")
            );
            if (!exists) setOpen(true);
          }
        });
      }
    });
  }, []);

  socket.on("vote_start", function (agendaId, agenda) {
    setCurrentVotingAgenda(agendaId);
    setVotingAgenda(agenda);
    setOpen(!open);
    setChangeIndex(true);
    setGetUpdate(!getUpdate);
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
      let res = await handleVote(voteData);
    }
  };

  const sendVoteStart = async () => {
    if (checkAgendaState() === 2) {
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
      // Check if the userId exists in localStorage
      
      if (userId) {
        // Find the user with the matching ID
        const user = resp.data.find((user) => user._id === userId);

        // Check if the user is found
        if (user.role === "admin") {
          // Return the user's role
          setAdmin(true);
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
      const res = await getAgenda();
      const agendas = res?.data || [];

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
      setAgendas(agendas);
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
    if (voteInfo === null) return 3;
    else {
      for (var i = 0; i < voteInfo.length; i++) {
        if (voteInfo[i]?.user_id == userId) {
          return voteInfo[i]?.decision;
        }
      }
      return 3;
    }
  };

  const handleLogout = () => {
    navigate("/");
    // logout();
    localStorage.clear();
  };

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleSave = async () => {
    const form = document.getElementById("agendaForm");
    if (form.checkValidity()) {
      setLoading(true);
      try {
        // Call createAgenda function
        const result = await createAgenda(formData);
        // Handle response
        console.log("Agenda created:", result);
        setFormData({
          title: "",
          description: "",
          pdf_path: "",
          agenda_type: "",
        });
        setLoading(false);
        setShowModal(false);
        setNewAgenda(true);
        const modal = document.getElementById("myModal");
        if (modal) {
          modal.classList.remove("show");
          modal.style.display = "none";
          const modalBackdrop =
            document.getElementsByClassName("modal-backdrop")[0];
          if (modalBackdrop) {
            modalBackdrop.parentNode.removeChild(modalBackdrop);
          }
        }
      } catch (error) {
        // Handle error
        console.error("Error creating agenda:", error);
      }
    } else {
      setError("Please fill out all required fields.");
    }
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
  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    // Update formData state based on input changes
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };
  return (
    <div className="">
      {showModal && (
        <AgendaDialog
          formData={formData}
          open={showModal}
          cancelAgenda={cancelAgenda}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
        ></AgendaDialog>
      )}
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
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <FontAwesomeIcon
                  icon={faBars}
                  onClick={toggleLogout}
                  className="cursor-pointer"
                />
                {showLogout && (
                  <div
                    id="logout"
                    className="position-absolute top-50 end-0 translate-middle-y"
                    style={{
                      backgroundColor:
                        "rgb(213 213 213 / var(--tw-bg-opacity))",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      marginBottom: "2px",
                      cursor: "pointer",
                      position: "absolute",
                      right: "0",
                      left: "0",
                      top: "30px",
                      height: "68px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon className="ml-1" icon={faSignOutAlt} />
                    <button className="btn ml-2">Logout</button>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
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
                    <span style={{ marginLeft: "8px" }}>{userName}</span>
                  </div>
                </div>
                <div>
                  {admin && (
                    <button data-toggle="modal" data-target="#myModal">
                      <FontAwesomeIcon
                        icon={faSquarePlus}
                        size="lg"
                        className="cursor-pointer"
                        onClick={cancelAgenda}
                      />
                    </button>
                  )}
                </div>
              </div>

              <div
                style={
                  showLogout ? { marginTop: "80px" } : { marginTop: "0px" }
                }
              >
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
                {preAgenda.map((item, index) => {
                  return (
                    <CustomButton
                      key={index}
                      selected={item._id == selectedIndexAgenda._id}
                      index={index + 1}
                      locked={item.vote_state == 2}
                      name={item.name}
                      onClick={() => {
                        setChangeIndex(true);
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
                    <div> Daily Agenda</div>
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
                        setChangeIndex(true);
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
                <img src={ZoomSvg} width={60} height={60} alt="" />
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
                        {users[index].map((userItem) => {
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
              {state?.role == "admin" && (
                <div className="w-full h-[120px]"></div>
              )}
              {state?.role == "admin" && (
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
    </div>
  );
}

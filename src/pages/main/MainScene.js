import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../../utils/socket";
import VoteAlert from "../../components/VoteAlert";
import {
  closeVote,
  getAgenda,
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
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
export default function MainScene(props) {
  const { state } = useLocation();
  const [agendas, setAgendas] = useState([]);
  const [party, setParty] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emitAgendaIndex, setEmitAgendaIndex] = useState(0);
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
  socket.on("connect", function () {
    setConnected(true);
  });
  useEffect(() => {
    socket.on("live_voting_results", async (agendaId) => {
      if (agendaId) {
        setCurrentVotingAgenda(agendaId);
        const res = await getAgenda();
        res.data.forEach((item) => {
          if (item._id === agendaId) {
            const exists = JSON.parse(item.vote_info)?.some(
              (element) => element.user_id === localStorage.getItem("userId")
            );
            if (!exists) setOpen(true);
          }
        });
      }
    });
  }, []);

  socket.on("message", function (data) {
    setEmitAgendaIndex(data);
  });
  socket.on("vote_start", function (agendaId) {
    setCurrentVotingAgenda(agendaId);
    setOpen(!open);
    setChangeIndex(true);
  });

  socket.on("vote_update", function (message, agendaId, agenda) {
    setVotingAgenda(agenda);
    setUpdateFlag(!updateFlag);
  });

  socket.on("vote_close", function (data) {
    setOpen(false);
  });
  socket.on("vote_reset", function (data) {
    setOpen(false);
    setVotingAgenda(null);
  });

  socket.on("disconnect", function () {
    setConnected(false);
  });

  const changeVoteView = async (param) => {
    if (state?.role == "admin") {
      setAdminOpen(!adminOpen);
    }
    setOpen(!open);
    const voteData = {
      user_id: state?.userId,
      agenda_id: agendas[selectedIndex]._id,
      decision: param,
    };

    console.log(
      "🚀 ~ file: MainScene.js:61 ~ changeVoteView ~ voteData:",
      voteData
    );
    socket.emit("vote_update", "message", agendas[selectedIndex]._id, voteData);
    if (!connected) {
      let res = await handleVote(voteData);
    }
  };

  const sendVoteStart = async () => {
    if (checkAgendaState() == 2) {
      toast("Voting already closed!");
      return;
    }
    const startVoteData = {
      agenda_item_id: agendas[selectedIndex]._id,
    };
    setStartedVote(startVoteData);
    await startVote(startVoteData);
    socket.emit(
      "vote_start",
      agendas[selectedIndex]._id,
      agendas[selectedIndex]
    );
  };

  const sendVoteClose = async () => {
    socket.emit("vote_update", "message", agendas[selectedIndex]._id);
    socket.emit(
      "vote_close",
      {
        yesNum: yesNum,
        noNum: noNum,
        abstrainedNum: abstrainedNum,
      },
      agendas[selectedIndex]._id
    );
    await closeVote(startedVote);
    setAdminOpen(false);
  };

  const sendVoteReset = async () => {
    const resetData = {
      agenda_id: agendas[selectedIndex]?._id,
    };
    await resetVote(resetData);
    setIsReset(!isReset);
    socket.emit("vote_update", "message");
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
      if (obj) {
        const key = obj.decision;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
      }
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
    const getAgendasAndUsers = async () => {
      const res = await getAgenda();
      setAgendas(res.data);
      setSelectedAgendaPdf(res.data[selectedIndex]._id);

      let tmp;
      if (
        res.data[selectedIndex]?.vote_info &&
        res.data[selectedIndex]?.vote_info !== "undefined"
      ) {
        tmp = JSON.parse(res.data[selectedIndex]?.vote_info);
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
        if (obj) {
          const key = obj.decision;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }
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
  }, [selectedIndex, isReset, connected]);
  useEffect(() => {
    if (changeIndex) {
      setSelectedIndex(
        agendas.findIndex((element) => element._id == currentVotingAgenda)
      );
      setChangeIndex(false);
    }
  }, [currentVotingAgenda]);
  const checkAgendaState = () => {
    return agendas[selectedIndex].vote_state;
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
  // const handleResultClose = () => {
  //   setResultOpen(false);
  // };
  // const getHeight = () => {
  //   return (
  //     window.innerHeight ||
  //     document.documentElement.clientHeight ||
  //     document.body.clientHeight
  //   );
  // };

  return (
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
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "17px",
                  marginTop: "-17px",
                  justifyContent: "space-between",
                }}
              >
                <FontAwesomeIcon icon={faUser} style={{ marginRight: "5px" }} />
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "17px",
                  }}
                >
                  {userName}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "17px",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: "5px", cursor: "pointer" }}
                    onClick={handleLogout}
                  />
                </span>
              </div>{" "}
              {agendas.map((item, index) => {
                return (
                  <CustomButton
                    key={index}
                    selected={index == selectedIndex}
                    index={index + 1}
                    locked={agendas[index].vote_state == 2}
                    name={item.name}
                    onClick={() => {
                      setSelectedIndex(index);
                      setChangeIndex(true);
                      setSelectedAgendaPdf(agendas[index]?._id);
                    }}
                  ></CustomButton>
                );
              })}
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
                <img src={ZoomSvg} width={60} height={60} />
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
        agenda={agendas?.at(emitAgendaIndex)}
        handleOpen={changeVoteView}
      />
      {/* <ResultAlert open={resultOpen} resultData={resultData} handleClose={handleResultClose} /> */}
    </div>
  );
}

import { useState } from "react";
import { getTvUsers } from "../../services/axios";
import "./tv.css";
import UserComponent from "../../components/UserComponent";
import { useEffect } from "react";
import { getAgenda2 } from "../../services/axios";
import { socket } from "../../utils/socket";
export default function LoginScene() {
  const [party, setParty] = useState([]);
  const [users, setUsers] = useState([]);
  const [yesNum, setYesNum] = useState(0);
  const [noNum, setNoNum] = useState(0);
  const [abstrainedNum, setAbstrainedNum] = useState(0);
  const [notVotedNum, setNotVotedNum] = useState(0);
  const [open, setOpen] = useState(false);
  const [agendaId, setAgendaId] = useState("");
  const [updateChange, setUpdateChange] = useState(false);
  const [agenda, setAgenda] = useState("");

  useEffect(() => {
    socket.on("live_voting_results", (agendaId) => {
      setAgendaId(agendaId);
    });
  }, []);

  socket.on("message", function (data) {
    setOpen(!open);
    setUpdateChange(!updateChange);
  });
  socket.on("vote_start", (id, agenda) => {
    setAgenda(agenda);
  });
  socket.on("vote_update", function (message, id, agenda) {
    setAgenda(agenda);
  });

  socket.on("vote_close", function (id, agenda) {
    setOpen(false);
    setAgendaId(id);
    setAgenda(agenda);
  });
  socket.on("vote_reset", function () {
    setAgenda(null);
  });
  useEffect(() => {
    if (agendaId) {
      const getdata = async () => {
        const res = await getAgenda2(agendaId);
        setAgenda(res.data);
      };
      getdata();
    }
  }, [agendaId]);
  useEffect(() => {
    const getUsers = async () => {
      const resp = await getTvUsers();
      const partyGroup2 = resp.data?.reduce((acc, obj) => {
        if (obj !== undefined && obj !== null) {
          const key = obj.party;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }
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
    const getAgenda = async () => {
      let tmp;
      if (agenda && agenda?.vote_info && agenda?.vote_info !== "undefined") {
        tmp = JSON.parse(agenda?.vote_info);
      }
      if (tmp == null) {
        setYesNum(0);
        setNoNum(0);
        setAbstrainedNum(0);
        setNotVotedNum(0);
        return;
      }
      const result = tmp?.reduce((acc, obj) => {
        if (obj !== null && obj !== undefined) {
          const key = obj?.decision;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(obj);
          return acc;
        }
        return acc;
      }, {});

      // Counting the number of objects for each decision
      const yes = result["1"] ? result["1"].length : 0;
      const no = result["0"] ? result["0"].length : 0;
      const ab = result["2"] ? result["2"].length : 0;

      // Setting the state variables
      setYesNum(yes);
      setNoNum(no);
      setAbstrainedNum(ab);
      setNotVotedNum(yes + no + ab);
    };
    getAgenda();
  }, [agenda]);

  const getDecisionFromAgenda = (userId, voteInfo) => {
    if (voteInfo == null) return 3;
    else {
      for (var i = 0; i < voteInfo.length; i++) {
        if (voteInfo[i]?.user_id === userId) {
          return voteInfo[i].decision;
        }
      }
      return 3;
    }
  };
  return (
    <div className="mt-4 ml-12 mr-12">
      <div className="text-center row justify-content-center">
        <div className="border border-dark p-4">
          <div
            className="mb-4 bold-title"
            style={{ fontWeight: "bold", fontSize: "50px" }}
          >
            {agenda?.name}
          </div>
          <div>
            <div className="flex flex-row w-full justify-around align-items-center bg-[#f5f5f5] rounded-[20px] p-[10px]">
              <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[80px] h-[80px] md:w-[80px] md:h-[80px] rounded-full bg-[#D9D9D9] border-[2px] border-[#5B5B5B] text-[#5B5B5B] text-2xl md:text-3xl font-bold">
                  {notVotedNum}
                </div>
                <div className="flex justify-center w-[20px] md:w-[50px] text-[12px] text-center break-words text-xl md:text-xxl font-bold mt-3">
                  Ukupno
                </div>
              </div>
              <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[80px] h-[80px] md:w-[80px] md:h-[80px] text-[white] rounded-full bg-[#4AD527] border-[#5B5B5B] text-2xl md:text-3xl font-bold">
                  {yesNum}
                </div>
                <div className="flex justify-center w-[20px] md:w-[50px] text-[12px] text-center break-words text-xl md:text-xxl font-bold mt-3">
                  ZA
                </div>
              </div>
              <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[80px] h-[80px] md:w-[80px] md:h-[80px] text-[white] rounded-full bg-[#377AFC] border-[#5B5B5B] text-2xl md:text-3xl font-bold">
                  {abstrainedNum}
                </div>
                <div className="flex justify-center w-[20px] md:w-[50px] text-[12px] text-center break-words text-xl md:text-xxl font-bold mt-3">
                  Suzdržano
                </div>
              </div>
              <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-[80px] h-[80px] md:w-[80px] md:h-[80px] text-[white] rounded-full bg-[#EF4343] border-[#5B5B5B] text-2xl md:text-3xl font-bold">
                  {noNum}
                </div>
                <div className="flex justify-center w-[20px] md:w-[50px] text-[12px] text-center break-words text-xl md:text-xxl font-bold mt-3">
                  Protiv
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col md:flex-row w-full gap-2 justify-between h-full mt-8 mb-4 ">
              {" "}
              {party?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col basis-1/2 bg-[#FFF] border-[2px] border-[#ccc] rounded-[8px] px-[20px] pt-[40px]"
                  >
                    <div className="" key={index}>
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
                                agenda?.vote_info
                                  ? JSON.parse(agenda?.vote_info)
                                  : 3
                              )}
                              name={userItem.name}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

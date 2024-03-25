import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../services/axios";
import { useAuth } from "../../authContext";
import "./tv.css";
import UserComponent from "../../components/UserComponent";
import { useEffect } from "react";
import {
  closeVote,
  getAgenda,
  getAgenda2,
  getUser,
  handleVote,
  resetVote,
  startVote,
} from "../../services/axios";
import { socket } from "../../utils/socket";
export default function LoginScene() {
  const [party, setParty] = useState([]);
  const [users, setUsers] = useState([]);
  const [yesNum, setYesNum] = useState(0);
  const [agendas, setAgendas] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [noNum, setNoNum] = useState(0);
  const [abstrainedNum, setAbstrainedNum] = useState(0);
  const [notVotedNum, setNotVotedNum] = useState(0);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [emitAgendaIndex, setEmitAgendaIndex] = useState(0);
  const [agendaName, setAgendaName] = useState("");
  const [selectedAgenda, setSelectedAgenda] = useState([]);
  const [agendaId, setAgendaId] = useState("");

  socket.on("message", function (data) {
    setEmitAgendaIndex(data);
    setOpen(!open);
  });

  socket.on("vote_update", function (data) {
    setAgendaId(data);
    setUpdateFlag(!updateFlag);
  });

  socket.on("vote_close", function (data) {
    setOpen(false);
  });
  useEffect(() => {
    if (agendaId) {
      const getdata = async () => {
        const res = await getAgenda2(agendaId);
        setAgendaName(res.data.name);
      };
      getdata();
    }
  }, [agendaId]);
  useEffect(() => {
    const getAgendasAndUsers = async () => {
      const userId = localStorage.getItem("userId");
      const resp = await getUser({ id: userId });

      // const partyGroup = Object.groupBy(resp.data, ({ party }) => party);
      // Object.values(partyGroup);
      // setParty(Object.keys(partyGroup));
      // setUsers(Object.values(partyGroup));

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
      const res = await getAgenda();
      setAgendas(res);
      //   console.log(res.data);
      let tmp;
      const data = res.data.findIndex((obj) => obj._id === agendaId);
      if (
        res.data[data]?.vote_info &&
        res.data[data]?.vote_info !== "undefined"
      ) {
        tmp = JSON.parse(res.data[data]?.vote_info);
      }
      setSelectedAgenda(tmp);
      if (tmp == null) {
        setYesNum(0);
        setNoNum(0);
        setAbstrainedNum(0);
        setNotVotedNum(0);
        return;
      }
      // const result = Object.groupBy(tmp, ({ decision }) => decision);
      // let yes = result["1"]?.length === undefined ? 0 : result["1"]?.length;
      // let no = result["0"]?.length === undefined ? 0 : result["0"]?.length;
      // let ab = result["2"]?.length === undefined ? 0 : result["2"]?.length;
      // setYesNum(yes);
      // setNoNum(no);
      // setAbstrainedNum(ab);
      // setNotVotedNum(yes + no + ab);
      const result = tmp?.reduce((acc, obj) => {
        const key = obj.decision;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(obj);
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
    getAgendasAndUsers();
  }, [selectedIndex, isReset, open, adminOpen, updateFlag]);
  const getDecisionFromAgenda = (userId, voteInfo) => {
    if (voteInfo == null) return 3;
    else {
      for (var i = 0; i < voteInfo.length; i++) {
        if (voteInfo[i].user_id == userId) {
          return voteInfo[i].decision;
        }
      }
      return 3;
    }
  };
  return (
    <div className="container-fluid main-box mt-4 ml-12 mr-12">
      <div className="text-center row justify-content-center">
        <div className="col-md-6 border border-dark p-4">
          <div className="mb-4 bold-title" style={{ fontWeight: "bold" }}>
            {agendaName}
          </div>
          <div>
            <div className="flex flex-row w-full justify-between bg-[#f5f5f5] rounded-[20px] p-[10px]">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full bg-[#D9D9D9] border-[2px] border-[#5B5B5B] text-[#5B5B5B]">
                  {notVotedNum}
                </div>
                <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                  In total
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#4AD527] border-[#5B5B5B] ">
                  {yesNum}
                </div>
                <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                  For
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#377AFC] border-[#5B5B5B] ">
                  {abstrainedNum}
                </div>
                <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                  Restrained
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#EF4343] border-[#5B5B5B] ">
                  {noNum}
                </div>
                <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                  Against
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
                                selectedAgenda
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

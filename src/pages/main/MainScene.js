import { useEffect, useState } from "react";
import { useAsyncError, useLocation } from "react-router-dom";
import { socket } from '../../utils/socket';
import VoteAlert from "../../components/VoteAlert";
import { closeVote, getAgenda, getUser, getVote, handleVote, resetVote, startVote } from "../../services/axios";
import { Button } from "@material-tailwind/react";
import OpenAlert from "../../components/OpenAlert";
import CloseAlert from "../../components/CloseAlert";
import CustomButton from "../../components/CustomButton";
import UserComponent from "../../components/UserComponent";
import { toast } from "react-toastify";
import ZoomSvg from '../../assets/Zoom.svg'
import ResultAlert from "../../components/ResultAlert";
import PdfViewer from "../../components/CustomPdfViewer";


export default function MainScene(props) {
    // const { navigation } = props;
    const { state } = useLocation();
    const [agendas, setAgendas] = useState([]);
    const [party, setParty] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emitAgendaIndex, setEmitAgendaIndex] = useState(0);
    const [open, setOpen] = useState(false)
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
    const [resultOpen, setResultOpen] = useState(false);
    const [resultData, setResultData] = useState({});
    const [height, setHeight] = useState(0)

    // useEffect(() => {
    //     setInterval(function greet() {
    //         socket.emit("vote_update", "message")
    //     }, 2000)
    // }, [])

    socket.on("message", function (data) {
        setEmitAgendaIndex(data)
        setOpen(!open)
    })

    socket.on("vote_update", function (data) {
        setUpdateFlag(!updateFlag)
    })

    socket.on("vote_close", function (data) {
        // setResultData(data)
        // setResultOpen(true);
        setOpen(false);
    })

    const changeVoteView = async (param) => {
        console.log("🚀 ~ file: MainScene.js:51 ~ changeVoteView ~ param:", param)
        if (state?.role == "admin") {
            setAdminOpen(!adminOpen)
        }
        setOpen(!open);
        const voteData = {
            user_id: state?.userId,
            agenda_id: agendas[emitAgendaIndex]._id,
            decision: param
        }
        console.log("🚀 ~ file: MainScene.js:61 ~ changeVoteView ~ voteData:", voteData)
        let res = await handleVote(voteData)
        socket.emit("vote_update", "message")
    }

    const sendVoteStart = async () => {
        // setAdminOpen(true);
        if (checkAgendaState() == 2) {
            toast("Voting already closed!")
            return
        }
        socket.emit("message", selectedIndex);
        const startVoteData = {
            agenda_item_id: agendas[selectedIndex]._id
        }
        setStartedVote(startVoteData);
        await startVote(startVoteData)
        socket.emit("vote_update", "message")
    }

    const sendVoteClose = async () => {
        socket.emit("vote_update", "message")
        socket.emit("vote_close", {
            yesNum: yesNum,
            noNum: noNum,
            abstrainedNum: abstrainedNum,
        })
        await closeVote(startedVote)
        setAdminOpen(false);
        // setTimeout(async () => {
        // }, 1000);
    }


    const sendVoteReset = async () => {
        const resetData = {
            agenda_id: agendas[selectedIndex]._id,
        }
        await resetVote(resetData);
        setIsReset(!isReset);
        socket.emit("vote_update", "message")
    }

    // 
    useEffect(() => {
        const getAgendasAndUsers = async () => {
            const userIdData = {
                id: state?.userId
            }
            const resp = await getUser(userIdData);

            const partyGroup = Object.groupBy(resp.data, ({ party }) => party);
            Object.values(partyGroup)
            setParty(Object.keys(partyGroup))
            setUsers(Object.values(partyGroup))

            const res = await getAgenda();
            setAgendas(res.data)
            let tmp
            if (res.data[selectedIndex]?.vote_info && res.data[selectedIndex]?.vote_info !== 'undefined') {
                tmp = JSON.parse(res.data[selectedIndex]?.vote_info)
            }
            setSelectedAgenda(tmp)
            if (tmp == null) {
                setYesNum(0)
                setNoNum(0)
                setAbstrainedNum(0)
                setNotVotedNum(0)
                return;
            }
            const result = Object.groupBy(tmp, ({ decision }) => decision);
            let yes = result["1"]?.length === undefined ? 0 : result["1"]?.length;
            let no = result["0"]?.length === undefined ? 0 : result["0"]?.length;
            let ab = result["2"]?.length === undefined ? 0 : result["2"]?.length;
            setYesNum(yes)
            setNoNum(no)
            setAbstrainedNum(ab)
            setNotVotedNum((yes + no + ab))
        }
        getAgendasAndUsers();
    }, [selectedIndex, isReset, open, adminOpen, updateFlag])




    const checkAgendaState = () => {
        return agendas[selectedIndex].vote_state
    }

    const getDecisionFromAgenda = (userId, voteInfo) => {
        if (voteInfo == null)
            return 3
        else {
            for (var i = 0; i < voteInfo.length; i++) {
                if (voteInfo[i].user_id == userId) {
                    return voteInfo[i].decision
                }
            }
            return 3;
        }
    }

    const handleResultClose = () => {
        setResultOpen(false)
    }
    const getHeight = () => {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    };
    useEffect(() => {
        console.log(getHeight())
    }, [])


    return (
        <div className="">
            <div className={`${isFullScreen ? 'p-[20px]' : 'p-[0px]'}  h-screen  w-full  bg-[#ddd]`} >
                <div className="flex flex-col md:flex-row w-full gap-2 justify-between h-full ">
                    {
                        isFullScreen && <div className='flex flex-col basis-1/4 bg-[#FFF] border-[2px] border-[#ccc] rounded-[8px] px-[20px] pt-[40px] overflow-y-auto'>
                            {
                                agendas.map((item, index) => {
                                    return (
                                        <CustomButton selected={index == selectedIndex} index={index + 1} locked={agendas[index].vote_state == 2} name={item.name} onClick={() => { setSelectedIndex(index) }} >
                                        </CustomButton>)
                                })
                            }
                        </div>
                    }
                    <div className={`${isFullScreen ? 'md:basis-2/4' : 'basis-full'} relative w-full h-[500px] md:h-full  bg-[#FFF] border-[2px] border-[#ccc] rounded-[8px]`} >
                        {/* <PdfViewerComponent className="h-full" document={"http://52.158.47.57:8080/api/pdf?agenda=" + selectedIndex} /> */}
                        <PdfViewer url={"http://52.158.47.57:8080/api/pdf?agenda=" + selectedIndex} />
                        <div className="absolute bottom-5 right-10">
                            <button onClick={() => {
                                setIsFullScreen(!isFullScreen)
                            }}>
                                <img src={ZoomSvg} width={60} height={60} />
                            </button>
                        </div>
                    </div>
                    {
                        isFullScreen &&
                        <div className="relative flex flex-col items-center basis-1/4  border-[2px] border-[#ccc] rounded-[8px] bg-[#fff]  p-[20px]">
                            <div className="flex flex-row w-full justify-between bg-[#f5f5f5] rounded-[20px] p-[10px]">
                                <div className="flex flex-col items-center">
                                    <div className='flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full bg-[#D9D9D9] border-[2px] border-[#5B5B5B] text-[#5B5B5B]'>
                                        {notVotedNum}
                                    </div>
                                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                                        Ukupno
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className='flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#4AD527] border-[#5B5B5B] '>
                                        {yesNum}
                                    </div>
                                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                                        Za
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className='flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#377AFC] border-[#5B5B5B] '>
                                        {abstrainedNum}
                                    </div>
                                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                                        Suzdržano
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className='flex items-center justify-center w-[40px] h-[40px] md:w-[60px] md:h-[60px] text-[white] rounded-full bg-[#EF4343] border-[#5B5B5B] '>
                                        {noNum}
                                    </div>
                                    <div className="w-[40px] md:w-[70px] text-[12px] text-center break-words">
                                        Protiv
                                    </div>
                                </div>

                            </div>

                            <div className="w-full overflow-y-auto">
                                {
                                    party?.map((item, index) => {
                                        return (
                                            <div className="w-full">
                                                <div className="text-[20px] text-[700] text-[#2E2E2E] text-center mt-[20px]">
                                                    {item}
                                                </div>
                                                <div className="w-full h-[4px] bg-[#D9D9D9] mt-[10px]">
                                                </div>
                                                <div className="w-full h-full flex flex-col">
                                                    {
                                                        users[index].map((userItem) => {
                                                            return (
                                                                <UserComponent decision={getDecisionFromAgenda(userItem._id, selectedAgenda)} name={userItem.name} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })

                                }

                            </div>
                            {state?.role == "admin" &&
                                <div className="w-full h-[120px]">

                                </div>
                            }
                            {
                                state?.role == "admin" &&
                                <div className='absolute bottom-0 flex flex-row gap-10 p-[10px] justify-between '>
                                    <Button className=' w-[120px] bg-[green] text-[12px]' onClick={sendVoteStart}>
                                        Otvori glasanje
                                    </Button>
                                    <Button className=' w-[120px] bg-[#f00] text-[12px]' onClick={sendVoteReset}>
                                        Resetiraj glasanje
                                    </Button>
                                </div>
                            }
                            <CloseAlert open={adminOpen} handleOpen={sendVoteStart} handleClose={sendVoteClose} />
                        </div>
                    }
                </div>
            </div>
            <VoteAlert open={open} agenda={agendas?.at(emitAgendaIndex)} handleOpen={changeVoteView} />
            {/* <ResultAlert open={resultOpen} resultData={resultData} handleClose={handleResultClose} /> */}
        </div >
    )
}
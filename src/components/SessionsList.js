import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

export default function SessionsList({
  sessions,
  setActive,
  setAgendas,
  openUpdateSession,
  deleteSession,
setSessionId,
setFromSession
}) {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  useEffect(() => {
    const pageNumber = Math.ceil(sessions.length / 10);
    setTotalPage(pageNumber);
  }, []);
  const handlePage = (btn) => {
    if (btn === "Next") {
      setPage(page + 1);
    } else {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  };
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = sessions.slice(indexOfFirstItem, indexOfLastItem);
  const TABLE_HEAD = ["Sr. No.", "Name", "View", "Action"];
  const handleAgendaList = (type, agendas,id,item) => {
    setAgendas(agendas);
    setActive(type);
    setSessionId(id)
    setFromSession(item?.id)
  };
  return (
    <Card>
      {" "}
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map((item, index) => {
              const isLast = index === sessions.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={item?.name}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      {/* <Avatar
                          src={img?img:""}
                          alt={item?.name}
                          size="md"
                          className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                        /> */}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {index + 1}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {item?.name}
                    </Typography>
                  </td>
                  <td
                    className={classes}
                    
                  >
                    <IconButton
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                        onClick={() => handleAgendaList("Agenda", item?.agendas,item?.id,item)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </IconButton>
                  </td>
                  {/* <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={status}
                          color={
                            status === "paid"
                              ? "green"
                              : status === "pending"
                              ? "amber"
                              : "red"
                          }
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-12 rounded-md border border-blue-gray-50 p-1">
                          <Avatar
                            src={
                              account === "visa"
                                ? "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/visa.png"
                                : "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/logos/mastercard.png"
                            }
                            size="sm"
                            alt={account}
                            variant="square"
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal capitalize"
                          >
                            {account.split("-").join(" ")} {accountNumber}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            {expiry}
                          </Typography>
                        </div>
                      </div>
                    </td> */}
                  <td className={classes}>
                    <Tooltip content="Edit User">
                      <IconButton
                       variant="small"
                        color="amber"
                        onClick={() => openUpdateSession(item)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete User">
                      <IconButton variant="small" className="ml-2" onClick={() => {deleteSession(item?.id)}} color="red">
                        <TrashIcon className="h-4 w-4"/>
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePage("Prev")}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
         {Array.from({length:totalPage},(_,index)=>index+1).map(page =>(
 <IconButton variant="outlined" size="sm">
            {page}
          </IconButton>
))}
        </div>
        <Button
          variant="outlined"
          size="sm"
          onClick={() => handlePage("Next")}
          disabled={page === totalPage}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

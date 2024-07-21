import { Tab } from "@headlessui/react";
import { CpuChipIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  IconButton,
  Input,
  Tabs,
  TabsHeader,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

export default function AgendaList({ agendas,openUpdateAgenda,deleteAgenda }) {
  const TABLE_HEAD = [
    "Sr.No.",
    "Name of agenda",
    "Description (optional)",
    "Type",
    "Document upload",
    "Action",
  ];
  console.log(agendas, "agenda");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
const [itemsPerPage,setItemsPerPage] = useState(10);
  useEffect(()=>{
  const pageNumber=Math.ceil(agendas.length/10);
  setTotalPage(pageNumber);

  },[]);
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

  const currentItems = agendas.slice(indexOfFirstItem, indexOfLastItem);
  console.log(page, "page");
const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pre Agenda",
    value: "pre_agenda",
  },
  {
    label: "Daily Agenda",
    value: "daily_agenda",
  },
];
  const TABLE_ROWS = [
    {
      img: "https://docs.material-tailwind.com/img/logos/logo-spotify.svg",
      name: "Spotify",
      amount: "$2,500",
      date: "Wed 3:00pm",
      status: "paid",
      account: "visa",
      accountNumber: "1234",
      expiry: "06/2026",
    },
    {
      img: "https://docs.material-tailwind.com/img/logos/logo-amazon.svg",
      name: "Amazon",
      amount: "$5,000",
      date: "Wed 1:00pm",
      status: "paid",
      account: "master-card",
      accountNumber: "1234",
      expiry: "06/2026",
    },
    {
      img: "https://docs.material-tailwind.com/img/logos/logo-pinterest.svg",
      name: "Pinterest",
      amount: "$3,400",
      date: "Mon 7:40pm",
      status: "pending",
      account: "master-card",
      accountNumber: "1234",
      expiry: "06/2026",
    },
    {
      img: "https://docs.material-tailwind.com/img/logos/logo-google.svg",
      name: "Google",
      amount: "$1,000",
      date: "Wed 5:00pm",
      status: "paid",
      account: "visa",
      accountNumber: "1234",
      expiry: "06/2026",
    },
    {
      img: "https://docs.material-tailwind.com/img/logos/logo-netflix.svg",
      name: "netflix",
      amount: "$14,000",
      date: "Wed 3:30am",
      status: "cancelled",
      account: "visa",
      accountNumber: "1234",
      expiry: "06/2026",
    },
  ];
  return (
    <Card>
       <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Agenda list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about Agenda
            </Typography>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Tab.Group value="all" className="w-full md:w-max">
            <Tab.List>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
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
            {currentItems?.map((item, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {index + 1}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes} >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal w-56"
                    >
                      {item?.name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal w-48"
                    >
                      {item?.description}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Chip
                        size="sm"
                        variant="ghost"
                        value={item?.agenda_type}
                        color={
                          item?.agenda_type === "pre_agenda"
                            ? "green"
                            : item?.agenda_type === "daily_agenda"
                            ? "amber"
                            : "red"
                        }
                      />
                    </div>
                  </td>
                  <td className={`${classes}col-2`}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal w-40 opacity-70"
                        >
                          {item?.pdf_path}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <Tooltip content="Edit User">
                      <IconButton variant="small"color="amber" onClick={() => {openUpdateAgenda(item)}}>
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="Delete User">
                      <IconButton variant="small" color="red"className="ml-2" onClick={() => deleteAgenda(item?._id)} >
                        <TrashIcon className="h-4 w-4" />
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
        <Button variant="outlined" size="sm" onClick={() => handlePage("Prev")} disabled={page===1}>
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <IconButton variant="outlined" size="sm">
            {page}
          </IconButton>
        </div>
        <Button variant="outlined" size="sm" onClick={() => handlePage("Next")} disabled={page === totalPage}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}

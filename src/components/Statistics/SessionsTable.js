import {  MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { sessionsList } from "../../services/axios";


export default function SessionsTable() {

  const TABLE_HEAD = ["Sr.No.", "Name", "Status" ];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsersList(page,search );
  }, [page,search]);

  const getUsersList = async (page,search) => {
    const resp = await sessionsList(page,search);
    setUsers(resp?.data);
    setTotalPage(resp?.totalPages);
    setPage(resp?.currentPage);
  };

  const handlePage = (btn) => {
    if (btn === "Next") {
      setPage(page + 1);
    } else {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  };

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Sessions list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about sessions
            </Typography>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* <Tab.Group value="all" className="w-full md:w-max">
            <Tab.List>
              {TABS.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  &nbsp;&nbsp;{label}&nbsp;&nbsp;
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group> */}
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
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
            {users?.map((item, index) => {
              const isLast = index === users.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";
                { console.log(item, 'items') }
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
                  <td className={classes}>
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
                      className="font-normal w-56"
                    >
                      {item?.status.toString()}
                    </Typography>
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
          <IconButton variant="outlined" size="sm">
            {page}
          </IconButton>
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

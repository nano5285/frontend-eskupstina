import { MagnifyingGlassIcon, ChevronDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Input,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { usersList } from "../../services/axios";

export default function UsersTable() {
  const TABLE_HEAD = ["Sr.No.", "Name", "Email", "City", "Party"];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [sortField, setSortField] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getUsersList(page, search, sortField);
  }, [page, search, sortField]);

  const getUsersList = async (page, search, sortField) => {
    const resp = await usersList(page, search, sortField);
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

  const handleSortFieldChange = (value) => {
    setSortField(value);
  };

  const openVotersModal = () => {
    setOpenModal(true);
  };
  const closeVotersModal = () => {
    setOpenModal(false);
  };

  return (
    <Card className="table_background">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="table-head mb-8 flex items-center justify-between gap-8">
          <div className="home-btn">
          <a href="#">Home</a>
            <div className="heading-inner">            
              <Typography variant="h5" color="blue-gray">
                Users list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about users
              </Typography>
            </div>            
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <Menu>
              <MenuHandler>
                <Button variant="outlined" className="flex items-center gap-2">
                  Sort
                  <ChevronDownIcon className="h-5 w-5" />
                </Button>
              </MenuHandler>
              <MenuList className="z-10 mt-2 w-40 origin-top-right bg-white shadow-2xl ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <MenuItem onClick={() => handleSortFieldChange("name")}>Name</MenuItem>
                  <MenuItem onClick={() => handleSortFieldChange("email")}>Email</MenuItem>
                  <MenuItem onClick={() => handleSortFieldChange("city")}>City</MenuItem>
                </div>
              </MenuList>
            </Menu>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD?.map((head) => (
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
                      className="font-normal w-48"
                    >
                      {item?.email}
                    </Typography>
                  </td>
                  <td className={`${classes} col-2`}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal w-40 opacity-70"
                        >
                          {item?.city}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={`${classes} col-2`}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal w-40 opacity-70"
                        >
                          {item?.party}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={`${classes} col-2`}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Button
                          className="ml-2 bg-blue-500 text-white rounded p-2"
                          onClick={() => openVotersModal()}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
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
      <Dialog open={openModal} onClose={closeVotersModal} fullWidth maxWidth="lg">
        <DialogBody
          divider
          style={{
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ flex: '1 1 auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {TABLE_HEAD?.map((head) => (
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
                          className="font-normal"
                        >
                          {item?.name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.city}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item?.party}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={closeVotersModal}
            className="text-red-500"
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

    </Card>
  );
}

import { faDisplay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import {
  faSignOutAlt,
  faUser,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../authContext";

const Navbar = ({ admin, superAdmin, sessions, sessionChange }) => {
  const navigate = useNavigate();

  // logout a user
  const { logout } = useAuth();
  const handleLogout = () => {
    navigate("/");
    logout();
    localStorage.clear();
  };


  return (
    <>
      <div>
        <header className="header-menu">
          <div className="side-bars">
            <Menu placement="bottom-start">
              <MenuHandler>
                <FontAwesomeIcon icon={faBars} className="cursor-pointer " />
              </MenuHandler>
              <MenuList>
                {sessions?.map((item) => (
                  <MenuItem
                    onClick={() => {
                      sessionChange(item);
                    }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
          <div className="menu-content mid-btns">
            <ul>
              <li onClick={() => navigate("/main")}>
                <a>Main</a>
              </li>
              {(admin || superAdmin) && (
                <li onClick={() => navigate("/admin")}>
                  <a href="#">Admin</a>
                </li>
              )}
              {superAdmin && (
                <li onClick={() => navigate("/super-admin")}>
                  <a href="#">Super Admin</a>
                </li>
              )}
              {(admin || superAdmin) && (
                <li onClick={() => navigate("/statistics")}>
                  <a href="#">Statistics</a>
                </li>
              )}
            </ul>
          </div>

          <div className="user-namee">
            <Menu placement="bottom-start">
              <MenuHandler>
                <span className="cursor-pointer ">
                  Dragan Miličević <FontAwesomeIcon icon={faUser} />
                </span>
              </MenuHandler>
              <MenuList>
                <MenuItem
                    onClick={() => {handleLogout()}}
                >
                 Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </header>
      </div>
    </>
  );
};

export default Navbar;

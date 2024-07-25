import { faDisplay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
    return(
        <div>                        
            <header className="header-menu">
                <div className="side-bars">
                    <p>faBars</p> 
                    
                </div>

                    <FontAwesomeIcon
                    // icon={faBars}
                    // onClick={toggleLogout}
                    className="cursor-pointer "
                     />
                <div className="menu-content mid-btns">
                    <ul>
                        <li>
                            <a href="#">Main</a>
                        </li>
                        <li>
                            <a href="#">Admin</a>
                        </li>
                        <li>
                            <a href="#">Super Admin</a>
                        </li>
                        <li>
                            <a href="#">Statistics</a>
                        </li>
                    </ul>
                </div>

                <div className="user-namee">
                    <h5>Dragan Miličević</h5>
                </div>
            </header>
            
        </div>
        
    )
}

export default Navbar;


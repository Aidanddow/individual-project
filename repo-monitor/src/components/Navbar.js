import { Link } from "react-router-dom";
import RepositorySearch from "../components/RepositorySearch"
import User from "../components/User"

let Navbar = (props) => {
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand application-name" href="#">
                <h4>
                    Repo-Monitor
                </h4>
            </a>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav ml-auto">

                    <li className="nav-item">
                        <Link to="/grid/1" className="nav-link">
                            Grid 1
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/grid/2" className="nav-link">
                            Grid 2
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/grid/3" className="nav-link">
                            Grid 3
                        </Link>
                    </li>

                    {/* <li className="navbar-search">
                        <RepositorySearch />
                    </li> */}

                    <li className="navbar-profile">
                        <Link to="/settoken" className="nav-link">
                            <User />
                        </Link>
                    </li>

                    
                </ul>
            </div>

            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
        </nav>
    )
}

export default Navbar
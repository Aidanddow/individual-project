import { Link } from "react-router-dom";
import RepositorySearch from "../components/RepositorySearch"

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
                    
                    <li className="nav-item active">
                        <Link to="/" className="nav-link" >
                            Home
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/repositorygrid" className="nav-link">
                            Grid
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link to="/settoken" className="nav-link">
                            Tokens
                        </Link>
                    </li>

                    <li className="navbar-search">
                        <RepositorySearch />
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
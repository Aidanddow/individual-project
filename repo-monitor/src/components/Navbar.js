import { Link } from "react-router-dom";
import RepositorySearch from "../components/RepositorySearch"
import User from "../components/User"
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from "react"

let Navbar = () => {
    
    const navigate = useNavigate()
    let [grids, setGrids] = useState(JSON.parse(localStorage.getItem("grid-names")))

    useEffect(() => {
        console.log("RUNNING")
        let gridNames = JSON.parse(localStorage.getItem("grid-names"))
        setGrids(gridNames)
        console.log("GridNames: ", gridNames)
    }, [])

    let addNewGrid = () => {
        let gridNames = JSON.parse(localStorage.getItem("grid-names"))
        const num = grids.length
        const gridName =`Grid ${num}`
        gridNames.push(gridName)
        localStorage.setItem("grid-names", JSON.stringify(gridNames))
        setGrids(gridNames)
        navigate(`/grid/${gridName}`)
    }
    
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <a className="navbar-brand application-name" href="#">
                <h4>
                    Repo-Monitor
                </h4>
            </a>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav ml-auto">
                    {
                        grids.map( (g) => (
                            <li className="nav-item">
                                <Link to={`/grid/${g}`} className="nav-link">
                                    {g}
                                </Link>
                            </li>
                        ))
                    }

                    {grids.length < 5?
                        <li className="nav-item">
                            <a onClick={() => addNewGrid()} className="nav-link">
                                +
                            </a>
                        </li>
                    : <></>
                    }
                    
                    
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
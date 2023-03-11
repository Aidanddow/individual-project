
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import ProfilePic from "./ProfilePic"

let Navbar = () => {
    
    const navigate = useNavigate()
    let [grids, setGrids] = useState( ["Untitled Grid 1"] )

    useEffect(() => {

        // Get list of grid names, if none, create a grid "Untitled Grid 1"
        let r = async () => {
            let gridNames = JSON.parse(localStorage.getItem("grid-names"))

            if (!gridNames) {
                gridNames = ["Untitled Grid 1"]
                localStorage.setItem("grid-names", JSON.stringify(gridNames))
            }
            setGrids(gridNames)
        }

        r()
    }, [])

    let addNewGrid = () => {
        let gridNames = JSON.parse(localStorage.getItem("grid-names"))
        const newGridName =`Untitled Grid ${grids.length + 1}`
        gridNames.push(newGridName)
        localStorage.setItem("grid-names", JSON.stringify(gridNames))
        setGrids(gridNames)
        navigate(`/grid/${newGridName}`)
    }
    
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <a className="navbar-brand application-name" href="/">
                <h4>
                    Repo-Monitor
                </h4>
            </a>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav ml-auto">
                    {
                        grids.map( (g, index) => (
                            <li className="nav-item" key={`Grid${index}`}>
                                <Link to={`/grid/${g}`} className="nav-link">
                                    {g}
                                </Link>
                            </li>
                        ))
                    }

                    {grids.length < 5?
                        <li className="nav-item" key="addNewGrid">
                            <a onClick={() => addNewGrid()} className="nav-link">
                                +
                            </a>
                        </li>
                    : <></>
                    }

                    <li className="navbar-profile" key="profilePic">
                        <Link to="/settoken" className="nav-link">
                            <ProfilePic />
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
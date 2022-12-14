
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useEffect } from "react"
import RepositorySearch from "../components/RepositorySearch"

let Home = () => {

    

    useEffect(() => {
        checkForToken()
    }, [])

    let checkForToken = () => {
        const pat = localStorage.getItem("pat")
        if (!pat) {
            // localStorage.setItem("pat", "glpat-N7BrBvPV3CqT2Unn1-Zh")
            navigate("/settoken")
        }
    }

    return (
        <div className="homepage">
        
            <h1 className="title">Go to a repository</h1>
            
            <RepositorySearch />
            
        </div>
    )
}

export default Home
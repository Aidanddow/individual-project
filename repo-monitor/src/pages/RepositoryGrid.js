
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"
import RepositoryPanel from "../components/RepositoryPanel";

let RepositoryGrid = () => {
    let [repos, setRepos] = useState([])
    let [id, setId] = useState([])
    
    useEffect(() => {
        setRepos([6119, 2412, 2413, 6030, 6029, 5967, 6270, 6030])
    }, [])

    let handleIdInputChange = (event) => {
        setId(event.target.value)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        setRepos([...repos, id])
        setId([null])
        console.log("REPOS: " + repos)
    }
    
    return (
        <div className="repository-grid container-fluid">
            <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                        <Link to="#" className="btn btn-outline-primary">Issues</Link>
                        </div>

                        <div className="col">
                            <h1 className="title">Commits</h1>
                        </div>

                        <div className="col">
                            <Link to="#" className="btn btn-outline-primary">PR's </Link>
                        </div>
                    </div>
                    <div className="row">

                        {repos.map((repo) => (
                            <div className="col">
                                <RepositoryPanel id={repo}/>
                            </div>
                        ))}
                        
                    </div>
                </div>
            </div>
            <div className="col-2"></div> 
            </div>


            <div className="enter-id">
                <form>
                    <input onSubmit={handleSubmit}
                        onChange={handleIdInputChange }
                        value={id}
                        placeholder="Add a Repository (ID)"
                        name="Repository ID"/>
                </form>
            
                <button onClick={handleSubmit} className="btn btn-primary gotorepo">Add</button>
            </div>
            
        </div>
        
    )
}

export default RepositoryGrid
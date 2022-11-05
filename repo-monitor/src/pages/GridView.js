
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"
import RepositoryGrid from "../components/RepositoryGrid";

let GridView = () => {
    let [repos, setRepos] = useState([])
    let [request, setRequest] = useState("")
    let [newID, setNewID] = useState([])
    
    useEffect(() => {
        setRepos([6119, 2412, 2413, 6030, 6029, 5967, 6270, 6030])
        setRequest("repository/commits")
    }, [])

    let handleIdInputChange = (event) => {
        setNewID(event.target.value)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        setRepos([...repos, newID])
        setNewID([null])
        console.log("REPOS: " + repos)
    }

    let showIssues = event => {
        setRequest("issues")  
    }
    let showCommits = event => {
        setRequest("commits")  
    }
    
    return (
        <div className="repository-grid container-fluid">
            <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
                <div className="container-fluid">
                    
                    <div className="row">
                        <div className="col">
                            <button onClick={showIssues} className="btn btn-outline-primary">
                                Issues
                            </button>

                            <button onClick={showCommits} className="btn btn-outline-primary">
                                Commits
                            </button>

                            <button onClick={() => {console.log(request)}} className="btn btn-outline-primary">Show Request</button>
                        </div>

                        <div className="col">
                            <h1 className="title">Commits</h1>
                        </div>

                    </div>
                    
                  
                    <RepositoryGrid request={request} repos={repos}/>
                 

                </div>
            </div>
            <div className="col-2"></div> 
            </div>


            <div className="enter-id">
                <form>
                    <input onSubmit={handleSubmit}
                        onChange={handleIdInputChange }
                        value={newID}
                        placeholder="Add a Repository (ID)"
                        name="Repository ID"/>
                </form>
            
                <button onClick={handleSubmit} className="btn btn-primary gotorepo">Add</button>
            </div>
            
        </div>
        
    )
}

export default GridView
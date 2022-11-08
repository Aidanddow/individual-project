
import { useEffect, useState } from "react"
import RepositoryGrid from "../components/RepositoryGrid";

let GridView = () => {
    let [repos, setRepos] = useState([])
    let [request, setRequest] = useState("")
    let [requests, setRequests] = useState(new Map())
    let [newID, setNewID] = useState([])
    
    useEffect(() => {
        let reqs = new Map()
        reqs.set("Commits", "repository/commits")
        reqs.set("Issues", "issues")
        reqs.set("Branches", "repository/branches")
        reqs.set("Merge Requests", "merge_requests")
        setRequests(reqs)

        const initialRepos = JSON.parse(localStorage.getItem("ids"))
        setRepos(initialRepos)
        
        setRequest("repository/commits")
    }, [])

    useEffect(() => {
        localStorage.setItem("ids", JSON.stringify(repos))
    }, [repos])

    let handleIdInputChange = (event) => {
        setNewID(event.target.value)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        setRepos([...repos, newID])
        setNewID([null])
        
        console.log("REPOS: " + repos)
    }
    
    return (
        <div className="repository-grid container-fluid">
            <div className="row">
            <div className="col-2"></div>

            <div className="col-8">
                <div className="container-fluid">
                    
                    <div className="row">
                        <h1 className="title">Repository Grid</h1>
                    </div>

                    <div className="row">
                        <div className="col">

                            {[...requests.keys()].map((name) => (
                                <button onClick={() => {setRequest(requests.get(name)) }} 
                                className={`btn btn-outline-primary 
                                    ${request===requests.get(name) && "active"}`}>
                                        {name}
                                </button>
                            ))}

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
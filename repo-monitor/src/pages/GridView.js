
import { useEffect, useState } from "react"
import RepositoryGrid from "../components/RepositoryGrid";

let GridView = () => {
    let [repos, setRepos] = useState([])
    let [request, setRequest] = useState("")
    let [requests, setRequests] = useState(new Map())

    let [periods, setPeriods] = useState(new Map())
    let [period, setPeriod] = useState(new Date())
    let [newID, setNewID] = useState([])
    
    useEffect(() => {
        let reqs = new Map()
        reqs.set("Commits", "repository/commits")
        reqs.set("Issues", "issues")
        reqs.set("Branches", "repository/branches")
        reqs.set("Merge Requests", "merge_requests")
        setRequests(reqs)

        let periods = new Map()
        const now = new Date();
        periods.set("1 Week", new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7))
        periods.set("1 Month", new Date(now.getFullYear(), now.getMonth()-1, now.getDate()))
        periods.set("1 Year", new Date(now.getFullYear()-1, now.getMonth(), now.getDate()))
        periods.set("All-Time", new Date(now.getFullYear()-50, now.getMonth(), now.getDate()))
        setPeriods(periods)

        const initialRepos = JSON.parse(localStorage.getItem("ids"))
        setRepos(initialRepos)
        
        setRequest("repository/commits")
        setPeriod(periods.get("All-Time"))
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

                        <div className="col">
                            {[...periods.keys()].map((name) => (
                                <button onClick={() => {setPeriod(periods.get(name)) }} 
                                className={`btn btn-outline-primary 
                                    ${period===periods.get(name) && "active"}`}>
                                        {name}
                                </button>
                            ))}
                        </div>

                    </div>
                    
                  
                    <RepositoryGrid request={request} repos={repos} period={period}/>
                 

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
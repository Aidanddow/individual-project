
import { useEffect, useState } from "react"
import RepositoryGrid from "../components/RepositoryGrid";
import RepositoryList from "../components/RepositoryList";


let GridView = () => {
   
    let [repos, setRepos] = useState([])
    let [request, setRequest] = useState("")
    let [showHeaders, setShowHeaders] = useState(false)

    const [requests] = useState(new Map([
        ["Commits", "repository/commits"],
        ["Issues", "issues"],
        ["Merge Requests", "merge_requests"],
        ["Pipeline Passes", "pipelines"],
        ["Last Commit (Days)", "last-commit"]
    ]))

    const now = new Date();
    let [periods, setPeriods] = useState(new Map([
        ["1 Week", new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)],
        ["1 Month", new Date(now.getFullYear(), now.getMonth()-1, now.getDate())],
        ["3 Months", new Date(now.getFullYear(), now.getMonth()-3, now.getDate())],
        ["1 Year", new Date(now.getFullYear()-1, now.getMonth(), now.getDate())],
        ["All-Time", new Date(now.getFullYear()-50, now.getMonth(), now.getDate())],
    ]))
                                                
    // let [periods, setPeriods] = useState(new Map())
    let [period, setPeriod] = useState(new Date())
    let [newID, setNewID] = useState([])
    
    useEffect(() => {

        let r = async () => {
            const initialRepos = await JSON.parse(localStorage.getItem("ids"))
            if (!initialRepos) {
                localStorage.setItem("ids", "[]")
                initialRepos = []
            }
            setRepos(initialRepos)
            setRequest("repository/commits")
            setPeriod(periods.get("1 Week"))
        }

        r()
        
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
    }

    let clearGrid = () => {
        localStorage.setItem("ids", "[]")   
        setRepos([])
    }

    let handleChange = (event) => {
        setPeriod(new Date(event.target.value))
    }

    let toggleHeader = () => {
        setShowHeaders(!showHeaders)
    }

    return (
        <div className="repository-grid container-fluid">
            
            <div className="repoGrid">
            <div className="row">

            <div className="col-9">
                <div className="container-fluid">
                    
                    <div className="row">
                        <h1 className="title">Repository Grid</h1>
                    </div>

                    <div className="row">
                        <div className="col-8">

                            {[...requests.keys()].map((name) => (
                                <button onClick={() => {setRequest(requests.get(name)) }} 
                                className={`btn btn-outline-primary 
                                    ${request===requests.get(name) && "active"}`}>
                                        {name}
                                </button>
                            ))}
                        </div>

                        <div className="col-2">
                            <select id="dropdown" onChange={handleChange} class="form-select" aria-label="Default select example">
                                {[...periods.keys()].map((name) => (
                                    <option value={periods.get(name)}>{name}</option>
                                ))}


                            
                            </select>
                        </div>

                        <div className="col-2">
                            <button onClick={() => toggleHeader()} className="btn btn-outline-primary">Toggle Headers</button>
                            <button onClick={() => clearGrid()} className="btn btn-outline-danger">Clear Grid</button>
                        </div>

                    </div>
                            
                   

                    {repos.length != 0 ? 
                        <RepositoryGrid request={request} repos={repos} period={period} showHeaders={showHeaders}/> 
                    : 
                    <div className="no-repos">
                        <h3>
                            You currently have no repositories in the grid!
                        </h3>
                        <h5>
                            Add repository by ID, or by search!
                        </h5>
                        </div>
                    }   

                    </div>
            </div>
            <div className="col-3">
                <RepositoryList gridRepos={repos} setGridRepos={setRepos}/>
            </div> 
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
    
      
        </div>
        
    )
}

export default GridView
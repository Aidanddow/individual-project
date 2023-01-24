
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import RepositoryGrid from "../components/RepositoryGrid";
import RepositoryList from "../components/RepositoryList";

let GridView = () => {
   
    const navigate = useNavigate()
    let [repos, setRepos] = useState([])
    let [showHeaders, setShowHeaders] = useState(false)

    const requestsArr = [
        { name: "Commits", endpoint: "repository/commits" },
        { name: "Merge Requests", endpoint: "merge_requests" },
        { name: "Open Issues", endpoint: "issues" },
        { name: "Merge Comments", endpoint: "merge_comments", },
        { name: "Pipeline Passes", endpoint: "pipelines" },
        { name: "Last Commit (Days)", endpoint: "last-commit" },
    ]

    const [requests] = useState(requestsArr)

    let [metric, setMetric] = useState(requestsArr[0])
    let [stats, setStats] = useState([])

    const now = new Date();
    let [periods] = useState(new Map([
        ["1 Week", new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)],
        ["1 Month", new Date(now.getFullYear(), now.getMonth()-1, now.getDate())],
        ["3 Months", new Date(now.getFullYear(), now.getMonth()-3, now.getDate())],
        ["1 Year", new Date(now.getFullYear()-1, now.getMonth(), now.getDate())],
        ["All-Time", new Date(now.getFullYear()-50, now.getMonth(), now.getDate())],
    ]))
                                                
    let [period, setPeriod] = useState(new Date())
    
    useEffect(() => {

        checkForToken()

        let r = async () => {
            const initialRepos = await JSON.parse(localStorage.getItem("ids"))
            if (!initialRepos) {
                localStorage.setItem("ids", "[]")
            }
            setRepos(initialRepos)
            setPeriod(periods.get("1 Week"))
        }
        r()
    }, [])

    useEffect(() => {
        localStorage.setItem("ids", JSON.stringify(repos))
    }, [repos])

    let checkForToken = () => {
        const pat = localStorage.getItem("pat")
        if (!pat) {
            navigate("/settoken")
        }
    }

    let clearGrid = () => {
        localStorage.setItem("ids", "[]")   
        setRepos([])
    }

    let sortRepos = async (alg) => {
        console.log("REPOS BEFORE: ", repos)
        let sortedRepos = [...repos]
            .map((id, index) => [id, stats[index] ? stats[index]: 0] )
            .sort( alg )
        
        console.log(sortedRepos)

        // console.log("REPOS SORTED: ", sortedRepos)
        setStats( (stats) => sortedRepos.map(a => a[1]))
        setRepos( (repos) => sortedRepos.map(a => a[0]))
        console.log("REPOS AFTER: ", sortedRepos.map(a => a[0]))
    }

    return (
        <div className="repository-grid container-fluid">
            
            <div className="row">

                <div className="col-9 griddd">
                    <div className="">
                        
                        <div className="row">
                            <div className="col-4">
                                <h1 className="title set-grid-name">Untitled Grid</h1>
                            </div>

                            <div className="col-8">
                                <ul className="options-list">
                                    <li className="option-button">
                                        <button onClick={() => setShowHeaders(!showHeaders)} className="btn btn-outline-primary">Toggle Headers</button>
                                    </li>

                                    <li className="option-button">
                                        <button onClick={() => sortRepos((a, b) => a[1] > b[1])} className="btn btn-outline-primary">Sort Asc</button>
                                    </li>

                                    <li className="option-button">
                                        <button onClick={() => sortRepos((a, b) => a[1] < b[1])} className="btn btn-outline-primary">Sort Desc</button>
                                    </li>
                                
                                    <li className="option-button">
                                        <button onClick={() => clearGrid()} className="btn btn-outline-danger">Clear Grid</button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="row metric-buttons">
                            <div className="col-10">

                                {requests.map(req => (
                                    <button onClick={() => {setMetric(req) }} 
                                        className={`metric-button
                                        ${metric===req && "active"}`}>
                                            {req.name}
                                    </button>
                                ))}
                            </div>

                            <div className="col-2">
                                <select id="dropdown" onChange={(event) => setPeriod(new Date(event.target.value))} class="form-select" aria-label="Default select example">
                                    {[...periods.keys()].map((name) => (
                                        <option value={periods.get(name)}>{name}</option>
                                    ))}

                                </select>
                            </div>

                        </div>
                                
                        {repos.length !== 0 ? 
                            <div className="animate">
                            <RepositoryGrid 
                                metric={metric}
                                repos={repos}
                                period={period}
                                showHeaders={showHeaders}
                                stats={stats}
                                setStats={setStats}
                                setRepos={setRepos}
                            /> 
                            </div>
                        : 
                        <div className="no-repos animate">
                            <h3>
                                You currently have no repositories in the grid!
                            </h3>
                            <h5>
                                Add repositories by searching!
                            </h5>
                        </div>
                        }   

                        </div>
                </div>
            
                <div className="col-3">
                    <RepositoryList gridRepos={repos} setGridRepos={setRepos}/>
                </div> 
            </div>
        
    
        </div>
        
    )
}

export default GridView
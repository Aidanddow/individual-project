
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import RepositoryGrid from "../components/RepositoryGrid";
import RepositoryList from "../components/RepositoryList";


let Metric = class {

    constructor(name, endpoint, bound) {
        this.name = name
        this.endpoint = endpoint
        this.bound = 1
    }

    lowerBound = (period) => {
        return this.bound
    }
}

let TimedMetric = class extends Metric {

    lowerBound = (period) => {
        let numWeeks = Math.floor((new Date() - period) / (1000*60*60*24*7))
        console.log("PERIOD: ", numWeeks)
        numWeeks = numWeeks % 26
        return this.bound * numWeeks
    }


    
}

let GridView = () => {
   
    const navigate = useNavigate()
    let [repos, setRepos] = useState([])
    let [showHeaders, setShowHeaders] = useState(false)

    const [requests] = useState([
        new TimedMetric("Commits", "repository/commits", 1),
        new TimedMetric("Merge Requests", "merge_requests", 1),
        new Metric("Open Issues", "issues", 1),
        new TimedMetric("Merge Comments", "merge_comments", 10),
        new Metric("Pipeline Passes", "pipelines", 1),
        new Metric("Last Commit (Days)", "last-commit", 7),
    ])

    let [metric, setMetric] = useState(new TimedMetric("Commits", "repository/commits"),)

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
    
    useEffect(() => {

        checkForToken()

        let r = async () => {
            const initialRepos = await JSON.parse(localStorage.getItem("ids"))
            if (!initialRepos) {
                localStorage.setItem("ids", "[]")
                initialRepos = []
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
                        <div className="col-8">
                            <h1 className="title set-grid-name">Untitled Grid</h1>
                        </div>
                        
                        <div className="col-2">
                        <button onClick={() => toggleHeader()} className="btn btn-outline-primary">Toggle Headers</button>
                        </div>
                        
                        <div className="col-2">
                            <button onClick={() => clearGrid()} className="btn btn-outline-danger">Clear Grid</button>
                        </div>
                    </div>

                    <div className="row">
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
                            <select id="dropdown" onChange={handleChange} class="form-select" aria-label="Default select example">
                                {[...periods.keys()].map((name) => (
                                    <option value={periods.get(name)}>{name}</option>
                                ))}


                            
                            </select>
                        </div>

                  

                    </div>
                            
                   
                    {repos.length != 0 ? 
                        <div className="animate">
                        <RepositoryGrid metric={metric} repos={repos} period={period} showHeaders={showHeaders}/> 
                        </div>
                    : 
                    <div className="no-repos">
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
    
        </div>
        
    )
}

export default GridView
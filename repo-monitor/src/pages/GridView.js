
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import RepositoryGrid from "../components/RepositoryGrid";
import RepositoryList from "../components/RepositoryList";

let GridView = () => {
   
    let { id } = useParams()
    if (!id) id = 1
    const grid = `grid${id}`
    const navigate = useNavigate()
    let [repos, setRepos] = useState([])
    let [showHeaders, setShowHeaders] = useState(false)
    let [avgStat, setAvgStat] = useState(null)

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

    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);

    let [periods] = useState(new Map([
        ["1 Week", new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)],
        ["1 Month", new Date(now.getFullYear(), now.getMonth()-1, now.getDate())],
        ["3 Months", new Date(now.getFullYear(), now.getMonth()-3, now.getDate())],
        ["1 Year", new Date(now.getFullYear()-1, now.getMonth(), now.getDate())],
        ["All-Time", new Date(now.getFullYear()-50, now.getMonth(), now.getDate())],
        ["Start of Week", prevMonday],
    ]))
                                                
    let [period, setPeriod] = useState(new Date())
    
    useEffect(() => {

        checkForToken()

        let r = async () => {
            const initialRepos = await JSON.parse(localStorage.getItem(grid))
            if (!initialRepos) {
                localStorage.setItem(grid, "[]")
            }
            setRepos(initialRepos)
            setPeriod(periods.get("1 Week"))
        }
        r()
    }, [])

    useEffect(() => {
        localStorage.setItem(grid, JSON.stringify(repos))
    }, [repos])

    useEffect(() => {
        let ids = localStorage.getItem(grid)
        if (!ids) {
            localStorage.setItem(grid, "[]")
            ids = []
        }
        setRepos(ids)
    }, [id])

    useEffect(() => {

        if (metric.endpoint == "pipelines") return

        let tot = 0
        
        stats
            .filter(s => typeof(s) == typeof(1))
            .forEach(s => tot+=s)

        let numFilled = stats.filter(s => s != null).length
        
        if (numFilled == 0) numFilled = 1

        console.log("TOTAL: ", tot)
        console.log("AVG: ", tot/numFilled)

        setAvgStat(tot / numFilled)
    }, [stats, setStats, metric, period])

    useEffect(() => {
        // Set the average stat to 10, in case average calculation fails
        setAvgStat(10)
    }, [metric])

    let checkForToken = () => {
        const pat = localStorage.getItem("pat")
        if (!pat) {
            navigate("/settoken")
        }
    }

    let clearGrid = () => {
        localStorage.setItem(grid, "[]")   
        setRepos([])
    }

    let sortRepos = async (alg) => {
        console.log("REPOS BEFORE: ", repos.map((id, index) => stats[index]))
        
        let sortedRepos = [...repos]
            .map((id, index) => [id, stats[index] ? stats[index]: 0] )
            .sort( alg )

        setStats( (stats) => sortedRepos.map(a => a[1]))
        setRepos( (repos) => sortedRepos.map(a => a[0]))
        console.log("REPOS AFTER: ", sortedRepos.map(a => a[0]))
    }

    let sortAsc = (a,b) => {
        if (a[1]>b[1]) return 1
        else if (a[1]<b[1]) return -1
        else return 0
    }

    let sortDsc = (a,b) => {
        return -1 * sortAsc(a,b)
    }

    return (
        <div className="repository-grid container-fluid">
            
            <div className="row">

                <div className="col-9 griddd">
                    <div className="">
                        
                        <div className="row">
                            <div className="col-4">
                                <h2 className="title set-grid-name">Untitled Grid {id}</h2>
                            </div>

                            <div className="col-8">
                                <ul className="options-list">
                                    <li className="option-button">
                                        <button onClick={() => setShowHeaders(!showHeaders)} className="btn btn-outline-primary">Toggle Headers</button>
                                    </li>

                                    <li className="option-button">
                                        <button onClick={() => sortRepos(sortAsc)} className="btn btn-outline-primary">Sort Asc</button>
                                    </li>

                                    <li className="option-button">
                                        <button onClick={() => sortRepos(sortDsc)} className="btn btn-outline-primary">Sort Desc</button>
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
                                <select id="dropdown" onChange={(event) => setPeriod(new Date(event.target.value))} className="form-select" aria-label="Default select example">
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
                                avgStat={avgStat}
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
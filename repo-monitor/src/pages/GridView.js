
import { useEffect, useState } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import RepositoryGrid from "../components/RepositoryGrid";
import RepositoryList from "../components/RepositoryList";

let GridView = () => {
   
    const navigate = useNavigate()

    let { id } = useParams()
    if (!id) id = "Untitled Grid"

    let [gridName, setGridName] = useState(id)
    let [updatedGridName, setUpdatedGridName] = useState(id)

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
        checkGrids()

        let r = async () => {
            const initialRepos = await JSON.parse(localStorage.getItem(gridName))
            if (!initialRepos) {
                localStorage.setItem(gridName, "[]")
            }
            setRepos(initialRepos)
            setPeriod(periods.get("1 Week"))
        }
        r()
    }, [])

    useEffect(() => {
        localStorage.setItem(gridName, JSON.stringify(repos))
    }, [repos])

    useEffect(() => {
        setRepos([])

        const name = id
        setGridName(name)
        
        let ids = JSON.parse(localStorage.getItem(name))

        if (!ids) {
            localStorage.setItem(name, "[]")
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

    let getDefaultGrid = () => {
        console.log("Getting Default")
        let names = JSON.parse(localStorage.getItem("grid-names"))
        if (!names) {
            localStorage.setItem("grid-names", '["Untitled Grid"]')
            navigate(`/grid/Untitled%20Grid`)
        }
        navigate(`/grid/${names[0]}`)
    }
    let checkForToken = () => {
        const pat = localStorage.getItem("pat")
        if (!pat) {
            navigate("/settoken")
        }
    }

    let checkGrids = () => {
        const grids = JSON.parse(localStorage.getItem("grid-names"))

        if (!grids) {
            localStorage.setItem("grid-names", "['Untitled Grid']")
        }
    }

    let clearGrid = () => {
        localStorage.setItem(gridName, "[]")   
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

    let updateGridName = () => {
        // Replace old grid name in grid names array with new one
        let gridNames = JSON.parse(localStorage.getItem("grid-names"))
        gridNames = gridNames.map(n => n === gridName ? updatedGridName : n)
        localStorage.setItem("grid-names", JSON.stringify(gridNames))

        // Replace old grid name key with new grid name
        let grid = JSON.parse(localStorage.getItem(gridName))
        localStorage.setItem(updatedGridName, JSON.stringify(grid))
        localStorage.removeItem(gridName)

        setGridName(updatedGridName)
        navigate(`/grid/${updatedGridName}`)
        
        window.location.reload(false);
    }

    return (
        <div className="repository-grid container-fluid">
            
            <div className="row">

                <div className="col-lg-9 gridd">
                        
                        <div className="row">
                            <div className="col-md-4">
                                <div className="row">
                                    
                                        <h2 className="title set-grid-name" 
                                            contentEditable="true" 
                                            onInput={e => setUpdatedGridName(e.currentTarget.textContent)}
                                        >
                                            {gridName}
                                        </h2>
                             
                                  
                                </div>
                            </div>

                            <div className="col-md-8">
                                <ul className="options-list">
                                    {updatedGridName !== gridName ?
                                    <li className="option-button">
                                        <button onClick={() => updateGridName()}className="btn btn-outline-primary">Update Name</button>
                                    </li>
                                    : <></>
                                    }
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
                            <div className="col-sm-10">

                                {requests.map(req => (
                                    <button onClick={() => {setMetric(req) }} 
                                        className={`metric-button
                                        ${metric===req && "active"}`}>
                                            {req.name}
                                    </button>
                                ))}
                            </div>

                            <div className="col-sm-2">
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
            
                <div className="col-lg-3 padd">
                    <RepositoryList gridRepos={repos} setGridRepos={setRepos}/>
                </div> 
            </div>
        
    
        </div>
        
    )
}

export default GridView
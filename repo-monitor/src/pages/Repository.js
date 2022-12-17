
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { fetchData, getJsonData, getUrl, fetchUrl, fetchSearch, getDaysSinceCommit } from "../utils.js"


let Developer = class {

    constructor(name) {
        this.name = name
        this.commits = 0
        this.lastCommitDate = ""
    }

    addCommit = (commit) => {
        this.commits ++
        
        if (this.lastCommitDate == ""){
            this.lastCommitDate = commit.created_at
        }
        
        return this
        // "2022-04-04T11:06:11.000+01:00"
    }

    // get getName() {
    //     return this.name
    // }

    getLastCommitDate = () => {
        return new Date(this.lastCommitDate)
    }

    // get numCommits() {
    //     return this.commits
    // }


}

let Repository = () => {

    const { id } = useParams()
    let [loading, setLoading] = useState(true)
    let [repoInfo, setRepoInfo] = useState([])
    let [commits, setCommits] = useState([])
    let [commitsLoaded, setCommitsLoaded] = useState(false)
    let [issues, setIssues] = useState([])
    let [curPage, setCurPage] = useState(0)
    let [developers, setDevelopers] = useState(new Map())
    
    useEffect(() => {
        /* Defining an async function allows await to be used in useEffect */
        let r = async () => {
            getRepoIssues(id)
            console.log("I've been called")
            getRepoInfo(id)
            await getRepoCommits(id)
            setLoading(false)
        }

        r()

        // let d = new Developer("Aidan Dow")
    }, [])

    useEffect(() => {
        getDevelopers()
    }, [loading])

    let getRepoInfo = async (id) => {
        let dataJson = await getJsonData(id, "")
        setRepoInfo(dataJson)
    }

    let getRepoCommits = async (id) => {
        let data = await getJsonData(id, `repository/commits?with_stats=yes&page=1&per_page=100`)
        let newData
        let i = 2
        
        do { 
            data = data.concat(newData)
            setCommits([...data])

            i++
            newData = await getJsonData(id, `repository/commits?with_stats=yes&page=${i}`)
            
        } while (!(Object.keys(newData).length === 0))

        setCommits(data.filter((commit) => commit != null))
    }


    let getRepoIssues = async (id) => {
        console.log("get issues")
        let data = await getJsonData(id, `issues?page=1&per_page=20`)
        console.log("DATAAA: " )
        console.table(data)
        let newData
        let i = 2
        
        do { 
            data = data.concat(newData)
            setIssues([...data])

            i++
            newData = await getJsonData(id, `issues?page=${i}&per_page=20`)
            
        } while (!(Object.keys(newData).length === 0))

        setIssues(data.filter((issue) => issue != null))
    }

    let getDevelopers = () => {
        let devsMap = new Map()
        
        commits.forEach((commit) => {
            let dev = commit.author_name
            
            if (!devsMap.has(dev)) {
                let a = new Developer( dev );
                devsMap.set(dev, a)
            }

            let d = devsMap.get(dev)
            console.log("DEV: ", d)
            d.addCommit(commit)
        })

        setDevelopers(devsMap)
        console.log("Devsmap: ", devsMap)
    }

    let formatTime = (timeStr) => {
        return timeStr.substring(0,10)
    }

    let truncateMessage = (message, length) => {
        return message.substring(0, length) + "..."
    }

    return (
        <div className="repo-info container-fluid">
           
            <h1 className="title">Repository - {repoInfo.name_with_namespace}</h1>
            

            <div className="row">
                <div className="col-5">
                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>Developers</th> 
                        <th>Commits</th>
                        <th>Contribution %</th>
                        <th>Last Commit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? 
                        <tr><td>Loading...</td><td></td><td></td><td></td></tr> : 
                
                    [...developers.keys()].sort()
                        .map(dev => developers.get(dev))
                        .map((developer, index) => (
                            <tr>
                                <td>
                                    {developer.name}
                                </td>

                                <td>
                                    {developer.commits}
                                </td>

                                <td>
                                    {(100 * developer.commits / commits.length).toFixed(1)}%
                                </td>

                                <td>
                                    {getDaysSinceCommit(developer.lastCommitDate)} days ago
                                </td>
                                
                            </tr>
                    ))
                }
                    </tbody>

                </table>
                </div> 


                <div className="col-2">
                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>Issues</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? 
                        <tr><td>Loading...</td></tr> : 
                        <tr><td>{issues.length}</td></tr>
                    }
                    </tbody>

                </table>
                </div> 
            </div>
            

            <h2>Commits</h2>
            
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>Created</th>
                        <th>Author</th>
                        <th>Message</th>
                        <th>Changes</th>
                        <th>Code</th>
                    </tr>
                </thead>
                
                <tbody>
                {commits.filter((commit) => {
                        return (commit != null) 
                          
                    }).map((commit, index) => (
                        
                        <tr>
                            <td key={`time${index}`}>
                                { formatTime(commit.created_at)}
                            </td>
                            
                            <td key={`name${index}`}>
                                { commit.author_name }
                            </td>

                            
                            <td key={`msg${index}`}>
                                <Link to={`/repository/${id}/commit/${commit.id}`} className="commit-table-row">
                                    { truncateMessage(commit.message, 80) }
                                </Link>
                            </td>

                            <td key={`stats${index}`}>{ commit.stats.total }</td>
                            <td key={`id${index}`}>{ truncateMessage(commit.id, 8) }</td>

                        </tr>
                      
                    ))}
                </tbody>
                
            </table>
        
        {/* {nextPage && 
            <button onClick={() => setCurPage(curPage + 1)} className="btn btn-outline-primary">Load More</button>
        } */}
               
        </div>
    )
}

export default Repository
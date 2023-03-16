import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getJsonData, getDaysSinceCommit } from "../utils.js"


let Developer = class {

    constructor(name) {
        this.name = name
        this.commits = 0
        this.lastCommitDate = ""
    }

    addCommit = (commit) => {
        this.commits ++
        
        if (this.lastCommitDate === ""){
            this.lastCommitDate = commit.created_at
        }
        
        return this
    }

    getLastCommitDate = () => {
        return new Date(this.lastCommitDate)
    }
}

let Repository = () => {

    const { id } = useParams()
    let [loadingCommits, setLoadingCommits] = useState(true)
    let [repoInfo, setRepoInfo] = useState([])
    let [commits, setCommits] = useState([])
    let [issues, setIssues] = useState([])
    let [developers, setDevelopers] = useState(new Map())
    
    useEffect(() => {
        /* Defining an async function allows await to be used in useEffect */
        let r = async () => {
            getRepoIssues(id)
            getRepoInfo(id)
            await getRepoCommits(id)
            setLoadingCommits(false)
            getDevelopers()
        }

        r()
    }, [id])

    useEffect(() => {
        getDevelopers()
    }, [loadingCommits])

    let getRepoInfo = async (id) => {
        let dataJson = await getJsonData(id, "")
        setRepoInfo(dataJson)
    }

    let getRepoCommits = async (id) => {
        let data = await getJsonData(id, `repository/commits?with_stats=yes&page=1&per_page=100`)
        let newData
        let page = 2
        
        do { 
            data = data.concat(newData)
            setCommits([...data])

            page++
            newData = await getJsonData(id, `repository/commits?with_stats=yes&page=${page}`)
            
        } while (!(Object.keys(newData).length === 0))

        setCommits(data.filter((commit) => commit != null))
    }

    let getRepoIssues = async (id) => {
        let data = await getJsonData(id, `issues?state=opened&page=1&per_page=20&state=opened`)
        console.table(data)
        let newData
        let i = 2
        
        do { 
            data = data.concat(newData)
            setIssues([...data])

            i++
            newData = await getJsonData(id, `issues?page=${i}&per_page=20&state=opened`)
            
        } while (!(Object.keys(newData).length === 0))

        setIssues(data.filter((issue) => issue != null))
    }

    let getDevelopers = () => {
        let devsMap = new Map()
        
        commits.forEach((commit) => {
            let dev = commit.author_name
            
            if (!devsMap.has(dev)) {
                devsMap.set(dev, new Developer( dev ))
            }

            let d = devsMap.get(dev)
            d.addCommit(commit)
        })
        setDevelopers(devsMap)
    }

    let formatTime = (timeStr) => {
        return timeStr.substring(0,10)
    }

    let truncateMessage = (message, length) => {
        return message.substring(0, length) + "..."
    }

    return (
        <div className="repo-info container-fluid">
           
           <div className="row">
            <div className="col-10">
                <h1 className="title">{repoInfo.name_with_namespace}</h1>
            </div>

            <div className="col-2">
                <a href={repoInfo.http_url_to_repo} target="_blank" className="btn btn-outline-primary view-gitlab-btn" rel="noreferrer">
                    View on GitLab
                </a>
            </div>
           </div>
            

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
                    {loadingCommits ? 
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
                    {loadingCommits ? 
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
        </div>
    )
}

export default Repository
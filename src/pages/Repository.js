
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

let Repository = () => {

    const { id } = useParams()
    let [repoInfo, setRepoInfo] = useState([])
    let [commits, setCommits] = useState([])
    let [developers, setDevelopers] = useState([])
    
    useEffect(() => {
        console.log("ID: " + id)
        getRepoInfo(id)
        getRepoCommits(id)
        getDevelopers()
        console.log("Developers: " + developers)
    }, [])

    let getUrl = (id, request) => {
        return `https://stgit.dcs.gla.ac.uk/api/v4//projects/${id}/${request}`
    }

    let fetchData = async (id, request) => {
        let requestUrl = getUrl(id, request)
        let response = await fetch(requestUrl, {
            headers: {
                "PRIVATE-TOKEN": "glpat-N7BrBvPV3CqT2Unn1-Zh"
            }
        })
        let data = await response.json()
        return data
    }

    let getRepoInfo = async (id) => {
        let data = await fetchData(id, "")
        setRepoInfo(data)
    }

    let getRepoCommits = async (id) => {
        let i = 2
        let newData
        let data = await fetchData(id, `repository/commits?with_stats=yes&page=1`)
        do {
            let newData = await fetchData(id, `repository/commits?with_stats=yes&page=${i}`)
            data = data.concat(newData)
            i++
        } while (newData)

        setRepoInfo(data)
        setCommits(data)
    }

    let getDevelopers = () => {
        let devsList = commits.map((commit) => commit.author_name);
        let devsSet = new Set()    
        devsList.forEach((dev) => devsSet.add(dev))
        let devs = Array.from(devsSet)
        setDevelopers(devs)
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
            <Link to="/" className="btn btn-outline-primary">Home</Link>
            
            {/* <h3>Developers</h3>
            <ul className="member-list">

                {developers.map((developer, index) => (
                    <li>
                        {developer}
                    </li>
                ))}

            </ul> */}

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
                    {commits.map((commit, index) => (
                        
                            <tr>
                                <td key="time{index}">{ formatTime(commit.created_at)}</td>
                                <td key="name{index}">{ commit.author_name }</td>

                                
                                    <td key={`msg${index}`}>
                                    <Link to={`/repository/${id}/commit/${commit.id}`} className="commit-table-row">
                                        { truncateMessage(commit.message, 100) }
                                    </Link>
                                    </td>
                            

                                <td key="stats{index}">{ commit.stats.total }</td>
                                <td>{ truncateMessage(commit.id, 8) }</td>
                            </tr>
                      
                    ))}
                </tbody>
                
            </table>
               
        </div>
    )
}

export default Repository
import { useEffect, useState } from "react"

export default function Repository () {

    let [repoInfo, setRepoInfo] = useState([])
    let [commits, setCommits] = useState([])
    
    useEffect(() => {
        getRepoInfo(2413)
        getRepoCommits(2413)
    }, [])

    let getUrl = (id, request) => {
        let pat = "?private_token=glpat-N7BrBvPV3CqT2Unn1-Zh"
        return `https://stgit.dcs.gla.ac.uk/api/v4//projects/${id}/${request}${pat}`
    }
    
    let getRepoInfo = async (id) => {
        let requestUrl = getUrl(id, "repository/issues")
        let response = await fetch(requestUrl)
        let data = await response.json()
        setRepoInfo(data)
    }

    let getRepoCommits = async (id) => {
        let requestUrl = getUrl(id, "repository/commits/")
        let response = await fetch(requestUrl)
        let data = await response.json()
        console.log("data: " + data)
        setCommits(data)
    }

    return (
        <div className="buttons">
           
        
            <h1>Repository</h1>
            {/* <h2>{commits[0].name}</h2> */}
            
            <table>
                <th>Author</th>
                <th>Message</th>
                {commits.map((commit, index) => (
                    <tr>
                        <td>{ commit.author_name }</td>
                        <td>{ commit.message }</td>
                        <td>{ commit.stats }</td>
                    </tr>
                ))}
            </table>
               
        </div>
    )
}
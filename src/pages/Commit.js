
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import ShowDiff from '../components/ShowDiff'

let Commit = () => {
    const { id, sha } = useParams()

    let [diff, setDiff] = useState([])
    let [commit, setCommit] = useState([])

    useEffect(() => {
        getCommit(id, sha)
        getDiff(id, sha)
    }, [])

    let getCommitUrl = (id, sha, request) => {
        return `https://stgit.dcs.gla.ac.uk/api/v4//projects/${id}/repository/commits/${sha}/${request}`
    }

    let fetchData = async (id, sha, request) => {
        let requestUrl = getCommitUrl(id, sha, request)
        let response = await fetch(requestUrl, {
            headers: {
                "PRIVATE-TOKEN": "glpat-N7BrBvPV3CqT2Unn1-Zh"
            }
        })
        let data = await response.json()
        return data
    }

    let getDiff = async (id, sha) => {
        const data = await fetchData(id, sha, "diff")       
        setDiff(data)
    }

    let getCommit = async (id, sha) => {
        const data = await fetchData(id, sha, "")
        setCommit(data)
    }

    let formatTime = (timeStr) => {
        return timeStr.substring(0,10)
    }

    return (
        <div class="container-fluid">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to={`/repository/${id}`}>Back to Repository</Link></li>
            </ul>
            
            <h1>Commit Diff</h1>
            <h4>Written by {commit.author_name} on {formatTime(commit.authored_date)}</h4>
            <h5>This commit has {commit.stats.additions} additions, {commit.stats.deletions} deletions, and {commit.stats.total} total</h5>
            
            <ShowDiff diffStr={diff}/>

        </div>
    )
}

export default Commit
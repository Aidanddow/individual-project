
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import { getJsonData, fetchData } from "../utils.js"
import ShowDiff from '../components/ShowDiff'

let Commit = () => {
    
    // Get ID and commit SHA from URL
    const { id, sha } = useParams()

    let [diff, setDiff] = useState(null)
    let [commit, setCommit] = useState([])

    useEffect(() => {
        getCommit(id, sha)
        getDiff(id, sha)
    }, [])

    let getCommitRequest = (id, sha, request) => {
        return `repository/commits/${sha}/${request}`
    }

    let getDiff = async (id, sha) => {
        let request = getCommitRequest(id, sha, "diff")
        const data = await getJsonData(id, request)
        setDiff(data)
    }

    let getCommit = async (id, sha) => {
        let request = getCommitRequest(id, sha, "")
        const response = await fetchData(id, request)
        
        if (response.ok) {
            let data = await response.json()

            if (data.stats) {
                setCommit(data)
            }
        } 
    }

    let formatTime = (timeStr) => {
        return timeStr
    }

    return (
        <div className="container-fluid">
            
            <div className="row">
                <div className="col-1">
                    <Link to={`/repository/${id}`} className="btn btn-outline-secondary back-button">Back</Link>
                </div>
                
                <h1 className="col-2"></h1>
            </div>
            
            {commit.length === 0 ? 
                <h2>Commit info not found.</h2> 
                : 
                <>
                    <h2>{commit.message}</h2>
                    <h4>Written by {commit.author_name} on {formatTime(commit.authored_date)}</h4> 
                    <h5>This commit has {commit.stats.additions} additions, {commit.stats.deletions} deletions, and {commit.stats.total} total</h5>
                </>
            }

            {diff ? 
                <ShowDiff diffArray={diff}/> 
                : <span className="loader"></span> 
            }
            
        </div>
    )
}

export default Commit
    
    
    
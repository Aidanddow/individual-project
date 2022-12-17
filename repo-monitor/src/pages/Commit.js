
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";
import ShowDiff from '../components/ShowDiff'
import { getJsonData, fetchData, getUrl } from "../utils.js"

let Commit = () => {
    const { id, sha } = useParams()

    let [diff, setDiff] = useState(null)
    let [commit, setCommit] = useState([])

    useEffect(() => {
        console.log("ID: " + id)
        console.log("SHA: " + sha)
        getCommit(id, sha)
        getDiff(id, sha)
    }, [])

    let getCommitRequest = (id, sha, request) => {
        return `repository/commits/${sha}/${request}`
    }

    let getDiff = async (id, sha) => {
        let request = getCommitRequest(id, sha, "diff")
        const data = await getJsonData(id, request)
        console.log(data)
       
        setDiff(data)
    }

    let getCommit = async (id, sha) => {
        let request = getCommitRequest(id, sha, "")
        console.log("REQ: ", request)
        const response = await fetchData(id, request)
        
        if (response.ok) {
            let data = await response.json()
            console.table(data)

            if (!data.stats) {
                console.log("ERROR")
            } else {
                console.log("SUCCESS")
                console.log(data.message)
                setCommit(data)
            }

        } else {
            console.log("ERROR!")
        }
    }

    let formatTime = (timeStr) => {
        return timeStr? timeStr.substring(0,10) : timeStr
    }


    return (
        <div className="container-fluid">
            
            <h1>Commit Diff</h1>
            {commit.length == 0 ? 
            <h2>Commit info not found.</h2> :
            <>
            <Link to={`/repository/${id}`} className="btn btn-outline-primary">Back to Repository</Link>
            <h3>{commit.message}</h3>
            <h4>Written by {commit.author_name} on {formatTime(commit.authored_date)}</h4> 
            <h5>This commit has {commit.stats.additions} additions, {commit.stats.deletions} deletions, and {commit.stats.total} total</h5>
            </>
            }
            

            {diff ? <ShowDiff diffStr={diff}/> : (<h3>LOADING...</h3>)}
            
        </div>
    )
}

export default Commit
    
    
    
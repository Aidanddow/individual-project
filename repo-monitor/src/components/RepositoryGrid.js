
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";

let RepositoryGrid = ({request, repos}) => {

    let [req, setReq] = useState([])

    useEffect(() => {
        setReq(request)
        console.log("req: " + req)
    }, [request]);

    return (
        <div className="row">
            {repos.map((repo, index) => (
                <div key={`repository${index}`} className="col">
                    <RepositoryPanel id={repo} request={request}/>
                </div>
            ))}
                        
        </div>
    )
}

export default RepositoryGrid

import { Link } from "react-router-dom";
import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";

let RepositoryGrid = ({request, repos, period}) => {

    let [req, setReq] = useState([])

    useEffect(() => {
        setReq(request)
        console.log("req: " + req)
    }, [request]);

    return (
        <div className="cards">
            {repos.map((repo, index) => (
                <div key={`repository${index}`}>
                    <RepositoryPanel id={repo} request={request} period={period}/>
                </div>
            ))}
                        
        </div>
    )
}

export default RepositoryGrid
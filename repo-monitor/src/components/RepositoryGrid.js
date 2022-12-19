
import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";

let RepositoryGrid = ({request, repos, period, showHeaders}) => {

    let [req, setReq] = useState([])

    useEffect(() => {
        setReq(request)
        console.log("req: " + req)
    }, [request]);

    return (
        <div className={showHeaders? "cards-headers" : "cards-no-headers"}>
            {repos.map((repo, index) => (
                <div key={`repository${index}`}>
                    <RepositoryPanel id={repo} request={request} period={period} showHeaders={showHeaders}/>
                </div>
            ))}
                        
        </div>
    )
}

export default RepositoryGrid
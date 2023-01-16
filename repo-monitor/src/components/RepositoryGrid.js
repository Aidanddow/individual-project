
import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";

let RepositoryGrid = ({metric, repos, period, showHeaders}) => {

    let [met, setMet] = useState([])
    let [grid, setGrid] = useState([])

    useEffect(() => {
        setMet(metric)
        console.log("req: " + met)
    }, [metric]);

    return (
        <div className={showHeaders? "cards-headers" : "cards-no-headers"}>
            {repos.map((repo, index) => (
                <div key={`repository${index}`}>
                    <RepositoryPanel id={repo} metric={met} period={period} showHeaders={showHeaders}/>
                </div>
            ))}
                        
        </div>
    )
}

export default RepositoryGrid

import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";

let RepositoryGrid = ({metric, repoIds, period, showHeaders}) => {

    let [met, setMet] = useState([])
    let [repos, setRepos] = useState(new Map())

    useEffect(() => {
        console.log("REPO IDS: ", repoIds)
        let repoDict = new Map()
        repoIds.forEach(id => repoDict.set(id, null))
        setRepos(repoDict)
        
    }, [])

    useEffect(() => {
        console.log("REPOS::: ", repos)
    }, [repos])

    useEffect(() => {
        setMet(metric)
    }, [metric]);

    return (
        <div className="repo-grid">
        <div className={showHeaders? "cards-headers" : "cards-no-headers"}>
            {[...repos.keys()].map((repoID) => (
                <div key={`repository${repoID}`}>
                    <RepositoryPanel id={repoID} repos={repos} setRepos={setRepos} metric={met} period={period} showHeaders={showHeaders}/>
                </div>
            ))}
                        
        </div>
        </div>
    )
}

export default RepositoryGrid
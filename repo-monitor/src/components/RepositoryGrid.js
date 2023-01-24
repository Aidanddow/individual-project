
import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";


let RepositoryGrid = ({metric, repoIds, period, showHeaders}) => {

    let [repos, setRepos] = useState([])
    let [stats, setStats] = useState([])

    useEffect(() => {
        console.log("REPO IDS: ", repoIds)
        setRepos(repoIds)
    }, [])

    let sortRepos = async (alg) => {
        console.log("REPOS BEFORE: ", repos)
        let sortedRepos = [...repos]
            .map((id, index) => [id, stats[index]] )
            .sort( alg )

        // console.log("REPOS SORTED: ", sortedRepos)
        setStats( (stats) => sortedRepos.map(a => a[1]))
        setRepos( (repos) => sortedRepos.map(a => a[0]))
        console.log("REPOS AFTER: ", sortedRepos.map(a => a[0]))
    }

    return (
        <div className="repo-grid">
            <button className="btn btn-outline-primary" onClick={() => sortRepos((a, b) => a[1] > b[1])}>Sort Ascending</button>
            <button className="btn btn-outline-primary" onClick={() => sortRepos((a, b) => a[1] < b[1])}>Sort Descending</button>
            <div className={showHeaders? "cards-headers" : "cards-no-headers"}>
                {repos.map((repo, index) => (
                    <div key={`repository${index}`}>
                        
                        <RepositoryPanel 
                            id={repo} 
                            index={index} 
                            request={metric.endpoint} 
                            period={period} 
                            showHeaders={showHeaders} 
                            stats={stats} 
                            setStats={setStats}
                        />
                    
                    </div>
                ))}       
            </div>

        </div>
    )
}


export default RepositoryGrid